"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, MapPin, Mail, Phone, ExternalLink, ArrowLeft } from "lucide-react"

export default function ApplicantDetailPage() {
  const params = useParams()
  const [applicant, setApplicant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return

    const fakeData = localStorage.getItem(`applicant-${params.id}`)
    if (fakeData) {
      setApplicant(JSON.parse(fakeData))
    } else {
      setApplicant({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        phone: "9876543210",
        location: "New York, NY",
        website: "https://janedoe.dev",
        headline: "Full Stack Developer",
        summary: "Motivated developer with 3+ years of experience in MERN stack.",
        skills: ["React", "Node.js", "MongoDB", "TypeScript"],
        resume: {
          name: "Jane_Doe_Resume.pdf",
          uploadDate: new Date().toISOString(),
          url: "/resumes/jane-doe-resume.pdf"
        }
      })
    }
    setLoading(false)
  }, [params?.id])

  if (loading || !applicant) {
    return (
      <div className="container py-8 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col space-y-8 max-w-4xl w-full">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Applicant Profile
            </h1>
            <p className="text-muted-foreground">Detailed view of the applicant's profile</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/recruiter/applicants">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Applicants
            </Link>
          </Button>
        </div>

        {/* Personal Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-3xl font-semibold mx-auto sm:mx-0">
                {applicant.firstName[0]}{applicant.lastName[0]}
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold">
                    {applicant.firstName} {applicant.lastName}
                  </h2>
                  <p className="text-primary text-lg">{applicant.headline}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{applicant.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{applicant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{applicant.phone}</p>
                    </div>
                  </div>
                  {applicant.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a href={applicant.website} target="_blank" className="text-primary underline">
                          {applicant.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Professional Summary</h3>
              <p className="text-muted-foreground">{applicant.summary}</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume */}
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            {applicant.resume ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{applicant.resume.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded on {new Date(applicant.resume.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <a href={applicant.resume.url} download target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No resume uploaded.</p>
            )}
          </CardContent>
        </Card>

        <CardFooter className="justify-center pt-6">
          <Button variant="default" asChild>
            <Link href="/recruiter/applicants">Back to Applicants</Link>
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}
