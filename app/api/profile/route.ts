import { type NextRequest, NextResponse } from "next/server"
import { createOrUpdateProfile, getProfileByUserId } from "@/lib/mongodb-utils"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId parameter" }, { status: 400 })
    }

    const profile = await getProfileByUserId(userId)

    return NextResponse.json({ success: true, profile })
  } catch (error: any) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch profile" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const profileData = await req.json()

    // Validate required fields
    if (!profileData.userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 })
    }

    const profile = await createOrUpdateProfile(profileData)

    return NextResponse.json({ success: true, profile }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating/updating profile:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to save profile" }, { status: 500 })
  }
}

