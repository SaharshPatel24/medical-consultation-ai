import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

export async function POST(req:NextRequest) {
    const {notes,selectedDoctor} = await req.json()
    const user = await currentUser();
    try {
        const sessionId = uuidv4();
        const result = await db.insert(SessionChatTable).values({
            sessionId:sessionId,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            notes:notes,
            selectedDoctor:selectedDoctor,
            createdOn:(new Date()).toString()
            //@ts-ignore
        }).returning({SessionChatTable});

        return NextResponse.json(result[0]?.SessionChatTable);
    } catch (e) {
        return NextResponse.json(e);
    }
}


export async function GET(req:NextRequest) {
    const {searchParams} = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const user = await currentUser();

    if(sessionId == 'all') {
        const result = await db.select().from(SessionChatTable)
        //@ts-ignore
        .where(eq(SessionChatTable.createdBy , user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(SessionChatTable.id))
        
    return NextResponse.json(result);
    }
    else{
        const result = await db.select().from(SessionChatTable)
        //@ts-ignore
        .where(eq(SessionChatTable.sessionId , sessionId));

    return NextResponse.json(result[0]);
    }
}

export async function PUT(req:NextRequest) {
    const {sessionId, notes, conversation, report} = await req.json();
    const user = await currentUser();

    try {
        const updateData: any = {};
        
        if (notes !== undefined) updateData.notes = notes;
        if (conversation !== undefined) updateData.conversation = conversation;
        if (report !== undefined) updateData.report = report;

        const result = await db.update(SessionChatTable)
            .set(updateData)
            .where(eq(SessionChatTable.sessionId, sessionId));
            
        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }
}
