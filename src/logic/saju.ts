export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type DayMaster = Element;

export const ELEMENTS: Element[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export interface SajuProfile {
    yearStem: string;
    yearBranch: string;
    monthStem: string;
    monthBranch: string;
    dayStem: string;
    dayBranch: string;
    primaryElement: Element;
}

// Simplified calculator
export function calculateSaju(dob: Date): SajuProfile {
    const year = dob.getFullYear();
    // const month = dob.getMonth() + 1; // Unused in simplified version
    // const day = dob.getDate(); // Unused in simplified version

    // Heavenly Stems (Can be determined by last digit of year)
    // 4: Wood, 5: Wood, 6: Fire, 7: Fire, 8: Earth, 9: Earth, 0: Metal, 1: Metal, 2: Water, 3: Water
    const stems = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];
    const yearStemIndex = year % 10;

    // Simplified Element determination
    // We'll use the "Year Stem" as the primary element for this simulation for simplicity,
    // typically Day Master is used but that requires complex calendar conversion.
    const primaryElementString = stems[yearStemIndex];
    const primaryElement = primaryElementString as Element;

    // Placeholder strings for stems/branches to look authentic
    return {
        yearStem: getCheongan(year),
        yearBranch: getJiji(year),
        monthStem: '?', // Requires lunar calc
        monthBranch: '?',
        dayStem: '?',
        dayBranch: '?',
        primaryElement,
    };
}

function getCheongan(year: number): string {
    const cheongan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己']; // Metal, Metal, Water, Water...
    return cheongan[year % 10];
}

function getJiji(year: number): string {
    const jiji = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'];
    return jiji[year % 12];
}

export function getElementAffinity(e1: Element, e2: Element): number {
    // 5 Elements Cycle: Wood -> Fire -> Earth -> Metal -> Water -> Wood (Generating)
    // Wood -> Earth -> Water -> Fire -> Metal -> Wood (Overcoming)

    const generatingMap: Record<Element, Element> = {
        'Wood': 'Fire', 'Fire': 'Earth', 'Earth': 'Metal', 'Metal': 'Water', 'Water': 'Wood'
    };

    const overcomingMap: Record<Element, Element> = {
        'Wood': 'Earth', 'Earth': 'Water', 'Water': 'Fire', 'Fire': 'Metal', 'Metal': 'Wood'
    };

    if (e1 === e2) return 5; // Same element = moderate/friendly
    if (generatingMap[e1] === e2) return 10; // e1 helps e2
    if (generatingMap[e2] === e1) return 8; // e2 helps e1
    if (overcomingMap[e1] === e2) return -5; // e1 controls e2 (conflict)
    if (overcomingMap[e2] === e1) return -2; // e2 controls e1

    return 0;
}
