"use client"

import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, FileText, Loader2, Plus, Trash2, Upload, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { useMongoDB } from "@/hooks/use-mongodb"

interface Resume {
  name: string
  url: string
  size?: number
  type?: string
  uploadDate: string
}

interface EducationalDocument {
  name: string
  url: string
  size?: number
  type?: string
  uploadDate: string
  documentType: '10th' | '12th' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'other'
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  headline: string
  summary: string
}

export default function CandidateProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docFileInputRef = useRef<HTMLInputElement>(null)
  const { getProfile: getProfileFromHook, saveProfile, isLoading: isSaving, error: saveError } = useMongoDB()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [activeTab, setActiveTab] = useState("personal")
  const [resume, setResume] = useState<Resume | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [educationalDocs, setEducationalDocs] = useState<EducationalDocument[]>([])
  const [isUploadingDoc, setIsUploadingDoc] = useState(false)
  const [uploadDocProgress, setUploadDocProgress] = useState(0)
  const [docType, setDocType] = useState<'10th' | '12th' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'other'>('10th')

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    summary: "",
  })

  const getProfile = useCallback(getProfileFromHook, []);

  // Load user data and profile from localStorage and MongoDB
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        // Get user data from localStorage
        const authData = localStorage.getItem("authUser")
        if (!authData) {
          router.push("/auth/login")
          return
        }

        const userData = JSON.parse(authData)
        setUserId(userData.id)

        // Set email from user data
        if (userData.email) {
          setFormData(prev => ({ ...prev, email: userData.email }))
        }
      } catch (err) {
        console.error("Error loading user data:", err)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  useEffect(() => {
    const loadProfileData = async () => {
      if (!userId) return

      setIsLoading(true)
      try {
        const profile = await getProfile()

        if (profile) {
          // Update form data with profile data
          setFormData({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            headline: profile.headline || "",
            summary: profile.summary || "",
          })

          // Update skills
          if (profile.skills && profile.skills.length > 0) {
            setSkills(profile.skills)
          }

          // Update resume
          if (profile.resumeUrl) {
            setResume({
              name: profile.resumeName || "Resume",
              url: profile.resumeUrl,
              size: profile.resumeSize,
              type: profile.resumeType,
              uploadDate: profile.resumeUpdatedAt || new Date().toISOString(),
            })
          }

          // Update educational documents
          if (profile.educationalDocuments && profile.educationalDocuments.length > 0) {
            setEducationalDocs(profile.educationalDocuments)
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err)
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [userId, getProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!userId) {
      setError("You must be logged in to update your profile")
      return
    }

    try {
      // Save profile to MongoDB
      const profileData = {
        userId,
        ...formData,
        skills,
        resumeUrl: resume?.url,
        resumeName: resume?.name,
        resumeSize: resume?.size,
        resumeType: resume?.type,
        resumeUpdatedAt: resume?.uploadDate,
        educationalDocuments: educationalDocs
      }

      await saveProfile(profileData)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Redirect to candidate profile view page
      router.push("/candidate/profile/view")
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      console.error("Profile update error:", err)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setError("")

      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload a PDF or Word document.")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Maximum size is 5MB.")
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      try {
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval)
              return 95
            }
            return prev + 5
          })
        }, 100)

        // In a real app, you would upload the file to a storage service
        const fileUrl = URL.createObjectURL(file)

        // Simulate API call to upload file
        await new Promise(resolve => setTimeout(resolve, 2000))

        clearInterval(interval)
        setUploadProgress(100)

        // Create resume object
        const newResume: Resume = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
          uploadDate: new Date().toISOString(),
        }

        setResume(newResume)
        toast({
          title: "Resume uploaded",
          description: "Your resume has been uploaded successfully.",
        })
      } catch (err) {
        setError("Failed to upload resume. Please try again.")
        console.error("Resume upload error:", err)
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
  }

  const handleDeleteResume = async () => {
    try {
      // Simulate API call to delete resume
      await new Promise(resolve => setTimeout(resolve, 500))

      setResume(null)
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      })
    } catch (err) {
      setError("Failed to delete resume. Please try again.")
      console.error("Resume delete error:", err)
    }
  }

  const handleDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setError("")

      // Validate file type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ]
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload a PDF, JPEG, or PNG.")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Maximum size is 5MB.")
        return
      }

      setIsUploadingDoc(true)
      setUploadDocProgress(0)

      try {
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadDocProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval)
              return 95
            }
            return prev + 5
          })
        }, 100)

        // In a real app, you would upload the file to a storage service
        const fileUrl = URL.createObjectURL(file)

        // Simulate API call to upload file
        await new Promise(resolve => setTimeout(resolve, 2000))

        clearInterval(interval)
        setUploadDocProgress(100)

        // Create document object
        const newDoc: EducationalDocument = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
          uploadDate: new Date().toISOString(),
          documentType: docType
        }

        setEducationalDocs(prev => [...prev, newDoc])
        toast({
          title: "Document uploaded",
          description: "Your educational document has been uploaded successfully.",
        })
      } catch (err) {
        setError("Failed to upload document. Please try again.")
        console.error("Document upload error:", err)
      } finally {
        setIsUploadingDoc(false)
        setUploadDocProgress(0)
      }
    }
  }

  const handleDeleteDoc = async (docUrl: string) => {
    try {
      // Simulate API call to delete document
      await new Promise(resolve => setTimeout(resolve, 500))

      setEducationalDocs(prev => prev.filter(doc => doc.url !== docUrl))
      toast({
        title: "Document deleted",
        description: "Your educational document has been deleted successfully.",
      })
    } catch (err) {
      setError("Failed to delete document. Please try again.")
      console.error("Document delete error:", err)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const triggerDocFileInput = () => {
    docFileInputRef.current?.click()
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return `${bytes} bytes`
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    else return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const getFileTypeLabel = (type?: string) => {
    if (!type) return "File"
    if (type.includes("pdf")) return "PDF"
    if (type.includes("word") || type.includes("doc")) return "DOC"
    return "File"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    let completed = 0
    const totalFields = 8 // Number of form fields we're checking
    
    if (formData.firstName) completed++
    if (formData.lastName) completed++
    if (formData.email) completed++
    if (formData.headline) completed++
    if (formData.summary) completed++
    if (skills.length > 0) completed++
    if (resume) completed++
    if (educationalDocs.length > 0) completed++

    return Math.round((completed / totalFields) * 100)
  }

  const completionPercentage = calculateCompletion()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and resume</p>
        </div>

        {/* Profile Completion */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to increase your chances of getting hired</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Complete your profile by adding your skills, experience, and education.
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education Docs</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="pt-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                        required
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="San Francisco, CA"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        name="headline"
                        value={formData.headline}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Frontend Developer"
                      />
                      <p className="text-sm text-muted-foreground">
                        A brief professional headline that appears at the top of your profile
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        placeholder="Write a brief summary about yourself..."
                        className="min-h-[150px] resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => router.push("/candidate/dashboard")}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full sm:w-auto"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Resume Tab */}
          <TabsContent value="resume" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
                <CardDescription>Upload and manage your resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {resume ? (
                  <div className="border rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <div className="text-lg font-medium">Current Resume</div>
                      <div className="flex items-center justify-center flex-wrap gap-2">
                        <Badge variant="outline">{getFileTypeLabel(resume.type)}</Badge>
                        <span className="text-sm break-all">{resume.name}</span>
                        {resume.size && <Badge variant="secondary">{formatFileSize(resume.size)}</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded on {new Date(resume.uploadDate).toLocaleDateString()}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                          <a href={resume.url} download={resume.name} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" /> Download
                          </a>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleDeleteResume} 
                          className="w-full sm:w-auto"
                          disabled={isUploading}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg p-6 sm:p-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Your Resume</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Drag and drop your resume file here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Supported formats: PDF, DOCX, DOC (Max size: 5MB)
                      </p>
                      <Button 
                        onClick={triggerFileInput} 
                        className="w-full sm:w-auto"
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload Resume
                      </Button>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Resume Tips</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Keep your resume concise and relevant to the jobs you're applying for</li>
                    <li>Highlight your achievements and quantify them when possible</li>
                    <li>Use keywords from job descriptions to pass through ATS systems</li>
                    <li>Proofread carefully to avoid typos and grammatical errors</li>
                    <li>Update your resume regularly to include your latest experience</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={resume ? triggerFileInput : undefined} 
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : resume ? (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Update Resume
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="pt-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Add your technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {skills.length === 0 && (
                        <p className="text-sm text-muted-foreground">No skills added yet. Add some skills below.</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addSkill()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addSkill} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" /> Add
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Add skills that are relevant to your profession. These will help employers find you when they search
                      for candidates.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Skills"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Education Documents Tab */}
          <TabsContent value="education" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Educational Documents</CardTitle>
                <CardDescription>Upload your educational certificates and transcripts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="docType">Document Type</Label>
                      <select
                        id="docType"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="10th">10th Grade Marksheet</option>
                        <option value="12th">12th Grade Marksheet</option>
                        <option value="diploma">Diploma Certificate</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2 flex flex-col justify-end">
                      <Button 
                        onClick={triggerDocFileInput} 
                        disabled={isUploadingDoc}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload Document
                      </Button>
                      <input
                        ref={docFileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocFileChange}
                        className="hidden"
                        disabled={isUploadingDoc}
                      />
                    </div>
                  </div>

                  {isUploadingDoc && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Uploading...</span>
                        <span className="text-sm font-medium">{uploadDocProgress}%</span>
                      </div>
                      <Progress value={uploadDocProgress} className="h-2" />
                    </div>
                  )}
                </div>

                {educationalDocs.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Uploaded Documents</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {educationalDocs.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-lg">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {doc.documentType.toUpperCase()} • {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <a href={doc.url} download={doc.name} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" /> Download
                              </a>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteDoc(doc.url)} 
                              className="w-full sm:w-auto"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg p-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No documents uploaded</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your educational certificates to complete your profile
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Document Guidelines</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Upload clear scans of your original documents</li>
                    <li>Accepted formats: PDF, JPG, PNG (Max size: 5MB each)</li>
                    <li>Ensure all important details are visible in the scan</li>
                    <li>Name your files appropriately (e.g., "10th_Marksheet.pdf")</li>
                    <li>Upload all relevant documents to increase your profile completeness</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}