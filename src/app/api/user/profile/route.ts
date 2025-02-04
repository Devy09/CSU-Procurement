import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received body:", body);

        const { 
            clerkId, 
            name, 
            email, 
            role, 
            department,
            section,
            title,
            designation, 
            saino, 
            alobsno,
            signatureUrl 
        } = body;

        if (!clerkId || !email) {
            console.warn("Missing required fields: clerkId or email");
            return NextResponse.json({ error: "Missing required fields: clerkId and email." }, { status: 400 });
        }

        const user = await prisma.user.upsert({
            where: { clerkId },
            update: { 
                name, 
                email, 
                role, 
                department,
                section,
                title,
                designation, 
                saino, 
                alobsno,
                signatureUrl 
            },
            create: { 
                clerkId, 
                name, 
                email, 
                role, 
                department,
                section,
                title,
                designation, 
                saino, 
                alobsno,
                signatureUrl 
            },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        console.error("Error saving user profile:", error);
        return NextResponse.json({ error: error.message || "Failed to save user profile." }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: {
                clerkId: userId,
            },
            select: {
                section: true,
                department: true,
                name: true,
                email: true,
                role: true,
                title: true,
                designation: true,
                saino: true,
                alobsno: true,
                signatureUrl: true,
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_PROFILE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


