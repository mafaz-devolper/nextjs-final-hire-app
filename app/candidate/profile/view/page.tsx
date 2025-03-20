"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, MapPin, Mail, Phone, Edit, ExternalLink } from "lucide-react"

export default function ViewProfilePage() {
  const [profileData, setProfileData] = useState<any>({})
  const [skills, setSkills] = useState<string[]>([])
  const [resume, setResume] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    const savedSkills = localStorage.getItem("userSkills")
    const savedResume = localStorage.getItem("userResume")

    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }

    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    } else {
      setSkills(["React", "TypeScript", "Next.js"])
    }

    if (savedResume) {
      setResume(JSON.parse(savedResume))
    }

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">View and manage your professional profile</p>
          </div>
          <Button asChild>
            <Link href="/candidate/profile">
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Link>
          </Button>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <span className="text-3xl font-semibold">
                  {profileData.firstName && profileData.lastName
                    ? `${profileData.firstName[0]}${profileData.lastName[0]}`
                    : "JD"}
                </span>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold">
                    {profileData.firstName && profileData.lastName
                      ? `${profileData.firstName} ${profileData.lastName}`
                      : "John Doe"}
                  </h2>
                  <p className="text-primary text-lg">{profileData.headline || "Senior Frontend Developer"}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{profileData.location || "San Francisco, CA"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{profileData.email || "john.doe@example.com"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{profileData.phone || "(123) 456-7890"}</p>
                    </div>
                  </div>
                  {profileData.website && (
                    <div className="flex items-start gap-2">
                      <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          {profileData.website}
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
              <p className="text-muted-foreground">
                {profileData.summary ||
                  "Experienced frontend developer with 5+ years of experience building responsive web applications using React, TypeScript, and Next.js. Passionate about creating intuitive user interfaces and optimizing application performance."}
              </p>
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
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {skills.length === 0 && <p className="text-muted-foreground">No skills added yet.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Resume */}
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            {resume ? (
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{resume.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded on {new Date(resume.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href={resume.url} download={resume.name} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No resume uploaded yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/candidate/profile?tab=resume">Upload Resume</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education and Experience would go here in a real implementation */}

        <CardFooter className="flex justify-center pt-4">
          <Button asChild>
            <Link href="/candidate/dashboard">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}

