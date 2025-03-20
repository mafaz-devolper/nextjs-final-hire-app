"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Globe, Users, Briefcase, Search } from "lucide-react"
import { useMongoDB } from "@/hooks/use-mongodb"

// Sample companies data (will be replaced with data from MongoDB)
const sampleCompanies = [
  {
    _id: "1",
    name: "Google LLC",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    description: "A leading multinational technology company specializing in Internet-related services and products.",
    industry: "Technology",
    location: "Mountain View, CA",
    website: "https://careers.google.com/",
    size: "10000+ employees",
    founded: "1998",
    specialties: ["Search Engine", "Cloud Computing", "Artificial Intelligence"],
    openings: 50,
  },
  {
    _id: "2", 
    name: "Microsoft Corporation",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    description: "A global technology leader offering software, services, devices, and solutions.",
    industry: "Technology",
    location: "Redmond, WA", 
    website: "https://careers.microsoft.com/",
    size: "144000+ employees",
    founded: "1975",
    specialties: ["Operating Systems", "Cloud Services", "Productivity Software"],
    openings: 70,
  },
  // ... rest of the companies data ...
];

export default function CompaniesPage() {
  const { getCompanies, isLoading, error } = useMongoDB()
  const [companies, setCompanies] = useState(sampleCompanies)
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("All")

  // Load companies from MongoDB
  useEffect(() => {
    async function loadCompanies() {
      try {
        const companiesData = await getCompanies()
        if (companiesData && companiesData.length > 0) {
          setCompanies(companiesData)
        } else {
          setCompanies(sampleCompanies)
        }
      } catch (error) {
        console.error("Error loading companies:", error)
      }
    }

    loadCompanies()
  }, [getCompanies])

  const industries = ["All", ...new Set(companies.map((company) => company.industry))]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      searchTerm === "" ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesIndustry = industryFilter === "All" || company.industry === industryFilter

    return matchesSearch && matchesIndustry
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Companies</h1>
          <p className="text-lg text-muted-foreground">Discover top companies hiring in your field</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search companies..."
              className="pl-10 h-12 w-full rounded-lg border border-input bg-background px-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="h-12 min-w-[180px] rounded-lg border border-input bg-background px-4 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Companies Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company._id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center p-2 flex-shrink-0">
                    <img
                      src={company.logo || "/placeholder.svg?height=80&width=80"}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl leading-tight mb-1">
                      <Link href={`/companies/${company._id}`} className="hover:text-primary transition-colors line-clamp-2">
                        {company.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm">{company.industry}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{company.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{company.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{company.openings} open positions</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-16 bg-muted/10 rounded-lg">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-3">No companies found</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find more companies
            </p>
            <Button
              size="lg"
              onClick={() => {
                setSearchTerm("")
                setIndustryFilter("All")
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
