"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface AuthGuardProps {
  children: React.ReactNode
}

// Public routes that don't require authentication
const publicRoutes = ["/", "/about", "/contact", "/companies", "/auth/login", "/auth/signup", "/privacy", "/terms"]

// Routes specific to candidates
const candidateRoutes = ["/candidate", "/jobs"]

// Routes specific to recruiters
const recruiterRoutes = ["/recruiter", "/find-talent"]

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem("authUser")

    if (authData) {
      const userData = JSON.parse(authData)
      setIsAuthenticated(true)
      setUserRole(userData.role)
    } else {
      setIsAuthenticated(false)
      setUserRole(null)
    }

    setIsLoading(false)
  }, [pathname])

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return

    // Allow access to public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return
    }

    // Check if authentication is required
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page.",
      })
      router.push("/auth/login")
      return
    }

    // Check role-specific routes
    if (
      (userRole === "candidate" && recruiterRoutes.some((route) => pathname.startsWith(route))) ||
      (userRole === "recruiter" && candidateRoutes.some((route) => pathname.startsWith(route)))
    ) {
      toast({
        title: "Access denied",
        description: `This page is not available for ${userRole}s.`,
        variant: "destructive",
      })
      router.push("/")
      return
    }
  }, [isLoading, isAuthenticated, userRole, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}

