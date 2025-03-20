import { type NextRequest, NextResponse } from "next/server"
import { getApplicationById, updateApplicationStatus } from "@/lib/mongodb-utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const application = await getApplicationById(params.id)

    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, application })
  } catch (error: any) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch application" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 })
    }

    const application = await updateApplicationStatus(params.id, status)

    return NextResponse.json({ success: true, application })
  } catch (error: any) {
    console.error("Error updating application:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update application status" },
      { status: 500 },
    )
  }
}

