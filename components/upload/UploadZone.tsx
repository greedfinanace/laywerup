"use client"

import { useState, useCallback } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress" // Using my own Progress component

interface UploadZoneProps {
    onUploadComplete?: (data: any) => void
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const [progress, setProgress] = useState(0)
    const [fileName, setFileName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            setUploadStatus('error')
            setErrorMessage(fileRejections[0].errors[0].message)
            return
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setFileName(file.name)
            setUploadStatus('uploading')
            setProgress(0)

            const formData = new FormData()
            formData.append("file", file)

            // Simulate progress for UX while waiting for server
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return 90
                    return prev + 10
                })
            }, 500)

            try {
                const { uploadContract } = await import("@/app/actions/upload")
                const result = await uploadContract(formData)

                clearInterval(interval)
                setProgress(100)

                if (result.success) {
                    setUploadStatus('success')
                    // Pass the whole result data, not just the file
                    if (onUploadComplete) onUploadComplete(result.data)
                } else {
                    setUploadStatus('error')
                    setErrorMessage(result.error || "Upload failed")
                }
            } catch (error) {
                clearInterval(interval)
                setUploadStatus('error')
                setErrorMessage("An unexpected error occurred")
                console.error(error)
            }
        }
    }, [onUploadComplete])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        }
    })

    // Reset
    const reset = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setUploadStatus('idle')
        setProgress(0)
        setFileName("")
        setErrorMessage("")
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex flex-col items-center justify-center p-12 transition-all duration-300 border-2 border-dashed rounded-xl cursor-pointer group hover:border-primary/50 hover:bg-primary/5",
                    isDragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-gray-200",
                    uploadStatus !== 'idle' && "pointer-events-none border-solid"
                )}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {uploadStatus === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center text-center space-y-4"
                        >
                            <div className="p-4 rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                                <UploadCloud className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {isDragActive ? "Drop contract here" : "Upload your contract"}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Drag & drop or click to browse
                                </p>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
                                <span>PDF</span>
                                <span>•</span>
                                <span>DOCX</span>
                                <span>•</span>
                                <span>TXT</span>
                            </div>
                        </motion.div>
                    )}

                    {uploadStatus === 'uploading' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-md space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-primary/10">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                                    <p className="text-xs text-muted-foreground">Uploading...</p>
                                </div>
                            </div>
                            {/* Simple Progress Bar inline since we didn't export full Progress component properly yet or we can just use tailwind div */}
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {uploadStatus === 'success' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center text-center space-y-3"
                        >
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Upload Complete!</h3>
                                <p className="text-sm text-gray-500">Analyzing your contract...</p>
                            </div>
                        </motion.div>
                    )}

                    {uploadStatus === 'error' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center text-center space-y-3"
                        >
                            <div className="p-3 rounded-full bg-red-100 text-danger">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Upload Failed</h3>
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={reset} className="mt-2 pointer-events-auto">
                                Try Again
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
