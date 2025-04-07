"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin } from "lucide-react"

interface Applicant {
    id: string
    firstName: string
    lastName: string
    email: string
    location: string
    skills: string[]
    headline: string
}

export default function ApplicantsPage() {
    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await fetch('/api/applicants'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setApplicants(data);
            } catch (error) {
                console.error("Failed to fetch applicants:", error);
                // Optionally set an error state to display a message to the user
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="container py-10 mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Applicants</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applicants.map((applicant) => (
                    <Card key={applicant.id} className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold">{applicant.firstName} {applicant.lastName}</CardTitle>
                            <p className="text-muted-foreground text-sm">{applicant.headline}</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{applicant.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{applicant.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {applicant.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                            <Button className="w-full mt-3" asChild>
                                <Link href={`/recruiter/applicants/${applicant.id}`}>View Profile</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {applicants.length === 0 && (
                <div className="text-center mt-12 text-muted-foreground">No applicants found.</div>
            )}
        </div>
    )
}
