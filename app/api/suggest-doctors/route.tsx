import {NextRequest, NextResponse} from "next/server";
import {openai} from "@/config/OpenAiModel";
import {AIDoctorAgents} from "@/list/list";

export async function POST(req: NextRequest) {
    const {notes} = await req.json();

    try {
        const completion = await openai.chat.completions.create({
            model: 'google/gemini-2.5-flash-lite-preview-06-17',
            messages: [
                {
                    role: 'system',
                    content: JSON.stringify(AIDoctorAgents),
                },
                {
                    role: 'user',
                    content:'User Notes/Symptoms:'+notes+', Depends on the user notes and symptoms, Please suggest a list of doctors, Return object in JSON only',
                },
            ],
        });

        const rawResponse = completion.choices[0].message || '';

        //@ts-ignore
        const Resp = rawResponse && rawResponse.content.trim().replace('```json', '').replace('```', '')
        // @ts-ignore
        const JSONResp = JSON.parse(Resp);
        console.log("Suggested doctor's api: ", JSONResp);
        return NextResponse.json(JSONResp);

    } catch(err) {
        return NextResponse.json(err);
    }
}