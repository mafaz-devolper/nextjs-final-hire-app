import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/mongodb-utils"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, company } = await req.json()

    // Create new user
    const user = await createUser({
      name,
      email,
      password, // In a real app, you would hash this password
      role: role as "candidate" | "recruiter",
      company: role === "recruiter" ? company : undefined,
    })

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "An error occurred during signup." },
      { status: error.message.includes("already exists") ? 409 : 500 },
    )
  }
}

