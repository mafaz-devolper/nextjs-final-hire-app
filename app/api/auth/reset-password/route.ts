import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb-utils"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, resetCode, newPassword } = await request.json()

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json({ error: "Email, reset code, and new password are required" }, { status: 400 })
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password and clear the reset code
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetCode: "",
          resetCodeExpires: "",
        },
      },
    )

    return NextResponse.json({ success: true, message: "Password reset successful" })
  } catch (error) {
    console.error("Error in reset-password route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

