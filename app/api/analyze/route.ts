import { NextResponse } from 'next/server';
import { analyzeContract, processOCR } from '@/app/lib/ai-service';

export async function POST(request: Request) {
    try {
        let contractText = '';
        let model: 'deepseek' | 'glm' = 'deepseek';
        let jurisdiction = 'General / International';

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;
            const modelParam = formData.get('model') as string;
            const jurisdictionParam = formData.get('jurisdiction') as string;

            if (modelParam === 'glm') model = 'glm';
            if (jurisdictionParam) jurisdiction = jurisdictionParam;

            if (file) {
                // Process OCR
                contractText = await processOCR(file);
            } else {
                // Fallback if text was passed in formData (rare for this app but possible)
                contractText = formData.get('contractText') as string || '';
            }
        } else {
            // JSON handling
            const json = await request.json();
            contractText = json.contractText;
            if (json.model === 'glm') model = 'glm';
            if (json.jurisdiction) jurisdiction = json.jurisdiction;
        }

        if (!contractText) {
            return NextResponse.json(
                { error: 'Contract text or file is required' },
                { status: 400 }
            );
        }

        // # proprietary logic removed for competition submission
        const analysis = {
            logicScore: 100,
            errors: [],
            verdict: "Logic removed for submission"
        };
        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Analysis API failed:', error);
        return NextResponse.json(
            { error: 'Failed to analyze contract' },
            { status: 500 }
        );
    }
}
