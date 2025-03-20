import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: March 16, 2025</p>
        </header>

        <main className="space-y-8">
          <article className="prose dark:prose-invert">
            <p>
              At JobPortal, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2>Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
            <ul>
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, telephone number, and demographic information that you voluntarily give to us when you register or choose to participate.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, access times, and pages viewed.
              </li>
              <li>
                <strong>Financial Data:</strong> Financial information (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase or request our services.
              </li>
              <li>
                <strong>Data From Social Networks:</strong> User information from social networking sites, such as LinkedIn, including your name, username, location, gender, birth date, email address, profile picture, and public data for contacts.
              </li>
            </ul>

            <h2>Use of Your Information</h2>
            <p>
              Accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use your information to:
            </p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Process your job applications.</li>
              <li>Email you regarding your account or job applications.</li>
              <li>Fulfill and manage job postings, payments, and transactions.</li>
              <li>Increase the efficiency of the site.</li>
              <li>Monitor and analyze usage and trends to improve your experience.</li>
              <li>Notify you of updates to the site.</li>
              <li>Resolve disputes and troubleshoot problems.</li>
              <li>Protect against unauthorized access to your personal data.</li>
              <li>Respond to legal requests and prevent harm.</li>
            </ul>

            <h2>Disclosure of Your Information</h2>
            <p>
              Your information may be shared in certain situations:
            </p>
            <ul>
              <li>
                <strong>By Law or to Protect Rights:</strong> When required by law or to protect the rights, property, and safety of others.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> With companies that perform services for us, including payment processing, data analysis, email delivery, hosting, customer service, and marketing.
              </li>
              <li>
                <strong>Marketing Communications:</strong> With your consent or an opportunity for you to withdraw consent.
              </li>
              <li>
                <strong>Interactions with Other Users:</strong> If you interact with other users, they may see your name, profile photo, and activity descriptions.
              </li>
              <li>
                <strong>Online Postings:</strong> Comments or contributions you post may be visible to all users and publicly distributed.
              </li>
            </ul>

            <h2>Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. However, no security measures are perfect or impenetrable.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <address>
              JobPortal<br />
              123 Employment Avenue<br />
              San Francisco, CA 94103<br />
              Email: privacy@jobportal.com<br />
              Phone: +1 (555) 123-4567
            </address>
          </article>
        </main>

        <footer className="flex justify-center pt-6">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </footer>
      </div>
    </div>
  )
}
