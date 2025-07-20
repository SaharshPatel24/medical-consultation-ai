// import { NextRequest, NextResponse } from "next/server";
// import {openai} from "@/config/OpenAiModel";
// import { AIDoctorAgents } from "@/list/list";

// export async function POST(req: NextRequest) {
//   const {notes} = await req.json()
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "google/gemini-2.0-flash-exp:free",
//       messages: [
//         {
//           role: 'system', content: JSON.stringify(AIDoctorAgents)

//         },
//         {
//           role: "user",
//           content: "User Notes/Symptoms: " + notes + ". Based on these notes and symptoms,Please  suggest list of  doctor from the list of AI Doctor Agents.Return object in JSON only ",
//         },
//       ],
//     });

//   const rawResponse = completion.choices[0].message;

//   //@ts-ignore
//   const resp  = rawResponse.content.trim().replace('```json', '').replace('```', '');
//   const JSONresp = JSON.parse(resp)
//   return NextResponse.json(JSONresp)
//   } catch (e) {
//     return NextResponse.json(e)
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { AIDoctorAgents } from "@/list/list";

export async function POST(req: NextRequest) {
  // For development, just return the first 2 doctors as a mock suggestion
  return NextResponse.json([AIDoctorAgents[0], AIDoctorAgents[1]]);
}