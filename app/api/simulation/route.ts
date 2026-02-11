import { NextRequest, NextResponse } from "next/server";
import { createAgentResponse } from "@/lib/groq";
import { buildAgentSystemPrompt, AgentPersona } from "@/lib/prompts";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { agent, otherAgentName, history, scenario, role } = body;

        if (!agent || !history) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const systemPrompt = buildAgentSystemPrompt(agent, role, scenario);

        // transform history for LLM if needed, here we assume it's already in format
        // simplified history passed from client
        const response = await createAgentResponse(systemPrompt, history);

        if (!response.success) {
            return NextResponse.json({ error: response.error }, { status: 500 });
        }

        // Attempt to parse JSON response from LLM
        let cleanResponse = response.message;
        // Extract JSON if wrapped in code blocks
        const jsonMatch = cleanResponse.match(/```json\n([\s\S]*?)\n```/) || cleanResponse.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            cleanResponse = jsonMatch[1] || jsonMatch[0];
        }

        try {
            const parsed = JSON.parse(cleanResponse);
            return NextResponse.json(parsed);
        } catch (e) {
            // Fallback if LLM didn't return valid JSON
            console.warn("Failed to parse LLM JSON", cleanResponse);
            return NextResponse.json({
                text: cleanResponse,
                emotion: "neutral",
                internal_thought: "Thinking..."
            });
        }

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
