export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
export type SkillProficiency = 'none' | 'prof' | 'expert';

export interface AbilityData {
  score: number;
  saveProf: boolean;
}

export interface SkillData {
  ability: AbilityKey;
  prof: SkillProficiency;
  advantage?: boolean;
}

export interface ClassLevel {
  name: string;
  subclass?: string;
  level: number;
  hitDie: string;
  conBonus?: number;
  hp?: number;
}

export interface HitDiePool {
  die: string;
  total: number;
  current: number;
  source: string;
}

export interface Weapon {
  id: string;
  name: string;
  toHit: string;
  damage: string;
  damageType: string;
  range: string;
  properties: string[];
  mastery?: string;
  masteryActive?: boolean;
  notes?: string;
  ability?: 'dex' | 'str';
  baseDamage?: string;
}

export interface ResourceTracker {
  id: string;
  name: string;
  current: number;
  max: number;
  reset: 'Short Rest' | 'Long Rest' | 'Short or Long Rest' | 'Other' | string;
  desc?: string;
  useProfBonus?: boolean;
}

export interface SpellSlotLevel {
  total: number;
  used: number;
}

export interface CharacterFeature {
  id: string;
  name: string;
  source: string; // 'Race' | 'Class' | 'Feat' | 'Background' | 'Other'
  description: string; // Displayed tactical brief / summary
  fullText?: string;   // Full verbatim rules text
  prerequisite?: string | null;
  category?: string;
  collapsed?: boolean;
}

export interface MasterFeat {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  prerequisite?: string | null;
  brief: string;
  fullText: string;
  source?: string;
}

export interface MasterSpeciesTrait {
  id: string;
  name: string;
  traitName: string;
  species: string;
  category: string;
  traitType: 'Base Trait' | 'Lineage';
  isLineage: boolean;
  prerequisite?: string | null;
  brief: string;
  fullText: string;
  source?: string;
}

export interface MasterSpeciesOverview {
  name: string;
  category: string;
  source: string;
  creatureType: string;
  size: string;
  speed: string;
  baseTraitCount: number;
  lineageCount: number;
  baseTraitIds: string[];
  lineageIds: string[];
}

export interface InventoryItem {
  id?: string;
  name: string;
  qty: number;
  weight: number;
  category: string;
  equipped?: boolean;
  sourceType?: 'weapon' | 'armor' | string;
  sourceId?: string;
  description?: string;
  desc?: string;
}

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface ArmorInfo {
  id?: string;
  name: string;
  type: string; // 'L' | 'M' | 'H' | 'Shield' | string
  ac: number;
  dexBonus: number;
  daStealth: boolean;
  weight: number;
  equipped?: boolean;
  notes?: string;
}

export interface AmmunitionItem {
  id?: string;
  name?: string;
  weaponName?: string;
  total: number;
}

export interface CharacterNote {
  id: string;
  title: string;
  content: string;
  collapsed?: boolean;
  createdAt?: number;
}

export interface CharacterData {
  name: string;
  classes: ClassLevel[];
  level: number;
  race: string;
  gender: string;
  background: string;
  deity?: string;
  alignment: string;
  size: string;
  inspiration?: number;
  appearance: {
    age: string;
    height: string;
    weight: string;
    eyes: string;
    skin: string;
    hair: string;
  };
  baseStatsLocked: boolean; // Locks base ability scores once edited to preserve calculation integrity
  baseStatsEdited: boolean;
  abilities: Record<AbilityKey, AbilityData>;
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  hitDice: HitDiePool[];
  deathSaves: {
    successes: number;
    failures: number;
  };
  armorClass: number;
  armorWorn: ArmorInfo[];
  shield: boolean;
  speed: {
    walk: number;
    climb: number;
    swim: number;
    jump: number;
    fly: number;
    other?: string;
  };
  initiative: number;
  proficiencyBonus: number;
  passives: {
    perception: number;
    insight: number;
    investigation: number;
  };
  skills: Record<string, SkillData>;
  weapons: Weapon[];
  ammunition: AmmunitionItem[];
  specialAttacks: string;
  specialDefenses: string;
  conditions: Record<string, boolean>;
  exhaustionLevel: number; // 0 to 6
  otherConditionsNotes: string;
  resources: ResourceTracker[];
  spellcasting: {
    stat: AbilityKey | string;
    saveDC: number;
    attackMod: number;
    slots: Record<string, SpellSlotLevel>;
    preparedSpellNames: string[];
    spellNotes?: Record<string, string>;
    lockedSpellNames?: string[];
  };
  features: CharacterFeature[];
  languages: string[];
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
  };
  inventory: InventoryItem[];
  currency: Currency;
  notes?: CharacterNote[];
  roleplaying?: {
    personality?: string;
    bio?: string;
  };
}
