// types/index.ts
export type Candidate = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    headline?: string;
    summary?: string;
    skills: string[];
    resume?: {
        id: string;
        name: string;
        filePath: string;
        uploadDate: string;
    };
    education?: {
        id: string;
        institution: string;
        degree: string;
        startDate: string;
        endDate?: string;
        description?: string;
    }[];
    experience?: {
        id: string;
        title: string;
        company: string;
        location?: string;
        startDate: string;
        endDate?: string;
        description?: string;
    }[];
};