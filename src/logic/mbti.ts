export type MBTI =
    | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
    | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
    | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
    | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export const MBTI_TYPES: MBTI[] = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

// Simplified compatibility scores (1-5 scale) based on Socionics/Keirsey roughly
// 5: Ideal (Dual), 4: Good, 3: Neutral, 2: Friction, 1: Conflict


export function getMBTICompatibility(m1: MBTI, m2: MBTI): number {
    if (m1 === m2) return 3;

    // Simple heuristics
    let score = 3;

    // E/I pairing: usually good if mixed
    if (m1[0] !== m2[0]) score += 1;

    // N/S pairing: usually key for understanding
    if (m1[1] === m2[1]) score += 1;
    else score -= 1;

    // T/F:
    /* if (m1[2] === m2[2]) score += 0; */

    // P/J:
    if (m1[3] !== m2[3]) score += 1;

    // Normalize to range -5 to 10 effectively for calculations
    return (score - 3) * 2; // -6 to +6
}
