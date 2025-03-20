"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Loader2, CheckCircle } from "lucide-react"
import { useMongoDB } from "@/hooks/use-mongodb"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { submitContactForm, isLoading, error } = useMongoDB()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await submitContactForm(formData)

      if (result?.success) {
        setFormSubmitted(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        })

        toast({
          title: "Message sent successfully",
          description: result.emailSent
            ? "Your message has been sent. We'll get back to you soon."
            : "Your message has been received. We'll get back to you soon.",
        })
      }
    } catch (err) {
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="h-fit">
            <CardHeader className="space-y-2">
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-16 h-16 text-primary mb-6" />
                    <h3 className="text-xl font-medium mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground mb-8">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button onClick={() => setFormSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                          id="first-name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input
                          id="last-name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide as much detail as possible..."
                        className="min-h-[150px] resize-y"
                        required
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              {!formSubmitted && (
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </CardFooter>
              )}
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Here's how you can reach us directly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Our Office</h3>
                    <address className="not-italic text-muted-foreground">
                      123 Employment Avenue<br />
                      Suite 456<br />
                      San Francisco, CA 94103<br />
                      United States
                    </address>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Email Us</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:mdmafaz08@gmail.com" className="hover:text-primary transition-colors">
                        mdmafaz08@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      We aim to respond to all inquiries within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Call Us</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+1-555-123-4567" className="hover:text-primary transition-colors">
                        +1 (555) 123-4567
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Monday to Friday, 9:00 AM to 6:00 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">How do I create an account?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can create an account by clicking on the "Sign Up" button in the top right corner of the page.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Is it free to post a job?</h3>
                  <p className="text-sm text-muted-foreground">
                    We offer both free and premium job posting options. Check our pricing page for more details.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">How can I update my resume?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can update your resume by logging into your account and navigating to the "Profile" section.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faq">View All FAQs</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="rounded-lg overflow-hidden border bg-muted h-[400px]">
          <iframe
            src="https://www.google.com/maps/place/Anjuman+E+Islam+Polytechnic+Gadag/@15.3894263,75.6039812,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb8fd7c5070094d:0x59d53ea010384904!8m2!3d15.3894263!4d75.6039812!16s%2Fg%2F11jzdhkgn0?entry=ttu&g_ep=EgoyMDI1MDMxOC4wIKXMDSoASAFQAw%3D%3D"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Office Location"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
