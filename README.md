# LawyerUp
**Democratizing Legal Access with AI**

## About The Project
LawyerUp is a cutting-edge AI-powered platform designed to make legal assistance accessible, affordable, and understandable for everyone. Dealing with contracts and legal documents can be overwhelming; LawyerUp bridges the gap by providing instant, plain-English analysis of complex legal text.

Our mission is to empower individuals to sign with confidence and understand their rights without needing expensive hourly consultations for every question.

## Submission / Port Note
This repository contains the **Frontend Architecture and UI/UX** of the LawyerUp platform.

> [!NOTE]
> **Proprietary Logic Omitted**: To protect Intellectual Property during this competition/submission, the core proprietary backend algorithms (Python-based AI microservices, specific prompt engineering chains, and payment verification logic) have been removed.
>
> In their place, you will find placeholders indicating where the logic normally resides:
> `// # proprietary logic removed for competition submission`

## Key Features
-   **Smart Contract Analysis**: Upload PDF or text contracts for instant "Logic Hawk" review.
-   **Brutalist Design System**: A "Iron Verdict" design language that conveys authority and clarity.
-   **Interactive AI Chat**: Ask questions about your specific documents (Logic simulated in this build).
-   **User Dashboard**: Track your document history and credits.
-   **Secure Authentication**: Built on Supabase Auth.

## Tech Stack
-   **Frontend**: Next.js 14 (App Router), React, TypeScript
-   **Styling**: Tailwind CSS, Framer Motion, Lucide Icons
-   **Backend/Auth**: Supabase (PostgreSQL)
-   **Payments**: NOWPayments / Dodo Payments Integration

## Getting Started
To run this frontend port locally:

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env.local` file with your public Supabase keys (if connecting to a live instance) or run in offline mode.
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Open Browser**
    Navigate to [http://localhost:3000](http://localhost:3000)

## Demo
For a complete look at the backend capabilities and full workflow, please refer to our accompanying **Demo Video**.

---
*Built to help people navigate the legal system.*