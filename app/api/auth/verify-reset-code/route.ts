import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, resetCode } = await request.json()

    if (!email || !resetCode) {
      return NextResponse.json({ error: "Email and reset code are required" }, { status: 400 })
    }

    // Check if user exists and code is valid
    const db = await getDb()
    const user = await db.collection("users").findOne({
      email,
      resetCode,
      resetCodeExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Reset code verified" })
  } catch (error) {
    console.error("Error in verify-reset-code route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

