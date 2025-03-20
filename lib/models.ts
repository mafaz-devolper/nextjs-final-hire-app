// MongoDB data models and types

// User model
export interface User {
  _id?: string
  name: string
  email: string
  password: string
  role: "candidate" | "recruiter"
  company?: string
  createdAt: Date
  updatedAt?: Date
}

// Job model
export interface Job {
  _id?: string
  title: string
  company: string
  companyLogo?: string
  location: string
  type: string
  salary: string
  salaryRange?: number[]
  description: string
  requirements?: string
  benefits?: string
  tags: string[]
  experience?: string
  education?: string
  applicationDeadline?: string
  status: "Active" | "Closed" | "Draft"
  postedBy: string // User ID of recruiter
  applicants?: number
  createdAt: Date
  updatedAt?: Date
}

// Application model
export interface Application {
  _id?: string
  jobId: string
  userId: string
  jobTitle: string
  company: string
  fullName: string
  email: string
  phone?: string
  resumeUrl?: string
  coverLetter?: string
  status: "Pending" | "Reviewed" | "Interview" | "Accepted" | "Rejected"
  appliedDate: Date
  updatedAt?: Date
}

// Candidate Profile model
export interface CandidateProfile {
  _id?: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
  skills: string[]
  experience?: {
    id: number
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }[]
  education?: {
    id: number
    institution: string
    degree: string
    field: string
    year: string
  }[]
  resumeUrl?: string
  linkedIn?: string
  website?: string
  createdAt: Date
  updatedAt?: Date
}

// Company model
export interface Company {
  _id?: string
  name: string
  logo?: string
  description: string
  industry: string
  location: string
  website: string
  size?: string
  founded?: string
  specialties?: string[]
  createdAt: Date
  updatedAt?: Date
}

// Contact form submission
export interface ContactSubmission {
  _id?: string
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  createdAt: Date
}

