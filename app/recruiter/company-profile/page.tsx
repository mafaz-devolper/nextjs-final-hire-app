"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface CompanyProfile {
    name: string
    description: string
    location: string
    website: string
    logoUrl?: string
}

export default function EditCompanyProfile() {
    const router = useRouter()
    const [profile, setProfile] = useState<CompanyProfile>({
        name: "",
        description: "",
        location: "",
        website: "",
        logoUrl: "",
    })

    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem("companyProfile") || "{}")
        setProfile(savedProfile)
    }, [])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setProfile((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveProfile = () => {
        if (!profile.name || !profile.description || !profile.location || !profile.website) {
            toast({
                title: "Validation Error",
                description: "Please fill out all required fields.",
                variant: "destructive",
            })
            return
        }
        localStorage.setItem("companyProfile", JSON.stringify(profile))
        toast({
            title: "Profile Updated",
            description: "Your company profile has been updated successfully.",
        })
        router.push("/recruiter/dashboard")
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Company Profile</h1>
                <p className="text-muted-foreground">
                    Update your company's information to attract the best talent.
                </p>
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            placeholder="Enter your company name"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Company Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            value={profile.description}
                            onChange={handleInputChange}
                            placeholder="Describe your company"
                            rows={5}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="location" className="text-sm font-medium">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="location"
                            name="location"
                            value={profile.location}
                            onChange={handleInputChange}
                            placeholder="Enter your company location"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="website" className="text-sm font-medium">
                            Website <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="website"
                            name="website"
                            value={profile.website}
                            onChange={handleInputChange}
                            placeholder="Enter your company website"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="logoUrl" className="text-sm font-medium">
                            Logo URL (Optional)
                        </label>
                        <Input
                            id="logoUrl"
                            name="logoUrl"
                            value={profile.logoUrl || ""}
                            onChange={handleInputChange}
                            placeholder="Enter the URL of your company logo"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
