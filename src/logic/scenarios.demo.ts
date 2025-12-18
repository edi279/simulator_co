// This is a demo file. Rename to scenarios.ts or copy context to scenarios.ts to use.

export interface Scenario {
    text: (actor: string, target: string) => string;
    score: number;
}

export const POSITIVE_SCENARIOS: Scenario[] = [
    { text: (a, t) => `${a}(이)가 ${t}에게 데모용 칭찬을 건넸습니다.`, score: 5 },
    { text: (a, t) => `${a}(이)가 ${t}와 즐겁게 협업했습니다.`, score: 5 },
];

export const NEGATIVE_SCENARIOS: Scenario[] = [
    { text: (a, t) => `${a}(이)가 ${t}와 의견 충돌이 있었습니다.`, score: -5 },
    { text: (a, t) => `${a}(이)가 ${t}의 실수를 지적했습니다.`, score: -3 },
];

export const NEUTRAL_SCENARIOS: Scenario[] = [
    { text: (a, t) => `${a}(이)가 ${t}와 인사를 나눴습니다.`, score: 1 },
    { text: (a, t) => `${a}(이)가 ${t}를 복도에서 마주쳤습니다.`, score: 0 },
];

export function getRandomScenario(type: 'positive' | 'negative' | 'neutral'): Scenario {
    let list = NEUTRAL_SCENARIOS;
    if (type === 'positive') list = POSITIVE_SCENARIOS;
    if (type === 'negative') list = NEGATIVE_SCENARIOS;

    return list[Math.floor(Math.random() * list.length)];
}
