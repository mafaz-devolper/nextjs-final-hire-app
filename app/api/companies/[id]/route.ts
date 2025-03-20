import { type NextRequest, NextResponse } from "next/server"
import { getCompanyById } from "@/lib/mongodb-utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const company = await getCompanyById(params.id)

    if (!company) {
      return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, company })
  } catch (error: any) {
    console.error("Error fetching company:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch company" }, { status: 500 })
  }
}

