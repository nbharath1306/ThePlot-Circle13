import { Question, AssessmentDimension } from "@/types";

export const DIMENSION_LABELS: Record<AssessmentDimension, string> = {
    core_values: "Identity & Values",
    intimacy: "Intimacy & Desire",
    lifestyle: "Habits & Lifestyle",
    communication: "Conflict DNA",
    future_goals: "Future Visions"
};

export const LIFETIME_QUESTIONS: Question[] = [
    // ─── PART 1: CORE VALUES (Politics, Religion, Money) ─────────────────
    {
        id: "cv_1",
        text: "Politically, I identify as:",
        dimension: "core_values",
        options: [
            { label: "Very Progressive", score: 0, value: "progressive" },
            { label: "Moderate / Centrist", score: 5, value: "moderate" },
            { label: "Conservative", score: 10, value: "conservative" },
            { label: "Apolitical / Don't Care", score: 5, value: "apolitical" },
        ],
    },
    {
        id: "cv_2",
        text: "Religion plays what role in my life?",
        dimension: "core_values",
        options: [
            { label: "Central to my identity", score: 10, value: "devout" },
            { label: "Important traditions, but flexible", score: 7, value: "traditional" },
            { label: "Spiritual but not religious", score: 4, value: "spiritual" },
            { label: "Not religious / Atheist", score: 0, value: "secular" },
        ],
    },
    {
        id: "cv_3",
        text: "When it comes to money, I am naturally:",
        dimension: "core_values",
        options: [
            { label: "An extreme saver / frugal", score: 0, value: "saver", tags: ["thrifty"] },
            { label: "Balanced / Budget-conscious", score: 5, value: "balanced" },
            { label: "A spender / 'Enjoy life now'", score: 10, value: "spender", tags: ["impulsive"] },
            { label: "An ambitious investor / risk-taker", score: 8, value: "investor", tags: ["risk-taker"] },
        ],
    },
    {
        id: "cv_4",
        text: "My view on traditional gender roles:",
        dimension: "core_values",
        options: [
            { label: "I prefer traditional roles", score: 10, value: "traditional" },
            { label: "I prefer a balanced partnership", score: 5, value: "egalitarian" },
            { label: "I reject traditional roles entirely", score: 0, value: "progressive" },
            { label: "It depends on the situation", score: 5, value: "situational" },
        ],
    },
    {
        id: "cv_5",
        text: "Family involvement (parents/in-laws) should be:",
        dimension: "core_values",
        options: [
            { label: "High - Weekly visits/calls", score: 10, value: "high_involvement" },
            { label: "Moderate - Holidays & birthdays", score: 5, value: "moderate_involvement" },
            { label: "Low - Boundaries are key", score: 0, value: "low_involvement" },
            { label: "Only when necessary", score: 2, value: "distant" },
        ],
    },
    {
        id: "cv_6",
        text: "My stance on having children:",
        dimension: "core_values",
        options: [
            { label: "Absolutely essential", score: 10, value: "wants_kids" },
            { label: "Open to it / Maybe", score: 5, value: "maybe_kids" },
            { label: "Prefer not to / Child-free", score: 0, value: "no_kids" },
            { label: "Undecided", score: 5, value: "undecided" },
        ],
    },

    // ─── PART 2: INTIMACY & SEX (Sensitive) ──────────────────────────────
    {
        id: "int_1",
        text: "Ideally, how often would you be intimate with your partner?",
        dimension: "intimacy",
        isSensitive: true,
        options: [
            { label: "Every day", score: 10, value: "daily_libido", tags: ["high_libido"] },
            { label: "A few times a week", score: 7, value: "weekly_libido", tags: ["avg_libido"] },
            { label: "Once a week/month is fine", score: 3, value: "low_libido", tags: ["low_libido"] },
            { label: "Quality over quantity / Spontaneous", score: 5, value: "spontaneous_libido" },
        ],
    },
    {
        id: "int_2",
        text: "My attitude towards exploring new things in the bedroom:",
        dimension: "intimacy",
        isSensitive: true,
        options: [
            { label: "Very adventurous / Try anything once", score: 10, value: "adventurous", tags: ["kink_friendly"] },
            { label: "Open to suggestions", score: 7, value: "open", tags: ["vanilla_plus"] },
            { label: "I prefer sticking to what works", score: 3, value: "predictable", tags: ["vanilla"] },
            { label: "Very private / Conservative", score: 0, value: "conservative" },
        ],
    },
    {
        id: "int_3",
        text: "Public Displays of Affection (PDA):",
        dimension: "intimacy",
        options: [
            { label: "Love it everywhere", score: 10, value: "high_pda" },
            { label: "Subtle touches are nice", score: 6, value: "moderate_pda" },
            { label: "Only in private", score: 2, value: "private_pda" },
            { label: "Dislike it", score: 0, value: "no_pda" },
        ],
    },
    {
        id: "int_4",
        text: "What makes you feel most loved? (Primary Love Language)",
        dimension: "intimacy",
        options: [
            { label: "Words of Affirmation", score: 0, value: "words" },
            { label: "Quality Time", score: 0, value: "time" },
            { label: "Physical Touch", score: 0, value: "touch" },
            { label: "Acts of Service", score: 0, value: "acts" },
            { label: "Receiving Gifts", score: 0, value: "gifts" },
        ],
    },
    {
        id: "int_5",
        text: "How do you handle rejection or lack of intimacy?",
        dimension: "intimacy",
        isSensitive: true,
        options: [
            { label: "I feel insecure immediately", score: 0, value: "insecure", tags: ["sensitive"] },
            { label: "I assume they're just tired", score: 10, value: "secure", tags: ["secure"] },
            { label: "I get frustrated/angry", score: 2, value: "frustrated", tags: ["reactive"] },
            { label: "I withdraw/pull away", score: 2, value: "withdraw", tags: ["avoidant"] },
        ],
    },

    // ─── PART 3: LIFESTYLE & HABITS ──────────────────────────────────────
    {
        id: "life_1",
        text: "How clean/organized are you at home?",
        dimension: "lifestyle",
        options: [
            { label: "Monica Geller (OCD levels)", score: 10, value: "very_clean" },
            { label: "Tidy, but lived-in", score: 7, value: "tidy" },
            { label: "Messy / Chaotic Creative", score: 3, value: "messy" },
            { label: "I hire a cleaner", score: 5, value: "outsourced" },
        ],
    },
    {
        id: "life_2",
        text: "A perfect Friday night is:",
        dimension: "lifestyle",
        options: [
            { label: "Out at a bar/club with friends", score: 10, value: "party" },
            { label: "Dinner party with close friends", score: 6, value: "social_intimate" },
            { label: "Netflix & Chill at home", score: 2, value: "homebody" },
            { label: "Working on a side project", score: 4, value: "productive" },
        ],
    },
    {
        id: "life_3",
        text: "My ideal vacation style:",
        dimension: "lifestyle",
        options: [
            { label: "Relaxing on a beach, doing nothing", score: 2, value: "relaxing" },
            { label: "Packed itinerary / Sightseeing", score: 8, value: "active" },
            { label: "Adventure / Hiking / Camping", score: 10, value: "adventure" },
            { label: "Luxury / Fine Dining / Shopping", score: 5, value: "luxury" },
        ],
    },
    {
        id: "life_4",
        text: "How do you handle mornings?",
        dimension: "lifestyle",
        options: [
            { label: "Up at 5AM, seize the day!", score: 10, value: "early_bird" },
            { label: "I need coffee and silence first", score: 5, value: "slow_starter" },
            { label: "I snooze 10 times", score: 2, value: "not_morning_person" },
            { label: "I sleep until noon if I can", score: 0, value: "night_owl" },
        ],
    },
    {
        id: "life_5",
        text: "Diet and Exercise typical routine:",
        dimension: "lifestyle",
        options: [
            { label: "Very strict / Gym rat", score: 10, value: "fitness_focused" },
            { label: "Moderate / Healthy balance", score: 6, value: "balanced" },
            { label: "I try, but inconsistent", score: 3, value: "inconsistent" },
            { label: "I live to eat / Not a gym fan", score: 0, value: "laissez_faire" },
        ],
    },

    // ─── PART 4: COMMUNICATION & CONFLICT ────────────────────────────────
    {
        id: "comm_1",
        text: "During a serious argument, I tend to:",
        dimension: "communication",
        options: [
            { label: "Want to solve it immediately (Pursue)", score: 8, value: "anxious_pursuer" },
            { label: "Need space to cool down (Withdraw)", score: 2, value: "avoidant_withdrawer" },
            { label: "Get emotional / Cry / Shout", score: 4, value: "volatile" },
            { label: "Stay calm and logical", score: 10, value: "secure_logic" },
        ],
    },
    {
        id: "comm_2",
        text: "Apologizing comes to me:",
        dimension: "communication",
        options: [
            { label: "Easily, I prioritize peace", score: 10, value: "easy_apology" },
            { label: "Hard, I need to understand why I'm wrong", score: 5, value: "principled" },
            { label: "Very hard, I rarely admit fault", score: 0, value: "stubborn" },
            { label: "I over-apologize even when not wrong", score: 2, value: "people_pleaser" },
        ],
    },
    {
        id: "comm_3",
        text: "When sharing feelings, I am:",
        dimension: "communication",
        options: [
            { label: "An open book", score: 10, value: "open" },
            { label: "Selective / Needs trust first", score: 6, value: "guarded" },
            { label: "Very private / Stoic", score: 2, value: "stoic" },
            { label: "Assume people should just know", score: 0, value: "mind_reader" },
        ],
    },

    // ─── PART 5: FUTURE GOALS (Ambition) ─────────────────────────────────
    {
        id: "fut_1",
        text: "My career ambition level:",
        dimension: "future_goals",
        options: [
            { label: "Workaholic / CEO ambitions", score: 10, value: "high_ambition", tags: ["work_focused"] },
            { label: "Ambitious but value balance", score: 7, value: "balanced_ambition" },
            { label: "Work to live, not live to work", score: 3, value: "life_focused" },
            { label: "I prefer a simple, low-stress job", score: 0, value: "low_stress" },
        ],
    },
    {
        id: "fut_2",
        text: "Where do you see yourself living in 10 years?",
        dimension: "future_goals",
        options: [
            { label: "Big City (NYC, London, etc.)", score: 10, value: "urban" },
            { label: "Suburbs with a yard", score: 5, value: "suburban" },
            { label: "Rural / Farm / Off-grid", score: 0, value: "rural" },
            { label: "Nomadic / Traveling", score: 8, value: "nomadic" },
        ],
    },
    {
        id: "fut_3",
        text: "Financial Risk Tolerance:",
        dimension: "future_goals",
        options: [
            { label: "High risk, high reward (Crypto/Startups)", score: 10, value: "high_risk" },
            { label: "Moderate (Stocks/Real Estate)", score: 6, value: "moderate_risk" },
            { label: "Low (Savings/Bonds)", score: 2, value: "low_risk" },
            { label: "Avoid risk entirely", score: 0, value: "no_risk" },
        ],
    },
];

export function getQuestionsByDimension(dim: AssessmentDimension): Question[] {
    return LIFETIME_QUESTIONS.filter(q => q.dimension === dim);
}

export function getTotalQuestions(): number {
    return LIFETIME_QUESTIONS.length;
}
