import DodoPayments from 'dodopayments';

export const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY || 'mock_dodo_key',
    environment: 'test_mode', // or 'live_mode'
});

export const DODO_PRODUCT_ID = 'pdt_0NXUEiVZUds4U2SyIgnSI'; // Consultancy Product ($19)
