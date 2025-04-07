// File: app/api/applicants/[id]/route.js (Next.js App Router)

import { NextResponse } from 'next/server';

// In a real application, you would connect to a database
// This is a simplified example using an in-memory data store
const applicants = [
    {
        id: "1",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        phone: "(555) 123-4567",
        location: "New York, NY",
        website: "https://janedoe.dev",
        headline: "Full Stack Developer",
        summary: "Motivated developer with 5+ years of experience in MERN stack development. Specialized in building scalable web applications and optimizing performance.",
        skills: ["React", "Node.js", "MongoDB", "TypeScript", "GraphQL", "AWS"],
        resume: {
            name: "Jane_Doe_Resume.pdf",
            uploadDate: "2025-02-15T10:30:00Z",
            url: "/uploads/resumes/jane-doe-resume.pdf"
        }
    },
    {
        id: "2",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "(555) 987-6543",
        location: "San Francisco, CA",
        website: "https://johnsmith.io",
        headline: "Senior Frontend Engineer",
        summary: "Creative frontend developer with expertise in modern JavaScript frameworks and UI/UX design principles. Passionate about creating intuitive user experiences.",
        skills: ["React", "Vue.js", "JavaScript", "CSS/SCSS", "Tailwind CSS", "Jest"],
        resume: {
            name: "John_Smith_Resume.pdf",
            uploadDate: "2025-03-01T14:45:00Z",
            url: "/uploads/resumes/john-smith-resume.pdf"
        }
    },
    {
        id: "3",
        firstName: "Emily",
        lastName: "Johnson",
        email: "emily.johnson@example.com",
        phone: "(555) 234-5678",
        location: "Austin, TX",
        website: "https://emilyj.tech",
        headline: "Backend Developer",
        summary: "Backend developer specialized in building robust APIs and microservices. Strong experience with database optimization and system architecture.",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "Redis", "Kubernetes"],
        resume: {
            name: "Emily_Johnson_Resume.pdf",
            uploadDate: "2025-02-20T09:15:00Z",
            url: "/uploads/resumes/emily-johnson-resume.pdf"
        }
    }
];

interface Applicant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    headline: string;
    summary: string;
    skills: string[];
    resume: Resume;
}

interface Resume {
    name: string;
    uploadDate: string;
    url: string;
}

interface Params {
    id: string;
}

interface Props {
    params: Params;
}

export async function GET(_request: Request, { params }: Props): Promise<NextResponse> {
    try {
        // Get the applicant ID from URL parameters
        const { id } = await params;

        // In a real app, you would fetch from a database
        // For this example, we're using the in-memory array
        const applicant: Applicant | undefined = applicants.find(app => app.id === id);

        if (!applicant) {
            // Return 404 if applicant not found
            return NextResponse.json(
                { error: "Applicant not found" },
                { status: 404 }
            );
        }

        // Add a small delay to simulate network latency (remove in production)
        await new Promise(resolve => setTimeout(resolve, 300));

        // Return the applicant data
        return NextResponse.json(applicant);

    } catch (error) {
        console.error("Error fetching applicant:", error);

        // Return 500 for server errors
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Optional: Handle updates to an applicant
interface UpdateApplicantData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    headline?: string;
    summary?: string;
    skills?: string[];
    resume?: Resume;
}

export async function PUT(request: Request, { params }: Props): Promise<NextResponse> {
    try {
        const { id } = params;
        const data: UpdateApplicantData = await request.json();

        // Find the applicant
        const applicantIndex = applicants.findIndex(app => app.id === id);

        if (applicantIndex === -1) {
            return NextResponse.json(
                { error: "Applicant not found" },
                { status: 404 }
            );
        }

        // Update the applicant (in a real app, this would update the database)
        applicants[applicantIndex] = {
            ...applicants[applicantIndex],
            ...data,
            id // Ensure ID doesn't change
        };

        return NextResponse.json(applicants[applicantIndex]);

    } catch (error) {
        console.error("Error updating applicant:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Optional: Handle applicant deletion
export async function DELETE(_request: Request, { params }: Props) {
    try {
        const { id } = await params;

        // Find the applicant
        const applicantIndex = applicants.findIndex(app => app.id === id);

        if (applicantIndex === -1) {
            return NextResponse.json(
                { error: "Applicant not found" },
                { status: 404 }
            );
        }

        // Remove the applicant (in a real app, this would update the database)
        applicants.splice(applicantIndex, 1);

        return NextResponse.json(
            { message: "Applicant successfully deleted" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting applicant:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}