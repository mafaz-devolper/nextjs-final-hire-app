"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface JobApplicationModalProps {
  jobId: number
  jobTitle: string
  company: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function JobApplicationModal({
  jobId,
  jobTitle,
  company,
  isOpen,
  onClose,
  onSuccess,
}: JobApplicationModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate form
    if (!formData.fullName || !formData.email || !resumeFile) {
      setError("Please fill in all required fields and upload your resume.")
      setIsSubmitting(false)
      return
    }

    try {
      // In a real application, you would upload the file to a storage service
      // and send the form data to your backend API

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful application
      const application = {
        id: Math.floor(Math.random() * 1000),
        jobId,
        jobTitle,
        company,
        appliedDate: new Date().toISOString(),
        status: "Pending",
        ...formData,
        resumeUrl: URL.createObjectURL(resumeFile),
      }

      // In a real app, you would store this in your database
      // For now, we'll use localStorage to simulate persistence
      const applications = JSON.parse(localStorage.getItem("applications") || "[]")
      applications.push(application)
      localStorage.setItem("applications", JSON.stringify(applications))

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess()
      } else {
        // Close the modal and redirect to applications page
        onClose()
        router.push("/candidate/dashboard?tab=applications")
        router.refresh()
      }
    } catch (err) {
      setError("Failed to submit application. Please try again.")
      console.error("Application submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>Complete the form below to apply for this position at {company}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX (Max size: 5MB)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell us why you're interested in this position and why you'd be a good fit..."
                className="min-h-[150px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

