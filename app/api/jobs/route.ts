import { type NextRequest, NextResponse } from "next/server"
import { getJobs, createJob, getJobsByRecruiter } from "@/lib/mongodb-utils"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const recruiterId = url.searchParams.get("recruiterId")

    let jobs
    if (recruiterId) {
      jobs = await getJobsByRecruiter(recruiterId)
    } else {
      jobs = await getJobs({ status: "Active" })
    }

    return NextResponse.json({ success: true, jobs })
  } catch (error: any) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const jobData = await req.json()

    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.postedBy) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const job = await createJob({
      ...jobData,
      tags: jobData.tags || [],
      status: jobData.status || "Active",
    })

    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating job:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to create job" }, { status: 500 })
  }
}

