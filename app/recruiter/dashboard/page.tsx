"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Briefcase, Download, Edit, Eye, FileText, Plus, Search, Trash2, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

interface Job {
  id: number
  title: string
  location: string
  type: string
  postedDate: string
  applicants: number
  status: string
  department?: string
}

interface Applicant {
  id: number
  name: string
  position: string
  appliedDate: string
  status: string
  resumeUrl?: string
  email?: string
  jobId?: number
}

export default function RecruiterDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "jobs"

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [jobs, setJobs] = useState<Job[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([])

  // Load jobs and applications from localStorage
  useEffect(() => {
    const postedJobs = JSON.parse(localStorage.getItem("postedJobs") || "[]")
    setJobs(postedJobs)

    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const applicantsData = applications.map((app: any) => ({
      id: app.id,
      name: app.fullName,
      position: app.jobTitle,
      appliedDate: app.appliedDate,
      status: app.status,
      resumeUrl: app.resumeUrl,
      email: app.email,
      jobId: app.jobId,
    }))

    setApplicants(applicantsData)
    setFilteredApplicants(applicantsData)
  }, [])

  useEffect(() => {
    router.replace(`/recruiter/dashboard?tab=${activeTab}`)
  }, [activeTab, router])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApplicants(applicants)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = applicants.filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(term) ||
        applicant.position.toLowerCase().includes(term),
    )

    setFilteredApplicants(filtered)
  }, [searchTerm, applicants])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const confirmDeleteJob = (jobId: number) => {
    setJobToDelete(jobId)
    setIsDeleteDialogOpen(true)
  }

  const deleteJob = () => {
    if (jobToDelete === null) return

    const updatedJobs = jobs.filter((job) => job.id !== jobToDelete)
    setJobs(updatedJobs)
    localStorage.setItem("postedJobs", JSON.stringify(updatedJobs))
    setIsDeleteDialogOpen(false)
    setJobToDelete(null)

    toast({
      title: "Job deleted",
      description: "The job posting has been deleted successfully.",
    })
  }

  const updateApplicationStatus = (applicantId: number, newStatus: string) => {
    const updatedApplicants = applicants.map((applicant) =>
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant,
    )
    setApplicants(updatedApplicants)
    setFilteredApplicants(
      filteredApplicants.map((applicant) =>
        applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant,
      ),
    )

    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const updatedApplications = applications.map((app: any) =>
      app.id === applicantId ? { ...app, status: newStatus } : app,
    )
    localStorage.setItem("applications", JSON.stringify(updatedApplications))

    toast({
      title: "Status updated",
      description: `Application status has been updated to ${newStatus}.`,
    })
  }

  // Dashboard stats
  const totalJobs = jobs.length
  const activeJobs = jobs.filter((job) => job.status === "Active").length
  const totalApplicants = applicants.length
  const hiredApplicants = applicants.filter((app) => app.status === "Accepted").length

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-gray-600">Manage your job postings, applicants, and company profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{totalJobs}</div>
              <p className="text-xs text-gray-500">
                {totalJobs > 0 ? `${activeJobs} active jobs` : "No jobs posted yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs text-gray-500">
                {activeJobs > 0 ? `${Math.round((activeJobs / totalJobs) * 100)}% of total jobs` : "No active jobs"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{totalApplicants}</div>
              <p className="text-xs text-gray-500">
                {totalApplicants > 0
                  ? `${Math.round(totalApplicants / (activeJobs || 1))} applicants per job avg.`
                  : "No applicants yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{hiredApplicants}</div>
              <p className="text-xs text-gray-500">
                {hiredApplicants > 0
                  ? `${Math.round((hiredApplicants / totalApplicants) * 100)}% of applicants`
                  : "No hires yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Button className="flex items-center gap-2" asChild>
            <Link href="/recruiter/post-job">
              <Plus className="h-4 w-4" /> Post a New Job
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link href="/recruiter/company-profile">
              <FileText className="h-4 w-4" /> Edit Company Profile
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link href="/recruiter/reports">
              <BarChart3 className="h-4 w-4" /> View Reports
            </Link>
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex justify-center gap-4 border-b">
            <TabsTrigger value="jobs" className="px-4 py-2">
              Job Postings
            </TabsTrigger>
            <TabsTrigger value="applicants" className="px-4 py-2">
              Recent Applicants
            </TabsTrigger>
          </TabsList>

          {/* Job Postings Tab */}
          <TabsContent value="jobs" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h2 className="text-xl font-semibold">Your Job Postings</h2>
                <Button asChild className="mt-4 md:mt-0">
                  <Link href="/recruiter/post-job">Post a New Job</Link>
                </Button>
              </div>

              {jobs.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            <Link href={`/recruiter/jobs/${job.id}`} className="hover:text-primary">
                              {job.title}
                            </Link>
                          </TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            {typeof job.postedDate === "string" && job.postedDate.includes("T")
                              ? new Date(job.postedDate).toLocaleDateString()
                              : job.postedDate}
                          </TableCell>
                          <TableCell>
                            <Link href={`/recruiter/jobs/${job.id}/applicants`} className="hover:text-primary">
                              {job.applicants} applicants
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/jobs/${job.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/recruiter/jobs/${job.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => confirmDeleteJob(job.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Job Postings Yet</h3>
                    <p className="text-center text-gray-500 mb-6">
                      You haven&apos;t posted any jobs yet. Create your first job posting!
                    </p>
                    <Button asChild>
                      <Link href="/recruiter/post-job">Post a Job</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Recent Applicants Tab */}
          <TabsContent value="applicants" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h2 className="text-xl font-semibold">Recent Applicants</h2>
                <div className="relative mt-4 md:mt-0">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    placeholder="Search applicants"
                    className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredApplicants.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplicants.map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell className="font-medium">
                            <Link href={`/recruiter/applicants/${applicant.id}`} className="hover:text-primary">
                              {applicant.name}
                            </Link>
                          </TableCell>
                          <TableCell>{applicant.position}</TableCell>
                          <TableCell>
                            {typeof applicant.appliedDate === "string" && applicant.appliedDate.includes("T")
                              ? new Date(applicant.appliedDate).toLocaleDateString()
                              : applicant.appliedDate}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                applicant.status === "Pending"
                                  ? "outline"
                                  : applicant.status === "Reviewed"
                                  ? "secondary"
                                  : applicant.status === "Interview"
                                  ? "default"
                                  : applicant.status === "Accepted"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {applicant.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateApplicationStatus(applicant.id, "Accepted")}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateApplicationStatus(applicant.id, "Rejected")}
                              >
                                Reject
                              </Button>
                              {applicant.resumeUrl && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a
                                    href={applicant.resumeUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">Download Resume</span>
                                  </a>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Applicants Yet</h3>
                    <p className="text-center text-gray-500 mb-6">
                      You don&apos;t have any applicants yet. Post a job to start receiving applications!
                    </p>
                    <Button asChild>
                      <Link href="/recruiter/post-job">Post a Job</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Job Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
