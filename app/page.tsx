"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Shield, Zap, Lock, FileText, Binary, Activity, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/utils/supabase/client"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setLoading(false)
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
  const features = [
    {
      icon: <Activity className="h-6 w-6 text-[#990000]" />,
      title: "RISK DETECTION",
      description: "Automatically finds hidden risks and dangerous clauses in your contracts."
    },
    {
      icon: <Binary className="h-6 w-6 text-[#990000]" />,
      title: "PLAIN ENGLISH",
      description: "Translates complex legal language into simple terms you can understand."
    },
    {
      icon: <Lock className="h-6 w-6 text-[#990000]" />,
      title: "SECURE & PRIVATE",
      description: "Your contracts are encrypted and never shared. What you upload stays private."
    }
  ]

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-32 pb-16">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/40 bg-primary/5 text-primary text-xs font-sans font-bold tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 bg-primary"></span>
                </span>
                SYSTEM ONLINE // V2.4.0
              </div>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground max-w-5xl mx-auto leading-tight font-serif uppercase">
                AI Contract <span className="text-primary">Review</span> Platform
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
                Upload your contract and get instant risk analysis. <span className="text-foreground font-medium">Know what you're signing before it's too late.</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
            >
              <Button size="lg" className="w-full text-base h-14" onClick={handleGetStarted} disabled={loading}>
                {loading ? 'Loading...' : 'Get Started'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-full max-w-6xl mx-auto mt-16"
            >
              {/* HUD / Terminal UI */}
              <div className="border border-border bg-background overflow-hidden aspect-[16/9] md:aspect-[2/1] relative group">

                {/* HUD Overlay Lines */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-primary/50" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-primary/50" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-primary/50" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-primary/50" />

                <div className="absolute inset-0 flex font-sans text-left text-xs">
                  {/* Sidebar */}
                  <div className="w-64 border-r border-border bg-muted/40 p-0 hidden md:flex flex-col">
                    <div className="p-4 border-b border-border flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground tracking-wider">LawyerUp OS</span>
                    </div>
                    <div className="flex-1 py-4">
                      {['DASHBOARD', 'INTEL FEED', 'RISK MATRIX', 'ARCHIVE'].map((item) => (
                        <div key={item} className="px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer flex items-center justify-between group-hover:pl-5 transition-all">
                          <span>{item}</span>
                          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-primary">0x01</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-border">
                      <div className="text-[10px] text-muted-foreground mb-1">STATUS:</div>
                      <div className="flex items-center gap-2 text-primary">
                        <span className="h-1.5 w-1.5 bg-primary animate-pulse"></span>
                        CONNECTED
                      </div>
                    </div>
                  </div>

                  {/* Main Display */}
                  <div className="flex-1 bg-background p-0 relative overflow-hidden">
                    {/* Top Bar */}
                    <div className="h-12 border-b border-border flex items-center justify-between px-6 bg-muted/20">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">TARGET:</span>
                        <span className="text-foreground bg-muted/50 px-2 py-0.5">MSA_V4_FINAL.PDF</span>
                      </div>
                      <div className="flex gap-4 text-muted-foreground">
                        <span>SIZE: 2.4MB</span>
                        <span>TYPE: LEGAL/COMMERCIAL</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 grid grid-cols-3 gap-6 h-full text-justify opacity-90">
                      <div className="col-span-2 space-y-4 font-sans text-muted-foreground leading-relaxed text-sm p-4 border border-dashed border-border bg-muted/10 relative">
                        <div className="absolute top-2 right-2 text-[10px] text-muted-foreground font-sans font-medium">RAW_TEXT_LAYER</div>
                        <p>
                          <span className="text-muted-foreground">001</span> This Master Services Agreement (the "Agreement") is entered into as of...
                        </p>
                        <p>
                          <span className="text-muted-foreground">002</span> <span className="bg-red-900/20 text-red-500 border-b border-red-500/50">INDEMNIFICATION. Provider shall indemnify Client for any and all claims... inclusive of consequential damages...</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">003</span> <span className="bg-amber-900/20 text-amber-500 border-b border-amber-500/50">NON-SOLICITATION. For a period of 5 years, Provider shall not...</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">004</span> GOVERNING LAW. This Agreement shall be governed by the laws of the State of Delaware.
                        </p>
                      </div>

                      {/* Side Analysis */}
                      <div className="space-y-4">
                        <div className="p-4 border border-border bg-muted/30">
                          <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Threat Level</div>
                          <div className="text-3xl font-bold text-red-500 mb-1">CRITICAL</div>
                          <div className="text-xs text-red-400">Clause 002 exposes uncapped liability.</div>
                        </div>

                        <div className="p-4 border border-border bg-muted/30">
                          <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Logic Score</div>
                          <div className="flex items-end gap-2 text-primary">
                            <span className="text-3xl font-bold">42</span>
                            <span className="text-sm mb-1">/ 100</span>
                          </div>
                          <div className="w-full bg-muted h-1 mt-2">
                            <div className="bg-primary h-full w-[42%]"></div>
                          </div>
                        </div>

                        <div className="p-4 border border-border bg-muted/30">
                          <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Action</div>
                          <Button size="sm" className="w-full bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors">
                            REJECT CLAUSE
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-xs text-muted-foreground font-sans tracking-widest uppercase">Trusted by Defense & Enterprise Sectors</p>
          </div>
        </div>
      </section>

      {/* Grid of Features - Technical Style */}
      <section className="py-24 border-t border-border bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="bg-transparent border border-border hover:border-primary/50 transition-colors group">
                <CardContent className="pt-8 px-8">
                  <div className="mb-6 p-3 bg-muted/50 w-fit border border-border group-hover:border-primary/50 group-hover:text-primary transition-all text-muted-foreground">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-foreground font-serif tracking-wide uppercase">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 bg-background">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground font-sans">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>LAWYERUP INC. // EST. 2026</span>
          </div>
          <div className="flex gap-6 uppercase tracking-wider">
            <a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Encrypted Comms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
