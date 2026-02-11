import { Question, PsychologicalDimension } from '@/types';

function createQuestion(
    id: string,
    text: string,
    dimension: PsychologicalDimension,
    options: { label: string; score: number; value: string }[]
): Question {
    return { id, text, dimension, options };
}

// 5 questions per dimension = 50 questions total (V1)
export const questions: Question[] = [
    // 1. OPENNESS
    createQuestion('o1', 'When plans change suddenly, I feel:', 'openness', [
        { label: 'excited for the new possibility', score: 4, value: 'high_flexibility' },
        { label: 'fine, I adapt easily', score: 3, value: 'moderate_flexibility' },
        { label: 'annoyed but I manage', score: 2, value: 'low_flexibility' },
        { label: 'panic/stressed', score: 1, value: 'rigid' },
    ]),
    createQuestion('o2', 'I enjoy abstract discussions about philosophy or art:', 'openness', [
        { label: 'constantly', score: 4, value: 'intellectual' },
        { label: 'often', score: 3, value: 'curious' },
        { label: 'rarely', score: 2, value: 'pragmatic' },
        { label: 'never', score: 1, value: 'concrete' },
    ]),
    createQuestion('o3', 'My approach to new experiences (food, travel, hobbies) is:', 'openness', [
        { label: 'seek them out actively', score: 4, value: 'explorer' },
        { label: 'open if suggested', score: 3, value: 'receptive' },
        { label: 'stick to what I know usually', score: 2, value: 'habitual' },
        { label: 'avoid them', score: 1, value: 'closed' },
    ]),
    createQuestion('o4', 'I prefer stories or movies that are:', 'openness', [
        { label: 'complex, ambiguous, artistic', score: 4, value: 'avant_garde' },
        { label: 'thought-provoking but clear', score: 3, value: 'deep' },
        { label: 'entertaining and straightforward', score: 2, value: 'conventional' },
        { label: 'predictable and happy', score: 1, value: 'traditional' },
    ]),
    createQuestion('o5', 'Rules and traditions are:', 'openness', [
        { label: 'meant to be challenged', score: 4, value: 'rebellious' },
        { label: 'guidelines, not laws', score: 3, value: 'questioning' },
        { label: 'generally good to follow', score: 2, value: 'compliant' },
        { label: 'essential for order', score: 1, value: 'dogmatic' },
    ]),

    // 2. CONSCIENTIOUSNESS
    createQuestion('c1', 'My workspace is usually:', 'conscientiousness', [
        { label: 'impeccably organized', score: 4, value: 'orderly' },
        { label: 'tidy enough', score: 3, value: 'functional' },
        { label: 'messy but I know where things are', score: 2, value: 'chaotic_good' },
        { label: 'a disaster zone', score: 1, value: 'disorganized' },
    ]),
    createQuestion('c2', 'When I have a deadline:', 'conscientiousness', [
        { label: 'I finish days early', score: 4, value: 'proactive' },
        { label: 'I finish on time', score: 3, value: 'reliable' },
        { label: 'I rush at the end', score: 2, value: 'procrastinator' },
        { label: 'I often miss it', score: 1, value: 'unreliable' },
    ]),
    createQuestion('c3', 'Details are:', 'conscientiousness', [
        { label: 'everything', score: 4, value: 'perfectionist' },
        { label: 'important', score: 3, value: 'thorough' },
        { label: 'less important than the big picture', score: 2, value: 'big_picture' },
        { label: 'boring', score: 1, value: 'careless' },
    ]),
    createQuestion('c4', 'I set goals:', 'conscientiousness', [
        { label: 'constantly and track them', score: 4, value: 'driven' },
        { label: 'often', score: 3, value: 'focused' },
        { label: 'sometimes', score: 2, value: 'drifter' },
        { label: 'rarely', score: 1, value: 'aimless' },
    ]),
    createQuestion('c5', 'Before making a big purchase, I:', 'conscientiousness', [
        { label: 'research extensively', score: 4, value: 'prudent' },
        { label: 'compare a few options', score: 3, value: 'sensible' },
        { label: 'go with my gut', score: 2, value: 'spontaneous' },
        { label: 'buy on impulse', score: 1, value: 'impulsive' },
    ]),

    // 3. EXTRAVERSION
    createQuestion('e1', 'At a large party, I usually:', 'extraversion', [
        { label: 'work the room/center of attention', score: 4, value: 'life_of_party' },
        { label: 'talk to many people', score: 3, value: 'sociable' },
        { label: 'stick to friends I know', score: 2, value: 'reserved' },
        { label: 'hide in the corner/leave early', score: 1, value: 'withdrawn' },
    ]),
    createQuestion('e2', 'A weekend alone sounds:', 'extraversion', [
        { label: 'lonely/boring', score: 4, value: 'needs_people' },
        { label: 'okay, but I prefer company', score: 3, value: 'social_pref' },
        { label: 'relaxing', score: 2, value: 'intro_pref' },
        { label: 'like heaven', score: 1, value: 'solitary' },
    ]),
    createQuestion('e3', 'I express my opinions:', 'extraversion', [
        { label: 'loudly and often', score: 4, value: 'outspoken' },
        { label: 'when I have something to say', score: 3, value: 'assertive' },
        { label: 'only if asked', score: 2, value: 'quiet' },
        { label: 'almost never', score: 1, value: 'passive' },
    ]),
    createQuestion('e4', 'My energy level is:', 'extraversion', [
        { label: 'always high', score: 4, value: 'high_energy' },
        { label: 'variable but generally good', score: 3, value: 'moderate_energy' },
        { label: 'low without stimulation', score: 2, value: 'low_energy' },
        { label: 'easily drained', score: 1, value: 'delicate' },
    ]),
    createQuestion('e5', 'Meeting new people makes me feel:', 'extraversion', [
        { label: 'energized', score: 4, value: 'gregarious' },
        { label: 'interested', score: 3, value: 'curious_social' },
        { label: 'tired', score: 2, value: 'drained' },
        { label: 'anxious', score: 1, value: 'shy' },
    ]),

    // 4. AGREEABLENESS
    createQuestion('a1', 'When a friend cancels plans last minute, I:', 'agreeableness', [
        { label: 'say "no problem!" and mean it', score: 4, value: 'forgiving' },
        { label: 'am annoyed but hide it', score: 3, value: 'polite' },
        { label: 'express my frustration', score: 2, value: 'assertive_conflict' },
        { label: 'cut them off/hold a grudge', score: 1, value: 'unforgiving' },
    ]),
    createQuestion('a2', 'I trust others:', 'agreeableness', [
        { label: 'until given a reason not to', score: 4, value: 'trusting' },
        { label: 'cautiously', score: 3, value: 'realistic' },
        { label: 'rarely', score: 2, value: 'skeptical' },
        { label: 'never', score: 1, value: 'cynical' },
    ]),
    createQuestion('a3', 'I focus on others\' needs:', 'agreeableness', [
        { label: 'before my own', score: 4, value: 'altruistic' },
        { label: 'alongside my own', score: 3, value: 'considerate' },
        { label: 'after my own', score: 2, value: 'self_centered' },
        { label: 'rarely', score: 1, value: 'callous' },
    ]),
    createQuestion('a4', 'Competitive situations make me:', 'agreeableness', [
        { label: 'uncomfortable', score: 4, value: 'cooperative' },
        { label: 'engaged but friendly', score: 3, value: 'sporting' },
        { label: 'eager to win', score: 2, value: 'competitive' },
        { label: 'ruthless', score: 1, value: 'aggressive' },
    ]),
    createQuestion('a5', 'My temper is:', 'agreeableness', [
        { label: 'non-existent', score: 4, value: 'gentle' },
        { label: 'slow to rise', score: 3, value: 'even_tempered' },
        { label: 'quick to rise', score: 2, value: 'irritable' },
        { label: 'explosive', score: 1, value: 'hostile' },
    ]),

    // 5. NEUROTICISM
    createQuestion('n1', 'Small mistakes make me feel:', 'neuroticism', [
        { label: 'devastated', score: 4, value: 'volatile' },
        { label: 'upset for a while', score: 3, value: 'sensitive' },
        { label: 'annoyed but I move on', score: 2, value: 'resilient' },
        { label: 'nothing, I learn and proceed', score: 1, value: 'stable' },
    ]),
    createQuestion('n2', 'My mood swings are:', 'neuroticism', [
        { label: 'frequent and intense', score: 4, value: 'moody' },
        { label: 'occasional', score: 3, value: 'variable' },
        { label: 'rare', score: 2, value: 'steady' },
        { label: 'I am a rock', score: 1, value: 'stoic' },
    ]),
    createQuestion('n3', 'Under stress, I:', 'neuroticism', [
        { label: 'panic/freeze', score: 4, value: 'overwhelmed' },
        { label: 'get anxious', score: 3, value: 'worried' },
        { label: 'get focused', score: 2, value: 'composed' },
        { label: 'perform better', score: 1, value: 'confident' },
    ]),
    createQuestion('n4', 'I worry about the future:', 'neuroticism', [
        { label: 'constantly', score: 4, value: 'anxious' },
        { label: 'often', score: 3, value: 'concerned' },
        { label: 'sometimes', score: 2, value: 'hopeful' },
        { label: 'never', score: 1, value: 'optimist' },
    ]),
    createQuestion('n5', 'Criticism feels like:', 'neuroticism', [
        { label: 'an attack', score: 4, value: 'defensive' },
        { label: 'hurtful but useful', score: 3, value: 'sensitive_constructive' },
        { label: 'useful data', score: 2, value: 'objective' },
        { label: 'irrelevant', score: 1, value: 'detached' },
    ]),

    // 6. ATTACHMENT
    createQuestion('att1', 'When my partner needs space, I feel:', 'attachment', [
        { label: 'panicked/rejected', score: 4, value: 'anxious' },
        { label: 'uneasy', score: 3, value: 'leaning_anxious' },
        { label: 'fine', score: 2, value: 'secure' },
        { label: 'relieved', score: 1, value: 'avoidant' },
    ]),
    createQuestion('att2', 'I share my deepest feelings:', 'attachment', [
        { label: 'very easily, too soon', score: 4, value: 'oversharing' },
        { label: 'when trust is built', score: 3, value: 'secure_sharing' },
        { label: 'reluctantly', score: 2, value: 'guarded' },
        { label: 'never', score: 1, value: 'sealed' },
    ]),
    createQuestion('att3', 'In relationships, I prioritize:', 'attachment', [
        { label: 'closeness/merging', score: 4, value: 'co_dependent' },
        { label: 'deep connection', score: 3, value: 'intimacy' },
        { label: 'independence', score: 2, value: 'autonomy' },
        { label: 'self-reliance', score: 1, value: 'distance' },
    ]),
    createQuestion('att4', 'Conflict makes me want to:', 'attachment', [
        { label: 'fix it immediately/cling', score: 4, value: 'pursuer' },
        { label: 'talk it out calmly', score: 3, value: 'secure_solver' },
        { label: 'withdraw/shut down', score: 2, value: 'distancer' },
        { label: 'leave', score: 1, value: 'runner' },
    ]),
    createQuestion('att5', 'I feel worthiest when:', 'attachment', [
        { label: 'someone loves me', score: 4, value: 'external_validation' },
        { label: 'I am helping', score: 3, value: 'helper' },
        { label: 'I am achieving', score: 2, value: 'achiever' },
        { label: 'I am alone and safe', score: 1, value: 'loner' },
    ]),

    // 7. LOVE LANGUAGE
    createQuestion('ll1', 'I feel most loved when my partner:', 'love_language', [
        { label: 'says "I love you" / compliments me', score: 1, value: 'words' },
        { label: 'spends uninterrupted time with me', score: 2, value: 'time' },
        { label: 'does chores for me', score: 3, value: 'acts' },
        { label: 'hugs/kisses me', score: 4, value: 'touch' },
    ]),
    createQuestion('ll2', 'The best gift is:', 'love_language', [
        { label: 'a thoughtful letter', score: 1, value: 'words_gift' },
        { label: 'vacation together', score: 2, value: 'time_gift' },
        { label: 'something handmade', score: 3, value: 'acts_gift' },
        { label: 'something tangible/expensive', score: 5, value: 'gifts' }, // Note score 5 for gifts to map separately if needed
    ]),
    // Additional Love Language questions can be inferred or expanded safely

    // 8. CONFLICT
    createQuestion('con1', 'In a heated argument, I tend to:', 'conflict', [
        { label: 'win at all costs', score: 4, value: 'compete' },
        { label: 'find a solution', score: 3, value: 'collaborate' },
        { label: 'split the difference', score: 2, value: 'compromise' },
        { label: 'give in to keep peace', score: 1, value: 'accommodate' },
    ]),
    createQuestion('con2', 'If I am angry, I:', 'conflict', [
        { label: 'explode', score: 4, value: 'volatile' },
        { label: 'express it clearly', score: 3, value: 'expressive' },
        { label: 'become passive-aggressive', score: 2, value: 'passive_aggressive' },
        { label: 'go silent', score: 1, value: 'avoidant' },
    ]),

    // 9. VALUES
    createQuestion('val1', 'Success to me means:', 'values', [
        { label: 'wealth and status', score: 4, value: 'ambition' },
        { label: 'impact and legacy', score: 3, value: 'purpose' },
        { label: 'happiness and balance', score: 2, value: 'lifestyle' },
        { label: 'family and connection', score: 1, value: 'community' },
    ]),
    createQuestion('val2', 'I would rather have:', 'values', [
        { label: 'infinite money', score: 4, value: 'material' },
        { label: 'infinite wisdom', score: 3, value: 'intellectual' },
        { label: 'infinite time', score: 2, value: 'experiential' },
        { label: 'infinite love', score: 1, value: 'emotional' },
    ]),

    // 10. EMOTIONAL INTELLIGENCE
    createQuestion('ei1', 'When a friend is crying, I:', 'emotional_intelligence', [
        { label: 'cry with them', score: 4, value: 'high_empathy' },
        { label: 'listen and hold space', score: 3, value: 'supportive' },
        { label: 'try to solve their problem', score: 2, value: 'fixer' },
        { label: 'feel awkward', score: 1, value: 'low_empathy' },
    ]),
    createQuestion('ei2', 'I understand why I feel what I feel:', 'emotional_intelligence', [
        { label: 'always', score: 4, value: 'high_self_awareness' },
        { label: 'usually', score: 3, value: 'aware' },
        { label: 'sometimes', score: 2, value: 'confused' },
        { label: 'rarely', score: 1, value: 'disconnected' },
    ]),
];

export function getQuestions(): Question[] {
    return questions;
}
