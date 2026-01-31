import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { dodo } from '@/app/lib/dodo';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create a one-time payment
        const payment = await dodo.payments.create({
            billing: {
                city: 'New York',
                country: 'US', // Defaulting for simple checkout
                state: 'NY',
                street: '123 Legal St',
                zipcode: '10001'
            },
            customer: {
                email: user.email || 'customer@example.com',
                name: 'LawyerUp User'
            },
            product_cart: [
                {
                    product_id: 'p_10_credits', // Update in Dodo Dashboard: Contract Analysis - $19
                    quantity: 1
                }
            ],
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`,
        });

        return NextResponse.json({ payment_url: payment.payment_link });

    } catch (error: any) {
        console.error('Dodo Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Checkout failed' },
            { status: 500 }
        );
    }
}
