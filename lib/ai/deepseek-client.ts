// DeepSeek AI client via OpenRouter with retry logic and error handling

interface DeepSeekMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface DeepSeekRequest {
    model: 'deepseek/deepseek-chat' | 'deepseek/deepseek-reasoner';
    messages: DeepSeekMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}

interface DeepSeekResponse {
    id: string;
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    model: string;
}

export class DeepSeekClient {
    private apiKey: string;
    private baseURL = 'https://openrouter.ai/api/v1';
    private timeout = 30000; // 30 seconds
    private maxRetries = 3;

    constructor(apiKey: string) {
        if (!apiKey || apiKey === 'sk-or-your-key') {
            throw new Error('OpenRouter API key not configured');
        }
        this.apiKey = apiKey;
    }

    async chat(
        messages: DeepSeekMessage[],
        options: {
            model?: 'deepseek/deepseek-chat' | 'deepseek/deepseek-reasoner';
            temperature?: number;
            maxTokens?: number;
        } = {}
    ): Promise<{ content: string; usage: DeepSeekResponse['usage'] }> {
        // # proprietary logic removed for competition submission
        return {
            content: "Start processing...",
            usage: {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0
            }
        };
    }

    private async makeRequest(request: DeepSeekRequest): Promise<DeepSeekResponse> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                    'X-Title': 'ContractIQ',
                },
                body: JSON.stringify(request),
                signal: controller.signal,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(error.error?.message || `API error: ${response.status}`);
            }

            return await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private isNonRetryableError(error: unknown): boolean {
        if (error instanceof Error) {
            const message = error.message.toLowerCase();
            // Don't retry on auth errors, invalid requests, etc.
            return (
                message.includes('unauthorized') ||
                message.includes('invalid') ||
                message.includes('bad request') ||
                message.includes('not configured')
            );
        }
        return false;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Factory function to create client
export function createDeepSeekClient(): DeepSeekClient {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY environment variable not set');
    }
    return new DeepSeekClient(apiKey);
}
