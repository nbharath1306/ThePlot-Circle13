export interface Scenario {
    id: string;
    year: number;
    title: string;
    description: string;
    context: string;
    emoji: string;
}

export const ORACLE_SCENARIOS: Scenario[] = [
    {
        id: "year1",
        year: 1,
        title: "Moving In Together",
        description: "You're discussing whether to get an apartment together.",
        context: "One of you wants to move fast, the other wants to take it slow. You're discussing chores, personal space, and whether this is too soon.",
        emoji: "🏠"
    },
    {
        id: "year3",
        year: 3,
        title: "Career vs. Relationship",
        description: "One of you got a dream job offer in another city.",
        context: "It's a career-defining opportunity, but it means long-distance or one person sacrificing their current life. You're deciding what matters more.",
        emoji: "💼"
    },
    {
        id: "year5",
        year: 5,
        title: "Financial Crisis",
        description: "Unexpected financial stress hits your relationship.",
        context: "One of you lost your job. Bills are piling up. You're discussing whether to dip into savings, borrow money, or make major lifestyle changes.",
        emoji: "💰"
    },
    {
        id: "year10",
        year: 10,
        title: "Long-Term Vision",
        description: "You're reflecting on the next decade together.",
        context: "Kids or no kids? City or suburbs? Retire early or work forever? Your visions for the future might not align.",
        emoji: "🌅"
    }
];
