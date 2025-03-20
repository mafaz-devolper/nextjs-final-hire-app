"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("role") || "candidate"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, role: string) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Use our MongoDB API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store auth data in localStorage
      localStorage.setItem("authUser", JSON.stringify(data.user))

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}! You are now logged in as a ${role}.`,
      })

      // Redirect based on role
      if (role === "candidate") {
        router.push("/candidate/dashboard")
      } else {
        router.push("/recruiter/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-4 p-1">
            <TabsTrigger value="candidate" className="text-base py-2">Candidate</TabsTrigger>
            <TabsTrigger value="recruiter" className="text-base py-2">Recruiter</TabsTrigger>
          </TabsList>
          <TabsContent value="candidate">
            <form onSubmit={(e) => handleSubmit(e, "candidate")}>
              <CardContent className="space-y-6 pt-6">
                {error && (
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="candidate-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="candidate-email" 
                    name="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-10"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="candidate-password" className="text-sm font-medium">Password</Label>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="candidate-password" 
                    name="password" 
                    type="password"
                    className="h-10" 
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
                <Button type="submit" className="w-full h-10 text-base" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Candidate"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup?role=candidate" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="recruiter">
            <form onSubmit={(e) => handleSubmit(e, "recruiter")}>
              <CardContent className="space-y-6 pt-6">
                {error && (
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="recruiter-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="recruiter-email" 
                    name="email" 
                    type="email" 
                    placeholder="name@company.com"
                    className="h-10" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recruiter-password" className="text-sm font-medium">Password</Label>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="recruiter-password" 
                    name="password" 
                    type="password"
                    className="h-10" 
                    required 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
                <Button type="submit" className="w-full h-10 text-base" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Recruiter"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup?role=recruiter" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
