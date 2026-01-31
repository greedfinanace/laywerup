// Example: How to call the AI endpoint from your React components
// This shows how to integrate DeepSeek AI into your ContractIQ app

import React from 'react';
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Call the AI endpoint to analyze contract text
 * @param prompt - The user's question or text to analyze
 * @param context - Optional system context for the AI
 * @param model - DeepSeek model to use (defaults to cheapest)
 * @returns AI response with content and token usage
 */
export async function analyzeContract(
    prompt: string,
    context?: string,
    model?: 'deepseek/deepseek-chat' | 'deepseek/deepseek-reasoner'
) {
    try {
        // Get the current user's session
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
            throw new Error('Please log in to use AI analysis')
        }

        // Call the AI endpoint with authentication
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                prompt,
                context,
                model: model || 'deepseek/deepseek-chat', // Default to cheapest
            }),
        })

        if (!response.ok) {
            const error = await response.json()

            // Handle rate limiting
            if (response.status === 429) {
                throw new Error(`Rate limit exceeded. Please wait ${error.retryAfter} seconds.`)
            }

            throw new Error(error.error || 'AI analysis failed')
        }

        const data = await response.json()
        return {
            content: data.content,
            usage: data.usage,
            model: data.model,
        }
    } catch (error) {
        console.error('AI Analysis Error:', error)
        throw error
    }
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Analyze a contract clause
export async function exampleAnalyzeClause() {
    const result = await analyzeContract(
        'Analyze this clause: "The tenant shall pay rent within 30 days of the invoice date."',
        'You are a legal contract analyst. Identify risks and suggest improvements.'
    )

    console.log('AI Analysis:', result.content)
    console.log('Tokens used:', result.usage.total_tokens)
    console.log('Cost:', `$${(result.usage.total_tokens / 1000000) * 0.14}`)
}

// Example 2: Risk assessment
export async function exampleRiskAssessment(contractText: string) {
    const result = await analyzeContract(
        `Assess the risk level of this contract and identify red flags:\n\n${contractText}`,
        'You are a senior legal advisor. Focus on client protection and financial risks.'
    )

    return result.content
}

// Example 3: Generate counter-proposal
export async function exampleCounterProposal(unfavorableClause: string) {
    const result = await analyzeContract(
        `Rewrite this clause to be more favorable to the client:\n"${unfavorableClause}"`,
        'You are a contract negotiator. Provide a balanced but client-protective alternative.'
    )

    return result.content
}

// Example 4: React component integration
export function AIAssistantExample() {
    const [loading, setLoading] = React.useState(false)
    const [response, setResponse] = React.useState('')
    const [error, setError] = React.useState('')

    const handleAnalyze = async (userQuestion: string) => {
        setLoading(true)
        setError('')

        try {
            const result = await analyzeContract(userQuestion)
            setResponse(result.content)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
        <button onClick= {() => handleAnalyze('What are common risks in NDAs?')
} disabled = { loading } >
    { loading? 'Analyzing...': 'Ask AI' }
    </button>
{ error && <div className="text-red-600" > { error } </div> }
{ response && <div className="whitespace-pre-wrap" > { response } </div> }
</div>
  )
}

// ============================================
// ADVANCED: Streaming Responses (Future)
// ============================================

// Note: The current implementation doesn't support streaming,
// but you can add it by modifying the DeepSeek client to use
// Server-Sent Events (SSE) for real-time token streaming.

export default analyzeContract
