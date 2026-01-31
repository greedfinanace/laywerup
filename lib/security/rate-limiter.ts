// Security: Token bucket rate limiting to prevent abuse and DDoS

import { createClient } from '@/lib/utils/supabase/server'

interface RateLimitEntry {
    tokens: number;
    lastRefill: number;
}

export class RateLimiter {
    private static readonly REQUESTS_PER_MINUTE = 10;
    private static readonly BUCKET_SIZE = 10;
    private static readonly REFILL_RATE = 10 / 60; // tokens per second

    private cache: Map<string, RateLimitEntry> = new Map();

    async checkLimit(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }> {
        const now = Date.now() / 1000; // seconds
        let entry = this.cache.get(identifier);

        if (!entry) {
            entry = {
                tokens: RateLimiter.BUCKET_SIZE,
                lastRefill: now,
            };
        } else {
            // Refill tokens based on time elapsed
            const timeSinceRefill = now - entry.lastRefill;
            const tokensToAdd = timeSinceRefill * RateLimiter.REFILL_RATE;
            entry.tokens = Math.min(RateLimiter.BUCKET_SIZE, entry.tokens + tokensToAdd);
            entry.lastRefill = now;
        }

        if (entry.tokens >= 1) {
            // Allow request
            entry.tokens -= 1;
            this.cache.set(identifier, entry);
            return { allowed: true };
        } else {
            // Rate limited
            const tokensNeeded = 1 - entry.tokens;
            const retryAfter = Math.ceil(tokensNeeded / RateLimiter.REFILL_RATE);
            return { allowed: false, retryAfter };
        }
    }

    // Cleanup old entries periodically
    cleanup() {
        const now = Date.now() / 1000;
        const maxAge = 300; // 5 minutes

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.lastRefill > maxAge) {
                this.cache.delete(key);
            }
        }
    }

    static async getUserIdentifier(userId?: string, ip?: string): Promise<string> {
        // Prefer user ID for authenticated requests
        if (userId) {
            return `user:${userId}`;
        }
        // Fallback to IP for unauthenticated requests
        if (ip) {
            return `ip:${ip}`;
        }
        // Ultimate fallback
        return `anonymous:${Date.now()}`;
    }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        rateLimiter.cleanup();
    }, 5 * 60 * 1000);
}
