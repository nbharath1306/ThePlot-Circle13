import Groq from 'groq-sdk';
import {
    PersonaProfile,
    SimulationResult,
    ScenarioResult,
    DialogueTurn,
    CompatibilityReport,
    EmotionalState
} from '@/types';
import { SCENARIOS, ScenarioDefinition } from './scenarios';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

const MODEL = 'llama-3.3-70b-versatile';

export async function runFullSimulation(
    personaA: PersonaProfile,
    personaB: PersonaProfile
): Promise<SimulationResult> {
    const scenarioResults: ScenarioResult[] = [];
    const timelineEvents: any[] = []; // For legacy compatibility if needed

    // Run scenarios sequentially
    for (const scenario of SCENARIOS) {
        const result = await runScenario(scenario, personaA, personaB, scenarioResults);
        scenarioResults.push(result);

        // Simple mapping for legacy timeline
        timelineEvents.push({
            year: parseInt(scenario.id.replace(/\D/g, '')) || 1,
            events: [result.analysis],
            emotionalShift: result.emotionalShift
        });
    }

    // Generate final report
    const compatibility = await generateCompatibilityReport(personaA, personaB, scenarioResults);

    return {
        scenarios: scenarioResults,
        compatibility,
        timeline: timelineEvents,
        outcome: compatibility.prediction,
        emotionalMetrics: scenarioResults.map((s, i) => ({
            ...s.emotionalShift,
            year: i + 1
        }))
    };
}

async function runScenario(
    scenario: ScenarioDefinition,
    pA: PersonaProfile,
    pB: PersonaProfile,
    history: ScenarioResult[]
): Promise<ScenarioResult> {
    const dialogue: DialogueTurn[] = [];
    let currentSpeaker = 'A';

    // Context building
    const previousContext = history.map(h => `[Previous Scenario: ${h.title}] Outcome: ${h.analysis}`).join('\n');
    const baseContext = `
    SCENARIO: ${scenario.title}
    CONTEXT: ${scenario.context}
    STAKES: ${scenario.stakes}
    
    RELATIONSHIP HISTORY:
    ${previousContext}
    `;

    // 4 turns each = 8 total turns
    for (let i = 0; i < 6; i++) {
        const speakerPersona = currentSpeaker === 'A' ? pA : pB;
        const otherPersona = currentSpeaker === 'A' ? pB : pA;
        const speakerName = currentSpeaker === 'A' ? 'Person A' : 'Person B';

        const prompt = `
        ${baseContext}
        
        TRANSCRIPT SO FAR:
        ${dialogue.map(d => `${d.speaker}: ${d.content}`).join('\n')}
        
        YOUR ROLE: You are ${speakerName}.
        ${speakerPersona.systemPrompt}
        
        INSTRUCTION: Respond to the situation or the other person. Keep it under 50 words. Be authentic to your character.
        If this is the start, use the prompt: "${scenario.starterPrompt}"
        `;

        const response = await completion(prompt);
        dialogue.push({
            speaker: currentSpeaker as 'A' | 'B',
            content: response
        });

        currentSpeaker = currentSpeaker === 'A' ? 'B' : 'A';
    }

    // Analyze outcome
    const analysisPrompt = `
    Analyze this dialogue between two partners in the scenario: "${scenario.title}".
    
    DIALOGUE:
    ${dialogue.map(d => `${d.speaker}: ${d.content}`).join('\n')}
    
    1. Summarize the dynamic in 1 sentence.
    2. Estimate emotional shift (Trust, Satisfaction, Commitment) on a scale of -10 to +10.
    
    Output JSON: { "analysis": string, "trust": number, "satisfaction": number, "commitment": number }
    `;

    const analysisJson = await jsonCompletion(analysisPrompt);

    return {
        id: scenario.id,
        title: scenario.title,
        transcript: dialogue,
        emotionalShift: {
            trust: analysisJson.trust || 0,
            satisfaction: analysisJson.satisfaction || 0,
            commitment: analysisJson.commitment || 0
        },
        analysis: analysisJson.analysis || "Analysis failed"
    };
}

async function generateCompatibilityReport(
    pA: PersonaProfile,
    pB: PersonaProfile,
    results: ScenarioResult[]
): Promise<CompatibilityReport> {
    const transcript = results.map(r => `SCENARIO ${r.title}:\n${r.analysis}`).join('\n\n');

    const prompt = `
    Generate a final compatibility report for these two people based on 7 years of simulated scenarios.
    
    PERSON A: ${JSON.stringify(pA.big5)}
    PERSON B: ${JSON.stringify(pB.big5)}
    
    SIMULATION RESULTS:
    ${transcript}
    
    Output JSON:
    {
      "overallScore": number (0-100),
      "dimensions": [
        { "dimension": "openness", "score": number, "analysis": string },
        ... (for all 10 dimensions)
      ],
      "strengths": [string, string, string],
      "challenges": [string, string, string],
      "prediction": "success_strong" | "success_engaged" | "success_thriving" | "challenge_break" | "challenge_different_paths" ...
    }
    `;

    // Note: detailed dimension analysis might need more tokens or logic, simplified here
    const report = await jsonCompletion(prompt);

    return {
        overallScore: report.overallScore || 50,
        dimensions: report.dimensions || [],
        strengths: report.strengths || [],
        challenges: report.challenges || [],
        prediction: report.prediction || 'challenge_timing'
    };
}

// Helpers
async function completion(prompt: string): Promise<string> {
    try {
        const res = await groq.chat.completions.create({
            model: MODEL,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            temperature: 0.7
        });
        return res.choices[0]?.message?.content?.replace(/^(Person [AB]:|A:|B:)/i, '').trim() || "...";
    } catch (e) {
        console.error("Groq error", e);
        return "...";
    }
}

async function jsonCompletion(prompt: string): Promise<any> {
    try {
        const res = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: 'You are a JSON generator. Output only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });
        return JSON.parse(res.choices[0]?.message?.content || "{}");
    } catch (e) {
        console.error("Groq JSON error", e);
        return {};
    }
}
