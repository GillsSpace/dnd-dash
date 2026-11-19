import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Sword, X, Sparkles, BookOpen } from 'lucide-react';
import {
  DND2024_WEAPONS,
  WEAPON_MASTERY_DESCRIPTIONS,
} from '../../data/dnd2024Weapons';

import { AbilityKey } from '../../types/character';

const WEAPON_MASTERIES = ['None', 'Nick', 'Vex', 'Graze', 'Push', 'Slow', 'Topple', 'Sap', 'Cleave'];
const DAMAGE_TYPES = ['Piercing', 'Slashing', 'Bludgeoning', 'Force', 'Radiant', 'Necrotic', 'Fire', 'Cold'];

export const WeaponModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addWeapon, character, getAbilityMod } = useCharacter();

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [name, setName] = useState('');
  const [toHit, setToHit] = useState('+6');
  const [damage, setDamage] = useState('1d8+4');
  const [damageType, setDamageType] = useState('Piercing');
  const [range, setRange] = useState('Melee');
  const [mastery, setMastery] = useState('Vex');
  const [masteryActive, setMasteryActive] = useState(true);
  const [properties, setProperties] = useState('Finesse');
  const [notes, setNotes] = useState('');

  const [selectedAbility, setSelectedAbility] = useState<AbilityKey>('str');
  const [baseDamage, setBaseDamage] = useState('1d8');

  if (!isOpen) return null;

  const handlePresetSelect = (weaponName: string) => {
    setSelectedPreset(weaponName);
    if (!weaponName) return;

    const preset = DND2024_WEAPONS.find((w) => w.name === weaponName);
    if (!preset) return;

    const dexMod = getAbilityMod('dex');
    const strMod = getAbilityMod('str');
    const isFinesse = preset.properties.some((p) => p.toLowerCase().includes('finesse'));
    const isRanged = preset.category.includes('Ranged');
    
    // Choose appropriate ability modifier
    const chosenAbility: AbilityKey = isFinesse ? (dexMod >= strMod ? 'dex' : 'str') : isRanged ? 'dex' : 'str';
    const mod = getAbilityMod(chosenAbility);
    const hitBonus = mod + character.proficiencyBonus;
    const toHitString = hitBonus >= 0 ? `+${hitBonus}` : `${hitBonus}`;

    let damageFormula = preset.damage;
    if (preset.damage === '1') {
      damageFormula = `${1 + mod}`;
    } else if (mod !== 0) {
      damageFormula = `${preset.damage}${mod > 0 ? `+${mod}` : `${mod}`}`;
    }

    setSelectedAbility(chosenAbility);
    setBaseDamage(preset.damage);
    setName(preset.name);
    setToHit(toHitString);
    setDamage(damageFormula);
    setDamageType(preset.damageType);
    setRange(preset.range);
    setProperties(preset.properties.join(', '));
    setMastery(preset.mastery);
    setMasteryActive(preset.mastery !== 'None');
    setNotes(WEAPON_MASTERY_DESCRIPTIONS[preset.mastery] || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const propArray = properties
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    addWeapon({
      id: `w-${Date.now()}`,
      name: name.trim(),
      toHit: toHit.startsWith('+') || toHit.startsWith('-') ? toHit : `+${toHit}`,
      damage: damage.trim(),
      damageType,
      range: range.trim() || 'Melee',
      properties: propArray,
      mastery: mastery === 'None' ? undefined : mastery,
      masteryActive,
      notes: notes.trim(),
      ability: selectedAbility,
      baseDamage: baseDamage || damage.trim(),
    });

    onClose();
  };

  const simpleMelee = DND2024_WEAPONS.filter((w) => w.category === 'Simple Melee');
  const simpleRanged = DND2024_WEAPONS.filter((w) => w.category === 'Simple Ranged');
  const martialMelee = DND2024_WEAPONS.filter((w) => w.category === 'Martial Melee');
  const martialRanged = DND2024_WEAPONS.filter((w) => w.category === 'Martial Ranged');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white border border-stone-400 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans text-stone-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1f4e78] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4 text-amber-300" />
            <h3 className="font-fantasy font-bold text-base">Add Weapon to Character</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto">
          {/* Preset Selector */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-300">
            <div className="flex items-center gap-1.5 font-bold text-[#1f4e78] mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Choose D&amp;D 2024 Default Weapon Preset:</span>
            </div>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none bg-white font-medium"
            >
              <option value="">-- Or enter custom weapon details below --</option>
              <optgroup label="Simple Melee Weapons">
                {simpleMelee.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name} ({w.damage} {w.damageType}, Mastery: {w.mastery})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Simple Ranged Weapons">
                {simpleRanged.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name} ({w.damage} {w.damageType}, Mastery: {w.mastery})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Martial Melee Weapons">
                {martialMelee.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name} ({w.damage} {w.damageType}, Mastery: {w.mastery})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Martial Ranged Weapons">
                {martialRanged.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name} ({w.damage} {w.damageType}, Mastery: {w.mastery})
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="text-[10px] text-stone-500 mt-1">
              Selecting a preset auto-calculates your to-hit bonus and damage modifier based on your Str/Dex and proficiency bonus (+{character.proficiencyBonus}).
            </p>
          </div>

          {/* Weapon Details */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Weapon Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Longbow, Rapier, Sun Blade"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">To Hit Attack Bonus</label>
              <input
                type="text"
                required
                placeholder="+6"
                value={toHit}
                onChange={(e) => setToHit(e.target.value)}
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Damage Formula</label>
              <input
                type="text"
                required
                placeholder="1d8+4"
                value={damage}
                onChange={(e) => setDamage(e.target.value)}
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Damage Type</label>
              <select
                value={damageType}
                onChange={(e) => setDamageType(e.target.value)}
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
              >
                {DAMAGE_TYPES.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Range</label>
              <input
                type="text"
                placeholder="Melee, 20/60, 80/320"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700">Weapon Mastery</label>
                <label className="text-[10px] text-stone-500 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={masteryActive}
                    onChange={(e) => setMasteryActive(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 cursor-pointer"
                  />
                  <span>Active</span>
                </label>
              </div>
              <select
                value={mastery}
                onChange={(e) => {
                  setMastery(e.target.value);
                  if (e.target.value !== 'None' && WEAPON_MASTERY_DESCRIPTIONS[e.target.value]) {
                    setNotes(WEAPON_MASTERY_DESCRIPTIONS[e.target.value]);
                  }
                }}
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
              >
                {WEAPON_MASTERIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Properties (comma separated)</label>
              <input
                type="text"
                placeholder="Finesse, Light, Thrown"
                value={properties}
                onChange={(e) => setProperties(e.target.value)}
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Ability Modifier Scaling</label>
            <select
              value={selectedAbility}
              onChange={(e) => {
                const newAbility = e.target.value as AbilityKey;
                setSelectedAbility(newAbility);
                const mod = getAbilityMod(newAbility);
                const hitBonus = mod + character.proficiencyBonus;
                setToHit(hitBonus >= 0 ? `+${hitBonus}` : `${hitBonus}`);
                const base = baseDamage || '1d8';
                if (base === '1') {
                  setDamage(`${1 + mod}`);
                } else if (mod !== 0) {
                  setDamage(`${base}${mod > 0 ? `+${mod}` : `${mod}`}`);
                } else {
                  setDamage(base);
                }
              }}
              className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none font-medium bg-stone-50"
            >
              <option value="str">Strength (STR - standard melee)</option>
              <option value="dex">Dexterity (DEX - finesse / ranged)</option>
              <option value="con">Constitution (CON - e.g. breath/bite)</option>
              <option value="int">Intelligence (INT - Battle Smith / Armorer)</option>
              <option value="wis">Wisdom (WIS - Astral Self / Shillelagh)</option>
              <option value="cha">Charisma (CHA - Hexblade / Pact of Blade)</option>
            </select>
          </div>

          {/* Mastery preview banner */}
          {mastery !== 'None' && WEAPON_MASTERY_DESCRIPTIONS[mastery] && (
            <div className="p-2 rounded bg-amber-50 border border-amber-300 text-stone-800 text-[11px] flex gap-2 items-start">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 font-fantasy">{mastery} Mastery: </strong>
                <span>{WEAPON_MASTERY_DESCRIPTIONS[mastery]}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">Notes / Tactical Effects</label>
            <input
              type="text"
              placeholder="e.g. Advantage on next attack, Nick property"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1f4e78] hover:bg-[#163857] text-white rounded font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sword className="w-3.5 h-3.5" />
              <span>Add Weapon</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
