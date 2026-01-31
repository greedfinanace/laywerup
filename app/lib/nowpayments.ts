export const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

export async function createInvoice(
    price_amount: number,
    price_currency: string,
    order_id: string,
    order_description: string
) {
    const apiKey = process.env.NOWPAYMENTS_API_KEY;

    // MOCK MODE: If key is missing or 'Mock_Key', return a fake invoice
    if (!apiKey || apiKey.startsWith('Mock_')) {
        console.log("⚠️ Using Mock NOWPayments Invoice");
        return {
            id: "mock_invoice_" + Date.now(),
            order_id: order_id,
            request_id: "mock_req_" + Date.now(),
            price_amount: price_amount,
            price_currency: price_currency,
            network: "btc",
            payment_currency: "btc",
            invoice_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mock-payment/${order_id}`,
            invoice_error: null
        };
    }

    const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            price_amount,
            price_currency,
            order_id,
            order_description,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?cancelled=true`
        })
    });

    if (!response.ok) {
        throw new Error(`NowPayments Error: ${response.statusText}`);
    }

    return await response.json();
}
