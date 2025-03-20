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
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"

export default function SignupPage() {
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
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const company = formData.get("company") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Add timeout to handle potential long requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, company }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Registration failed. Please try again later.")
      }

      const data = await response.json()

      toast({
        title: "Account created successfully",
        description: "Your account has been created. You can now log in.",
      })

      // Redirect to login page
      router.push(`/auth/login?role=${role}`)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("Request timed out. Please try again.")
      } else {
        setError(err.message || "Registration failed. Please check your connection and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center text-base">
            Enter your details to create your account and get started
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="candidate" className="text-base py-2">Candidate</TabsTrigger>
            <TabsTrigger value="recruiter" className="text-base py-2">Recruiter</TabsTrigger>
          </TabsList>
          <TabsContent value="candidate">
            <form onSubmit={(e) => handleSubmit(e, "candidate")}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="ml-2">{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="candidate-name" className="text-base">Full Name</Label>
                  <Input id="candidate-name" name="name" placeholder="John Doe" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-email" className="text-base">Email</Label>
                  <Input id="candidate-email" name="email" type="email" placeholder="name@example.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-password" className="text-base">Password</Label>
                  <Input id="candidate-password" name="password" type="password" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-confirm-password" className="text-base">Confirm Password</Label>
                  <Input id="candidate-confirm-password" name="confirmPassword" type="password" required className="h-11" />
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox id="candidate-terms" required className="mt-1" />
                  <label
                    htmlFor="candidate-terms"
                    className="text-sm leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6">
                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up as Candidate"}
                </Button>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login?role=candidate" className="text-primary hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="recruiter">
            <form onSubmit={(e) => handleSubmit(e, "recruiter")}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="ml-2">{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="recruiter-name" className="text-base">Full Name</Label>
                  <Input id="recruiter-name" name="name" placeholder="John Doe" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruiter-company" className="text-base">Company Name</Label>
                  <Input id="recruiter-company" name="company" placeholder="Acme Inc." required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruiter-email" className="text-base">Email</Label>
                  <Input id="recruiter-email" name="email" type="email" placeholder="name@company.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruiter-password" className="text-base">Password</Label>
                  <Input id="recruiter-password" name="password" type="password" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruiter-confirm-password" className="text-base">Confirm Password</Label>
                  <Input id="recruiter-confirm-password" name="confirmPassword" type="password" required className="h-11" />
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox id="recruiter-terms" required className="mt-1" />
                  <label
                    htmlFor="recruiter-terms"
                    className="text-sm leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6">
                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up as Recruiter"}
                </Button>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login?role=recruiter" className="text-primary hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
