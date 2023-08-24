import type { Stats, Weapon, WeaponProficiencies } from "./index";

export interface UnitTypeModifier {
    unitType: string;
    effect: string;
}

export interface EngageAttackBase {
    name: string;
    description: string;
    unitTypeModifiers: UnitTypeModifier[];
}

export interface EngageAttackLink {
    attackPartner: string;
    description: string;
}

export interface Emblem {
    weaponProficiencies: WeaponProficiencies[];
    engageAttack: {
        base: EngageAttackBase;
        link: EngageAttackLink;
    };
    engageWeapons: Omit<Weapon, "base64ID">[];
    name: string;
    base64ID: string;
    statsModifiers: Stats;
    img: string;
}