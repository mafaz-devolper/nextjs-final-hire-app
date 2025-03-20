import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/mongodb"

export async function authenticateUser(req: NextRequest) {
  try {
    // Get auth data from localStorage on client side
    // This is just a placeholder - in a real app, you'd use cookies or JWT
    const authData = localStorage.getItem("authUser")

    if (!authData) {
      return null
    }

    const userData = JSON.parse(authData)
    const user = await getUserByEmail(userData.email)

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function withAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await authenticateUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req, user)
  }
}

