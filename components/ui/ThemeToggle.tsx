"use client"

import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative h-9 w-9 rounded-full"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'light' ? 1 : 0,
                    opacity: theme === 'light' ? 1 : 0,
                    rotate: theme === 'light' ? 0 : 180,
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Sun className="h-5 w-5" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'dark' ? 1 : 0,
                    opacity: theme === 'dark' ? 1 : 0,
                    rotate: theme === 'dark' ? 0 : -180,
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Moon className="h-5 w-5" />
            </motion.div>
        </Button>
    )
}
