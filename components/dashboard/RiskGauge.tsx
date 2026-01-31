"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

interface RiskGaugeProps {
    score: number
    size?: number
}

export function RiskGauge({ score, size = 200 }: RiskGaugeProps) {
    const normalizedScore = Math.max(0, Math.min(100, score))

    const data = useMemo(() => [
        { name: "Score", value: normalizedScore },
        { name: "Remaining", value: 100 - normalizedScore }
    ], [normalizedScore])

    // Determine color based on score
    const getColor = (s: number) => {
        if (s <= 40) return "var(--success)" // Low risk (Wait, prompt said 0-40 GREEN? Usually low score = low risk? Or 0-100 risk score? Prompt says "Risk Score... 0-40: Green". So 0 is good?)
        // Prompt: 0-40 Green, 41-70 Amber, 71-100 Red.
        // Yes, usually Risk Score implies higher is worse.
        if (s <= 70) return "var(--warning)"
        return "var(--danger)"
    }

    const color = getColor(normalizedScore)
    const isHighRisk = normalizedScore > 70

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            <div style={{ width: size, height: size }} className="relative">
                {isHighRisk && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-danger blur-2xl z-0"
                    />
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={size / 2 - 20}
                            outerRadius={size / 2}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            <Cell fill={color} />
                            <Cell fill="hsl(var(--muted))" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <span className="text-4xl font-bold text-foreground" style={{ color }}>{normalizedScore}</span>
                    </motion.div>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Risk Level</span>
                </div>
            </div>

            <p className="mt-2 font-medium text-muted-foreground text-sm">
                {normalizedScore <= 40 ? "Low Risk" : normalizedScore <= 70 ? "Moderate Risk" : "Critical Risk"}
            </p>
        </div>
    )
}
