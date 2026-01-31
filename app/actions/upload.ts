'use server'

import { analyzeContract } from "@/app/lib/ai-service"
// @ts-ignore
import mammoth from "mammoth"
import PDFParser from "pdf2json"

export async function uploadContract(formData: FormData) {
    const file = formData.get("file") as File
    if (!file) {
        return { success: false, error: "No file uploaded" }
    }

    let text = ""
    console.log(`Processing file: ${file.name} (${file.type})`)

    try {
        const buffer = Buffer.from(await file.arrayBuffer())

        if (file.type === "application/pdf") {
            try {
                text = await parsePdfWithPdf2Json(buffer)
            } catch (pdfError) {
                console.error("PDF Parse Error:", pdfError)
                throw new Error("Failed to parse PDF file")
            }
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const result = await mammoth.extractRawText({ buffer })
            text = result.value
        } else if (file.type === "text/plain") {
            text = buffer.toString("utf-8")
        } else {
            return { success: false, error: "Unsupported file type. Please upload PDF, DOCX, or TXT." }
        }

        if (!text || text.trim().length === 0) {
            return { success: false, error: "Could not extract text from file." }
        }

        console.log(`Extracted ${text.length} characters. Analyzing...`)

        // Call AI Service
        const analysis = await analyzeContract(text)

        return { success: true, data: analysis }

    } catch (error) {
        console.error("Processing error:", error)
        return { success: false, error: "Failed to process document. Please try again." }
    }
}

async function parsePdfWithPdf2Json(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);

        pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error(errData.parserError);
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            // getRawTextContent() is a method on the instance
            const rawText = pdfParser.getRawTextContent();
            resolve(rawText);
        });

        pdfParser.parseBuffer(buffer);
    });
}
