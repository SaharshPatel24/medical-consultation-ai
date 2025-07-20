import { NextRequest, NextResponse } from "next/server";
import {currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const user = await currentUser();

    try {
        //check if user already exists
        const users = await db.select().from(usersTable)
        //@ts-ignore
        .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

        if(users?.length ==0){
            const res = await db.insert(usersTable).values({
                //@ts-ignore
                name: user?.fullName,
                email:user?.primaryEmailAddress?.emailAddress,
                credits:10
            })
        }
        
        return NextResponse.json(users[0])
    } catch (e) {
        return NextResponse.json(e)
    }
}