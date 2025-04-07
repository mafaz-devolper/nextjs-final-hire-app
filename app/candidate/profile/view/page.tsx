"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, MapPin, Mail, Phone, Edit, ExternalLink } from "lucide-react"

interface EducationalDocument {
  name: string
  url: string
  size?: number
  type?: string
  uploadDate: string
  documentType: string
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  headline: string
  summary: string
  skills: string[]
  resumeUrl?: string
  resumeName?: string
  resumeSize?: number
  resumeType?: string
  resumeUpdatedAt?: string
  educationalDocuments?: EducationalDocument[]
}

export default function ViewProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    summary: "",
    skills: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // In a real app, you would fetch from your API
        const authData = localStorage.getItem("authUser")
        if (!authData) {
          window.location.href = "/auth/login"
          return
        }

        const savedProfile = localStorage.getItem("userProfile")
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile)
          setProfileData({
            firstName: parsedProfile.firstName || "",
            lastName: parsedProfile.lastName || "",
            email: parsedProfile.email || "",
            phone: parsedProfile.phone || "",
            location: parsedProfile.location || "",
            headline: parsedProfile.headline || "",
            summary: parsedProfile.summary || "",
            skills: parsedProfile.skills || [],
            resumeUrl: parsedProfile.resumeUrl,
            resumeName: parsedProfile.resumeName,
            resumeSize: parsedProfile.resumeSize,
            resumeType: parsedProfile.resumeType,
            resumeUpdatedAt: parsedProfile.resumeUpdatedAt,
            educationalDocuments: parsedProfile.educationalDocuments || []
          })
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [])

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full">
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center shrink-0 mx-auto sm:mx-0">
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
                  <p className="text-primary text-lg">{profileData.headline || "Professional"}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{profileData.location || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{profileData.email || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{profileData.phone || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Professional Summary</h3>
              <p className="text-muted-foreground">
                {profileData.summary || "No summary provided."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.skills && profileData.skills.length > 0 ? (
                profileData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No skills added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resume */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            {profileData.resumeUrl ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{profileData.resumeName || "Resume"}</h3>
                  {profileData.resumeUpdatedAt && (
                    <p className="text-sm text-muted-foreground">
                      Uploaded on {new Date(profileData.resumeUpdatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button variant="outline" asChild>
                  <a href={profileData.resumeUrl} download={profileData.resumeName} target="_blank" rel="noopener noreferrer">
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

        {/* Educational Documents */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Educational Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {profileData.educationalDocuments && profileData.educationalDocuments.length > 0 ? (
              <div className="space-y-4">
                {profileData.educationalDocuments.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.documentType.toUpperCase()} • {doc.size ? `${(doc.size / 1024 / 1024).toFixed(1)} MB` : 'Unknown size'} • {new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={doc.url} download={doc.name} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No educational documents uploaded yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/candidate/profile?tab=education">Upload Documents</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <CardFooter className="flex justify-center pt-4">
          <Button asChild>
            <Link href="/candidate/dashboard">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}