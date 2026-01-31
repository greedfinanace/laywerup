import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(request: Request) {
    // Dodo Webhook Logic (Simplified)
    // In production, verify signature!

    try {
        const body = await request.json();
        const event = body.type; // Check event type (e.g., payment.succeeded)

        if (event === 'payment.succeeded') {
            // Logic to find user from payment metadata (if supported) or email
            // For now, logging
            console.log('Dodo Payment Success:', body);

            // TODO: Match email to user and add credits
            // const email = body.data.customer.email;
            // ... update supabase
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
