import { NextRequest, NextResponse } from 'next/server';
import { createDeepSeekClient } from '@/lib/ai/deepseek-client';
import { RequestValidator } from '@/lib/security/request-validator';
import { rateLimiter, RateLimiter } from '@/lib/security/rate-limiter';
import { createClient } from '@supabase/supabase-js';

// Security headers
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': ' DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
};

interface AIRequest {
    prompt: string;
    context?: string;
    model?: 'deepseek/deepseek-chat' | 'deepseek/deepseek-reasoner';
}

export async function POST(request: NextRequest) {
    try {
        // 1. Validate Content-Type
        const contentType = request.headers.get('content-type');
        if (!RequestValidator.validateContentType(contentType)) {
            return NextResponse.json(
                { error: 'Invalid content type. Expected application/json' },
                { status: 400, headers: SECURITY_HEADERS }
            );
        }

        // 2. Get user from Supabase auth
        const authHeader = request.headers.get('authorization');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!authHeader || !supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401, headers: SECURITY_HEADERS }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: { Authorization: authHeader },
            },
        });

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401, headers: SECURITY_HEADERS }
            );
        }

        // 3. Rate limiting
        const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const identifier = await RateLimiter.getUserIdentifier(user.id, clientIp);
        const rateLimit = await rateLimiter.checkLimit(identifier);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    retryAfter: rateLimit.retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        ...SECURITY_HEADERS,
                        'Retry-After': rateLimit.retryAfter?.toString() || '60',
                    },
                }
            );
        }

        // 4. Parse and validate request body
        const body = await request.json();
        const validation = RequestValidator.validateRequest(body);

        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error || 'Invalid request' },
                { status: 400, headers: SECURITY_HEADERS }
            );
        }

        const aiRequest = validation.sanitized as AIRequest;

        // 5. Validate required fields
        if (!aiRequest.prompt || typeof aiRequest.prompt !== 'string') {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400, headers: SECURITY_HEADERS }
            );
        }

        // 6. Call DeepSeek AI
        // # proprietary logic removed for competition submission
        const response = {
            content: "Logic removed for competition submission",
            usage: { total_tokens: 0 }
        };

        // 7. Log request (sanitized)
        console.log('[AI Request]', {
            userId: user.id,
            model: aiRequest.model || 'deepseek-chat',
            promptLength: aiRequest.prompt.length,
            tokensUsed: 0,
            timestamp: new Date().toISOString(),
        });

        // 8. Return response
        return NextResponse.json(
            {
                content: response.content,
                usage: response.usage,
                model: aiRequest.model || 'deepseek-chat',
            },
            { status: 200, headers: SECURITY_HEADERS }
        );
    } catch (error) {
        console.error('[AI API Error]', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        const safeError = RequestValidator.sanitizeErrorMessage(error);

        return NextResponse.json(
            { error: safeError },
            { status: 500, headers: SECURITY_HEADERS }
        );
    }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                ...SECURITY_HEADERS,
                'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        }
    );
}
