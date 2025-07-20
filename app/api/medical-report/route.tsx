import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest , NextResponse} from "next/server";

const REPORT_GENERATION_SYSTEM_PROMPT = `
You are an AI medical voice agent that just finished a voice conversation with a user.Based on the Doctor AI agent info and conversation between AI medical agent and user , generate a structured report 
2. agent : the medical specialist name(e.g. , "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided 
4. timestamp : current date and time in ISO format
5. chiefCompliant: one-sententce summary of the main health concern
6. summary : a 2-3 sententce summary of the conversation , symptoms 
7. symptoms : list of symptoms mentioned by user
8. duration: how long the user has experienced the symptoms 
9. severity" mild, moderate,or severe
10. medicationMentioned : list of any medicines mentioned
11. recommendation : lit of AI suggestions (e.g. , rest, see a doctor)
Return the result in this JSON format:
{
 "agent" : "string",
 "user" : "string",
 "timestamp" : "ISO Date string",
 "chiefComplaint" : "string",
 "summary" : ["symptom1","symptom2"],
 "symptoms" : "string",
 "duration" : "string",
 "severity":"string",
 "medicationsMentioned":["med1","med2"],
 "recommendations:["rec1","rec2"]

} 
 Only include valid fields . Respond with nothing else.
`;  

export async function POST(req: NextRequest) {
  const { messages, sessionDetail, sessionId } = await req.json();

  
     try {
      const UserInput = "AI Doctor Agent Info : "+JSON.stringify(sessionDetail)+", Conversation :" + JSON.stringify(messages)
      const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: 'system', content:  REPORT_GENERATION_SYSTEM_PROMPT 

        },
        {
          role: "user",
          content: UserInput
        },
      ],
    });

  const rawResponse = completion.choices[0].message;

  //@ts-ignore
  const resp  = rawResponse.content.trim().replace('```json', '').replace('```', '');
  const JSONresp = JSON.parse(resp)
  //savind resonse report to database

  const result = await db.update(SessionChatTable).set({
    report : JSONresp,
    conversation:messages
  }).where(eq(SessionChatTable.sessionid,sessionId))
  return NextResponse.json(JSONresp, { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    
  }

}