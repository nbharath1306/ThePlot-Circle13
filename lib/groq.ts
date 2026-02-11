import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

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
