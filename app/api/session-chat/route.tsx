import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq ,desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid';


export async function POST(req: NextRequest) {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();
    try {
        const sessionid = uuidv4();
        const result = await db.insert(SessionChatTable).values({
            sessionid: sessionid,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            notes: notes,
            selectedDoctor: selectedDoctor,
            createdOn: (new Date).toString()
        }).returning();

        // If insert failed, result will be empty
        if (!result || !result[0]) {
            return NextResponse.json({ error: "Session creation failed" }, { status: 500 });
        }

        return NextResponse.json(result[0]);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}


export async function GET(req:NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionid = searchParams.get("sessionid");
   const user = await currentUser();
   try {


    if (sessionid === "all") {
        const result = await db.select().from(SessionChatTable)
        //@ts-ignore
            .where(eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress))
            //@ts-ignore
            .orderBy(desc(SessionChatTable.id))
          return NextResponse.json(result);
    } else {
        const result = await db.select().from(SessionChatTable)
        //@ts-ignore
        .where(eq(SessionChatTable.sessionid, sessionid))
        return NextResponse.json(result[0]);
    } 
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
    
}