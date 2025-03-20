import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb-utils"
import nodemailer from "nodemailer"

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const db = await getDb()
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate a random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const resetCodeExpires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    // Store the reset code in the database
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          resetCode,
          resetCodeExpires,
        },
      },
    )

    // Send the reset code via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code - AI Hire",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Password Reset</h2>
          <p>You requested a password reset for your AI Hire account. Use the following code to reset your password:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${resetCode}
          </div>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            &copy; ${new Date().getFullYear()} AI Hire. All rights reserved.
          </p>
        </div>
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Continue even if email fails, as we'll store the code in the database
    }

    return NextResponse.json({ success: true, message: "Reset code sent" })
  } catch (error) {
    console.error("Error in forgot-password route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

