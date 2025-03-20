import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold tracking-tight">JobPortal</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Connecting talented professionals with top employers worldwide.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold tracking-tight">For Candidates</h3>
            <ul className="flex flex-col space-y-3 text-sm">
              <li>
                <Link href="/jobs" className="text-muted-foreground transition-colors hover:text-foreground">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-muted-foreground transition-colors hover:text-foreground">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/resources/resume" className="text-muted-foreground transition-colors hover:text-foreground">
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link href="/resources/career" className="text-muted-foreground transition-colors hover:text-foreground">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold tracking-tight">For Recruiters</h3>
            <ul className="flex flex-col space-y-3 text-sm">
              <li>
                <Link href="/post-job" className="text-muted-foreground transition-colors hover:text-foreground">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/resources/hiring" className="text-muted-foreground transition-colors hover:text-foreground">
                  Hiring Tips
                </Link>
              </li>
              <li>
                <Link href="/contact-sales" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold tracking-tight">Company</h3>
            <ul className="flex flex-col space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
