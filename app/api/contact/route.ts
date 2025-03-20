import { type NextRequest, NextResponse } from "next/server"
import { createContactSubmission } from "@/lib/mongodb-utils"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json()

    // Validate required fields
    if (!formData.firstName || !formData.email || !formData.message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Save to database
    const submission = await createContactSubmission(formData)

    // Try to send email
    let emailSent = false
    try {
      // Create a transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "your-email@gmail.com",
          pass: process.env.EMAIL_PASS || "your-password",
        },
      })

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "your-email@gmail.com",
        to: "mdmafaz08@gmail.com",
        subject: `Contact Form: ${formData.subject || "New Message"}`,
        text: `
          Name: ${formData.firstName} ${formData.lastName || ""}
          Email: ${formData.email}
          
          Message:
          ${formData.message}
        `,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName || ""}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message.replace(/\n/g, "<br>")}</p>
        `,
      })

      emailSent = true
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // We continue even if email fails, since we saved to database
    }

    return NextResponse.json(
      {
        success: true,
        submission,
        emailSent,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process contact form" },
      { status: 500 },
    )
  }
}

