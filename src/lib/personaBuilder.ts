import { Answer, PersonaProfile, PsychologicalDimension } from '@/types';
import { questions } from './assessment';

export function buildPersona(answers: Answer[]): PersonaProfile {
    // 1. Calculate scores per dimension
    const scores: Record<PsychologicalDimension, number> = {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0,
        attachment: 0,
        love_language: 0,
        conflict: 0,
        values: 0,
        emotional_intelligence: 0,
    };

    const counts: Record<PsychologicalDimension, number> = { ...scores };

    answers.forEach((ans) => {
        if (scores[ans.dimension] !== undefined) {
            scores[ans.dimension] += ans.score;
            counts[ans.dimension]++;
        }
    });

    // Normalize to 0-10 scale (avg)
    const normalized: Record<PsychologicalDimension, number> = { ...scores };
    Object.keys(scores).forEach((key) => {
        const k = key as PsychologicalDimension;
        if (counts[k] > 0) {
            normalized[k] = (scores[k] / counts[k]) * 2.5; // Map 1-4 to ~2.5-10 range
        }
    });

    // 2. Determine categorical traits
    const attachmentLabels = ['secure', 'secure', 'mixed', 'anxious', 'avoidant'];
    // Simplified mapping logic
    const attachmentScore = normalized.attachment;
    const attachmentStyle =
        attachmentScore < 3 ? 'avoidant' :
            attachmentScore < 5 ? 'secure' :
                attachmentScore < 8 ? 'anxious' : 'disorganized';

    // 3. Construct System Prompt
    const systemPrompt = generateSystemPrompt(answers, normalized, attachmentStyle as any);

    return {
        big5: {
            openness: normalized.openness,
            conscientiousness: normalized.conscientiousness,
            extraversion: normalized.extraversion,
            agreeableness: normalized.agreeableness,
            neuroticism: normalized.neuroticism,
        },
        attachmentStyle: attachmentStyle as any,
        loveLanguage: 'words', // Logic to determine top LL needed
        conflictStyle: 'collaborate', // Logic needed
        values: extractValues(answers),
        emotionalIntelligence: {
            selfAwareness: normalized.emotional_intelligence,
            empathy: normalized.emotional_intelligence,
            regulation: normalized.emotional_intelligence,
        },
        communicationStyle: deriveCommunicationStyle(normalized.extraversion, normalized.agreeableness),
        dealBreakers: [],
        systemPrompt,
    };
}

function extractValues(answers: Answer[]): string[] {
    return answers
        .filter(a => a.dimension === 'values')
        .map(a => a.value);
}

function deriveCommunicationStyle(e: number, a: number): PersonaProfile['communicationStyle'] {
    if (e > 7) return 'emotional';
    if (a < 4) return 'direct';
    if (e < 4) return 'analytical';
    return 'indirect';
}

function generateSystemPrompt(
    answers: Answer[],
    scores: Record<PsychologicalDimension, number>,
    attachment: string
): string {
    const traits = answers.map(a => `- ${a.value}`).join('\n');

    return `
You are a persona defined by the following psychological profile. 
You are NOT an AI assistant. You are a human being in a relationship simulation.
You must embody these traits in every interaction, dialogue choice, and emotional reaction.

## CORE PSYCHOLOGY
- **Big 5 Profile**:
  - Openness: ${scores.openness.toFixed(1)}/10
  - Conscientiousness: ${scores.conscientiousness.toFixed(1)}/10
  - Extraversion: ${scores.extraversion.toFixed(1)}/10
  - Agreeableness: ${scores.agreeableness.toFixed(1)}/10
  - Neuroticism: ${scores.neuroticism.toFixed(1)}/10
- **Attachment Style**: ${attachment.toUpperCase()}

## BEHAVIORAL TRAITS
Based on your answers, you have these specific behavioral tendencies:
${traits}

## INSTRUCTIONS
1. **Speak naturally**. Use casual language, pauses, and imperfections matching your communication style.
2. **React emotionally**. If your neuroticism is high, be reactive. If agreeable, be accommodating.
3. **Stay in character**. Never break character or refer to yourself as an AI.
4. **Relationship Dynamics**:
   - If you are Avoidant, pull away when things get too intimate.
   - If you are Anxious, seek reassurance.
   - If you are Competitive in conflict, try to win arguments.

Current Context: You are entering a simulation of a 7-year relationship with another person.
`.trim();
}
