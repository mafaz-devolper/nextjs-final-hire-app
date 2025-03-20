import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/mongodb-utils"

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json()

    // Find user with matching email
    const user = await getUserByEmail(email)

    if (!user || user.role !== role) {
      return NextResponse.json(
        { success: false, error: "User not found. Please check your email or sign up." },
        { status: 404 },
      )
    }

    // In a real app, you would hash passwords and use a secure comparison
    if (user.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid password. Please try again." }, { status: 401 })
    }

    // Create user data to return (excluding password)
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name || email.split("@")[0],
      role: user.role,
      company: user.company,
      loggedInAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, user: userData })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "An error occurred during login." },
      { status: 500 },
    )
  }
}

