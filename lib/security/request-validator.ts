// Security: Input validation and sanitization to prevent XSS, injection attacks

export class RequestValidator {
    private static readonly MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB
    private static readonly MALICIOUS_PATTERNS = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /eval\(/gi,
        /expression\(/gi,
    ];

    static validateRequest(body: unknown): {
        valid: boolean;
        error?: string;
        sanitized?: any;
    } {
        // Check if body exists
        if (!body || typeof body !== 'object') {
            return { valid: false, error: 'Invalid request body' };
        }

        // Check size
        const bodySize = JSON.stringify(body).length;
        if (bodySize > this.MAX_REQUEST_SIZE) {
            return {
                valid: false,
                error: `Request too large. Maximum ${this.MAX_REQUEST_SIZE / 1024 / 1024}MB allowed`,
            };
        }

        // Sanitize and validate
        try {
            const sanitized = this.sanitizeObject(body);
            return { valid: true, sanitized };
        } catch (error) {
            return {
                valid: false,
                error: error instanceof Error ? error.message : 'Validation failed',
            };
        }
    }

    private static sanitizeObject(obj: any): any {
        if (typeof obj === 'string') {
            return this.sanitizeString(obj);
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitizeObject(item));
        }

        if (obj !== null && typeof obj === 'object') {
            const sanitized: any = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[this.sanitizeString(key)] = this.sanitizeObject(value);
            }
            return sanitized;
        }

        return obj;
    }

    private static sanitizeString(input: string): string {
        // Check for malicious patterns
        for (const pattern of this.MALICIOUS_PATTERNS) {
            if (pattern.test(input)) {
                throw new Error('Potentially malicious content detected');
            }
        }

        // HTML entity encoding
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    static validateContentType(contentType: string | null): boolean {
        if (!contentType) return false;
        return contentType.toLowerCase().includes('application/json');
    }

    static sanitizeErrorMessage(error: unknown): string {
        // Never expose internal error details
        if (error instanceof Error) {
            // Only return safe, generic messages
            if (error.message.includes('fetch')) {
                return 'Service temporarily unavailable';
            }
            if (error.message.includes('timeout')) {
                return 'Request timed out';
            }
            if (error.message.includes('rate limit')) {
                return error.message; // Rate limit messages are safe
            }
        }
        return 'An error occurred processing your request';
    }
}
