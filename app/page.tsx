"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Building2, Search, Users } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const authData = localStorage.getItem("authUser")
    if (authData) {
      const userData = JSON.parse(authData)
      setIsAuthenticated(true)
      setUserRole(userData.role)
    } else {
      setIsAuthenticated(false)
      setUserRole(null)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find Your Dream Job Today
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
                Connect with top employers and discover opportunities that match your skills and aspirations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg">
                  <Link href={userRole === "candidate" ? "/jobs" : "/recruiter/dashboard"}>
                    {userRole === "candidate" ? "Browse Jobs" : "Go to Dashboard"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/jobs">
                      Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth/signup">Create Account</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <form action="/jobs" method="get" className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="search"
                placeholder="Job title, keywords, or company"
                className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="location"
                placeholder="Location or Remote"
                className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <Button type="submit" size="lg">
              Search Jobs
            </Button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Thousands of Jobs</h3>
              <p className="text-muted-foreground">
                Browse through thousands of job listings from top companies across various industries.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Top Employers</h3>
              <p className="text-muted-foreground">
                Connect with leading companies looking for talented professionals like you.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Career Growth</h3>
              <p className="text-muted-foreground">
                Find opportunities that align with your career goals and help you grow professionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Take the Next Step?
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground md:text-xl">
                {isAuthenticated
                  ? "Explore opportunities and grow your career with us."
                  : "Create an account today and start your journey towards finding your dream job."}
              </p>
            </div>
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link href={userRole === "candidate" ? "/candidate/dashboard" : "/recruiter/dashboard"}>
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/auth/signup?role=candidate">Sign Up as Candidate</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/signup?role=recruiter">Sign Up as Recruiter</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
