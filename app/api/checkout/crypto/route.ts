import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { createInvoice } from '@/app/lib/nowpayments';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Price per Contract Analysis = $19 USD
        const amount = 19;
        const currency = 'usd';
        const orderId = `${user.id}_${Date.now()}`; // Unique Order ID: userId_timestamp

        const invoice = await createInvoice(amount, currency, orderId, "Contract Analysis - $19");

        return NextResponse.json({ invoice_url: invoice.invoice_url });

    } catch (error: any) {
        console.error('Crypto Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Checkout failed' },
            { status: 500 }
        );
    }
}
