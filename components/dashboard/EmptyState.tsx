"use client"

import { motion } from "framer-motion"
import { Upload, FileText, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function EmptyState() {
    const router = useRouter()

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl"
            >
                <Card className="p-12 bg-white dark:bg-[#262626] border dark:border-[#4D4D4D]">
                    <div className="flex justify-center mb-6">
                        <div className="p-6 bg-gray-100 dark:bg-[#050505] rounded-full border-2 dark:border-[#4D4D4D]">
                            <FileText className="h-16 w-16 text-gray-400 dark:text-[#999999]" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4 dark:text-[#E0E0E0]">
                        Welcome to LawyerUp
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-[#999999] mb-8">
                        You haven't uploaded any contracts yet. Get started by analyzing your first legal document and discover hidden risks before you sign.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 text-left p-4 bg-gray-50 dark:bg-[#050505] rounded-lg border dark:border-[#4D4D4D]">
                            <div className="p-2 bg-blue-50 dark:bg-[#990000]/10 rounded-lg">
                                <Upload className="h-5 w-5 text-primary dark:text-[#990000]" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1 dark:text-[#E0E0E0]">Upload Your Contract</h3>
                                <p className="text-sm text-gray-600 dark:text-[#999999]">
                                    Support for PDF, DOCX, and TXT files
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 text-left p-4 bg-gray-50 dark:bg-[#050505] rounded-lg border dark:border-[#4D4D4D]">
                            <div className="p-2 bg-blue-50 dark:bg-[#990000]/10 rounded-lg">
                                <Shield className="h-5 w-5 text-primary dark:text-[#990000]" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1 dark:text-[#E0E0E0]">AI Analysis</h3>
                                <p className="text-sm text-gray-600 dark:text-[#999999]">
                                    Get instant risk scores and red flag detection
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 text-left p-4 bg-gray-50 dark:bg-[#050505] rounded-lg border dark:border-[#4D4D4D]">
                            <div className="p-2 bg-blue-50 dark:bg-[#990000]/10 rounded-lg">
                                <FileText className="h-5 w-5 text-primary dark:text-[#990000]" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1 dark:text-[#E0E0E0]">Actionable Insights</h3>
                                <p className="text-sm text-gray-600 dark:text-[#999999]">
                                    Receive suggestions for negotiation and revisions
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full md:w-auto"
                        onClick={() => router.push('/upload')}
                    >
                        <Upload className="mr-2 h-5 w-5" />
                        Upload Your First Contract
                    </Button>

                    <p className="mt-6 text-xs text-gray-500 dark:text-[#999999]">
                        Your documents are encrypted and never shared. Privacy guaranteed.
                    </p>
                </Card>
            </motion.div>
        </div>
    )
}
