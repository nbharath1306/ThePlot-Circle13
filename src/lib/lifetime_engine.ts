import Groq from 'groq-sdk';
import {
    PersonaProfile,
    SimulationResult,
    LifeStageResult,
    RelationshipHealth,
    Scene,
    DialogueTurn
} from '@/types';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

const MODEL = 'llama-3.3-70b-versatile';

// ─── STAGE DEFINITIONS ────────────────────────────────────────────────

const STAGES = [
    {
        id: 'stage_1',
        name: 'The Spark',
        ageRange: '20s - Dating Phase',
        context: "The early days. High passion, discovering each other's quirks and red flags. The first major conflict arises.",
        focus: 'Chemistry & Initial Compatibility'
    },
    {
        id: 'stage_2',
        name: 'The Bind',
        ageRange: 'Late 20s/Early 30s - Commitment',
        context: "Moving in together, marriage, or deepening commitment. Merging finances and lifestyles. The honeymoon phase ends.",
        focus: 'Compromise & Shared Values'
    },
    {
        id: 'stage_3',
        name: 'The Build',
        ageRange: '30s/40s - The Grind',
        context: "Peak career stress, potentially raising children, buying a home. Routine sets in. Romance is tested by exhaustion.",
        focus: 'Resilience & Teamwork'
    },
    {
        id: 'stage_4',
        name: 'The Drift',
        ageRange: '50s - Mid-Life Checkpoint',
        context: "Empty nest or career plateau. Looking back at missed opportunities. A moment of crisis: do we reinvent or drift apart?",
        focus: 'Reconnection vs. Resentment'
    },
    {
        id: 'stage_5',
        name: 'The Legacy',
        ageRange: '60s+ - Twilight Years',
        context: "Retirement, health issues, looking back at the life built together. Acceptance or regret.",
        focus: 'Enduring Love & Companionship'
    }
];

// ─── MAIN ENGINE ──────────────────────────────────────────────────────

export async function runLifetimeSimulation(
    pA: PersonaProfile,
    pB: PersonaProfile
): Promise<SimulationResult> {
    const lifeStages: LifeStageResult[] = [];
    let currentHealth: RelationshipHealth = {
        connection: 50, // Start neutral
        passion: 80,    // Start high
        stability: 30   // Start low
    };

    // Run stages sequentially
    for (const stageDef of STAGES) {
        // 1. Generate the Scene & Dialogue for this stage
        const stageResult = await simulateStage(stageDef, pA, pB, lifeStages, currentHealth);

        // 2. Update health
        currentHealth = {
            connection: Math.max(0, Math.min(100, currentHealth.connection + stageResult.healthDelta.connection)),
            passion: Math.max(0, Math.min(100, currentHealth.passion + stageResult.healthDelta.passion)),
            stability: Math.max(0, Math.min(100, currentHealth.stability + stageResult.healthDelta.stability)),
        };

        lifeStages.push(stageResult);
    }

    // Generate Final Verdict
    const verdict = await generateVerdict(pA, pB, lifeStages, currentHealth);

    return {
        lifeStages,
        overallHealth: currentHealth,
        verdict
    };
}

// ─── STAGE SIMULATOR ──────────────────────────────────────────────────

async function simulateStage(
    stage: any,
    pA: PersonaProfile,
    pB: PersonaProfile,
    history: LifeStageResult[],
    currentHealth: RelationshipHealth
): Promise<LifeStageResult> {
    const historySummary = history.map(h => `[${h.stageName}]: ${h.summary}`).join('\n');

    const prompt = `
    SIMULATE A RELATIONSHIP STAGE: "${stage.name}" (${stage.ageRange})
    CONTEXT: ${stage.context}
    
    PERSON A:
    - Values: ${JSON.stringify(pA.coreValues)}
    - Intimacy: ${JSON.stringify(pA.intimacy)}
    - Personality: ${pA.systemPrompt.substring(0, 200)}...

    PERSON B:
    - Values: ${JSON.stringify(pB.coreValues)}
    - Intimacy: ${JSON.stringify(pB.intimacy)}
    - Personality: ${pB.systemPrompt.substring(0, 200)}...

    CURRENT HEALTH: Connection ${currentHealth.connection}, Passion ${currentHealth.passion}, Stability ${currentHealth.stability}
    RELATIONSHIP HISTORY:
    ${historySummary}

    TASK:
    1. Create a SCENE (a specific moment that defines this era).
    2. Write a DIALOGUE (4-6 turns) showing their dynamic. **Be realistic. Allow conflict, silence, or intimacy.**
    3. Determine the Health Delta (how this stage changed them).
    
    OUTPUT JSON ONLY:
    {
        "sceneTitle": "string (e.g. 'The 2AM Fight' or 'Sunday Morning')",
        "setting": "string",
        "dialogue": [
            { "speaker": "A", "content": "..." },
            { "speaker": "B", "content": "..." }
        ],
        "summary": "1 sentence on what happened this decade.",
        "healthDelta": { "connection": number (-20 to +20), "passion": number (-20 to +20), "stability": number (-20 to +20) }
    }
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.75 // Slightly creative
        });

        const data = JSON.parse(completion.choices[0]?.message?.content || '{}');

        return {
            id: stage.id,
            stageName: stage.name as any,
            ageRange: stage.ageRange,
            scenes: [{
                title: data.sceneTitle || "Untitled Moment",
                setting: data.setting || "Unknown location",
                dialogue: data.dialogue || [],
                significance: 'high'
            }],
            healthDelta: data.healthDelta || { connection: 0, passion: 0, stability: 0 },
            summary: data.summary || "Life went on."
        };

    } catch (e) {
        console.error("Stage Simulation Error", e);
        return getFallbackStage(stage);
    }
}

// ─── VERDICT GENERATOR ────────────────────────────────────────────────

async function generateVerdict(
    pA: PersonaProfile,
    pB: PersonaProfile,
    history: LifeStageResult[],
    finalHealth: RelationshipHealth
): Promise<SimulationResult['verdict']> {
    const historyText = history.map(h => `${h.stageName}: ${h.summary}`).join('\n');

    const prompt = `
    Analyze this lifetime relationship for a final verdict.
    
    HISTORY:
    ${historyText}
    
    FINAL METRICS:
    Connection: ${finalHealth.connection}
    Passion: ${finalHealth.passion}
    Stability: ${finalHealth.stability}
    
    Outputs needed:
    1. Title: A quick 2-3 word archetype (e.g. "Soulmates", "Quietly Content", "Volatile Burnout")
    2. Score: 0-100 compatibility
    3. Summary: A 2 sentence poetic summary of their life together.
    
    Format: JSON { "title": string, "score": number, "summary": string }
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: MODEL,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
        });

        const data = JSON.parse(completion.choices[0]?.message?.content || '{}');
        return {
            title: data.title || "It Was Complicated",
            compatibilityScore: data.score || 50,
            summary: data.summary || "They lived a full life together, with ups and downs."
        };
    } catch (e) {
        return {
            title: "Analysis Failed",
            compatibilityScore: 0,
            summary: "Could not generate verdict."
        };
    }
}

function getFallbackStage(stage: any): LifeStageResult {
    return {
        id: stage.id,
        stageName: stage.name,
        ageRange: stage.ageRange,
        scenes: [{
            title: "Hardware Malfunction",
            setting: "The Simulation Void",
            dialogue: [{ speaker: "Narrator", content: "Simulation data corrupted for this era." }],
            significance: 'low'
        }],
        healthDelta: { connection: 0, passion: 0, stability: 0 },
        summary: "Data lost."
    };
}
