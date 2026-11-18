import { CharacterFeature } from '../types/character';

export interface LevelProgression {
  level: number;
  proficiencyBonus: number;
  features: Omit<CharacterFeature, 'id'>[];
  spellSlots?: Record<string, number>;
}

export interface ClassDefinition {
  name: string;
  hitDie: string;
  isSpellcaster: boolean;
  casterType: 'full' | 'half' | 'third' | 'none';
  levels: Record<number, LevelProgression>;
}

export const CLASS_PROGRESSION_DATA: Record<string, ClassDefinition> = {
  Ranger: {
    name: 'Ranger',
    hitDie: 'd10',
    isSpellcaster: true,
    casterType: 'half',
    levels: {
      1: {
        level: 1,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Spellcasting (Ranger)',
            source: 'Ranger',
            description: 'You can prepare spells from the Ranger spell list. Wisdom is your spellcasting ability.',
          },
          {
            name: 'Favored Enemy',
            source: 'Ranger',
            description: 'You always have Hunter\'s Mark prepared, and can cast it without expending a spell slot a number of times equal to your Proficiency Bonus per Long Rest.',
          },
          {
            name: 'Weapon Mastery (Ranger)',
            source: 'Ranger',
            description: 'Gain mastery properties in 2 proficient weapons. You can swap them after a Long Rest.',
          },
        ],
      },
      2: {
        level: 2,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Deft Explorer',
            source: 'Ranger',
            description: 'Gain 2 languages and Expertise in one skill in which you have proficiency.',
          },
          {
            name: 'Fighting Style',
            source: 'Ranger',
            description: 'Gain a Fighting Style feat (such as Archery: +2 bonus to attack rolls made with ranged weapons).',
          },
        ],
      },
      3: {
        level: 3,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Ranger Subclass (Horizon Walker)',
            source: 'Ranger',
            description: 'Gain your Ranger Archetype: Horizon Walker. Gain Horizon Walker Magic, Detect Portal, and Planar Warrior.',
          },
          {
            name: 'Planar Warrior',
            source: 'Horizon Walker',
            description: 'As a bonus action, choose one creature within 30 ft. The next time you hit it with a weapon attack this turn, all damage becomes force damage, and it takes an extra 1d8 force damage.',
          },
        ],
      },
      4: {
        level: 4,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Ability Score Improvement / Feat (Level 4)',
            source: 'Ranger',
            description: 'Increase one ability score by 2, or two scores by 1, or choose a 5e Feat (e.g. Sharpshooter, Alert, or Fey Touched).',
          },
        ],
      },
      5: {
        level: 5,
        proficiencyBonus: 3,
        features: [
          {
            name: 'Extra Attack',
            source: 'Ranger',
            description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
          },
          {
            name: 'Rover',
            source: 'Ranger',
            description: 'Your walking speed increases by 10 ft, and you gain a climbing speed and swimming speed equal to your walking speed.',
          },
        ],
      },
      6: {
        level: 6,
        proficiencyBonus: 3,
        features: [
          {
            name: 'Favored Enemy Enhancement',
            source: 'Ranger',
            description: 'Hunter\'s Mark damage increases to 1d8, or gain an additional favored terrain.',
          },
        ],
      },
    },
  },
  Cleric: {
    name: 'Cleric',
    hitDie: 'd8',
    isSpellcaster: true,
    casterType: 'full',
    levels: {
      1: {
        level: 1,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Spellcasting (Cleric)',
            source: 'Cleric',
            description: 'You prepare a list of Cleric spells available to cast. Wisdom is your spellcasting ability.',
          },
          {
            name: 'Divine Order',
            source: 'Cleric',
            description: 'Protector (heavy armor and martial weapons) or Thaumaturge (extra cantrip and add Wis to Religion/Arcana checks).',
          },
        ],
      },
      2: {
        level: 2,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Channel Divinity',
            source: 'Cleric',
            description: 'Channel divine energy from your deity. Can use Divine Spark (heal/damage) or Turn Undead. Regain uses on a Short or Long Rest.',
          },
          {
            name: 'Turn Undead',
            source: 'Cleric',
            description: 'As an action, present your holy symbol. Each undead within 30 ft that can see/hear you must make a Wis save or be turned for 1 minute.',
          },
        ],
      },
      3: {
        level: 3,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Cleric Subclass Feature',
            source: 'Cleric',
            description: 'Gain 2nd-level domain spells and your domain-specific features.',
          },
        ],
      },
      4: {
        level: 4,
        proficiencyBonus: 2,
        features: [
          {
            name: 'Ability Score Improvement / Feat (Cleric 4)',
            source: 'Cleric',
            description: 'Increase one ability score by 2, or two scores by 1, or take a 5e Feat.',
          },
        ],
      },
    },
  },
};

// 5e Multiclass Spell Slot Table
// Level -> [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
export const MULTICLASS_SPELL_SLOTS: Record<number, number[]> = {
  1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
};
