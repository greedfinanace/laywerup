"use client"

import { UploadZone } from "@/components/upload/UploadZone"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function UploadPage() {
    const router = useRouter()

    const handleUploadComplete = (data: any) => {
        // Store the analysis data in localStorage for the dashboard to pick up
        if (typeof window !== "undefined") {
            try {
                // Ensure we're saving the shape the dashboard expects.
                // The server action returns { success, data: AIResponse }
                // We passed 'result.data' which IS the AIResponse.
                localStorage.setItem("contractAnalysis", JSON.stringify(data))
                console.log("Analysis saved to localStorage", data)
            } catch (e) {
                console.error("Failed to save analysis", e)
            }
        }

        // Simulate processing delay then redirect
        setTimeout(() => {
            router.push("/dashboard")
        }, 500)
    }

    return (
        <div className="container max-w-4xl mx-auto py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 text-center"
            >
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">Upload Contract</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Securely upload your legal document for instant AI analysis. We support PDF, DOCX, and TXT.
                    </p>
                </div>

                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <UploadZone onUploadComplete={handleUploadComplete} />
                </div>

                <p className="text-xs text-gray-400 mt-8">
                    By uploading, you agree to our Terms of Service. Your documents are encrypted and deleted after 30 days.
                </p>
            </motion.div>
        </div>
    )
}
