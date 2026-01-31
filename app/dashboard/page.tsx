"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RiskGauge } from "@/components/dashboard/RiskGauge"
import { RedFlagCard } from "@/components/dashboard/RedFlagCard"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, MessageSquare, FileText, Calendar, AlertTriangle, CheckCircle, ArrowRight, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/app/utils/supabase/client"

export default function DashboardPage() {
    const [hasContracts, setHasContracts] = useState(false)
    const [loading, setLoading] = useState(true)

    const [analysisData, setAnalysisData] = useState<any>(null)

    useEffect(() => {
        const checkContracts = async () => {
            // Check localStorage for new upload
            const savedAnalysis = localStorage.getItem("contractAnalysis")
            if (savedAnalysis) {
                try {
                    const parsed = JSON.parse(savedAnalysis)
                    setAnalysisData(parsed)
                    setHasContracts(true)
                } catch (e) {
                    console.error("Failed to parse saved analysis", e)
                }
            } else {
                // Mock fallback or Supabase query could go here
                setHasContracts(false)
            }
            setLoading(false)
        }
        checkContracts()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!hasContracts || !analysisData) {
        return <EmptyState />
    }

    // Use analysis data
    const contractMeta = {
        name: analysisData.contractType || "Uploaded Contract",
        type: analysisData.contractType || "Contract",
        date: new Date().toLocaleDateString(),
        size: "Unknown" // We don't have file size easily here unless passed, but acceptable for now
    }

    const riskScore = analysisData.riskScore || 0
    const redFlags = analysisData.redFlags || []
    const summary = analysisData.summary || "No summary available."
    // missingClauses not in AI response currently, can assume empty or default
    const missingClauses = [
        "Limitation of Liability",
        "Confidentiality/NDA",
        "Dispute Resolution"
    ]



    return (
        <div className="min-h-screen pb-20 bg-background text-foreground">
            {/* Dashboard Header */}
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-16 z-30">
                <div className="container py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{contractMeta.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="rounded-md font-normal">{contractMeta.type}</Badge>
                                <span>•</span>
                                <span>Uploaded {contractMeta.date}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button size="sm" onClick={() => window.location.href = '/upload'}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Scan
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container py-8 grid lg:grid-cols-12 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Executive Summary */}
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-6 shadow-sm border"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-500" />
                            Executive Summary
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {summary}
                        </p>
                        <div className="mt-4 flex gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertTriangle className="h-4 w-4 text-danger" />
                                <span>{redFlags.length} Critical Issues</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-success" />
                                <span>{analysisData.fairTerms?.length || 0} Fair Terms</span>
                            </div>
                        </div>
                    </motion.section>

                    {/* Red Flags Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-foreground">Red Flags & Risks</h2>
                            <Badge variant="destructive">Action Required</Badge>
                        </div>
                        <div className="space-y-4">
                            {redFlags.map((flag: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <RedFlagCard {...flag} />
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Missing Clauses */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-muted-foreground">Missing Protection</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {missingClauses.map((clause: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                                        <span className="text-sm font-medium text-muted-foreground">{clause}</span>
                                        <Button variant="ghost" size="sm" className="h-6 text-primary hover:text-primary-700">Add</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-muted-foreground">Fairness Score</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">You (Service Provider)</span>
                                        <span className="font-medium">40%</span>
                                    </div>
                                    <Progress value={40} className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Client</span>
                                        <span className="font-medium">60%</span>
                                    </div>
                                    <Progress value={60} className="bg-muted [&>div]:bg-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-lg bg-card overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success via-warning to-danger" />
                        <CardHeader className="text-center pb-2">
                            <CardTitle>Overall Risk Score</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-4">
                            <RiskGauge score={riskScore} size={220} />
                            <p className="text-center text-sm text-muted-foreground -mt-4 px-4">
                                This contract has a <strong>High Risk</strong> profile compared to standard <span className="italic">Vendor Agreements</span>.
                            </p>
                            <Button className="w-full mt-4 shadow-lg shadow-red-600/25 bg-red-600 hover:bg-red-700 text-white">
                                Start Negotiation
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Ask AI Assistant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="bg-muted rounded-lg p-3 rounded-bl-none text-sm text-foreground">
                                    I found 3 critical issues in this contract. Would you like me to draft a counter-proposal?
                                </div>
                                <div className="rounded-lg p-3 rounded-br-none text-sm ml-auto w-fit bg-primary/20 text-foreground">
                                    Yes, please draft an email to the client.
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ask about this contract..."
                                        className="w-full rounded-full border border-input py-2 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted"
                                    />
                                    <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-primary hover:bg-transparent">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="rounded-xl bg-gradient-to-br from-primary-900 to-primary-800 p-6 text-white">
                        <h3 className="font-semibold mb-2">Need a Human Review?</h3>
                        <p className="text-sm text-primary-100 mb-4">
                            Get a certified attorney to review this contract for $199.
                        </p>
                        <Button variant="secondary" size="sm" className="w-full text-primary-900">
                            Connect with Lawyer
                        </Button>
                    </div>
                </div>

            </div>

            {/* Mobile Floating Action Button */}
            <div className="fixed bottom-6 right-6 lg:hidden">
                <Button size="icon" className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90">
                    <MessageSquare className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}
