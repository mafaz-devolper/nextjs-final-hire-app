import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Building2, Users, Award, Globe, Clock, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">About JobPortal</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Connecting talented professionals with top employers worldwide since 2025.
          </p>
        </div>

        {/* Our Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 px-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              At JobPortal, we believe that the right job can change a person's life. Our mission is to make meaningful
              connections between talented individuals and forward-thinking companies, creating opportunities that
              benefit both.
            </p>
            <p className="text-lg text-muted-foreground">
              We're committed to building a platform that makes the job search process more efficient, transparent, and
              human-centered for everyone involved.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/jobs">Explore Opportunities</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-6 px-4">
            <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <Briefcase className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">10,000+</h3>
                <p className="text-sm text-muted-foreground">Jobs Posted Monthly</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">1 Million+</h3>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <Building2 className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">5,000+</h3>
                <p className="text-sm text-muted-foreground">Partner Companies</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">95%</h3>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Values */}
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              These core principles guide everything we do at JobPortal.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-fit">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">People First</h3>
                <p className="text-muted-foreground">
                  We believe in putting people at the center of everything we do, creating experiences that respect and
                  value their time and aspirations.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-fit">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Inclusivity</h3>
                <p className="text-muted-foreground">
                  We're committed to creating a platform that provides equal opportunities for everyone, regardless of
                  background or circumstance.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardContent className="p-8 space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-fit">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve our platform to meet the changing needs of the job market, embracing new
                  technologies and approaches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Team */}
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Our Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              Meet the passionate individuals driving JobPortal's mission forward.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {[
              {
                name: "Md Mafaz",
                role: "CEO & Co-founder",
                image: "https://media.licdn.com/dms/image/v2/D4D03AQH_7QeFT_u3fA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1731676450701?e=1747872000&v=beta&t=WhQwJ0YgIVvU3qCQx8lB7pOBdfmaHxRuQSKQMbIKvII",
              },
              {
                name: "Md Shoheb",
                role: "Co-founder",
                image: "/shoheb.jpeg",
              },
              {
                name: "Md Yusuf",
                role: "CTO",
                image: "/yusuf.png",
              },
              {
                name: "Shahid Danked",
                role: "Chief Marketing Officer",
                image: "/shahid.png",
              },
            ].map((member) => (
              <Card key={member.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full overflow-hidden w-32 h-32 shadow-md">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Join Our Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Whether you're looking for your next career move or searching for top talent, JobPortal is here to help you
            succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/auth/signup?role=candidate">Sign Up as Candidate</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/auth/signup?role=recruiter">Sign Up as Recruiter</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
