import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client only if API key is available
const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, agentA, agentB } = body;

        if (!messages || !agentA || !agentB) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if Groq client is initialized
        if (!groq) {
            return NextResponse.json(
                { error: "GROQ API key is not configured. Please add GROQ_API_KEY to your environment variables." },
                { status: 500 }
            );
        }

        // Build conversation summary for analysis
        const conversationSummary = messages
            .map((m: any) => `${m.speaker}: ${m.text}`)
            .join("\n");

        const analysisPrompt = `You are a brutally honest relationship analyst. Analyze this conversation between ${agentA.name} and ${agentB.name}.

**Conversation:**
${conversationSummary}

**Agent Profiles:**
- ${agentA.name}: ${agentA.traits.join(", ")} | ${agentA.style}
- ${agentB.name}: ${agentB.traits.join(", ")} | ${agentB.style}

**Your Task:**
Generate a viral-worthy relationship verdict. Output ONLY a JSON object with this structure:
{
  "label": "A catchy 2-4 word label (e.g., 'Toxic Power Couple', 'Chaotic Soulmates', 'Doomed Romantics')",
  "survival_probability": 75,
  "verdict": "A single punchy sentence roasting or praising them (max 20 words)",
  "vibe": "emoji that captures the energy (e.g., 🔥, 💀, ✨, 🌪️)"
}

Be creative, funny, and shareable. Make it Instagram-worthy.`;

        const response = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [{ role: "user", content: analysisPrompt }],
            temperature: 0.9,
            max_tokens: 200,
        });

        const content = response.choices[0]?.message?.content || "";

        // Extract JSON
        let cleanContent = content;
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanContent = jsonMatch[1] || jsonMatch[0];
        }

        try {
            const analysis = JSON.parse(cleanContent);
            return NextResponse.json(analysis);
        } catch (e) {
            console.warn("Failed to parse analysis JSON", cleanContent);
            return NextResponse.json({
                label: "Unpredictable Chaos",
                survival_probability: 50,
                verdict: "The AI couldn't even predict this mess.",
                vibe: "🤷"
            });
        }

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
