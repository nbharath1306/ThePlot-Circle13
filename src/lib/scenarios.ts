export interface ScenarioDefinition {
    id: string;
    title: string;
    description: string;
    context: string;
    starterPrompt: string;
    stakes: string;
}

export const SCENARIOS: ScenarioDefinition[] = [
    {
        id: 's1_first_date',
        title: 'The First Date',
        description: 'Initial chemistry and conversation flow.',
        context: 'You are on your first date at a quiet, intimate jazz bar. You ordered drinks and are sitting in a booth.',
        starterPrompt: 'Start the conversation by commenting on the atmosphere or asking a getting-to-know-you question.',
        stakes: 'Assess physical attraction, conversational ease, and surface-level compatibility.',
    },
    {
        id: 's2_conflict',
        title: 'The First Conflict',
        description: 'Navigating a disagreement.',
        context: 'It has been 3 months. You are planning a weekend trip. One of you wants a relaxing beach stay, the other wants an adventurous hiking trip. You are both tired from work.',
        starterPrompt: 'Express your preference strongly but try to find a solution.',
        stakes: 'Tests conflict resolution style, compromise, and emotional regulation.',
    },
    {
        id: 's3_serious',
        title: 'Getting Serious',
        description: 'Defining the relationship.',
        context: 'It has been 1 year. You are at home, cooking dinner together. The topic of "where is this going" comes up. One of you mentions a job offer in another city.',
        starterPrompt: 'Bring up the future of the relationship and the potential move.',
        stakes: 'Tests commitment attachment style, and long-term alignment.',
    },
    {
        id: 's4_stress',
        title: 'Life Stress Test',
        description: 'External pressure affecting the relationship.',
        context: 'It is Year 3. One partner has just lost their job and is feeling worthless. The other is stressed about a family health issue. The apartment is messy.',
        starterPrompt: 'Start a conversation about the messy apartment that spirals into the deeper stress.',
        stakes: 'Tests support systems, empathy, and resilience under pressure.',
    },
    {
        id: 's5_intimacy',
        title: 'Intimacy & Vulnerability',
        description: 'Deep emotional connection.',
        context: 'Year 4. It is late at night in bed. The lights are off. You are talking about your deepest fears or insecurities.',
        starterPrompt: 'Share a vulnerability you have never told anyone else.',
        stakes: 'Tests emotional safety, depth of intimacy, and reaction to vulnerability.',
    },
    {
        id: 's6_crisis',
        title: 'The Crisis Point',
        description: 'A major breach of trust or alignment.',
        context: 'Year 6. A major secret has come out (financial debt, a secret friendship, or a lie about the past). You are sitting at the kitchen table in silence.',
        starterPrompt: 'Break the silence. confront the issue directly.',
        stakes: 'Tests forgiveness, integrity, and the breaking point of the bond.',
    },
    {
        id: 's7_verdict',
        title: 'The Verdict',
        description: 'Reflection and decision.',
        context: 'Year 7. You are celebrating your anniversary. You look back on the years. Are you happy? Do you want to continue?',
        starterPrompt: 'Reflect on the journey and make a statement about the future.',
        stakes: 'The final assessment of relationship viability and satisfaction.',
    },
];
