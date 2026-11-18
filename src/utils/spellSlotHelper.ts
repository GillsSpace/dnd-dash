import { ClassLevel, SpellSlotLevel } from '../types/character';

export type CasterType = 'full' | 'half' | 'third' | 'pact' | 'none';

export interface ClassMetadata {
  name: string;
  defaultHitDie: string;
  casterType: CasterType;
  primaryStat: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
}

export const DND_2024_CLASSES: Record<string, ClassMetadata> = {
  barbarian: { name: 'Barbarian', defaultHitDie: 'd12', casterType: 'none', primaryStat: 'str' },
  bard: { name: 'Bard', defaultHitDie: 'd8', casterType: 'full', primaryStat: 'cha' },
  cleric: { name: 'Cleric', defaultHitDie: 'd8', casterType: 'full', primaryStat: 'wis' },
  druid: { name: 'Druid', defaultHitDie: 'd8', casterType: 'full', primaryStat: 'wis' },
  fighter: { name: 'Fighter', defaultHitDie: 'd10', casterType: 'none', primaryStat: 'str' },
  monk: { name: 'Monk', defaultHitDie: 'd8', casterType: 'none', primaryStat: 'dex' },
  paladin: { name: 'Paladin', defaultHitDie: 'd10', casterType: 'half', primaryStat: 'cha' },
  ranger: { name: 'Ranger', defaultHitDie: 'd10', casterType: 'half', primaryStat: 'wis' },
  rogue: { name: 'Rogue', defaultHitDie: 'd8', casterType: 'none', primaryStat: 'dex' },
  sorcerer: { name: 'Sorcerer', defaultHitDie: 'd6', casterType: 'full', primaryStat: 'cha' },
  warlock: { name: 'Warlock', defaultHitDie: 'd8', casterType: 'pact', primaryStat: 'cha' },
  wizard: { name: 'Wizard', defaultHitDie: 'd6', casterType: 'full', primaryStat: 'int' },
  artificer: { name: 'Artificer', defaultHitDie: 'd8', casterType: 'half', primaryStat: 'int' },
};

export const getCasterTypeForClass = (className: string, subclass?: string): CasterType => {
  const normClass = className.toLowerCase().trim();
  const normSub = (subclass || '').toLowerCase().trim();

  // Third casters
  if (normSub.includes('eldritch knight') || normSub.includes('arcane trickster')) {
    return 'third';
  }

  const meta = DND_2024_CLASSES[normClass];
  if (meta) return meta.casterType;

  // Custom fallback checks
  if (normClass.includes('wizard') || normClass.includes('cleric') || normClass.includes('druid') || normClass.includes('sorcerer') || normClass.includes('bard')) {
    return 'full';
  }
  if (normClass.includes('paladin') || normClass.includes('ranger') || normClass.includes('artificer')) {
    return 'half';
  }
  if (normClass.includes('warlock')) {
    return 'pact';
  }

  return 'none';
};

// D&D 2024 Full Caster / Multiclass Spell Slot Table (Levels 1 to 20)
// Array index 0-8 represents spell levels 1 to 9
export const FULL_CASTER_SLOTS: Record<number, number[]> = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6:  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8:  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9:  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// D&D 2024 Single-Class Half Caster Progression Table (Ranger & Paladin start at L1)
export const HALF_CASTER_SLOTS: Record<number, number[]> = {
  1:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  6:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  7:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  8:  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  9:  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
};

// D&D 2024 Single-Class Third Caster Table (Eldritch Knight, Arcane Trickster)
export const THIRD_CASTER_SLOTS: Record<number, number[]> = {
  1:  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  2:  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  3:  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  4:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  6:  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  7:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  8:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  9:  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  14: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  15: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  18: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  19: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  20: [4, 3, 3, 1, 0, 0, 0, 0, 0],
};

// D&D 2024 Warlock Pact Magic Slot Progression
export const WARLOCK_PACT_SLOTS: Record<number, { count: number; slotLevel: number }> = {
  1:  { count: 1, slotLevel: 1 },
  2:  { count: 2, slotLevel: 1 },
  3:  { count: 2, slotLevel: 2 },
  4:  { count: 2, slotLevel: 2 },
  5:  { count: 2, slotLevel: 3 },
  6:  { count: 2, slotLevel: 3 },
  7:  { count: 2, slotLevel: 4 },
  8:  { count: 2, slotLevel: 4 },
  9:  { count: 2, slotLevel: 5 },
  10: { count: 2, slotLevel: 5 },
  11: { count: 3, slotLevel: 5 },
  12: { count: 3, slotLevel: 5 },
  13: { count: 3, slotLevel: 5 },
  14: { count: 3, slotLevel: 5 },
  15: { count: 3, slotLevel: 5 },
  16: { count: 3, slotLevel: 5 },
  17: { count: 4, slotLevel: 5 },
  18: { count: 4, slotLevel: 5 },
  19: { count: 4, slotLevel: 5 },
  20: { count: 4, slotLevel: 5 },
};

/**
 * Calculates total spell slots across levels 1 to 9 according to D&D 2024 rules.
 * Intelligently distinguishes between:
 * - Non-Caster (0 slots)
 * - Single Caster (Full, Half, Third, or Pact Magic)
 * - Multiclass Caster (sums full caster levels, rounds half casters UP, rounds third casters DOWN)
 * - Integrates Pact Magic slots alongside regular slots.
 */
export const calculateSpellSlots = (
  classes: ClassLevel[],
  currentSlots?: Record<string, SpellSlotLevel>
): Record<string, SpellSlotLevel> => {
  const resultSlots: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Group classes by casting type
  const castingClasses = classes
    .map((c) => ({
      ...c,
      casterType: getCasterTypeForClass(c.name, c.subclass),
    }))
    .filter((c) => c.casterType !== 'none' && c.level > 0);

  const regularCasters = castingClasses.filter((c) => c.casterType !== 'pact');
  const pactCaster = castingClasses.find((c) => c.casterType === 'pact');

  // Case 1: Exactly 1 regular casting class and no pact caster -> SINGLE CASTER
  if (regularCasters.length === 1 && !pactCaster) {
    const single = regularCasters[0];
    const lvl = Math.min(20, Math.max(1, single.level));

    if (single.casterType === 'full') {
      const arr = FULL_CASTER_SLOTS[lvl] || [];
      arr.forEach((cnt, idx) => (resultSlots[idx] = cnt));
    } else if (single.casterType === 'half') {
      const arr = HALF_CASTER_SLOTS[lvl] || [];
      arr.forEach((cnt, idx) => (resultSlots[idx] = cnt));
    } else if (single.casterType === 'third') {
      const arr = THIRD_CASTER_SLOTS[lvl] || [];
      arr.forEach((cnt, idx) => (resultSlots[idx] = cnt));
    }
  } else if (regularCasters.length > 1) {
    // Case 2: Multiclassing among regular casters
    // D&D 2024 rules:
    // - Full casters: 1x level
    // - Half casters (Paladin, Ranger, Artificer): Half levels ROUND UP (ceil(lvl / 2))
    // - Third casters (Eldritch Knight, Arcane Trickster): 1/3 levels ROUND DOWN (floor(lvl / 3))
    let effectiveCasterLevel = 0;

    for (const c of regularCasters) {
      if (c.casterType === 'full') {
        effectiveCasterLevel += c.level;
      } else if (c.casterType === 'half') {
        effectiveCasterLevel += Math.ceil(c.level / 2);
      } else if (c.casterType === 'third') {
        effectiveCasterLevel += Math.floor(c.level / 3);
      }
    }

    if (effectiveCasterLevel > 0) {
      const cappedLevel = Math.min(20, Math.max(1, effectiveCasterLevel));
      const arr = FULL_CASTER_SLOTS[cappedLevel] || [];
      arr.forEach((cnt, idx) => (resultSlots[idx] = cnt));
    }
  }

  // Case 3: If Pact Magic (Warlock) is present, add pact slots
  if (pactCaster) {
    const wLvl = Math.min(20, Math.max(1, pactCaster.level));
    const pactInfo = WARLOCK_PACT_SLOTS[wLvl];
    if (pactInfo) {
      const slotIndex = pactInfo.slotLevel - 1;
      resultSlots[slotIndex] = (resultSlots[slotIndex] || 0) + pactInfo.count;
    }
  }

  // Build the Record<string, SpellSlotLevel> structure
  const formatted: Record<string, SpellSlotLevel> = {};
  for (let i = 1; i <= 9; i++) {
    const total = resultSlots[i - 1] || 0;
    const prevUsed = currentSlots?.[i.toString()]?.used || 0;
    formatted[i.toString()] = {
      total,
      used: Math.min(total, prevUsed),
    };
  }

  return formatted;
};

/**
 * Calculates standard D&D 2024 HP for a class given its hit die and level:
 * - Primary class (isFirstClass = true): Level 1 gets max die + CON mod.
 *   Levels 2+ get fixed average (Math.floor(die/2) + 1 + CON mod) per level.
 * - Multiclass (isFirstClass = false): All levels get fixed average per level.
 */
export const calculateClassDefaultHp = (
  hitDieStr: string,
  level: number,
  conMod: number,
  isFirstClass: boolean
): number => {
  const dieNum = parseInt(hitDieStr.replace(/[^0-9]/g, ''), 10) || 8;
  const avg = Math.floor(dieNum / 2) + 1; // e.g. d6->4, d8->5, d10->6, d12->7
  const perLevelHp = Math.max(1, avg + conMod);

  if (level <= 0) return 0;

  if (isFirstClass) {
    const level1Hp = Math.max(1, dieNum + conMod);
    return level1Hp + perLevelHp * (level - 1);
  } else {
    return perLevelHp * level;
  }
};

// D&D 2024 Prepared Spells progression per class level
export const FULL_CASTER_PREPARED: Record<number, number> = {
  1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15,
  11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
};

export const HALF_CASTER_PREPARED: Record<number, number> = {
  1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 9, 10: 9,
  11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 14, 18: 14, 19: 15, 20: 15,
};

export const WARLOCK_PREPARED: Record<number, number> = {
  1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10,
  11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15,
};

export const THIRD_CASTER_PREPARED: Record<number, number> = {
  1: 0, 2: 0, 3: 3, 4: 4, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7,
  11: 8, 12: 8, 13: 9, 14: 10, 15: 10, 16: 11, 17: 11, 18: 11, 19: 12, 20: 13,
};

export interface ClassPreparedSpells {
  className: string;
  subclass?: string;
  level: number;
  prepared: number;
}

/**
 * Calculates the number of prepared spells granted to each spellcasting class
 * according to official D&D 2024 rules (and Tasha's Artificer rules).
 */
export const calculateClassPreparedSpells = (
  classes: ClassLevel[],
  abilityModifiers?: Record<string, number>
): ClassPreparedSpells[] => {
  const result: ClassPreparedSpells[] = [];

  for (const c of classes || []) {
    if (!c.name || c.level <= 0) continue;
    const normName = c.name.toLowerCase().trim();
    const lvl = Math.min(20, Math.max(1, c.level));
    const casterType = getCasterTypeForClass(c.name, c.subclass);

    let prepared = 0;

    if (normName.includes('artificer')) {
      const intMod = abilityModifiers?.int ?? 0;
      prepared = Math.max(1, Math.floor(lvl / 2) + intMod);
    } else if (casterType === 'full') {
      prepared = FULL_CASTER_PREPARED[lvl] || 0;
    } else if (casterType === 'half') {
      prepared = HALF_CASTER_PREPARED[lvl] || 0;
    } else if (casterType === 'pact') {
      prepared = WARLOCK_PREPARED[lvl] || 0;
    } else if (casterType === 'third') {
      prepared = THIRD_CASTER_PREPARED[lvl] || 0;
    }

    if (prepared > 0) {
      result.push({
        className: c.name,
        subclass: c.subclass,
        level: c.level,
        prepared,
      });
    }
  }

  return result;
};
