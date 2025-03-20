"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Info, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

interface JobFormData {
  title: string
  department: string
  jobType: string
  location: string
  workMode: string
  minSalary: string
  maxSalary: string
  description: string
  requirements: string
  benefits: string
  applicationDeadline: string
}

export default function PostJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    department: "",
    jobType: "full-time",
    location: "",
    workMode: "on-site",
    minSalary: "",
    maxSalary: "",
    description: "",
    requirements: "",
    benefits: "",
    applicationDeadline: "",
  })

  // Check authentication
  useEffect(() => {
    const authData = localStorage.getItem("authUser")
    if (authData) {
      const user = JSON.parse(authData)
      if (user.role === "recruiter") {
        setIsAuthenticated(true)
        setUserData(user)
      } else {
        toast({
          title: "Access denied",
          description: "Only recruiters can post jobs.",
          variant: "destructive",
        })
        router.push("/")
      }
    } else {
      toast({
        title: "Authentication required",
        description: "Please login as a recruiter to post jobs.",
        variant: "destructive",
      })
      router.push("/auth/login?role=recruiter")
    }
  }, [router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate form
    if (
      !formData.title ||
      !formData.location ||
      !formData.description ||
      !formData.requirements
    ) {
      setError("Please fill in all required fields.")
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newJob = {
        id: Date.now(),
        title: formData.title,
        department: formData.department,
        type: formData.jobType,
        location: formData.location,
        workMode: formData.workMode,
        salary:
          formData.minSalary && formData.maxSalary
            ? `$${formData.minSalary} - $${formData.maxSalary}`
            : "Competitive",
        salaryRange: [
          formData.minSalary ? Number.parseInt(formData.minSalary) : 0,
          formData.maxSalary ? Number.parseInt(formData.maxSalary) : 0,
        ],
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        applicationDeadline: formData.applicationDeadline,
        postedDate: new Date().toISOString(),
        status: "Active",
        applicants: 0,
        company: userData?.company || "Your Company",
        postedBy: userData?.id || "unknown",
        tags: formData.description
          .split(" ")
          .filter((word) => word.length > 5)
          .slice(0, 5),
      }

      const jobs = JSON.parse(localStorage.getItem("postedJobs") || "[]")
      jobs.push(newJob)
      localStorage.setItem("postedJobs", JSON.stringify(jobs))

      toast({
        title: "Job posted successfully",
        description:
          "Your job has been posted and is now visible to candidates.",
      })

      router.push("/recruiter/dashboard")
    } catch (err) {
      setError("Failed to post job. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Post a New Job
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a new job posting to attract qualified candidates
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="px-6 py-4">
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide detailed information about the position
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4 space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="e.g. Engineering"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select
                      name="jobType"
                      value={formData.jobType}
                      onValueChange={(value) =>
                        handleSelectChange("jobType", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workMode">Work Mode *</Label>
                    <Select
                      name="workMode"
                      value={formData.workMode}
                      onValueChange={(value) =>
                        handleSelectChange("workMode", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minSalary">Minimum Salary</Label>
                    <Input
                      id="minSalary"
                      name="minSalary"
                      type="number"
                      placeholder="e.g. 80000"
                      value={formData.minSalary}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxSalary">Maximum Salary</Label>
                    <Input
                      id="maxSalary"
                      name="maxSalary"
                      type="number"
                      placeholder="e.g. 120000"
                      value={formData.maxSalary}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the role, responsibilities, and ideal candidate..."
                      className="min-h-[200px]"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements *</Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      placeholder="List the skills, qualifications, and experience required..."
                      className="min-h-[150px]"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea
                      id="benefits"
                      name="benefits"
                      placeholder="Describe the benefits, perks, and company culture..."
                      className="min-h-[150px]"
                      value={formData.benefits}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">
                    Application Deadline
                  </Label>
                  <Input
                    id="applicationDeadline"
                    name="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    If left blank, the job posting will remain open indefinitely.
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All fields marked with * are required. Please provide accurate
                    information to attract the right candidates.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
