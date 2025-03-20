import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Star, Users, CheckCircle } from "lucide-react"

export default function FindTalentPage() {
  // List of top job portals for recruiters
  const jobPortals = [
    {
      id: 1,
      name: "LinkedIn",
      description: "The world's largest professional network with over 700 million users worldwide.",
      website: "https://www.linkedin.com/talent-solutions",
      features: ["Advanced candidate search", "InMail messaging", "Job posting", "Applicant tracking"],
      rating: 4.8,
      specialties: ["Professional networking", "Executive recruitment", "Tech talent"],
      logo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Indeed",
      description: "One of the world's largest job sites with millions of job listings and resumes.",
      website: "https://www.indeed.com/hire",
      features: ["Pay-per-click job ads", "Resume search", "Company pages", "Applicant management"],
      rating: 4.6,
      specialties: ["Volume hiring", "Entry to mid-level positions", "Diverse industries"],
      logo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Glassdoor",
      description: "Job site with company reviews, salary reports, and interview insights from employees.",
      website: "https://www.glassdoor.com/employers",
      features: ["Employer branding", "Job posting", "Company reviews", "Interview management"],
      rating: 4.5,
      specialties: ["Employer branding", "Transparent hiring", "Company culture"],
      logo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Monster",
      description: "Global employment website with job listings across various industries and locations.",
      website: "https://hiring.monster.com",
      features: ["Resume database access", "Targeted job ads", "Candidate matching", "Diversity solutions"],
      rating: 4.3,
      specialties: ["Blue-collar jobs", "Healthcare", "Sales positions"],
      logo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      name: "ZipRecruiter",
      description: "Job distribution platform that sends job postings to multiple job boards.",
      website: "https://www.ziprecruiter.com/hiring",
      features: ["One-click job distribution", "AI matching technology", "Candidate screening", "Mobile app"],
      rating: 4.7,
      specialties: ["Small business hiring", "Quick candidate matching", "Local talent"],
      logo: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Find Top Talent</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the best platforms to source qualified candidates for your open positions.
          </p>
        </div>

        {/* Top Job Portals */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Top Talent Sourcing Platforms</h2>
          <div className="grid gap-6">
            {jobPortals.map((portal) => (
              <Card key={portal.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 bg-muted p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4">
                        <img
                          src={portal.logo || "/placeholder.svg"}
                          alt={`${portal.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{portal.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{portal.name}</h3>
                          <p className="text-sm text-muted-foreground">{portal.description}</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                          <a
                            href={portal.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit Site
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Key Features</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {portal.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium mb-3">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {portal.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>Ideal for sourcing qualified candidates across multiple industries</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recruitment Tips */}
        <div className="bg-primary/5 rounded-lg p-6 sm:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Effective Recruitment Strategies</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Write Compelling Job Descriptions</h3>
                <p className="text-sm text-muted-foreground">
                  Craft clear, engaging job descriptions that accurately represent the role and your company culture to
                  attract the right candidates.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Leverage Your Network</h3>
                <p className="text-sm text-muted-foreground">
                  Employee referrals often lead to quality hires. Encourage your team to refer qualified candidates from
                  their professional networks.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Streamline Your Interview Process</h3>
                <p className="text-sm text-muted-foreground">
                  Create a structured, efficient interview process that respects candidates' time while thoroughly
                  evaluating their skills and fit.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Focus on Candidate Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Provide a positive experience for all applicants, regardless of outcome, to build your employer brand
                  and attract future talent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Ready to Post Your Job?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create a job posting on JobPortal to reach qualified candidates and manage your recruitment process
            efficiently.
          </p>
          <Button size="lg" className="min-w-[200px]" asChild>
            <Link href="/recruiter/post-job">Post a Job Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
