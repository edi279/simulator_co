import { calculateSaju, getElementAffinity, type SajuProfile } from './saju';
import { getMBTICompatibility, type MBTI } from './mbti';
import { getRandomScenario } from './scenarios';

export interface Employee {
    id: string;
    name: string;
    dob: string; // YYYY-MM-DD
    mbti: MBTI;
    saju: SajuProfile;
    mood: number; // 0-100
    stress: number; // 0-100
}

export interface Relationship {
    fromId: string;
    toId: string;
    score: number; // -100 to 100
}

export interface GameLog {
    id: string;
    day: number;
    message: string;
    type: 'positive' | 'negative' | 'neutral';
}

export interface GameState {
    day: number;
    employees: Employee[];
    relationships: Relationship[];
    logs: GameLog[];
    isPlaying: boolean;
}

export const INITIAL_STATE: GameState = {
    day: 1,
    employees: [],
    relationships: [],
    logs: [],
    isPlaying: false,
};

// Relation helper
export function getRelationship(state: GameState, from: string, to: string): number {
    const rel = state.relationships.find(r => r.fromId === from && r.toId === to);
    return rel ? rel.score : 0;
}

export function updateRelationship(state: GameState, from: string, to: string, delta: number): Relationship[] {
    const existing = state.relationships.find(r => r.fromId === from && r.toId === to);
    if (existing) {
        return state.relationships.map(r =>
            (r.fromId === from && r.toId === to) ? { ...r, score: Math.max(-100, Math.min(100, r.score + delta)) } : r
        );
    } else {
        return [...state.relationships, { fromId: from, toId: to, score: delta }];
    }
}

export function nextDay(currentState: GameState): GameState {
    let newState = { ...currentState, day: currentState.day + 1 };
    const dailyLogs: GameLog[] = [];

    // 1. Random Interactions
    // For each employee, pick a random other employee to interact with
    newState.employees.forEach(actor => {
        // 30% chance to initiate something
        if (Math.random() > 0.7) {
            const others = newState.employees.filter(e => e.id !== actor.id);
            if (others.length === 0) return;

            const target = others[Math.floor(Math.random() * others.length)];

            // Calculate Interaction Outcome based on Compatibility
            const elementAffinity = getElementAffinity(actor.saju.primaryElement, target.saju.primaryElement);
            const mbtiAffinity = getMBTICompatibility(actor.mbti, target.mbti);

            const totalAffinity = elementAffinity + mbtiAffinity;
            const roll = (Math.random() * 20) - 10; // -10 to +10 randomness

            const outcome = totalAffinity + roll;

            let type: 'positive' | 'negative' | 'neutral' = 'neutral';

            if (outcome > 5) {
                type = 'positive';
            } else if (outcome < -5) {
                type = 'negative';
            } else {
                type = 'neutral';
            }

            const scenario = getRandomScenario(type);
            const msg = scenario.text(actor.name, target.name);
            const scoreParams = scenario.score;

            // Mutual update for simplicity? Or directional? Let's make it directional for now, but usually feelings are mutual in this sim.
            // Let's update both directions slightly differently? No, symmetric for now to keep matrix simple in UI.
            newState.relationships = updateRelationship(newState, actor.id, target.id, scoreParams);
            newState.relationships = updateRelationship(newState, target.id, actor.id, scoreParams); // Symmetric update

            dailyLogs.push({
                id: Math.random().toString(36).substr(2, 9),
                day: newState.day,
                message: msg,
                type
            });
        }
    });

    if (dailyLogs.length === 0) {
        dailyLogs.push({
            id: Math.random().toString(36).substr(2, 9),
            day: newState.day,
            message: "평화로운 하루가 지나갔습니다.",
            type: 'neutral'
        });
    }

    newState.logs = [...dailyLogs, ...newState.logs].slice(0, 100); // Keep last 100 logs
    return newState;
}

export function addEmployee(state: GameState, name: string, dob: string, mbti: MBTI): GameState {
    const newEmp: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        dob,
        mbti,
        saju: calculateSaju(new Date(dob)),
        mood: 50,
        stress: 0
    };
    return { ...state, employees: [...state.employees, newEmp] };
}
