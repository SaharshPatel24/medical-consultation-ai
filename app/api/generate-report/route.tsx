import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const { sessionId, conversation, doctor, initialNotes } = await req.json();
        const user = await currentUser();

        if (!sessionId || !conversation || conversation.length === 0) {
            return NextResponse.json(
                { error: "Session ID and conversation data are required" },
                { status: 400 }
            );
        }

        // Prepare conversation text for AI analysis
        const conversationText = conversation
            .map((msg: any) => `${msg.role}: ${msg.text}`)
            .join('\n');

        // Generate medical report using AI
        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.5-flash-lite-preview-06-17',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert medical AI assistant. Generate a comprehensive medical consultation report based on the conversation between doctor and patient. 

                    The report should include:
                    1. CHIEF COMPLAINT: Primary reason for consultation
                    2. HISTORY OF PRESENT ILLNESS: Detailed description of symptoms
                    3. ASSESSMENT: Clinical analysis and observations
                    4. DIAGNOSIS: Most likely diagnoses based on symptoms
                    5. RECOMMENDATIONS: Treatment recommendations and next steps
                    6. FOLLOW-UP: When patient should return or seek further care
                    7. SUMMARY: Brief summary of the consultation

                    Return the response as a JSON object with these exact keys: chiefComplaint, historyOfPresentIllness, assessment, diagnosis, recommendations, followUp, summary.
                    Be professional, concise, and medically accurate. If information is missing, note it appropriately.`
                },
                {
                    role: 'user',
                    content: `Doctor Specialist: ${doctor?.specialist || 'General Physician'}
                    Initial Patient Notes: ${initialNotes || 'None provided'}
                    
                    Conversation Transcript:
                    ${conversationText}
                    
                    Please generate a comprehensive medical report based on this consultation.`
                }
            ],
        });

        const rawResponse = completion.choices[0].message?.content || '';
        
        let reportData;
        try {
            // Clean up the response and parse JSON
            const cleanResponse = rawResponse.trim().replace(/```json/g, '').replace(/```/g, '');
            reportData = JSON.parse(cleanResponse);
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            // Fallback report structure
            reportData = {
                chiefComplaint: "Unable to extract from conversation",
                historyOfPresentIllness: rawResponse.substring(0, 500) + "...",
                assessment: "Report generation incomplete due to parsing error",
                diagnosis: "Unable to determine from available data",
                recommendations: "Please consult with healthcare provider for proper evaluation",
                followUp: "Schedule follow-up appointment as needed",
                summary: "Consultation completed - manual review recommended"
            };
        }

        // Add metadata to report
        const fullReport = {
            ...reportData,
            generatedAt: new Date().toISOString(),
            doctorSpecialist: doctor?.specialist || 'General Physician',
            sessionId: sessionId,
            conversationLength: conversation.length
        };

        // Save report to database
        await db.update(SessionChatTable)
            .set({ report: fullReport })
            .where(eq(SessionChatTable.sessionId, sessionId));

        console.log('Medical report generated and saved for session:', sessionId);

        return NextResponse.json({
            success: true,
            report: fullReport,
            message: 'Medical report generated successfully'
        });

    } catch (error) {
        console.error('Error generating medical report:', error);
        return NextResponse.json(
            { 
                error: 'Failed to generate medical report',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 
