"use client"

import { useState } from "react"

export function useMongoDB() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getProfile = async () => {
    try {
      setIsLoading(true)
      const profile = localStorage.getItem("userProfile")
      return profile ? JSON.parse(profile) : null
    } catch (err) {
      setError("Failed to fetch profile")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const saveProfile = async (profile: any) => {
    try {
      setIsLoading(true)
      localStorage.setItem("userProfile", JSON.stringify(profile))
    } catch (err) {
      setError("Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getCompanies = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const companies = localStorage.getItem("companies")
      return companies ? JSON.parse(companies) : []
    } catch (err) {
      console.error("Error fetching companies:", err)
      setError("Failed to fetch companies")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getProfile,
    saveProfile,
    getCompanies,
    isLoading,
    error
  }
}
