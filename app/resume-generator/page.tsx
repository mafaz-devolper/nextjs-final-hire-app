"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, FileText, Plus, Trash2, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export default function ResumeGeneratorPage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    education: [
      {
        id: Date.now(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    experience: [
      {
        id: Date.now(),
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    skills: [] as string[],
    newSkill: "",
    template: "modern",
    isGenerating: false,
    error: "",
  })

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setResumeData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value,
      },
    }))
  }

  const handleEducationChange = (id: number, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }))
  }

  const removeEducation = (id: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const handleExperienceChange = (id: number, field: string, value: string | boolean) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (id: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeData((prev) => ({
      ...prev,
      newSkill: e.target.value,
    }))
  }

  const addSkill = () => {
    if (resumeData.newSkill.trim() && !resumeData.skills.includes(resumeData.newSkill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: "",
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleTemplateChange = (template: string) => {
    setResumeData((prev) => ({
      ...prev,
      template,
    }))
  }

  const generateResume = () => {
    if (!resumeData.personal.fullName || !resumeData.personal.email) {
      setResumeData((prev) => ({
        ...prev,
        error: "Please fill in all required personal information fields.",
      }))
      setActiveTab("personal")
      return
    }

    setResumeData((prev) => ({
      ...prev,
      isGenerating: true,
      error: "",
    }))

    setTimeout(() => {
      setResumeData((prev) => ({
        ...prev,
        isGenerating: false,
      }))
      toast({
        title: "Resume generated successfully",
        description: "Your resume has been generated and is ready to download.",
      })
    }, 2000)
  }

  return (
    <div className="container py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Resume Generator</h1>
          <p className="text-muted-foreground">
            Create a professional resume in minutes
          </p>
        </div>

        {resumeData.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{resumeData.error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Inputs */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              {/* Personal Info */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Enter your personal and contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={resumeData.personal.fullName}
                          onChange={handlePersonalInfoChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={resumeData.personal.email}
                          onChange={handlePersonalInfoChange}
                          placeholder="john.doe@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={resumeData.personal.phone}
                          onChange={handlePersonalInfoChange}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={resumeData.personal.location}
                          onChange={handlePersonalInfoChange}
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={resumeData.personal.linkedin}
                          onChange={handlePersonalInfoChange}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website/Portfolio</Label>
                        <Input
                          id="website"
                          name="website"
                          value={resumeData.personal.website}
                          onChange={handlePersonalInfoChange}
                          placeholder="johndoe.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={resumeData.personal.summary}
                        onChange={handlePersonalInfoChange}
                        placeholder="A brief summary of your professional background and career goals..."
                        className="min-h-[150px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => setActiveTab("education")}>
                      Next: Education
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Education */}
              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Add your educational background</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="space-y-4">
                        {index > 0 && <Separator />}
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Education #{index + 1}</h3>
                          {resumeData.education.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`institution-${edu.id}`}>
                              Institution
                            </Label>
                            <Input
                              id={`institution-${edu.id}`}
                              value={edu.institution}
                              onChange={(e) =>
                                handleEducationChange(edu.id, "institution", e.target.value)
                              }
                              placeholder="University Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                            <Input
                              id={`degree-${edu.id}`}
                              value={edu.degree}
                              onChange={(e) =>
                                handleEducationChange(edu.id, "degree", e.target.value)
                              }
                              placeholder="Bachelor of Science"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                          <Input
                            id={`field-${edu.id}`}
                            value={edu.field}
                            onChange={(e) =>
                              handleEducationChange(edu.id, "field", e.target.value)
                            }
                            placeholder="Computer Science"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                            <Input
                              id={`startDate-${edu.id}`}
                              type="month"
                              value={edu.startDate}
                              onChange={(e) =>
                                handleEducationChange(edu.id, "startDate", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${edu.id}`}>End Date (or Expected)</Label>
                            <Input
                              id={`endDate-${edu.id}`}
                              type="month"
                              value={edu.endDate}
                              onChange={(e) =>
                                handleEducationChange(edu.id, "endDate", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${edu.id}`}>Description</Label>
                          <Textarea
                            id={`description-${edu.id}`}
                            value={edu.description}
                            onChange={(e) =>
                              handleEducationChange(edu.id, "description", e.target.value)
                            }
                            placeholder="Relevant coursework, achievements, or activities..."
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addEducation} className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add Another Education
                    </Button>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("personal")}>
                      Previous: Personal
                    </Button>
                    <Button onClick={() => setActiveTab("experience")}>
                      Next: Experience
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Experience */}
              <TabsContent value="experience">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Add your professional experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="space-y-4">
                        {index > 0 && <Separator />}
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Experience #{index + 1}</h3>
                          {resumeData.experience.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`company-${exp.id}`}>Company</Label>
                            <Input
                              id={`company-${exp.id}`}
                              value={exp.company}
                              onChange={(e) =>
                                handleExperienceChange(exp.id, "company", e.target.value)
                              }
                              placeholder="Company Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`position-${exp.id}`}>Position</Label>
                            <Input
                              id={`position-${exp.id}`}
                              value={exp.position}
                              onChange={(e) =>
                                handleExperienceChange(exp.id, "position", e.target.value)
                              }
                              placeholder="Job Title"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`location-${exp.id}`}>Location</Label>
                          <Input
                            id={`location-${exp.id}`}
                            value={exp.location}
                            onChange={(e) =>
                              handleExperienceChange(exp.id, "location", e.target.value)
                            }
                            placeholder="City, State or Remote"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                            <Input
                              id={`startDate-${exp.id}`}
                              type="month"
                              value={exp.startDate}
                              onChange={(e) =>
                                handleExperienceChange(exp.id, "startDate", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                            <Input
                              id={`endDate-${exp.id}`}
                              type="month"
                              value={exp.endDate}
                              onChange={(e) =>
                                handleExperienceChange(exp.id, "endDate", e.target.value)
                              }
                              disabled={exp.current}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${exp.id}`}>Description</Label>
                          <Textarea
                            id={`description-${exp.id}`}
                            value={exp.description}
                            onChange={(e) =>
                              handleExperienceChange(exp.id, "description", e.target.value)
                            }
                            placeholder="Describe your responsibilities and achievements..."
                            className="min-h-[150px]"
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addExperience} className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add Another Experience
                    </Button>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("education")}>
                      Previous: Education
                    </Button>
                    <Button onClick={() => setActiveTab("skills")}>Next: Skills</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Skills */}
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Add your technical and professional skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {skill}</span>
                            </button>
                          </Badge>
                        ))}
                        {resumeData.skills.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No skills added yet. Add some skills below.
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill..."
                          value={resumeData.newSkill}
                          onChange={handleSkillChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                        />
                        <Button type="button" onClick={addSkill}>
                          <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add skills that highlight your professional capabilities.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("experience")}>
                      Previous: Experience
                    </Button>
                    <Button onClick={generateResume} disabled={resumeData.isGenerating}>
                      {resumeData.isGenerating ? "Generating..." : "Generate Resume"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Preview and Template Selection */}
          <div className="flex flex-col gap-6 md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Resume Template</CardTitle>
                <CardDescription>Choose a template for your resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {["modern", "classic", "creative", "minimal"].map((temp) => (
                    <div
                      key={temp}
                      className={`border rounded-md p-2 cursor-pointer ${
                        resumeData.template === temp ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleTemplateChange(temp)}
                    >
                      <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center">
                        <span className="text-sm font-medium capitalize">{temp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
                <CardDescription>A preview of your generated resume</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-full aspect-[3/4] bg-muted rounded-md flex items-center justify-center mb-4">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Complete all sections and generate your resume to see a preview.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>
                  <Download className="h-4 w-4 mr-2" /> Download Resume
                </Button>
              </CardFooter>
            </Card>

            <div className="text-sm text-muted-foreground">
              <p>Tips for a great resume:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Keep it concise and relevant</li>
                <li>Quantify your achievements when possible</li>
                <li>Use action verbs to describe your experience</li>
                <li>Tailor your resume for each job application</li>
                <li>Proofread carefully for errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
