"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Menu, X, User, LogOut, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { toast } from "@/hooks/use-toast"

export function Navbar() {
  const { setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const authData = localStorage.getItem("authUser")
    if (authData) {
      const userData = JSON.parse(authData)
      setIsAuthenticated(true)
      setUserRole(userData.role)
      setUserName(userData.name || userData.email.split("@")[0])
    } else {
      setIsAuthenticated(false)
      setUserRole(null)
      setUserName("")
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("authUser")
    setIsAuthenticated(false)
    setUserRole(null)
    router.push("/")
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const getNavItems = () => {
    const commonItems = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
    ]

    if (userRole === "recruiter") {
      return [...commonItems, { name: "Find Talent", href: "/find-talent" }]
    } else {
      return [...commonItems, { name: "Jobs", href: "/jobs" }, { name: "Companies", href: "/companies" }]
    }
  }

  const navItems = getNavItems()

  const getDashboardItems = () => {
    if (userRole === "candidate") {
      return [
        { name: "Dashboard", href: "/candidate/dashboard" },
        { name: "My Profile", href: "/candidate/profile/view" },
        { name: "Edit Profile", href: "/candidate/profile" },
        { name: "Resume Templates", href: "/candidate/resume-templates" },
      ]
    } else if (userRole === "recruiter") {
      return [
        { name: "Dashboard", href: "/recruiter/dashboard" },
        { name: "Post a Job", href: "/recruiter/post-job" },
      ]
    }
    return []
  }

  const dashboardItems = getDashboardItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight">Hire.com</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[150px] truncate">{userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {dashboardItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center">
                          {item.name === "Dashboard" ? (
                            <User className="mr-2 h-4 w-4" />
                          ) : (
                            <FileText className="mr-2 h-4 w-4" />
                          )}
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] bg-background md:hidden">
          <div className="container px-4 py-6 flex flex-col h-full">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center text-base font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated &&
                dashboardItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center text-base font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
            </nav>
            
            <div className="mt-auto border-t pt-6">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{userName}</span>
                  </div>
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/auth/login" onClick={toggleMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup" onClick={toggleMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}