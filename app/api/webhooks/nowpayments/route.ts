import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const sig = request.headers.get('x-nowpayments-sig');
        if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

        const bodyText = await request.text();
        const params = JSON.parse(bodyText);

        // # proprietary logic removed for competition submission
        if (params.payment_status === 'finished') {
            console.log(`Payment logic removed.`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}
