import { type NextRequest, NextResponse } from "next/server"
import { createApplication, getApplicationsByUserId, getApplicationsByJobId } from "@/lib/mongodb-utils"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const jobId = url.searchParams.get("jobId")

    let applications
    if (userId) {
      applications = await getApplicationsByUserId(userId)
    } else if (jobId) {
      applications = await getApplicationsByJobId(jobId)
    } else {
      return NextResponse.json({ success: false, error: "Missing userId or jobId parameter" }, { status: 400 })
    }

    return NextResponse.json({ success: true, applications })
  } catch (error: any) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch applications" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const applicationData = await req.json()

    // Validate required fields
    if (!applicationData.jobId || !applicationData.userId || !applicationData.email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const application = await createApplication(applicationData)

    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating application:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application" },
      { status: error.message.includes("already applied") ? 409 : 500 },
    )
  }
}

