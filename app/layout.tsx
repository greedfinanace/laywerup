import type { Metadata } from 'next'
import { Manrope, Cinzel, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-serif',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'LawyerUp | AI Contract Analysis',
  description: 'AI-powered contract analysis for modern enterprises.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn(manrope.variable, cinzel.variable, jetbrains.variable, "min-h-screen bg-background font-sans antialiased")} suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
