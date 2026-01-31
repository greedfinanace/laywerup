"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldCheck, Menu, X, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { createClient } from "@/app/utils/supabase/client"

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const pathname = usePathname()
    const router = useRouter()
    const isDashboard = pathname.startsWith('/dashboard')

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setIsAuthenticated(true)
                setUserEmail(user.email ?? null)
            }
        }
        checkAuth()
    }, [])

    const handleGetStarted = () => {
        if (isAuthenticated) {
            router.push('/dashboard')
        } else {
            router.push('/login')
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                        <div className="relative h-8 w-8">
                            <Image
                                src="/logo-v3.png"
                                alt="LawyerUp Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span>Lawyer<span className="text-primary">Up</span></span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {!isDashboard ? (
                        <>
                            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Features
                            </Link>
                            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Pricing
                            </Link>
                            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Testimonials
                            </Link>
                            <div className="h-6 w-px bg-border mx-2" />
                            <ThemeToggle />
                            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Button onClick={handleGetStarted}>Get Started <ChevronRight className="ml-1 h-4 w-4" /></Button>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/dashboard' ? "text-primary" : "text-muted-foreground")}>
                                Overview
                            </Link>
                            <Link href="/dashboard/contracts" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Contracts
                            </Link>
                            <div className="h-6 w-px bg-border mx-2" />
                            <ThemeToggle />
                            <Link href="/dashboard/profile">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <User className="h-4 w-4" />
                                    {userEmail || "Profile"}
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="md:hidden border-b bg-background"
                >
                    <div className="container py-4 flex flex-col gap-4">
                        <Link href="#features" className="text-sm font-medium" onClick={() => setIsOpen(false)}>Features</Link>
                        <Link href="#pricing" className="text-sm font-medium" onClick={() => setIsOpen(false)}>Pricing</Link>
                        <Link href="/login" className="text-sm font-medium" onClick={() => setIsOpen(false)}>Sign In</Link>
                        <Button className="w-full" onClick={() => { handleGetStarted(); setIsOpen(false); }}>Get Started</Button>
                    </div>
                </motion.div>
            )}
        </header>
    )
}
