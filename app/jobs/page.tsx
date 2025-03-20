"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Building2, Clock, MapPin, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  salaryRange: [number, number];
  posted: string;
  description: string;
  tags: string[];
  experience: string;
  status: string;
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const initialSearchTerm = searchParams.get("search") || ""
  const initialLocationFilter = searchParams.get("location") || ""

  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [locationFilter, setLocationFilter] = useState(initialLocationFilter)
  const [sortBy, setSortBy] = useState("relevance")
  const [jobTypeFilter, setJobTypeFilter] = useState("all")
  const [experienceFilters, setExperienceFilters] = useState<string[]>([])
  const [salaryFilters, setSalaryFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load jobs from localStorage
  useEffect(() => {
    const loadJobs = () => {
      setIsLoading(true)
      try {
        // Get posted jobs from localStorage
        const postedJobs = JSON.parse(localStorage.getItem("postedJobs") || "[]")

        // Add some default jobs if none exist
        const defaultJobs = [
          {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            type: "Full-time",
            salary: "$120,000 - $150,000",
            salaryRange: [120000, 150000],
            posted: "2 days ago",
            description: "We are looking for an experienced Frontend Developer to join our team...",
            tags: ["React", "TypeScript", "Next.js"],
            experience: "Senior Level",
            status: "Active",
          },
          {
            id: 2,
            title: "Backend Engineer",
            company: "DataSystems",
            location: "Remote",
            type: "Full-time",
            salary: "$110,000 - $140,000",
            salaryRange: [110000, 140000],
            posted: "1 week ago",
            description: "Join our backend team to build scalable APIs and services...",
            tags: ["Node.js", "Python", "AWS"],
            experience: "Mid Level",
            status: "Active",
          },
          {
            id: 3,
            title: "UX/UI Designer",
            company: "CreativeStudio",
            location: "New York, NY",
            type: "Contract",
            salary: "$90,000 - $120,000",
            salaryRange: [90000, 120000],
            posted: "3 days ago",
            description: "Design beautiful and intuitive user interfaces for our products...",
            tags: ["Figma", "Adobe XD", "UI/UX"],
            experience: "Mid Level",
            status: "Active",
          },
          {
            id: 4,
            title: "DevOps Engineer",
            company: "CloudTech",
            location: "Remote",
            type: "Full-time",
            salary: "$130,000 - $160,000",
            salaryRange: [130000, 160000],
            posted: "Just now",
            description: "Manage our cloud infrastructure and CI/CD pipelines...",
            tags: ["Docker", "Kubernetes", "AWS"],
            experience: "Senior Level",
            status: "Active",
          },
          {
            id: 5,
            title: "Product Manager",
            company: "InnovateCo",
            location: "Austin, TX",
            type: "Full-time",
            salary: "$115,000 - $145,000",
            salaryRange: [115000, 145000],
            posted: "5 days ago",
            description: "Lead product development and work with cross-functional teams...",
            tags: ["Product Management", "Agile", "Scrum"],
            experience: "Senior Level",
            status: "Active",
          },
          {
            id: 6,
            title: "Junior Web Developer",
            company: "StartupHub",
            location: "Chicago, IL",
            type: "Full-time",
            salary: "$70,000 - $90,000",
            salaryRange: [70000, 90000],
            posted: "1 day ago",
            description: "Join our team to build modern web applications...",
            tags: ["JavaScript", "HTML", "CSS"],
            experience: "Entry Level",
            status: "Active",
          },
          {
            id: 7,
            title: "Data Scientist",
            company: "AnalyticsPro",
            location: "Remote",
            type: "Contract",
            salary: "$100,000 - $130,000",
            salaryRange: [100000, 130000],
            posted: "4 days ago",
            description: "Analyze complex data sets and build predictive models...",
            tags: ["Python", "Machine Learning", "SQL"],
            experience: "Mid Level",
            status: "Active",
          },
        ]

        // Combine posted jobs with default jobs
        // Only include active jobs
        const combinedJobs = [...defaultJobs, ...postedJobs.filter((job: Job) => job.status === "Active")]

        // Remove duplicates by ID
        const uniqueJobs = Array.from(new Map(combinedJobs.map((job: Job) => [job.id, job])).values())

        setAllJobs(uniqueJobs)
        setJobs(uniqueJobs)
      } catch (error) {
        console.error("Error loading jobs:", error)
        setAllJobs([])
        setJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let filteredJobs = [...allJobs]

    // Search term filter (title, company, tags)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.tags.some((tag: string) => tag.toLowerCase().includes(term)),
      )
    }

    // Location filter
    if (locationFilter) {
      const location = locationFilter.toLowerCase()
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(location))
    }

    // Job type filter
    if (jobTypeFilter !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.type.toLowerCase() === jobTypeFilter.toLowerCase())
    }

    // Experience level filter
    if (experienceFilters.length > 0) {
      filteredJobs = filteredJobs.filter((job) => experienceFilters.includes(job.experience))
    }

    // Salary range filter
    if (salaryFilters.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        const [min, max] = job.salaryRange
        return salaryFilters.some((range) => {
          if (range === "range1") return max <= 50000
          if (range === "range2") return min >= 50000 && max <= 100000
          if (range === "range3") return min >= 100000 && max <= 150000
          if (range === "range4") return min >= 150000
          return false
        })
      })
    }

    // Sorting
    if (sortBy === "recent") {
      filteredJobs = [...filteredJobs].sort((a, b) => {
        if (a.posted.includes("Just now")) return -1
        if (b.posted.includes("Just now")) return 1
        if (a.posted.includes("day") && b.posted.includes("week")) return -1
        if (a.posted.includes("week") && b.posted.includes("day")) return 1
        return 0
      })
    } else if (sortBy === "salary-high") {
      filteredJobs = [...filteredJobs].sort((a, b) => b.salaryRange[1] - a.salaryRange[1])
    } else if (sortBy === "salary-low") {
      filteredJobs = [...filteredJobs].sort((a, b) => a.salaryRange[0] - b.salaryRange[0])
    }

    setJobs(filteredJobs)
  }, [searchTerm, locationFilter, sortBy, jobTypeFilter, experienceFilters, salaryFilters, allJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const toggleExperienceFilter = (value: string) => {
    setExperienceFilters((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const toggleSalaryFilter = (value: string) => {
    setSalaryFilters((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setSortBy("relevance")
    setJobTypeFilter("all")
    setExperienceFilters([])
    setSalaryFilters([])
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">
            Find the perfect job opportunity that matches your skills and experience
          </p>
        </div>

        {/* Search and Filter */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Location or Remote"
                  className="pl-10 w-full"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">Search Jobs</Button>
            </form>
          </div>
          <div className="flex flex-col gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Results */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="hidden md:block space-y-6 bg-card p-6 rounded-lg border">
            <div>
              <h3 className="font-medium mb-4">Experience Level</h3>
              <div className="space-y-3">
                {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
                  <div key={level} className="flex items-center space-x-3">
                    <Checkbox
                      id={level.toLowerCase().replace(" ", "-")}
                      checked={experienceFilters.includes(level)}
                      onCheckedChange={() => toggleExperienceFilter(level)}
                    />
                    <Label htmlFor={level.toLowerCase().replace(" ", "-")}>{level}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-medium mb-4">Salary Range</h3>
              <div className="space-y-3">
                {[
                  { id: "range1", label: "$0 - $50,000" },
                  { id: "range2", label: "$50,000 - $100,000" },
                  { id: "range3", label: "$100,000 - $150,000" },
                  { id: "range4", label: "$150,000+" }
                ].map((range) => (
                  <div key={range.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={range.id}
                      checked={salaryFilters.includes(range.id)}
                      onCheckedChange={() => toggleSalaryFilter(range.id)}
                    />
                    <Label htmlFor={range.id}>{range.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-6" 
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>

          {/* Job Listings */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Showing {jobs.length} jobs</p>
              <Button 
                variant="outline" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="md:hidden space-y-6 p-6 bg-card rounded-lg border">
                <div>
                  <h3 className="font-medium mb-4">Experience Level</h3>
                  <div className="space-y-3">
                    {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
                      <div key={level} className="flex items-center space-x-3">
                        <Checkbox
                          id={`${level.toLowerCase().replace(" ", "-")}-mobile`}
                          checked={experienceFilters.includes(level)}
                          onCheckedChange={() => toggleExperienceFilter(level)}
                        />
                        <Label htmlFor={`${level.toLowerCase().replace(" ", "-")}-mobile`}>{level}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-medium mb-4">Salary Range</h3>
                  <div className="space-y-3">
                    {[
                      { id: "range1", label: "$0 - $50,000" },
                      { id: "range2", label: "$50,000 - $100,000" },
                      { id: "range3", label: "$100,000 - $150,000" },
                      { id: "range4", label: "$150,000+" }
                    ].map((range) => (
                      <div key={range.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`${range.id}-mobile`}
                          checked={salaryFilters.includes(range.id)}
                          onCheckedChange={() => toggleSalaryFilter(range.id)}
                        />
                        <Label htmlFor={`${range.id}-mobile`}>{range.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-6" 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <CardTitle className="text-xl">
                            <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                              {job.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Building2 className="h-4 w-4 mr-2" />
                            {job.company}
                          </CardDescription>
                        </div>
                        <div className="text-right w-full sm:w-auto">
                          <div className="font-medium text-lg">{job.salary}</div>
                          <div className="text-sm text-muted-foreground flex items-center justify-end mt-2">
                            <Clock className="h-3 w-3 mr-2" />
                            {job.posted}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        {job.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
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
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-medium">No jobs found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              </Card>
            )}

            {jobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="w-full sm:w-auto">
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
