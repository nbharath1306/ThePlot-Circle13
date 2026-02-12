import Groq from "groq-sdk";

// Initialize Groq client only if API key is available
// This prevents build-time errors when the key is not set
const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

export interface AgentResponse {
    message: string;
    success: boolean;
    error?: string;
}

export async function createAgentResponse(
    systemPrompt: string,
    history: { role: "user" | "assistant" | "system"; content: string }[],
    temperature: number = 0.7
): Promise<AgentResponse> {
    try {
        // Check if Groq client is initialized
        if (!groq) {
            return {
                message: "",
                success: false,
                error: "GROQ API key is not configured. Please add GROQ_API_KEY to your environment variables.",
            };
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...history,
            ],
            model: "llama-3.1-70b-versatile",
            temperature: temperature,
            max_tokens: 300,
        });

        return {
            message: chatCompletion.choices[0]?.message?.content || "",
            success: true,
        };
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return {
            message: "",
            success: false,
            error: error.message || "Failed to generate response",
        };
    }
}
