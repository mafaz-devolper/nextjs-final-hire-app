import { type NextRequest, NextResponse } from "next/server"
import { getJobById, updateJob, deleteJob } from "@/lib/mongodb-utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await getJobById(params.id)

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error: any) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobData = await req.json()
    const job = await updateJob(params.id, jobData)

    return NextResponse.json({ success: true, job })
  } catch (error: any) {
    console.error("Error updating job:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteJob(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to delete job" }, { status: 500 })
  }
}

