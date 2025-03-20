"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Briefcase, Users } from "lucide-react"

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

export default function ViewReports() {
    // Load jobs and applicants from localStorage
    const jobs: Job[] = JSON.parse(localStorage.getItem("postedJobs") || "[]")
    const applicants: Applicant[] = JSON.parse(localStorage.getItem("applications") || "[]")

    // Calculate stats for the charts
    const jobStatusData = [
        { name: "Active", value: jobs.filter((job) => job.status === "Active").length },
        { name: "Closed", value: jobs.filter((job) => job.status === "Closed").length },
    ]

    const applicantStatusData = [
        { name: "Pending", value: applicants.filter((app) => app.status === "Pending").length },
        { name: "Reviewed", value: applicants.filter((app) => app.status === "Reviewed").length },
        { name: "Interview", value: applicants.filter((app) => app.status === "Interview").length },
        { name: "Accepted", value: applicants.filter((app) => app.status === "Accepted").length },
        { name: "Rejected", value: applicants.filter((app) => app.status === "Rejected").length },
    ]

    const jobApplicantsData = jobs.map((job) => ({
        name: job.title,
        applicants: job.applicants,
    }))

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-center tracking-tight">Reports</h1>
                    <p className="text-muted-foreground text-center">
                        Analytics and insights for your job postings and applicants
                    </p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex flex-col items-center">
                        <CardHeader className="flex flex-col items-center pb-2">
                            <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
                            <Briefcase className="h-5 w-5 text-muted-foreground mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-center">{jobs.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col items-center">
                        <CardHeader className="flex flex-col items-center pb-2">
                            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                            <Users className="h-5 w-5 text-muted-foreground mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-center">{applicants.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col items-center">
                        <CardHeader className="flex flex-col items-center pb-2">
                            <CardTitle className="text-sm font-medium">Hired Applicants</CardTitle>
                            <Users className="h-5 w-5 text-muted-foreground mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-center">
                                {applicants.filter((app) => app.status === "Accepted").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex flex-col items-center">
                        <CardHeader className="flex flex-col items-center pb-2">
                            <CardTitle className="text-sm font-medium">Rejected Applicants</CardTitle>
                            <Users className="h-5 w-5 text-muted-foreground mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-center">
                                {applicants.filter((app) => app.status === "Rejected").length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Status Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Job Postings Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={jobStatusData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Applicant Status Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Applicants Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={applicantStatusData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Applicants Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Applicants per Job</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={jobApplicantsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="applicants" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}