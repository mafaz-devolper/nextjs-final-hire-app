"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Briefcase, Building2, Clock, FileText, Heart, Info, MapPin, MessageCircle, Plus, Search, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface SavedJob {
  id: number
  title: string
  company: string
  location: string
  salary: string
  postedDate: string
  type: string
}

interface Application {
  id: number
  jobId: number
  jobTitle: string
  company: string
  appliedDate: string
  status: string
  location?: string
  feedback?: string // Add feedback field
}

export default function CandidateDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "applications"

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [profileCompletion, setProfileCompletion] = useState(65)
  
  // State for feedback dialog
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null)

  // Load saved jobs and applications from localStorage
  useEffect(() => {
    // Load saved jobs
    const savedJobsData = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    setSavedJobs(savedJobsData)

    // Load applications
    const applicationsData = JSON.parse(localStorage.getItem("applications") || "[]")

    // Update application statuses in real-time
    setApplications(applicationsData)

    // Set up a small interval to check for updates (in a real app, this would be via WebSockets or polling)
    const interval = setInterval(() => {
      const updatedApplications = JSON.parse(localStorage.getItem("applications") || "[]")
      if (JSON.stringify(updatedApplications) !== JSON.stringify(applications)) {
        setApplications(updatedApplications)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update URL when tab changes
  useEffect(() => {
    router.replace(`/candidate/dashboard?tab=${activeTab}`)
  }, [activeTab, router])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleRemoveSavedJob = (jobId: number) => {
    const updatedSavedJobs = savedJobs.filter((job) => job.id !== jobId)
    setSavedJobs(updatedSavedJobs)
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
    toast({
      title: "Job removed",
      description: "The job has been removed from your saved jobs.",
    })
  }

  // Show feedback dialog
  const viewFeedback = (application: Application) => {
    setCurrentApplication(application)
    setIsFeedbackDialogOpen(true)
  }

  // Get the appropriate badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "outline"
      case "Interview":
        return "default"
      case "Accepted":
        return "secondary"
      case "Rejected":
        return "destructive"
      default:
        return undefined
    }
  }

  // Mock recommended jobs
  const recommendedJobs = [
    {
      id: 6,
      title: "React Developer",
      company: "AppWorks",
      location: "Boston, MA",
      salary: "$90,000 - $120,000",
      postedDate: "5 days ago",
    },
    {
      id: 7,
      title: "Frontend Engineer",
      company: "TechInnovate",
      location: "Remote",
      salary: "$95,000 - $125,000",
      postedDate: "2 days ago",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
          <p className="text-muted-foreground">Manage your job applications, saved jobs, and profile</p>
        </div>


        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full ">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">Your Applications</h2>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>

              {applications.length > 0 ? (
                <div className="grid gap-4">
                  {applications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1.5 flex-grow">
                            <CardTitle className="text-lg">
                              <Link
                                href={`/jobs/${application.jobId}`}
                                className="hover:text-primary transition-colors"
                              >
                                {application.jobTitle}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                              {application.company}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={getStatusBadgeVariant(application.status)}
                            >
                              {application.status}
                            </Badge>
                            {(application.status === "Accepted" || application.status === "Rejected") && 
                              application.feedback && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => viewFeedback(application)}
                                title="View Feedback"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-4 text-sm">
                          {application.location && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              {application.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full sm:w-auto" asChild>
                          <Link href={`/jobs/${application.jobId}`}>View Job</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-center">No Applications Yet</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      You haven&apos;t applied to any jobs yet. Start exploring opportunities!
                    </p>
                    <Button className="w-full sm:w-auto" asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">Saved Jobs</h2>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>

              {savedJobs.length > 0 ? (
                <div className="grid gap-4">
                  {savedJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1.5 flex-grow">
                            <CardTitle className="text-lg">
                              <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                                {job.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                              {job.company}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{job.salary}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-end mt-1">
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                              {job.postedDate}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {job.location}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveSavedJob(job.id)}
                            title="Remove from saved jobs"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button variant="outline" className="flex-1 sm:flex-none" asChild>
                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                          </Button>
                        </div>
                        <Button className="w-full sm:w-auto" asChild>
                          <Link href={`/jobs/${job.id}?apply=true`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-center">No Saved Jobs</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      You haven&apos;t saved any jobs yet. Save jobs to apply to them later!
                    </p>
                    <Button className="w-full sm:w-auto" asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Recommended Jobs Tab */}
          <TabsContent value="recommended">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold">Recommended for You</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    placeholder="Search recommendations"
                    className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              {recommendedJobs.length > 0 ? (
                <div className="grid gap-4">
                  {recommendedJobs.map((job) => (
                    <Card key={job.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1.5 flex-grow">
                            <CardTitle className="text-lg">
                              <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                                {job.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                              {job.company}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{job.salary}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-end mt-1">
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                              {job.postedDate}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {job.location}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                        <Button variant="outline" className="w-full sm:w-auto" asChild>
                          <Link href={`/jobs/${job.id}`}>View Details</Link>
                        </Button>
                        <Button className="w-full sm:w-auto" asChild>
                          <Link href={`/jobs/${job.id}?apply=true`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-center">No Recommendations Yet</h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      Complete your profile to get personalized job recommendations!
                    </p>
                    <Button className="w-full sm:w-auto" asChild>
                      <Link href="/candidate/profile">Update Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentApplication?.status === "Accepted" ? (
                <>Application Accepted <Badge>Accepted</Badge></>
              ) : (
                <>Application Rejected <Badge variant="destructive">Rejected</Badge></>
              )}
            </DialogTitle>
            <DialogDescription>
              Feedback from {currentApplication?.company} regarding your application:
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-4 rounded-md mt-2">
            <p className="whitespace-pre-wrap">{currentApplication?.feedback}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsFeedbackDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}