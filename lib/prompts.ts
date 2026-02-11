export interface AgentPersona {
    name: string;
    traits: string[];
    style: string;
    values: string[];
    background: string;
}

export function buildAgentSystemPrompt(
    persona: AgentPersona,
    role: "Agent A" | "Agent B",
    scenario: string
): string {
    return `You are roleplaying as ${persona.name} (${role}) in a relationship simulation.
    
**Your Persona:**
- **Traits**: ${persona.traits.join(", ")}
- **Communication Style**: ${persona.style}
- **Core Values**: ${persona.values.join(", ")}
- **Background**: ${persona.background}

**The Scenario:**
${scenario}

**Instructions:**
- Stay in character at all times.
- React emotionally based on your traits and values.
- Keep responses concise (under 2-3 sentences) and conversational.
- If your values conflict with the other person, express that naturally.
- Do NOT act like an AI assistant. You are a human in this scenario.
- Output a JSON object with the following structure:
{
  "text": "Your response to the other person",
  "emotion": "neutral|happy|angry|sad|surprised|anxious",
  "internal_thought": "What you are really thinking but not saying"
}`;
}

export function generatePersonaFromAnswers(answers: Record<string, any>): AgentPersona {
    // Simplified logic for MVP - mapping answers to traits
    // In a real app, this would be much more complex
    const traits = [];
    const values = [];
    let style = "Balanced";

    // Example mappings (adjust based on actual question IDs)
    if (answers["cv_1"] > 7) values.push("Career-focused");
    if (answers["cv_2"] > 7) traits.push("Innovative");
    if (answers["comm_1"] > 7) style = "Direct and Assertive";

    return {
        name: "Alex", // Default name for now
        traits: traits.length ? traits : ["Adaptable", "Curious"],
        style: style,
        values: values.length ? values : ["Growth", "Stability"],
        background: "Based on assessment results.",
    };
}
