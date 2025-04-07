// app/api/candidates/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Get the authenticated session
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the candidate profile from the database
        const candidate = await db.candidate.findUnique({
            where: {
                userId: session.user.id,
            },
            include: {
                education: true,
                experience: true,
                skills: true,
                resume: true,
            },
        });

        if (!candidate) {
            return NextResponse.json(
                { error: 'Candidate profile not found' },
                { status: 404 }
            );
        }

        // Format the skills for the frontend
        interface Skill {
            name: string;
        }

        interface Candidate {
            id: string;
            userId: string;
            education: any[];  // Replace 'any' with the actual type if available
            experience: any[]; // Replace 'any' with the actual type if available
            skills: Skill[];
            resume: any[];     // Replace 'any' with the actual type if available
            // Add other properties as needed based on your candidate model
        }

        const formattedCandidate: Omit<Candidate, 'skills'> & { skills: string[] } = {
            ...candidate,
            skills: candidate.skills.map(skill => skill.name),
        };

        return NextResponse.json(formattedCandidate);
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}