"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ChevronDown, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RedFlagProps {
    title: string
    clause: string
    explanation: string
    severity: "critical" | "moderate" | "minor"
    suggestion?: string
}

export function RedFlagCard({ title, clause, explanation, severity, suggestion }: RedFlagProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [copied, setCopied] = useState(false)

    const severityColors = {
        critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50",
        moderate: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
        minor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50"
    }

    const borderColors = {
        critical: "border-l-danger",
        moderate: "border-l-warning",
        minor: "border-l-primary" // Using blue/primary for minor
    }

    const handleCopy = () => {
        if (suggestion) {
            navigator.clipboard.writeText(suggestion)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <motion.div
            layout
            className={cn(
                "group relative overflow-hidden rounded-lg bg-card shadow-sm ring-1 ring-border transition-all hover:shadow-md",
                `border-l-4 ${borderColors[severity]}`
            )}
        >
            <div
                className="flex cursor-pointer items-start gap-4 p-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="mt-1">
                    <AlertTriangle className={cn(
                        "h-5 w-5",
                        severity === 'critical' ? 'text-danger' : severity === 'moderate' ? 'text-warning' : 'text-primary'
                    )} />
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{title}</h3>
                        <div className="flex items-center gap-2">
                            <Badge variant={severity === 'critical' ? 'destructive' : severity === 'moderate' ? 'warning' : 'secondary'} className="capitalize">
                                {severity}
                            </Badge>
                            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                        </div>
                    </div>

                    {!isExpanded && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                            {explanation}
                        </p>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="border-t border-border bg-muted/50 p-4 pt-2 ml-12">
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Problematic Clause</span>
                                    <p className="mt-1 rounded-md bg-warning/10 p-3 italic text-foreground border border-warning/20 text-sm">
                                        "{clause}"
                                    </p>
                                </div>

                                <div>
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Why it's risky</span>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {explanation}
                                    </p>
                                </div>

                                {suggestion && (
                                    <div className="rounded-lg bg-card p-4 ring-1 ring-border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                                                <Sparkles className="h-3 w-3" />
                                                Suggested Fix
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopy();
                                                }}
                                            >
                                                {copied ? <Check className="h-3 w-3 mr-1" /> : null}
                                                {copied ? "Copied" : "Copy Fix"}
                                            </Button>
                                        </div>
                                        <p className="text-sm text-foreground bg-muted p-2 rounded border border-border">
                                            {suggestion}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button size="sm" variant="outline" className="text-xs">
                                        Ask AI
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
