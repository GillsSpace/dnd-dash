import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CharacterData,
  AbilityKey,
  HitDiePool,
  Weapon,
  ArmorInfo,
  CharacterFeature,
  ResourceTracker,
  ClassLevel,
  AmmunitionItem,
  InventoryItem,
  CharacterNote,
} from '../types/character';
import { Spell } from '../types/spell';
import { initialCharacter } from '../data/defaultCharacter';
import { masterSpellList } from '../data/masterSpells';
import { MULTICLASS_SPELL_SLOTS } from '../data/classProgression';
import { calculateSpellSlots, calculateClassDefaultHp } from '../utils/spellSlotHelper';
import { DND2024_WEAPONS } from '../data/dnd2024Weapons';

interface CharacterContextType {
  character: CharacterData;
  masterSpells: Spell[];
  updateCharacter: (updater: (prev: CharacterData) => CharacterData) => void;
  // Base stats lock
  updateBaseScore: (key: AbilityKey, newScore: number) => void;
  toggleBaseStatsLock: () => void;
  // Weapons
  addWeapon: (weapon: Weapon, weight?: number) => void;
  removeWeapon: (id: string) => void;
  updateWeapon: (weapon: Weapon) => void;
  setWeaponAbility: (id: string, ability: AbilityKey) => void;
  toggleWeaponMastery: (id: string) => void;
  // Ammunition
  addAmmunition: (name?: string, total?: number) => void;
  updateAmmunition: (index: number, updates: Partial<AmmunitionItem>) => void;
  removeAmmunition: (index: number) => void;
  // Armor
  addArmor: (armor: ArmorInfo) => void;
  removeArmor: (index: number) => void;
  toggleArmorEquipped: (index: number) => void;
  // Features
  addFeature: (feature: CharacterFeature) => void;
  removeFeature: (id: string) => void;
  updateFeature: (feature: CharacterFeature) => void;
  // Notes
  addNote: (title?: string, content?: string) => void;
  updateNote: (id: string, updates: Partial<CharacterNote>) => void;
  deleteNote: (id: string) => void;
  toggleNoteCollapse: (id: string) => void;
  // Class & Level management
  addClass: (newClass: { name: string; subclass?: string; level: number; hitDie: string; hp?: number }) => void;
  removeClass: (index: number) => void;
  updateClassLevel: (index: number, newLevel: number) => void;
  updateClass: (index: number, updates: Partial<ClassLevel>) => void;
  // Spells
  setSpellcastingStat: (stat: string) => void;
  togglePreparedSpell: (spellName: string) => void;
  updateSpellNote: (spellName: string, note: string) => void;
  isSpellPrepared: (spellName: string) => boolean;
  isSpellLocked: (spellName: string) => boolean;
  toggleSpellLock: (spellName: string) => void;
  castSpell: (spell: Spell, slotLevel?: number) => { success: boolean; message: string };
  toggleSpellSlot: (level: number, slotIndex: number) => void;
  adjustSpellSlotsUsed: (level: number, delta: number) => void;
  resetAllSpellSlots: () => void;
  // Vitals & Health
  adjustHp: (amount: number, isDamage?: boolean) => void;
  setTempHp: (amount: number) => void;
  useHitDie: (die: string) => void;
  updateHitDieCurrent: (index: number, current: number) => void;
  setInspiration: (points: number) => void;
  adjustResource: (resourceId: string, delta: number) => void;
  addResource: (resource: ResourceTracker) => void;
  removeResource: (id: string) => void;
  updateResource: (resource: ResourceTracker) => void;
  // Conditions
  toggleCondition: (condName: string) => void;
  setExhaustionLevel: (level: number) => void;
  // Rest mechanics
  shortRest: () => void;
  longRest: () => void;
  // Custom spell & JSON
  addCustomSpell: (spell: Omit<Spell, 'id'>) => void;
  exportCharacterJson: (customFilename?: string) => void;
  importCharacterJson: (jsonString: string) => boolean;
  resetToTemplate: () => void;
  createNewCharacter: () => void;
  // File Management & Storage
  currentSaveFilename: string;
  setCurrentSaveFilename: (name: string) => void;
  saveToFileSystemPicker: (customFilename?: string) => Promise<boolean>;
  loadFromFileSystemPicker: () => Promise<boolean>;
  // Formulas
  getAbilityMod: (key: AbilityKey) => number;
  getSaveBonus: (key: AbilityKey) => number;
  getSkillBonus: (skillKey: string) => number;
  saveDC: number;
  attackBonus: number;
}

const STORAGE_KEY_CHAR = 'dnd_dash_character_v4';
const STORAGE_KEY_SPELLS = 'dnd_dash_master_spells_2024_v3';

export const calculateArmorClass = (
  armorList: ArmorInfo[] = [],
  dexMod: number,
  extra?: {
    conMod?: number;
    wisMod?: number;
    unarmoredFormula?: 'standard' | 'barbarian' | 'monk' | 'mageArmor' | 'custom';
    customBaseAc?: number;
    acBonus?: number;
  }
): number => {
  const equipped = (armorList || []).filter((a) => a.equipped !== false);
  const bodyArmor = equipped.find((a) =>
    ['L', 'M', 'H', 'LIGHT', 'MEDIUM', 'HEAVY'].includes(a.type.toUpperCase())
  );
  const shield = equipped.find((a) => a.type.toLowerCase().includes('shield'));

  let baseAc = 10 + dexMod;
  if (!bodyArmor) {
    const formula = extra?.unarmoredFormula || 'standard';
    if (formula === 'barbarian') {
      baseAc = 10 + dexMod + (extra?.conMod ?? 0);
    } else if (formula === 'monk') {
      baseAc = 10 + dexMod + (extra?.wisMod ?? 0);
    } else if (formula === 'mageArmor') {
      baseAc = 13 + dexMod;
    } else if (formula === 'custom' && extra?.customBaseAc !== undefined) {
      baseAc = extra.customBaseAc + dexMod;
    }
  } else {
    const t = bodyArmor.type.toUpperCase();
    if (t === 'L' || t === 'LIGHT') {
      baseAc = bodyArmor.ac + dexMod;
    } else if (t === 'M' || t === 'MEDIUM') {
      baseAc = bodyArmor.ac + Math.min(2, dexMod);
    } else if (t === 'H' || t === 'HEAVY') {
      baseAc = bodyArmor.ac;
    } else {
      baseAc = bodyArmor.ac + (bodyArmor.dexBonus || 0);
    }
  }

  const shieldAc = shield ? (shield.ac || 2) : 0;
  const bonus = extra?.acBonus || 0;
  return baseAc + shieldAc + bonus;
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<CharacterData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHAR);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load character from localStorage', e);
    }
    return initialCharacter;
  });

  const [masterSpells, setMasterSpells] = useState<Spell[]>(() => {
    try {
      // Purge legacy storage keys that contain obsolete 2014 spells without fullText
      localStorage.removeItem('dnd_dash_master_spells_v3');
      localStorage.removeItem('dnd_dash_master_spells_v2');
      localStorage.removeItem('dnd_dash_master_spells');

      const saved = localStorage.getItem(STORAGE_KEY_SPELLS);
      if (saved) {
        const parsed: Spell[] = JSON.parse(saved);
        // Retain only user-created custom spells (prefixed with 'custom-')
        const customSpells = parsed.filter((s) => s.id && s.id.startsWith('custom-'));
        return [...customSpells, ...masterSpellList];
      }
    } catch (e) {
      console.error('Failed to load master spells from localStorage', e);
    }
    return masterSpellList;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHAR, JSON.stringify(character));
    } catch (e) {
      console.error('Failed to save character to localStorage', e);
    }
  }, [character]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPELLS, JSON.stringify(masterSpells));
    } catch (e) {
      console.error('Failed to save spells to localStorage', e);
    }
  }, [masterSpells]);

  // Synchronize any custom spells stored on character into masterSpells (and persist to localStorage)
  useEffect(() => {
    if (character.customSpells && Array.isArray(character.customSpells) && character.customSpells.length > 0) {
      setMasterSpells((prevMaster) => {
        const existingNames = new Set(prevMaster.map((s) => s.name.toLowerCase()));
        const toAdd = character.customSpells!.filter(
          (cs) => !existingNames.has(cs.name.toLowerCase())
        );
        if (toAdd.length > 0) {
          return [...toAdd, ...prevMaster];
        }
        return prevMaster;
      });
    }
  }, [character.customSpells]);

  // Track active save file in project /saves folder
  const [currentSaveFilename, setCurrentSaveFilename] = useState<string>(() => {
    return localStorage.getItem('dnd_current_save_filename') || 'character_sheet.json';
  });

  useEffect(() => {
    if (currentSaveFilename) {
      localStorage.setItem('dnd_current_save_filename', currentSaveFilename);
    }
  }, [currentSaveFilename]);

  // Synchronize initiative dynamically with Dexterity modifier and custom bonus
  useEffect(() => {
    const dexScore = character.abilities?.dex?.score ?? 10;
    const dexMod = Math.floor((dexScore - 10) / 2);
    const customBonus = character.initiativeBonus || 0;
    const expectedInit = dexMod + customBonus;

    if (character.initiative !== expectedInit) {
      setCharacter((prev) => ({
        ...prev,
        initiative: expectedInit,
      }));
    }
  }, [
    character.abilities?.dex?.score,
    character.initiativeBonus,
    character.initiative,
  ]);

  // Synchronize passives dynamically with skills and custom bonuses
  useEffect(() => {
    const perceptionBonus = character.passives?.perceptionBonus || 0;
    const insightBonus = character.passives?.insightBonus || 0;
    const investigationBonus = character.passives?.investigationBonus || 0;

    const expectedPerception = 10 + getSkillBonus('perception') + perceptionBonus;
    const expectedInsight = 10 + getSkillBonus('insight') + insightBonus;
    const expectedInvestigation = 10 + getSkillBonus('investigation') + investigationBonus;

    if (
      character.passives?.perception !== expectedPerception ||
      character.passives?.insight !== expectedInsight ||
      character.passives?.investigation !== expectedInvestigation
    ) {
      setCharacter((prev) => ({
        ...prev,
        passives: {
          ...prev.passives,
          perception: expectedPerception,
          insight: expectedInsight,
          investigation: expectedInvestigation,
        },
      }));
    }
  }, [
    character.skills?.perception?.prof,
    character.skills?.insight?.prof,
    character.skills?.investigation?.prof,
    character.abilities?.wis?.score,
    character.abilities?.int?.score,
    character.proficiencyBonus,
    character.passives?.perceptionBonus,
    character.passives?.insightBonus,
    character.passives?.investigationBonus,
    character.passives?.perception,
    character.passives?.insight,
    character.passives?.investigation,
  ]);

  // Ensure multiclass Hit Dice pools are always present and synchronized with classes
  useEffect(() => {
    if (!character.classes || character.classes.length === 0) return;

    const classNames = character.classes.map((c) => c.name.toLowerCase());
    const hitDiceSources = (character.hitDice || []).map((hd) => (hd.source || '').toLowerCase());

    const isMissingClass = character.classes.some(
      (c) => !hitDiceSources.includes(c.name.toLowerCase())
    );
    const hasOrphan = (character.hitDice || []).some(
      (hd) => hd.source && !classNames.includes(hd.source.toLowerCase())
    );

    if (isMissingClass || hasOrphan || character.classes.length !== (character.hitDice || []).length) {
      setCharacter((prev) => {
        const syncedHitDice: HitDiePool[] = prev.classes.map((c) => {
          const existing = (prev.hitDice || []).find(
            (hd) => (hd.source || '').toLowerCase() === c.name.toLowerCase()
          );
          const safeDie = c.hitDie ? (c.hitDie.startsWith('d') ? c.hitDie : `d${c.hitDie}`) : 'd8';
          return {
            die: safeDie,
            total: c.level,
            current: existing ? Math.min(c.level, existing.current) : c.level,
            source: c.name,
          };
        });
        return {
          ...prev,
          hitDice: syncedHitDice,
        };
      });
    }
  }, [character.classes]);

  // Ensure all weapons and armor appear in inventory, and cleanup removed weapons/armor
  useEffect(() => {
    const weapons = character.weapons || [];
    const armorList = character.armorWorn || [];
    const inventory = character.inventory || [];

    let hasChanges = false;
    let updatedInventory = [...inventory];

    // Check weapons: each weapon must show up under inventory items
    weapons.forEach((weapon) => {
      const exists = updatedInventory.some(
        (it) => it.sourceType === 'weapon' && it.sourceId === weapon.id
      );

      if (!exists) {
        const initialIdx = updatedInventory.findIndex(
          (it) =>
            !it.sourceType &&
            it.category === 'Weapon' &&
            (it.name.toLowerCase() === weapon.name.toLowerCase() ||
              it.name.toLowerCase().startsWith(weapon.name.toLowerCase()))
        );

        if (initialIdx >= 0) {
          updatedInventory[initialIdx] = {
            ...updatedInventory[initialIdx],
            sourceId: weapon.id,
            sourceType: 'weapon',
          };
          hasChanges = true;
        } else {
          const preset = DND2024_WEAPONS.find((w) => w.name.toLowerCase() === weapon.name.toLowerCase());
          const weight = preset ? parseFloat(preset.weight.replace(/[^0-9.]/g, '')) || 2 : 2;
          updatedInventory.push({
            id: `inv-w-${weapon.id}`,
            name: weapon.name,
            qty: 1,
            weight,
            category: 'Weapon',
            sourceType: 'weapon',
            sourceId: weapon.id,
          });
          hasChanges = true;
        }
      }
    });

    // Check armor: each armor must show up under inventory items
    armorList.forEach((armor, idx) => {
      const armorId = armor.id || `armor-${idx + 1}`;
      const exists = updatedInventory.some(
        (it) => it.sourceType === 'armor' && it.sourceId === armorId
      );

      if (!exists) {
        const initialIdx = updatedInventory.findIndex(
          (it) =>
            !it.sourceType &&
            it.category === 'Armor' &&
            (it.name.toLowerCase() === armor.name.toLowerCase() ||
              it.name.toLowerCase().startsWith(armor.name.toLowerCase()))
        );

        if (initialIdx >= 0) {
          updatedInventory[initialIdx] = {
            ...updatedInventory[initialIdx],
            sourceId: armorId,
            sourceType: 'armor',
          };
          hasChanges = true;
        } else {
          updatedInventory.push({
            id: `inv-a-${armorId}`,
            name: armor.name,
            qty: 1,
            weight: armor.weight || 0,
            category: 'Armor',
            sourceType: 'armor',
            sourceId: armorId,
          });
          hasChanges = true;
        }
      }
    });

    // Remove any orphaned weapon/armor items whose source weapon/armor was deleted
    const filteredInventory = updatedInventory.filter((it) => {
      if (it.sourceType === 'weapon' && it.sourceId) {
        return weapons.some((w) => w.id === it.sourceId);
      }
      if (it.sourceType === 'armor' && it.sourceId) {
        return armorList.some((a, idx) => (a.id || `armor-${idx + 1}`) === it.sourceId);
      }
      return true;
    });

    if (filteredInventory.length !== updatedInventory.length) {
      hasChanges = true;
      updatedInventory = filteredInventory;
    }

    if (hasChanges) {
      setCharacter((prev) => ({
        ...prev,
        inventory: updatedInventory,
      }));
    }
  }, [character.weapons, character.armorWorn]);

  const updateCharacter = (updater: (prev: CharacterData) => CharacterData) => {
    setCharacter((prev) => updater(prev));
  };

  const getAbilityMod = (key: AbilityKey): number => {
    const score = character.abilities[key]?.score ?? 10;
    return Math.floor((score - 10) / 2);
  };

  const getSaveBonus = (key: AbilityKey): number => {
    const mod = getAbilityMod(key);
    const isProf = character.abilities[key]?.saveProf ?? false;
    const globalBonus = character.globalSaveBonus || 0;
    const statBonus = character.saveBonuses?.[key] || 0;
    return mod + (isProf ? character.proficiencyBonus : 0) + globalBonus + statBonus;
  };

  const getSkillBonus = (skillKey: string): number => {
    const skill = character.skills[skillKey];
    if (!skill) return 0;
    const mod = getAbilityMod(skill.ability);
    if (skill.prof === 'expert') return mod + character.proficiencyBonus * 2;
    if (skill.prof === 'prof') return mod + character.proficiencyBonus;
    return mod;
  };

  // Base Stats (Always unlocked)
  const updateBaseScore = (key: AbilityKey, newScore: number) => {
    updateCharacter((prev) => {
      const updatedAbilities = {
        ...prev.abilities,
        [key]: {
          ...prev.abilities[key],
          score: newScore,
        },
      };
      const dexScore = key === 'dex' ? newScore : (prev.abilities.dex?.score ?? 10);
      const dexMod = Math.floor((dexScore - 10) / 2);
      const conScore = key === 'con' ? newScore : (prev.abilities.con?.score ?? 10);
      const conMod = Math.floor((conScore - 10) / 2);
      const wisScore = key === 'wis' ? newScore : (prev.abilities.wis?.score ?? 10);
      const wisMod = Math.floor((wisScore - 10) / 2);
      const newAc = calculateArmorClass(prev.armorWorn, dexMod, {
        conMod,
        wisMod,
        unarmoredFormula: prev.unarmoredFormula,
        customBaseAc: prev.customBaseAc,
        acBonus: prev.acBonus,
      });
      const customBonus = prev.initiativeBonus || 0;

      return {
        ...prev,
        baseStatsEdited: true,
        baseStatsLocked: false,
        abilities: updatedAbilities,
        armorClass: newAc,
        initiative: dexMod + customBonus,
      };
    });
  };

  const toggleBaseStatsLock = () => {
    updateCharacter((prev) => ({
      ...prev,
      baseStatsLocked: false,
    }));
  };

  // Weapon controls
  const addWeapon = (weapon: Weapon, weight?: number) => {
    updateCharacter((prev) => {
      const preset = DND2024_WEAPONS.find(
        (w) => w.name.toLowerCase() === weapon.name.toLowerCase()
      );
      const parsedWeight = preset
        ? parseFloat(preset.weight.replace(/[^0-9.]/g, '')) || 2
        : 2;
      const finalWeight = weight ?? parsedWeight;

      const newInventoryItem: InventoryItem = {
        id: `inv-w-${Date.now()}`,
        name: weapon.name,
        qty: 1,
        weight: finalWeight,
        category: 'Weapon',
        sourceType: 'weapon',
        sourceId: weapon.id,
      };

      return {
        ...prev,
        weapons: [...prev.weapons, weapon],
        inventory: [...prev.inventory, newInventoryItem],
      };
    });
  };

  const removeWeapon = (id: string) => {
    updateCharacter((prev) => {
      const weaponToRemove = prev.weapons.find((w) => w.id === id);
      const updatedWeapons = prev.weapons.filter((w) => w.id !== id);

      let updatedInventory = prev.inventory;
      if (weaponToRemove) {
        const wNameLower = weaponToRemove.name.toLowerCase().trim();
        let removed = false;
        updatedInventory = prev.inventory.filter((item) => {
          if (removed) return true;
          if (item.sourceId && item.sourceId === id) {
            removed = true;
            return false;
          }
          if (
            (item.category?.toLowerCase() === 'weapon' || item.sourceType === 'weapon') &&
            (item.name.toLowerCase().trim() === wNameLower ||
              item.name.toLowerCase().trim().startsWith(wNameLower) ||
              wNameLower.startsWith(item.name.toLowerCase().trim()))
          ) {
            removed = true;
            return false;
          }
          return true;
        });
      }

      return {
        ...prev,
        weapons: updatedWeapons,
        inventory: updatedInventory,
      };
    });
  };

  const updateWeapon = (weapon: Weapon) => {
    updateCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((w) => (w.id === weapon.id ? weapon : w)),
    }));
  };

  const setWeaponAbility = (id: string, ability: AbilityKey) => {
    updateCharacter((prev) => {
      const score = prev.abilities[ability]?.score ?? 10;
      const mod = Math.floor((score - 10) / 2);
      const hitBonus = mod + prev.proficiencyBonus;
      const toHitString = hitBonus >= 0 ? `+${hitBonus}` : `${hitBonus}`;

      return {
        ...prev,
        weapons: prev.weapons.map((w) => {
          if (w.id !== id) return w;
          const baseDie = w.baseDamage || w.damage.replace(/([+-]\d+)$/, '').trim() || '1d8';
          let damageFormula = baseDie;
          if (baseDie === '1') {
            damageFormula = `${1 + mod}`;
          } else if (mod !== 0) {
            damageFormula = `${baseDie}${mod > 0 ? `+${mod}` : `${mod}`}`;
          }

          return {
            ...w,
            ability,
            baseDamage: baseDie,
            toHit: toHitString,
            damage: damageFormula,
          };
        }),
      };
    });
  };

  const toggleWeaponMastery = (id: string) => {
    updateCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((w) =>
        w.id === id ? { ...w, masteryActive: !w.masteryActive } : w
      ),
    }));
  };

  // Ammunition controls
  const addAmmunition = (name: string = 'Arrows', total: number = 20) => {
    updateCharacter((prev) => ({
      ...prev,
      ammunition: [
        ...(prev.ammunition || []),
        { id: `ammo-${Date.now()}`, name, weaponName: name, total },
      ],
    }));
  };

  const updateAmmunition = (index: number, updates: Partial<AmmunitionItem>) => {
    updateCharacter((prev) => ({
      ...prev,
      ammunition: (prev.ammunition || []).map((item, i) =>
        i === index
          ? {
              ...item,
              ...updates,
              weaponName: updates.name ?? updates.weaponName ?? item.weaponName ?? item.name,
              name: updates.name ?? updates.weaponName ?? item.name ?? item.weaponName,
            }
          : item
      ),
    }));
  };

  const removeAmmunition = (index: number) => {
    updateCharacter((prev) => ({
      ...prev,
      ammunition: (prev.ammunition || []).filter((_, i) => i !== index),
    }));
  };

  // Armor controls
  const addArmor = (armor: ArmorInfo) => {
    updateCharacter((prev) => {
      const armorId = armor.id || `armor-${Date.now()}`;
      const armorWithId = { ...armor, id: armorId };
      const dexMod = Math.floor(((prev.abilities.dex?.score ?? 10) - 10) / 2);
      const updated = [...(prev.armorWorn || []), armorWithId];
      const newAc = calculateArmorClass(updated, dexMod);
      const hasShield = updated.some(
        (a) => (a.equipped !== false) && a.type.toLowerCase().includes('shield')
      );

      const newInventoryItem: InventoryItem = {
        id: `inv-a-${Date.now()}`,
        name: armor.name,
        qty: 1,
        weight: armor.weight || 0,
        category: 'Armor',
        sourceType: 'armor',
        sourceId: armorId,
      };

      return {
        ...prev,
        armorWorn: updated,
        shield: hasShield,
        armorClass: newAc,
        inventory: [...prev.inventory, newInventoryItem],
      };
    });
  };

  const removeArmor = (index: number) => {
    updateCharacter((prev) => {
      const armorList = prev.armorWorn || [];
      const armorToRemove = armorList[index];
      const updated = armorList.filter((_, i) => i !== index);
      const dexMod = Math.floor(((prev.abilities.dex?.score ?? 10) - 10) / 2);
      const newAc = calculateArmorClass(updated, dexMod);
      const hasShield = updated.some(
        (a) => (a.equipped !== false) && a.type.toLowerCase().includes('shield')
      );

      let updatedInventory = prev.inventory;
      if (armorToRemove) {
        const aNameLower = armorToRemove.name.toLowerCase().trim();
        let removed = false;
        updatedInventory = prev.inventory.filter((item) => {
          if (removed) return true;
          if (armorToRemove.id && item.sourceId && item.sourceId === armorToRemove.id) {
            removed = true;
            return false;
          }
          if (
            (item.category?.toLowerCase() === 'armor' || item.sourceType === 'armor') &&
            (item.name.toLowerCase().trim() === aNameLower ||
              item.name.toLowerCase().trim().startsWith(aNameLower) ||
              aNameLower.startsWith(item.name.toLowerCase().trim()))
          ) {
            removed = true;
            return false;
          }
          return true;
        });
      }

      return {
        ...prev,
        armorWorn: updated,
        shield: hasShield,
        armorClass: newAc,
        inventory: updatedInventory,
      };
    });
  };

  const toggleArmorEquipped = (index: number) => {
    updateCharacter((prev) => {
      const dexMod = Math.floor(((prev.abilities.dex?.score ?? 10) - 10) / 2);
      const updated = (prev.armorWorn || []).map((a, i) =>
        i === index ? { ...a, equipped: a.equipped === false ? true : false } : a
      );
      const newAc = calculateArmorClass(updated, dexMod);
      const hasShield = updated.some(
        (a) => (a.equipped !== false) && a.type.toLowerCase().includes('shield')
      );
      return {
        ...prev,
        armorWorn: updated,
        shield: hasShield,
        armorClass: newAc,
      };
    });
  };

  // Feature controls
  const addFeature = (feature: CharacterFeature) => {
    updateCharacter((prev) => ({
      ...prev,
      features: [...prev.features, feature],
    }));
  };

  const removeFeature = (id: string) => {
    updateCharacter((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  const updateFeature = (feature: CharacterFeature) => {
    updateCharacter((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === feature.id ? feature : f)),
    }));
  };

  // Notes Management
  const addNote = (title: string = 'New Note', content: string = '') => {
    updateCharacter((prev) => ({
      ...prev,
      notes: [
        ...(prev.notes || []),
        {
          id: `note-${Date.now()}`,
          title: title.trim() || 'New Note',
          content,
          collapsed: false,
          createdAt: Date.now(),
        },
      ],
    }));
  };

  const updateNote = (id: string, updates: Partial<CharacterNote>) => {
    updateCharacter((prev) => ({
      ...prev,
      notes: (prev.notes || []).map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  };

  const deleteNote = (id: string) => {
    updateCharacter((prev) => ({
      ...prev,
      notes: (prev.notes || []).filter((n) => n.id !== id),
    }));
  };

  const toggleNoteCollapse = (id: string) => {
    updateCharacter((prev) => ({
      ...prev,
      notes: (prev.notes || []).map((n) => (n.id === id ? { ...n, collapsed: !n.collapsed } : n)),
    }));
  };

  // Class & Level Management System (D&D 2024 Rules)
  const recalculateFromClasses = (
    prev: CharacterData,
    updatedClasses: ClassLevel[]
  ): CharacterData => {
    // 1. Total Level
    const totalLevel = Math.max(1, updatedClasses.reduce((sum, c) => sum + (c.level || 0), 0));

    // 2. Proficiency Bonus based on total level
    const profBonus = Math.floor((totalLevel - 1) / 4) + 2;

    // 3. Con modifier for HP calculations
    const conScore = prev.abilities.con?.score ?? 10;
    const conMod = Math.floor((conScore - 10) / 2);

    // 4. Classes with HP and ConBonus populated
    const finalClasses = updatedClasses.map((c, idx) => {
      const isFirst = idx === 0;
      const defaultHp = calculateClassDefaultHp(c.hitDie, c.level, conMod, isFirst);
      return {
        ...c,
        conBonus: conMod,
        hp: c.hp !== undefined && c.hp > 0 ? c.hp : defaultHp,
      };
    });

    // 5. Total HP Max
    const newMaxHp = finalClasses.reduce((sum, c) => sum + (c.hp || 0), 0);
    const hpDiff = newMaxHp - prev.hp.max;
    const newCurrentHp = Math.max(1, Math.min(newMaxHp, prev.hp.current + hpDiff));

    // 6. Hit Dice Pool
    const updatedHitDice: HitDiePool[] = finalClasses.map((c) => {
      const existingPool = prev.hitDice.find(
        (hd) => hd.source.toLowerCase() === c.name.toLowerCase()
      );
      const prevCurrent = existingPool?.current ?? c.level;
      return {
        die: c.hitDie.startsWith('d') ? c.hitDie : `d${c.hitDie}`,
        total: c.level,
        current: Math.min(c.level, Math.max(0, prevCurrent)),
        source: c.name,
      };
    });

    // 7. Spell Slots (Single Caster vs Multiclass Caster via 2024 rules)
    const newSlots = calculateSpellSlots(finalClasses, prev.spellcasting.slots);

    // 8. Spell Save DC and Attack Mod
    const spellStat = (prev.spellcasting.stat.toLowerCase() as AbilityKey) || 'wis';
    const spellStatScore = prev.abilities[spellStat]?.score ?? 10;
    const spellStatMod = Math.floor((spellStatScore - 10) / 2);
    const dcBonus = prev.spellcasting?.dcBonus || 0;
    const attackBonusMod = prev.spellcasting?.attackBonusMod || 0;
    const saveDC = 8 + profBonus + spellStatMod + dcBonus;
    const attackMod = profBonus + spellStatMod + attackBonusMod;

    return {
      ...prev,
      level: totalLevel,
      proficiencyBonus: profBonus,
      classes: finalClasses,
      hp: {
        ...prev.hp,
        max: newMaxHp,
        current: newCurrentHp,
      },
      hitDice: updatedHitDice,
      spellcasting: {
        ...prev.spellcasting,
        saveDC,
        attackMod,
        slots: newSlots,
      },
    };
  };

  const addClass = (newClass: {
    name: string;
    subclass?: string;
    level: number;
    hitDie: string;
    hp?: number;
  }) => {
    updateCharacter((prev) => {
      const conScore = prev.abilities.con?.score ?? 10;
      const conMod = Math.floor((conScore - 10) / 2);
      const isFirst = prev.classes.length === 0;
      const calculatedHp =
        newClass.hp ??
        calculateClassDefaultHp(newClass.hitDie, newClass.level, conMod, isFirst);

      const added: ClassLevel = {
        name: newClass.name,
        subclass: newClass.subclass || '',
        level: Math.max(1, newClass.level || 1),
        hitDie: newClass.hitDie,
        conBonus: conMod,
        hp: calculatedHp,
      };

      return recalculateFromClasses(prev, [...prev.classes, added]);
    });
  };

  const removeClass = (index: number) => {
    updateCharacter((prev) => {
      if (prev.classes.length <= 1) {
        alert('A character must have at least one class.');
        return prev;
      }
      const updatedClasses = prev.classes.filter((_, idx) => idx !== index);
      return recalculateFromClasses(prev, updatedClasses);
    });
  };

  const updateClassLevel = (index: number, newLevel: number) => {
    updateCharacter((prev) => {
      const safeLevel = Math.max(1, newLevel);
      const updatedClasses = prev.classes.map((c, idx) => {
        if (idx === index) {
          const conScore = prev.abilities.con?.score ?? 10;
          const conMod = Math.floor((conScore - 10) / 2);
          const newHp = calculateClassDefaultHp(c.hitDie, safeLevel, conMod, idx === 0);
          return {
            ...c,
            level: safeLevel,
            hp: newHp,
          };
        }
        return c;
      });
      return recalculateFromClasses(prev, updatedClasses);
    });
  };

  const updateClass = (index: number, updates: Partial<ClassLevel>) => {
    updateCharacter((prev) => {
      const updatedClasses = prev.classes.map((c, idx) => {
        if (idx === index) {
          return {
            ...c,
            ...updates,
          };
        }
        return c;
      });
      return recalculateFromClasses(prev, updatedClasses);
    });
  };

  // Conditions
  const toggleCondition = (condName: string) => {
    updateCharacter((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [condName]: !prev.conditions[condName],
      },
    }));
  };

  const setExhaustionLevel = (level: number) => {
    updateCharacter((prev) => ({
      ...prev,
      exhaustionLevel: Math.max(0, Math.min(6, level)),
    }));
  };

  // Spellcasting metrics
  const spellAbilityKey = (character.spellcasting.stat.toLowerCase() as AbilityKey) || 'wis';
  const spellMod = getAbilityMod(spellAbilityKey);
  const dcBonus = character.spellcasting?.dcBonus || 0;
  const attackBonusMod = character.spellcasting?.attackBonusMod || 0;
  const saveDC = 8 + character.proficiencyBonus + spellMod + dcBonus;
  const attackBonus = character.proficiencyBonus + spellMod + attackBonusMod;

  const setSpellcastingStat = (stat: string) => {
    updateCharacter((prev) => {
      const normStat = stat.toUpperCase().trim();
      const spellAbilityKey = (normStat.toLowerCase() as AbilityKey) || 'int';
      const spellStatScore = prev.abilities[spellAbilityKey]?.score ?? 10;
      const spellStatMod = Math.floor((spellStatScore - 10) / 2);
      const dcBonus = prev.spellcasting?.dcBonus || 0;
      const attackBonusMod = prev.spellcasting?.attackBonusMod || 0;
      const saveDC = 8 + prev.proficiencyBonus + spellStatMod + dcBonus;
      const attackMod = prev.proficiencyBonus + spellStatMod + attackBonusMod;

      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          stat: normStat,
          saveDC,
          attackMod,
        },
      };
    });
  };

  const isSpellPrepared = (spellName: string): boolean => {
    return (character.spellcasting?.preparedSpellNames || []).some(
      (n) => n.trim().toLowerCase() === spellName.trim().toLowerCase()
    );
  };

  const isSpellLocked = (spellName: string): boolean => {
    return (character.spellcasting?.lockedSpellNames || []).some(
      (n) => n.trim().toLowerCase() === spellName.trim().toLowerCase()
    );
  };

  const toggleSpellLock = (spellName: string) => {
    updateCharacter((prev) => {
      const currentLocked = prev.spellcasting?.lockedSpellNames || [];
      const normalized = spellName.trim().toLowerCase();
      const exists = currentLocked.some((n) => n.trim().toLowerCase() === normalized);

      const newLocked = exists
        ? currentLocked.filter((n) => n.trim().toLowerCase() !== normalized)
        : [...currentLocked, spellName.trim()];

      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          lockedSpellNames: newLocked,
        },
      };
    });
  };

  const togglePreparedSpell = (spellName: string) => {
    updateCharacter((prev) => {
      const currentList = prev.spellcasting?.preparedSpellNames || [];
      const normalized = spellName.trim().toLowerCase();
      const exists = currentList.some((n) => n.trim().toLowerCase() === normalized);

      // If spell is locked, prevent removal
      const currentLocked = prev.spellcasting?.lockedSpellNames || [];
      const isLocked = currentLocked.some((n) => n.trim().toLowerCase() === normalized);
      if (exists && isLocked) {
        return prev;
      }

      const newList = exists
        ? currentList.filter((n) => n.trim().toLowerCase() !== normalized)
        : [...currentList, spellName.trim()];

      const newSpellNotes = { ...(prev.spellcasting?.spellNotes || {}) };
      if (exists) {
        delete newSpellNotes[spellName];
        Object.keys(newSpellNotes).forEach((k) => {
          if (k.trim().toLowerCase() === normalized) {
            delete newSpellNotes[k];
          }
        });
      }

      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          preparedSpellNames: newList,
          spellNotes: newSpellNotes,
        },
      };
    });
  };

  const updateSpellNote = (spellName: string, note: string) => {
    updateCharacter((prev) => ({
      ...prev,
      spellcasting: {
        ...prev.spellcasting,
        spellNotes: {
          ...(prev.spellcasting.spellNotes || {}),
          [spellName]: note,
        },
      },
    }));
  };

  const toggleSpellSlot = (level: number, slotIndex: number) => {
    updateCharacter((prev) => {
      const slotData = prev.spellcasting.slots[level.toString()];
      if (!slotData) return prev;

      const currentUsed = slotData.used;
      const newUsed = slotIndex < currentUsed ? slotIndex : currentUsed + 1;
      const clampedUsed = Math.max(0, Math.min(slotData.total, newUsed));

      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          slots: {
            ...prev.spellcasting.slots,
            [level.toString()]: {
              ...slotData,
              used: clampedUsed,
            },
          },
        },
      };
    });
  };

  const adjustSpellSlotsUsed = (level: number, delta: number) => {
    updateCharacter((prev) => {
      const slotData = prev.spellcasting.slots[level.toString()];
      if (!slotData) return prev;
      const newUsed = Math.max(0, Math.min(slotData.total, slotData.used + delta));
      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          slots: {
            ...prev.spellcasting.slots,
            [level.toString()]: {
              ...slotData,
              used: newUsed,
            },
          },
        },
      };
    });
  };

  const resetAllSpellSlots = () => {
    updateCharacter((prev) => {
      const newSlots = { ...prev.spellcasting.slots };
      Object.keys(newSlots).forEach((lvl) => {
        newSlots[lvl] = { ...newSlots[lvl], used: 0 };
      });
      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          slots: newSlots,
        },
      };
    });
  };

  const castSpell = (spell: Spell, slotLevel?: number): { success: boolean; message: string } => {
    if (spell.level === 0) {
      return { success: true, message: `Cast ${spell.name} (Cantrip, no slot needed).` };
    }

    const castLevel = slotLevel ?? spell.level;
    const slotData = character.spellcasting.slots[castLevel.toString()];

    if (!slotData || slotData.total === 0) {
      return { success: false, message: `No level ${castLevel} spell slots available!` };
    }

    if (slotData.used >= slotData.total) {
      return { success: false, message: `All level ${castLevel} slots are expended!` };
    }

    updateCharacter((prev) => {
      const current = prev.spellcasting.slots[castLevel.toString()];
      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          slots: {
            ...prev.spellcasting.slots,
            [castLevel.toString()]: {
              ...current,
              used: current.used + 1,
            },
          },
        },
      };
    });

    return {
      success: true,
      message: `Cast ${spell.name} using a Level ${castLevel} slot (${slotData.total - (slotData.used + 1)} slots remaining).`,
    };
  };

  const adjustHp = (amount: number, isDamage: boolean = true) => {
    updateCharacter((prev) => {
      let currentHp = prev.hp.current;
      let tempHp = prev.hp.temp;

      if (isDamage) {
        if (tempHp > 0) {
          if (amount <= tempHp) {
            tempHp -= amount;
            amount = 0;
          } else {
            amount -= tempHp;
            tempHp = 0;
          }
        }
        currentHp = Math.max(0, currentHp - amount);
      } else {
        currentHp = Math.min(prev.hp.max, currentHp + amount);
      }

      return {
        ...prev,
        hp: {
          ...prev.hp,
          current: currentHp,
          temp: tempHp,
        },
      };
    });
  };

  const setTempHp = (amount: number) => {
    updateCharacter((prev) => ({
      ...prev,
      hp: {
        ...prev.hp,
        temp: Math.max(0, amount),
      },
    }));
  };

  const useHitDie = (die: string) => {
    updateCharacter((prev) => ({
      ...prev,
      hitDice: prev.hitDice.map((hd) =>
        hd.die === die && hd.current > 0 ? { ...hd, current: hd.current - 1 } : hd
      ),
    }));
  };

  const updateHitDieCurrent = (index: number, current: number) => {
    updateCharacter((prev) => ({
      ...prev,
      hitDice: prev.hitDice.map((hd, i) =>
        i === index ? { ...hd, current: Math.max(0, current) } : hd
      ),
    }));
  };

  const setInspiration = (points: number) => {
    updateCharacter((prev) => ({
      ...prev,
      inspiration: Math.max(0, points),
    }));
  };

  const adjustResource = (resourceId: string, delta: number) => {
    updateCharacter((prev) => ({
      ...prev,
      resources: prev.resources.map((res) => {
        if (res.id !== resourceId) return res;
        const maxVal = res.useProfBonus ? prev.proficiencyBonus : res.max;
        const newCur = Math.max(0, Math.min(maxVal, res.current + delta));
        return { ...res, max: maxVal, current: newCur };
      }),
    }));
  };

  const addResource = (resource: ResourceTracker) => {
    updateCharacter((prev) => {
      const maxVal = resource.useProfBonus ? prev.proficiencyBonus : resource.max;
      return {
        ...prev,
        resources: [
          ...prev.resources,
          {
            ...resource,
            max: maxVal,
            current: resource.current !== undefined ? resource.current : maxVal,
          },
        ],
      };
    });
  };

  const removeResource = (id: string) => {
    updateCharacter((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== id),
    }));
  };

  const updateResource = (resource: ResourceTracker) => {
    updateCharacter((prev) => {
      const maxVal = resource.useProfBonus ? prev.proficiencyBonus : resource.max;
      return {
        ...prev,
        resources: prev.resources.map((r) =>
          r.id === resource.id
            ? {
                ...resource,
                max: maxVal,
                current: Math.min(resource.current, maxVal),
              }
            : r
        ),
      };
    });
  };

  const shortRest = () => {
    updateCharacter((prev) => ({
      ...prev,
      resources: prev.resources.map((res) => {
        const maxVal = res.useProfBonus ? prev.proficiencyBonus : res.max;
        return res.reset === 'Short Rest' || res.reset === 'Short or Long Rest'
          ? { ...res, max: maxVal, current: maxVal }
          : { ...res, max: maxVal };
      }),
    }));
  };

  const longRest = () => {
    updateCharacter((prev) => {
      const newHp = { ...prev.hp, current: prev.hp.max, temp: 0 };
      const newDeathSaves = { successes: 0, failures: 0 };
      const newSlots: Record<string, { total: number; used: number }> = {};
      Object.entries(prev.spellcasting.slots).forEach(([lvl, data]) => {
        newSlots[lvl] = { ...data, used: 0 };
      });

      const newHitDice = prev.hitDice.map((hd) => {
        const regain = Math.max(1, Math.floor(hd.total / 2));
        return { ...hd, current: Math.min(hd.total, hd.current + regain) };
      });

      const newResources = prev.resources.map((res) => {
        const maxVal = res.useProfBonus ? prev.proficiencyBonus : res.max;
        return {
          ...res,
          max: maxVal,
          current: maxVal,
        };
      });

      // In D&D 5e, long rest removes 1 tier of exhaustion
      const newExhaustion = Math.max(0, prev.exhaustionLevel - 1);

      return {
        ...prev,
        hp: newHp,
        deathSaves: newDeathSaves,
        spellcasting: {
          ...prev.spellcasting,
          slots: newSlots,
        },
        hitDice: newHitDice,
        resources: newResources,
        exhaustionLevel: newExhaustion,
      };
    });
  };

  const syncCustomSpellsFromCharacter = (char: CharacterData) => {
    if (char && char.customSpells && Array.isArray(char.customSpells) && char.customSpells.length > 0) {
      setMasterSpells((prevMaster) => {
        const existingNames = new Set(prevMaster.map((s) => s.name.toLowerCase()));
        const toAdd = char.customSpells!.filter(
          (cs) => !existingNames.has(cs.name.toLowerCase())
        );
        if (toAdd.length > 0) {
          return [...toAdd, ...prevMaster];
        }
        return prevMaster;
      });
    }
  };

  const addCustomSpell = (newSpellData: Omit<Spell, 'id'>) => {
    const newId = `custom-${Date.now()}`;
    const newSpell: Spell = {
      ...newSpellData,
      id: newId,
    };
    setMasterSpells((prev) => [newSpell, ...prev]);
    setCharacter((prev) => {
      const existing = prev.customSpells || [];
      const updated = [
        newSpell,
        ...existing.filter(
          (s) => s.id !== newSpell.id && s.name.toLowerCase() !== newSpell.name.toLowerCase()
        ),
      ];
      return {
        ...prev,
        customSpells: updated,
      };
    });
    togglePreparedSpell(newSpell.name);
  };

  const exportCharacterJson = (customFilename?: string) => {
    const rawName =
      customFilename ||
      (currentSaveFilename && !currentSaveFilename.endsWith('_5e_2024.json')
        ? currentSaveFilename
        : `${(character.name || 'character').trim().replace(/\s+/g, '_')}_sheet.json`);
    const finalName = rawName.endsWith('.json') ? rawName : `${rawName}.json`;
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', finalName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importCharacterJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.name && parsed.abilities) {
        setCharacter(parsed);
        syncCustomSpellsFromCharacter(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid character JSON', e);
    }
    return false;
  };

  const resetToTemplate = () => {
    if (window.confirm('Reset all character data to the initial template from the spreadsheet?')) {
      setCharacter(initialCharacter);
      setMasterSpells(masterSpellList);
      localStorage.removeItem(STORAGE_KEY_CHAR);
      localStorage.removeItem(STORAGE_KEY_SPELLS);
    }
  };

  const createNewCharacter = () => {
    setCharacter(initialCharacter);
    setMasterSpells(masterSpellList);
    setCurrentSaveFilename('character_sheet.json');
    localStorage.setItem(STORAGE_KEY_CHAR, JSON.stringify(initialCharacter));
  };

  const saveToFileSystemPicker = async (customFilename?: string): Promise<boolean> => {
    const rawName =
      customFilename ||
      (currentSaveFilename && !currentSaveFilename.endsWith('_5e_2024.json')
        ? currentSaveFilename
        : `${(character.name || 'character').trim().replace(/\s+/g, '_')}_sheet.json`);
    const suggestedName = rawName.endsWith('.json') ? rawName : `${rawName}.json`;
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName,
          types: [
            {
              description: 'D&D Character JSON',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(character, null, 2));
        await writable.close();
        if (handle.name) {
          setCurrentSaveFilename(handle.name);
        }
        return true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error saving file:', err);
        }
        return false;
      }
    } else {
      exportCharacterJson(suggestedName);
      return true;
    }
  };

  const loadFromFileSystemPicker = async (): Promise<boolean> => {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'D&D Character JSON',
              accept: { 'application/json': ['.json'] },
            },
          ],
          multiple: false,
        });
        const file = await handle.getFile();
        const text = await file.text();
        const success = importCharacterJson(text);
        if (success) {
          setCurrentSaveFilename(handle.name || file.name);
          return true;
        }
        return false;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error opening file:', err);
        }
        return false;
      }
    }
    return false;
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        masterSpells,
        updateCharacter,
        updateBaseScore,
        toggleBaseStatsLock,
        addWeapon,
        removeWeapon,
        updateWeapon,
        setWeaponAbility,
        toggleWeaponMastery,
        addAmmunition,
        updateAmmunition,
        removeAmmunition,
        addArmor,
        removeArmor,
        toggleArmorEquipped,
        addFeature,
        removeFeature,
        updateFeature,
        addClass,
        removeClass,
        updateClassLevel,
        updateClass,
        setSpellcastingStat,
        togglePreparedSpell,
        updateSpellNote,
        isSpellPrepared,
        isSpellLocked,
        toggleSpellLock,
        castSpell,
        toggleSpellSlot,
        adjustSpellSlotsUsed,
        resetAllSpellSlots,
        adjustHp,
        setTempHp,
        useHitDie,
        updateHitDieCurrent,
        setInspiration,
        adjustResource,
        addResource,
        removeResource,
        updateResource,
        toggleCondition,
        setExhaustionLevel,
        shortRest,
        longRest,
        addNote,
        updateNote,
        deleteNote,
        toggleNoteCollapse,
        addCustomSpell,
        exportCharacterJson,
        importCharacterJson,
        resetToTemplate,
        createNewCharacter,
        currentSaveFilename,
        setCurrentSaveFilename,
        saveToFileSystemPicker,
        loadFromFileSystemPicker,
        getAbilityMod,
        getSaveBonus,
        getSkillBonus,
        saveDC,
        attackBonus,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
