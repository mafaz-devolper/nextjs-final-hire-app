"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  GraduationCap,
  Heart,
  MapPin,
  Share2,
  Users,
  Copy,
  X,
  Check,
} from "lucide-react"
import { JobApplicationModal } from "@/components/job-application-modal"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Mock job data - in a real app, this would come from an API
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    companyLogo: "/placeholder.svg?height=80&width=80",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    experience: "5+ years",
    education: "Bachelor's degree in Computer Science or related field",
    posted: "2 days ago",
    deadline: "30 days remaining",
    description: `
      <p>TechCorp is looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining user interfaces for our web applications.</p>
      
      <h3>Responsibilities:</h3>
      <ul>
        <li>Develop new user-facing features using React.js</li>
        <li>Build reusable components and front-end libraries for future use</li>
        <li>Translate designs and wireframes into high-quality code</li>
        <li>Optimize components for maximum performance across a vast array of web-capable devices and browsers</li>
        <li>Collaborate with the design team to ensure the technical feasibility of UI/UX designs</li>
      </ul>
      
      <h3>Requirements:</h3>
      <ul>
        <li>5+ years of experience in frontend development</li>
        <li>Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model</li>
        <li>Thorough understanding of React.js and its core principles</li>
        <li>Experience with popular React.js workflows (such as Redux)</li>
        <li>Familiarity with newer specifications of ECMAScript</li>
        <li>Experience with data structure libraries (e.g., Immutable.js)</li>
        <li>Knowledge of isomorphic React is a plus</li>
        <li>Understanding of server-side rendering</li>
      </ul>
      
      <h3>Benefits:</h3>
      <ul>
        <li>Competitive salary and equity</li>
        <li>Health, dental, and vision insurance</li>
        <li>401(k) with company match</li>
        <li>Flexible work hours and remote work options</li>
        <li>Professional development budget</li>
        <li>Paid time off and parental leave</li>
      </ul>
    `,
    tags: ["React", "TypeScript", "Next.js", "Redux", "JavaScript"],
    companyDescription:
      "TechCorp is a leading technology company specializing in web and mobile application development. We work with clients across various industries to deliver innovative digital solutions.",
    employees: "50-100",
    website: "https://techcorp.example.com",
  },
  // Add more job data as needed
]

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = Number.parseInt(params.id)
  const [job, setJob] = useState(jobs[0]) // Initialize with a default job
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  // Check if job is saved and if user has applied
  useEffect(() => {
    // Check if job is saved
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    setIsSaved(savedJobs.some((savedJob: any) => savedJob.id === jobId))

    // Check if user has already applied for this job
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    setHasApplied(applications.some((app: any) => app.jobId === jobId))
  }, [jobId])

  // Check if we should open the application modal from URL param
  useEffect(() => {
    if (searchParams.get("apply") === "true") {
      setIsApplicationModalOpen(true)
    }
  }, [searchParams])

  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")

    if (isSaved) {
      // Remove job from saved jobs
      const updatedSavedJobs = savedJobs.filter((savedJob: any) => savedJob.id !== jobId)
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
      setIsSaved(false)
      toast({
        title: "Job removed from saved jobs",
        description: "The job has been removed from your saved jobs.",
      })
    } else {
      // Add job to saved jobs
      const jobToSave = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        postedDate: job.posted,
        type: job.type,
      }
      savedJobs.push(jobToSave)
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs))
      setIsSaved(true)
      toast({
        title: "Job saved",
        description: "The job has been added to your saved jobs.",
      })
    }
  }

  const handleShareJob = () => {
    setIsShareModalOpen(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Link copied",
      description: "Job link has been copied to clipboard.",
    })
  }

  // Modify the job loading logic to use real job data from localStorage
  // Update useEffect to properly fetch job data
  useEffect(() => {
    const loadJob = () => {
      try {
        // Get posted jobs from localStorage
        const postedJobs = JSON.parse(localStorage.getItem("postedJobs") || "[]")

        // Get default jobs
        const defaultJobs = jobs

        // Combine all jobs
        const allJobs = [...defaultJobs, ...postedJobs]

        // Find the job with the matching ID
        const job = allJobs.find((j) => j.id === jobId)

        if (job) {
          setJob(job)
        }
      } catch (err) {
        console.error("Error loading job:", err)
      }
    }

    loadJob()
  }, [jobId])

  // Function to handle successful application submission
  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setIsApplicationModalOpen(false)

    // Remove the apply param from the URL
    if (searchParams.get("apply") === "true") {
      router.replace(`/jobs/${jobId}`)
    }

    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/jobs" className="hover:text-primary">
              Jobs
            </Link>
            <span>/</span>
            <span>{job.title}</span>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
                <div className="flex gap-6 items-start">
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <img
                      src={job.companyLogo || "/placeholder.svg"}
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      {job.company}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {hasApplied ? (
                    <Button variant="outline" disabled className="w-full sm:w-auto">
                      <Check className="h-4 w-4 mr-2" /> Applied
                    </Button>
                  ) : (
                    <Button onClick={() => setIsApplicationModalOpen(true)} className="w-full sm:w-auto">
                      Apply Now
                    </Button>
                  )}
                  <Button 
                    variant={isSaved ? "default" : "outline"} 
                    onClick={handleSaveJob}
                    className="w-full sm:w-auto"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleShareJob}
                    className="w-full sm:w-auto"
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Posted {job.posted}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Apply before: {job.deadline}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{job.education}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/jobs">Back to Jobs</Link>
              </Button>
              {hasApplied ? (
                <Button variant="outline" disabled className="w-full sm:w-auto">
                  <Check className="h-4 w-4 mr-2" /> Applied
                </Button>
              ) : (
                <Button onClick={() => setIsApplicationModalOpen(true)} className="w-full sm:w-auto">
                  Apply Now
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About the Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                  <img
                    src={job.companyLogo || "/placeholder.svg"}
                    alt={job.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{job.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    <Link
                      href={`/companies/${job.company.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-primary"
                    >
                      View Company Profile
                    </Link>
                  </p>
                </div>
              </div>
              <p className="text-sm">{job.companyDescription}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{job.employees} employees</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={job.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Company Website
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium hover:text-primary">
                    <Link href={`/jobs/${i + 1}`}>
                      {i === 0 ? "Frontend Developer" : i === 1 ? "React Developer" : "UI Engineer"}
                    </Link>
                  </h3>
                  <div className="text-sm text-muted-foreground mt-2">
                    {i === 0 ? "WebTech" : i === 1 ? "AppDev Inc." : "UI Masters"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{i === 0 ? "Remote" : i === 1 ? "New York, NY" : "Austin, TX"}</span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        jobId={job.id}
        jobTitle={job.title}
        company={job.company}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false)
          // Remove the apply param from the URL
          if (searchParams.get("apply") === "true") {
            router.replace(`/jobs/${jobId}`)
          }
        }}
        onSuccess={handleApplicationSuccess}
      />

      {/* Share Job Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Job</DialogTitle>
            <DialogDescription>Share this job opportunity with your network</DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input value={shareUrl} readOnly className="w-full" />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
