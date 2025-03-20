import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="py-4 bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
            Terms of Service
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Terms of Service
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: March 16, 2025
            </p>
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Welcome to JobPortal. Please read these Terms of Service ("Terms", "Terms of Service") carefully before
              using our website operated by JobPortal ("us", "we", or "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
            <p>
              By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the
              terms, then you may not access the Service.
            </p>

            <h2>Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at
              all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of
              your account on our Service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities
              or actions under your password, whether your password is with our Service or a third-party service.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming
              aware of any breach of security or unauthorized use of your account.
            </p>

            <h2>Job Postings and Applications</h2>
            <p>
              Employers are responsible for the content of their job postings. Job postings must not contain
              discriminatory content or violate any applicable laws. We reserve the right to remove any job posting at our
              discretion.
            </p>
            <p>
              Job seekers are responsible for the accuracy of their applications and resumes. By submitting an
              application, you grant us permission to share your application materials with the employer.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property
              of JobPortal and its licensors. The Service is protected by copyright, trademark, and other laws of both the
              United States and foreign countries. Our trademarks and trade dress may not be used in connection with any
              product or service without the prior written consent of JobPortal.
            </p>

            <h2>Links To Other Web Sites</h2>
            <p>
              Our Service may contain links to third-party web sites or services that are not owned or controlled by
              JobPortal.
            </p>
            <p>
              JobPortal has no control over, and assumes no responsibility for, the content, privacy policies, or
              practices of any third-party web sites or services. You further acknowledge and agree that JobPortal shall
              not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused
              by or in connection with use of or reliance on any such content, goods, or services available on or through
              any such web sites or services.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
              account, you may simply discontinue using the Service.
            </p>

            <h2>Limitation Of Liability</h2>
            <p>
              In no event shall JobPortal, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access
              to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on
              the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration
              of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any
              other legal theory, whether or not we have been informed of the possibility of such damage.
            </p>

            <h2>Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
              material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <address>
              JobPortal
              <br />
              123 Employment Avenue
              <br />
              San Francisco, CA 94103
              <br />
              Email: terms@jobportal.com
              <br />
              Phone: +1 (555) 123-4567
            </address>
          </div>
          <div className="flex justify-center pt-6">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          &copy; 2025 JobPortal
        </div>
      </footer>
    </div>
  )
}
