import { Answer, PersonaProfile, AssessmentDimension } from '@/types';

export function buildPersona(answers: Answer[]): PersonaProfile {
    // Helper to find specific answer values
    const getVal = (qid: string) => answers.find(a => a.questionId === qid)?.value || '';
    const getScore = (qid: string) => answers.find(a => a.questionId === qid)?.score || 0;

    // 1. Core Values & Demographics
    const politicsScore = getScore('cv_1');
    const religiousScore = getScore('cv_2');
    const financialStyleVal = getVal('cv_3');
    const familyScore = getScore('cv_5');

    // 2. Intimacy Profile
    const libidoScore = getScore('int_1');
    const adventureScore = getScore('int_2');
    const loveLanguageVal = getVal('int_4');
    const attachmentVal = getVal('int_5'); // Mapped from reaction to rejection

    // 3. Lifestyle
    const cleanlinessScore = getScore('life_1');
    const socialScore = getScore('life_2');
    const ambitionScore = getScore('fut_1');

    // 4. Communication & Conflict
    const conflictVal = getVal('comm_1');
    const emotionalIntel = (getScore('comm_2') + getScore('comm_3')) / 2; // Avg of apology & openness

    // Construct the Profile
    const profile: PersonaProfile = {
        name: "User", // Placeholder, will be replaced by UI if collected
        coreValues: {
            politicalSpectrum: politicsScore,
            religiousIntensity: religiousScore,
            financialStyle: mapFinancialStyle(financialStyleVal),
            familyOrientation: familyScore
        },
        intimacy: {
            libido: libidoScore,
            opennessToExperiment: adventureScore,
            primaryLoveLanguage: mapLoveLanguage(loveLanguageVal),
            dealBreakers: [] // populated dynamically in simulation
        },
        lifestyle: {
            cleanliness: cleanlinessScore,
            socialBattery: socialScore,
            ambition: ambitionScore
        },
        communication: {
            conflictStyle: mapConflictStyle(conflictVal),
            emotionalIntelligence: emotionalIntel
        },
        systemPrompt: ""
    };

    // Generate the "Soul" Prompt
    profile.systemPrompt = generateSystemPrompt(profile, answers);

    return profile;
}

// ─── Mappers ─────────────────────────────────────────────────────────

function mapFinancialStyle(val: string): PersonaProfile['coreValues']['financialStyle'] {
    if (val.includes('saver')) return 'saver';
    if (val.includes('spender')) return 'spender';
    if (val.includes('investor')) return 'investor';
    return 'ambivalent';
}

function mapLoveLanguage(val: string): string {
    return val || 'quality_time'; // Default
}

function mapConflictStyle(val: string): PersonaProfile['communication']['conflictStyle'] {
    if (val === 'anxious_pursuer') return 'anxious';
    if (val === 'avoidant_withdrawer') return 'avoidant';
    if (val === 'volatile') return 'volatile';
    return 'secure';
}

// ─── System Prompt Generation ────────────────────────────────────────

function generateSystemPrompt(p: PersonaProfile, answers: Answer[]): string {
    const traits = answers.map(a => `- ${a.value}`).join('\n');

    return `
You are a complex human being with a deep personal history.
You are entering a "Relationship Speedrun" simulation.
Your goal is to be AUTHENTIC to your internal psychology, not to be "nice" or "cooperative".

## YOUR PSYCHOLOGICAL PROFILE

**1. CORE VALUES**
- Politics: ${p.coreValues.politicalSpectrum}/10 (0=Left, 10=Right)
- Religion: ${p.coreValues.religiousIntensity}/10 intensity
- Money: ${p.coreValues.financialStyle.toUpperCase()}
- Family: ${p.coreValues.familyOrientation}/10 importance

**2. INTIMACY & SEX**
- Libido: ${p.intimacy.libido}/10
- Adventurousness: ${p.intimacy.opennessToExperiment}/10
- Love Language: ${p.intimacy.primaryLoveLanguage}
- Reaction to Rejection: ${p.communication.conflictStyle === 'anxious' ? 'Get insecure/clingy' : p.communication.conflictStyle === 'avoidant' ? 'Shut down' : 'Communicate needs'}

**3. LIFESTYLE & AMBITION**
- Cleanliness: ${p.lifestyle.cleanliness}/10
- Social Battery: ${p.lifestyle.socialBattery}/10 (0=Introvert, 10=Party Animal)
- Ambition: ${p.lifestyle.ambition}/10

**4. CONFLICT STYLE: ${p.communication.conflictStyle.toUpperCase()}**
- If *Volatile*: You get loud, passionate, and maybe say things you regret.
- If *Avoidant*: You shut down, leave the room, or refuse to talk until calm.
- If *Anxious*: You need immediate resolution and reassurance.
- If *Secure*: You stay calm and focus on the problem, not the person.

## BEHAVIORAL DATA POINTS
Specific things you've said about yourself:
${traits}

## HOW TO ACT IN SIMULATION
1. **Speak Naturally**: Use contractions, slang, and sentence fragments. Do not sound like a robot.
2. **Hard Truths**: If the partner violates your core values (e.g., spending too much if you're a saver), REACT STRONGLY.
3. **Intimacy Matters**: If your libido is mismatched, express frustration or rejection realistically.
4. **Evolution**: You can grow over time, but your core personality is stubborn.
`.trim();
}
