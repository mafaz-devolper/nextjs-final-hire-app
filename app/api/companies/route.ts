import { type NextRequest, NextResponse } from "next/server"
import { getCompanies, createCompany } from "@/lib/mongodb-utils"

export async function GET() {
  try {
    const companies = await getCompanies()
    return NextResponse.json({ success: true, companies })
  } catch (error: any) {
    console.error("Error fetching companies:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch companies" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyData = await req.json()

    // Validate required fields
    if (!companyData.name || !companyData.industry || !companyData.location) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const company = await createCompany(companyData)

    return NextResponse.json({ success: true, company }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating company:", error)
    return NextResponse.json({ success: false, error: error.message || "Failed to create company" }, { status: 500 })
  }
}

