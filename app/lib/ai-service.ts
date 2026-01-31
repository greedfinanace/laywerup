import OpenAI from 'openai';

// Initialize clients (will use env vars)
// User needs to set DEEPSEEK_API_KEY and GLM_API_KEY in .env.local

interface AIResponse {
    riskScore: number;
    summary: string;
    redFlags: Array<{ issue: string; clause: string; severity: string; fix: string }>;
    fairTerms: string[];
    contractType: string;
}

export async function analyzeContract(
    text: string,
    model: 'deepseek' | 'glm' = 'deepseek',
    jurisdiction: string = 'International'
): Promise<AIResponse> {

    const systemPrompt = `
    You are ContractIQ, an elite legal risk auditor. 
    You are an expert in ${jurisdiction} law.
    Analyze the provided contract text. Identify critical security, financial, and legal risks.
    Output purely strictly valid JSON with this schema:
    {
      "contractType": "string (e.g. NDA, SaaS Agreement)",
      "riskScore": number (0-100, 100 is high risk),
      "summary": "string (executive summary)",
      "redFlags": [ { "issue": "string", "clause": "string (quote)", "severity": "High|Medium|Low", "fix": "string" } ],
      "fairTerms": [ "string" ]
    }
    Be cynical, protective, and brief.
  `;

    // OpenRouter Configuration
    // Model Mapping:
    // deepseek -> deepseek/deepseek-chat or deepseek/deepseek-r1
    // glm -> zhipu/glm-4

    const selectedModel = model === 'deepseek' ? 'deepseek/deepseek-chat' : 'zhipu/glm-4';

    try {
        const openRouter = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-mock-key',
            defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter for some tiers
                "X-Title": "LawyerUp"
            }
        });

        const response = await openRouter.chat.completions.create({
            model: selectedModel,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('No content from OpenRouter');

        // Some models on OR might return markdown code blocks with JSON
        const cleaned = content.replace(/```json\n?|```/g, '');
        return JSON.parse(cleaned);

    } catch (error) {
        console.error(`AI Service Error (${model}):`, error);
        // Fallback Mock for Demo if API fails/missing
        return {
            contractType: "Analysis Failed",
            riskScore: 0,
            summary: "AI Service Connection Failed. The system could not reach the AI provider. Please check your internet connection and API keys.",
            redFlags: [],
            fairTerms: []
        };
    }
}

export async function processOCR(file: File): Promise<string> {
    // Ideally use DeepSeek VL or a dedicated OCR service
    // Since we can't easily upload a File object from backend to DeepSeek without a specific endpoint
    // We will simulate OCR or use a public helper if available.

    // For now, return a placeholder indicating OCR was requested.
    // In a real app, we'd send this to `https://api.deepseek.com/v1/vision` (if valid) or Tesseract.

    console.log(`Processing OCR for file: ${file.name} (${file.type})`);

    // FUTURE: Implement actual API call
    return `[OCR CONTENT FOR ${file.name}]\n\n(This is a simulation. Actual OCR requires a valid Vision API endpoint)\n\nThis Agreement is entered into...`;
}
