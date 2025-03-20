"use client"

import { useState } from "react"

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string>
}

export function useMongoDB() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAPI = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const { method = "GET", body, headers = {}, params = {} } = options

      // Build URL with query parameters
      let url = `/api/${endpoint}`
      if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value)
        })
        url += `?${searchParams.toString()}`
      }

      const requestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }

      if (body) {
        requestOptions.body = JSON.stringify(body)
      }

      const response = await fetch(url, requestOptions)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred")
      }

      return data as T
    } catch (err: any) {
      setError(err.message || "An error occurred")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Auth functions
  const login = async (email: string, password: string, role: string) => {
    const data = await fetchAPI<{ success: boolean; user: any }>("auth/login", {
      method: "POST",
      body: { email, password, role },
    })

    if (data?.success && data.user) {
      // Store user data in localStorage for client-side auth
      localStorage.setItem("authUser", JSON.stringify(data.user))
      return data.user
    }

    return null
  }

  const signup = async (userData: any) => {
    return fetchAPI<{ success: boolean; user: any }>("auth/signup", {
      method: "POST",
      body: userData,
    })
  }

  const logout = () => {
    localStorage.removeItem("authUser")
  }

  // Job functions
  const getJobs = async (recruiterId?: string) => {
    const data = await fetchAPI<{ success: boolean; jobs: any[] }>("jobs", {
      params: recruiterId ? { recruiterId } : {},
    })
    return data?.jobs || []
  }

  const getJob = async (id: string) => {
    const data = await fetchAPI<{ success: boolean; job: any }>(`jobs/${id}`)
    return data?.job || null
  }

  const createJob = async (jobData: any) => {
    const data = await fetchAPI<{ success: boolean; job: any }>("jobs", {
      method: "POST",
      body: jobData,
    })
    return data?.job || null
  }

  const updateJob = async (id: string, jobData: any) => {
    const data = await fetchAPI<{ success: boolean; job: any }>(`jobs/${id}`, {
      method: "PUT",
      body: jobData,
    })
    return data?.job || null
  }

  const deleteJob = async (id: string) => {
    return fetchAPI<{ success: boolean }>(`jobs/${id}`, {
      method: "DELETE",
    })
  }

  // Application functions
  const getApplications = async (params: { userId?: string; jobId?: string }) => {
    const data = await fetchAPI<{ success: boolean; applications: any[] }>("applications", {
      params,
    })
    return data?.applications || []
  }

  const createApplication = async (applicationData: any) => {
    const data = await fetchAPI<{ success: boolean; application: any }>("applications", {
      method: "POST",
      body: applicationData,
    })
    return data?.application || null
  }

  const getApplication = async (id: string) => {
    const data = await fetchAPI<{ success: boolean; application: any }>(`applications/${id}`)
    return data?.application || null
  }

  const updateApplicationStatus = async (id: string, status: string) => {
    const data = await fetchAPI<{ success: boolean; application: any }>(`applications/${id}`, {
      method: "PATCH",
      body: { status },
    })
    return data?.application || null
  }

  // Profile functions
  const getProfile = async (userId: string) => {
    const data = await fetchAPI<{ success: boolean; profile: any }>("profile", {
      params: { userId },
    })
    return data?.profile || null
  }

  const saveProfile = async (profileData: any) => {
    const data = await fetchAPI<{ success: boolean; profile: any }>("profile", {
      method: "POST",
      body: profileData,
    })
    return data?.profile || null
  }

  // Company functions
  const getCompanies = async () => {
    const data = await fetchAPI<{ success: boolean; companies: any[] }>("companies")
    return data?.companies || []
  }

  const getCompany = async (id: string) => {
    const data = await fetchAPI<{ success: boolean; company: any }>(`companies/${id}`)
    return data?.company || null
  }

  // Contact form
  const submitContactForm = async (formData: any) => {
    const data = await fetchAPI<{ success: boolean; submission: any; emailSent: boolean }>("contact", {
      method: "POST",
      body: formData,
    })
    return data
  }

  return {
    isLoading,
    error,
    // Auth
    login,
    signup,
    logout,
    // Jobs
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    // Applications
    getApplications,
    getApplication,
    createApplication,
    updateApplicationStatus,
    // Profile
    getProfile,
    saveProfile,
    // Companies
    getCompanies,
    getCompany,
    // Contact
    submitContactForm,
  }
}