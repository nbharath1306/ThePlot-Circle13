import Groq from 'groq-sdk';
import { UserData, SimulationResult, YearEvent, OUTCOME_NAMES, OutcomeType } from '@/types';
import { buildPersonality, calculateMetrics } from './simulation';
import { logger } from './logger';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function runSimulation(
    userA: UserData,
    userB: UserData
): Promise<SimulationResult> {
    const agentA = buildPersonality(userA.answers);
    const agentB = buildPersonality(userB.answers);

    const systemPrompt = `You are simulating a 7-year relationship between two people.

Agent A Personality:
${agentA}

Agent B Personality:
${agentB}

Generate a year-by-year relationship timeline with 3-5 major events per year.
Output ONLY events and emotional state changes, not dialogue.

Format as JSON:
{
  "years": [
    {
      "year": 1,
      "events": ["Event 1", "Event 2", "Event 3"],
      "emotionalShift": { "trust": 10, "satisfaction": 15, "commitment": 20 }
    }
  ],
  "outcome": "success_strong" | "success_engaged" | "success_thriving" | "success_growing" | "challenge_break" | "challenge_different_paths" | "challenge_timing",
  "insights": ["Insight 1", "Insight 2", "Insight 3"]
}

CRITICAL RULES:
- 70% of simulations MUST have positive outcomes (success_*).
- NEVER generate traumatic scenarios (abuse, infidelity, severe harm).
- Keep challenges realistic but hopeful.
- emotionalShift values should range from -30 to +30 per year.
- Output ONLY valid JSON, no markdown, no commentary.`;

    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a JSON-only API. Output strict JSON with no markdown formatting.' },
                { role: 'user', content: systemPrompt },
            ],
            temperature: 0.8,
            max_tokens: 2048,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('Empty AI response');

        const parsed = JSON.parse(content);
        const years: YearEvent[] = parsed.years;
        const outcome = parsed.outcome as OutcomeType;

        return {
            timeline: years,
            outcome,
            outcomeName: OUTCOME_NAMES[outcome] || outcome,
            insights: parsed.insights || [],
            emotionalMetrics: calculateMetrics(years),
        };
    } catch (error) {
        logger.error('Groq simulation failed', error);
        // Fallback: return mock data so the demo always works
        return generateFallbackSimulation();
    }
}

function generateFallbackSimulation(): SimulationResult {
    const years: YearEvent[] = [
        { year: 1, events: ['First vacation together in Bali', 'Meeting each other\'s families', 'Both start new careers'], emotionalShift: { trust: 15, satisfaction: 20, commitment: 25 } },
        { year: 2, events: ['Move in together', 'Adopt a pet named Luna', 'Navigate work-life balance'], emotionalShift: { trust: 10, satisfaction: 15, commitment: 10 } },
        { year: 3, events: ['Major job change causes stress', 'First real argument about finances', 'Weekend trip heals the rift'], emotionalShift: { trust: -5, satisfaction: -10, commitment: 5 } },
        { year: 4, events: ['Both invest in personal growth', 'Start a creative project together', 'Deepen shared friendships'], emotionalShift: { trust: 10, satisfaction: 15, commitment: 10 } },
        { year: 5, events: ['Career breakthrough for one partner', 'Navigate long-distance phase', 'Reunite stronger than before'], emotionalShift: { trust: 5, satisfaction: -5, commitment: 15 } },
        { year: 6, events: ['Discuss long-term commitment', 'Family pressure from both sides', 'Find their own path together'], emotionalShift: { trust: 10, satisfaction: 10, commitment: 20 } },
        { year: 7, events: ['Major life decision made together', 'Celebrate anniversary milestone', 'Plan next chapter as a team'], emotionalShift: { trust: 15, satisfaction: 20, commitment: 15 } },
    ];

    return {
        timeline: years,
        outcome: 'success_thriving',
        outcomeName: OUTCOME_NAMES['success_thriving'],
        insights: [
            'Strong communication foundation helps navigate challenges',
            'Complementary values create balance in the relationship',
            'Willingness to grow together is the key differentiator',
        ],
        emotionalMetrics: calculateMetrics(years),
    };
}
