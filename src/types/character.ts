import type { Stats } from "./index";

type CharacterStats = Omit<Stats, "mov">

export interface PersonalSkill {
    name: string;
    description: string;
    img: string;
}

export interface Character {
    bases: CharacterStats;
    growths: CharacterStats;
    modifiers: CharacterStats;
    initialClass: string;
    initialSP: number;
    capability: string;
    hiddenCapabilities: string[];
    personalSkill: PersonalSkill;
    sprite: string;
    name: string;
    img: string;
    base64ID: string;
}