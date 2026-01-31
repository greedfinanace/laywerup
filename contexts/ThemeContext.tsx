"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
            setThemeState(savedTheme)
            // Apply theme class immediately
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(savedTheme)
        } else {
            // Default to dark theme (brutalist)
            setThemeState('dark')
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add('dark')
        }
        setMounted(true)
    }, [])

    // Update document class and localStorage when theme changes
    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement

        // Remove both classes first
        root.classList.remove('light', 'dark')

        // Add the current theme class
        root.classList.add(theme)

        // Save to localStorage
        localStorage.setItem('theme', theme)
    }, [theme, mounted])

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light')
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    // Prevent flash of wrong theme by not rendering children until mounted
    if (!mounted) {
        return null
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
