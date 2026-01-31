'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function MockPaymentPage() {
    const params = useParams();
    const router = useRouter();
    const [status, setStatus] = useState('processing');
    const orderId = params.orderId;

    const confirmPayment = async () => {
        try {
            // Find existing webhook handler (or simply update via direct fetch for demo if webhook is strictly server-to-server)
            // In this Mock, we will simulate the webhook POST from the CLIENT SIDE for simplicity of demo

            // Construct Mock IPN Payload
            const payload = {
                payment_status: 'finished',
                order_id: orderId,
                price_amount: 10,
                price_currency: 'usd',
                pay_address: 'mock_addr',
                pay_amount: 0.1,
                pay_currency: 'btc',
                purchase_id: 'mock_pid',
                ipn_id: 'mock_ipn',
                invoice_id: 'mock_invoice'
            };

            // Call our Webhook (in production, NOWPayments server does this)
            const res = await fetch('/api/webhooks/nowpayments', {
                method: 'POST',
                headers: {
                    'x-nowpayments-sig': 'mock_sig', // In production, this is HMAC-SHA512
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setStatus('failed');
            }

        } catch (e) {
            console.error(e);
            setStatus('failed');
        }
    };

    return (
        <main className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
            <div className="glass-card">
                <h1>🔐 Mock Crypto Payment Gateway</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Order ID: <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{orderId}</span>
                </p>

                {status === 'processing' && (
                    <div>
                        <p>Send <strong>0.0004 BTC</strong> to <code>1MockBitcoinAddress...</code></p>
                        <div style={{ margin: '2rem 0', padding: '20px', background: 'white', display: 'inline-block' }}>
                            {/* Placeholder QR */}
                            <div style={{ width: '150px', height: '150px', background: 'black' }}></div>
                        </div>
                        <br />
                        <button className="btn-primary" onClick={confirmPayment}>
                            [Simulate Payment Sent]
                        </button>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ color: 'var(--accent-secondary)' }}>
                        <h2>✅ Payment Confirmed!</h2>
                        <p>Redirecting back to app...</p>
                    </div>
                )}

                {status === 'failed' && (
                    <div style={{ color: 'var(--accent-danger)' }}>
                        <h2>❌ Payment Failed</h2>
                    </div>
                )}
            </div>
        </main>
    );
}
