import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { calculateClassPreparedSpells } from '../../utils/spellSlotHelper';
import { Spell } from '../../types/spell';
import { AbilityKey } from '../../types/character';

const SCHOOL_COLORS: Record<string, string> = {
  Abjur: 'text-blue-800 border-blue-400 bg-blue-50',
  Conj: 'text-yellow-800 border-yellow-400 bg-yellow-50',
  Divin: 'text-cyan-800 border-cyan-400 bg-cyan-50',
  Ench: 'text-pink-800 border-pink-400 bg-pink-50',
  Evoc: 'text-red-800 border-red-400 bg-red-50',
  Illus: 'text-purple-800 border-purple-400 bg-purple-50',
  Necro: 'text-emerald-800 border-emerald-400 bg-emerald-50',
  Trans: 'text-amber-800 border-amber-400 bg-amber-50',
};

const SKILL_LIST: { key: string; label: string; ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' }[] = [
  { key: 'acrobatics', label: 'Acrobatics (Dex)', ability: 'dex' },
  { key: 'animalHandling', label: 'Animal Handling (Wis)', ability: 'wis' },
  { key: 'arcana', label: 'Arcana (Int)', ability: 'int' },
  { key: 'athletics', label: 'Athletics (Str)', ability: 'str' },
  { key: 'deception', label: 'Deception (Cha)', ability: 'cha' },
  { key: 'history', label: 'History (Int)', ability: 'int' },
  { key: 'insight', label: 'Insight (Wis)', ability: 'wis' },
  { key: 'intimidation', label: 'Intimidation (Cha)', ability: 'cha' },
  { key: 'investigation', label: 'Investigation (Int)', ability: 'int' },
  { key: 'medicine', label: 'Medicine (Wis)', ability: 'wis' },
  { key: 'nature', label: 'Nature (Int)', ability: 'int' },
  { key: 'perception', label: 'Perception (Wis)', ability: 'wis' },
  { key: 'performance', label: 'Performance (Cha)', ability: 'cha' },
  { key: 'persuasion', label: 'Persuasion (Cha)', ability: 'cha' },
  { key: 'religion', label: 'Religion (Int)', ability: 'int' },
  { key: 'sleightOfHand', label: 'Sleight of Hand (Dex)', ability: 'dex' },
  { key: 'stealth', label: 'Stealth (Dex)', ability: 'dex' },
  { key: 'survival', label: 'Survival (Wis)', ability: 'wis' },
];

const CONDITIONS_LIST = [
  ['Blinded', 'Paralysed'],
  ['Charmed', 'Petrified'],
  ['Deafened', 'Poisoned'],
  ['Frightened', 'Prone'],
  ['Grappled', 'Restrained'],
  ['Incapacitated', 'Stunned'],
  ['Invisible', 'Unconscious'],
];

export const PrintDocument: React.FC = () => {
  const {
    character,
    masterSpells,
    getAbilityMod,
    getSaveBonus,
    getSkillBonus,
    saveDC,
    attackBonus,
  } = useCharacter();

  const classSummary = character.classes
    .map((c) => `${c.name}${c.subclass ? ` (${c.subclass})` : ''} (${c.level})`)
    .join(', ');

  const dexMod = getAbilityMod('dex');
  const equippedArmor = (character.armorWorn || []).filter((a) => a.equipped !== false);
  const bodyArmor = equippedArmor.find((a) =>
    ['L', 'M', 'H', 'LIGHT', 'MEDIUM', 'HEAVY'].includes(a.type.toUpperCase())
  );
  const shieldItem = equippedArmor.find((a) => a.type.toLowerCase().includes('shield'));

  let dexApplied = 0;
  if (bodyArmor) {
    const t = bodyArmor.type.toUpperCase();
    if (t === 'L' || t === 'LIGHT') dexApplied = dexMod;
    else if (t === 'M' || t === 'MEDIUM') dexApplied = Math.min(2, dexMod);
    else if (t === 'H' || t === 'HEAVY') dexApplied = 0;
    else dexApplied = bodyArmor.dexBonus ?? 0;
  } else {
    dexApplied = dexMod;
  }

  const baseArmorAc = bodyArmor ? bodyArmor.ac : 10;
  const shieldAc = shieldItem ? shieldItem.ac || 2 : 0;
  const computedTotalAc = baseArmorAc + dexApplied + shieldAc;
  const effectiveAc = character.armorClass || computedTotalAc;

  // Inventory / Wealth Calculations
  const strScore = character.abilities.str?.score ?? 10;
  const maxCarryWeight = strScore * 15;
  const totalItemWeight = character.inventory.reduce(
    (sum, item) => sum + (item.weight || 0) * (item.qty || 1),
    0
  );
  const totalCoins =
    character.currency.cp +
    character.currency.sp +
    character.currency.ep +
    character.currency.gp +
    character.currency.pp;
  const coinWeight = Math.round((totalCoins / 50) * 10) / 10;
  const totalWeight = Math.round((totalItemWeight + coinWeight) * 10) / 10;

  // Features split
  const raceAndFeatFeatures = character.features.filter(
    (f) => f.source === 'Race' || f.source === 'Feat' || f.source === 'Background'
  );
  const classFeatures = character.features.filter(
    (f) => f.source === 'Class' || f.source === 'Other' || !raceAndFeatFeatures.includes(f)
  );

  // Spells Data
  const preparedSpells: Spell[] = character.spellcasting.preparedSpellNames
    .map((name) =>
      masterSpells.find((s) => s.name.trim().toLowerCase() === name.trim().toLowerCase())
    )
    .filter((s): s is Spell => s !== undefined)
    .sort((a, b) => (a.level === b.level ? a.name.localeCompare(b.name) : a.level - b.level));

  const spellsByLevel: Record<number, Spell[]> = {};
  for (let lvl = 0; lvl <= 9; lvl++) {
    spellsByLevel[lvl] = [];
  }
  preparedSpells.forEach((sp) => {
    if (spellsByLevel[sp.level]) {
      spellsByLevel[sp.level].push(sp);
    }
  });

  const intMod = getAbilityMod('int');
  const classPreparedSpells = calculateClassPreparedSpells(character.classes, { int: intMod });

  const currentCastingStat = character.spellcasting.stat || 'WIS';
  const castingStatMod = getAbilityMod((currentCastingStat.toLowerCase() as AbilityKey) || 'wis');

  return (
    <div className="w-full text-stone-900 font-sans print:text-xs">
      {/* =========================================================================
          PAGE 1: FRONT CHARACTER SHEET
      ========================================================================= */}
      <div className="print-page-break space-y-2.5 pb-2">
        {/* Document Header */}
        <div className="border-b-2 border-[#7b1113] pb-2">
          <div className="flex items-center justify-between">
            <span className="font-fantasy font-extrabold text-[#7b1113] text-lg tracking-wider">
              D&amp;D 5.5e (2024) CHARACTER SHEET
            </span>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
              Page 1 of 3 • Front Sheet
            </span>
          </div>

          {/* Reference Info Grid */}
          <div className="grid grid-cols-12 gap-2 mt-2 bg-[#f6efe6] border border-stone-300 p-2 text-xs">
            <div className="col-span-4 border-r border-stone-300 pr-2">
              <span className="text-[9px] font-bold text-[#991b1b] uppercase block">Character Name</span>
              <span className="text-base font-extrabold text-[#1f4e78] block truncate">
                {character.name || 'Unnamed Adventurer'}
              </span>
            </div>

            <div className="col-span-2 border-r border-stone-300 pr-2">
              <span className="text-[9px] font-bold text-[#991b1b] uppercase block">Class &amp; Level</span>
              <span className="font-bold text-stone-900 block truncate">
                {classSummary || `Level ${character.level}`}
              </span>
            </div>

            <div className="col-span-2 border-r border-stone-300 pr-2">
              <span className="text-[9px] font-bold text-[#991b1b] uppercase block">Race / Species</span>
              <span className="font-semibold text-stone-800 block truncate">{character.race || '—'}</span>
            </div>

            <div className="col-span-2 border-r border-stone-300 pr-2">
              <span className="text-[9px] font-bold text-[#991b1b] uppercase block">Background</span>
              <span className="font-semibold text-stone-800 block truncate">{character.background || '—'}</span>
            </div>

            <div className="col-span-2">
              <span className="text-[9px] font-bold text-[#991b1b] uppercase block">Proficiency</span>
              <span className="font-mono font-extrabold text-sm text-[#276749]">
                +{character.proficiencyBonus}
              </span>
            </div>
          </div>
        </div>

        {/* Abilities & Saving Throws Row */}
        <div className="grid grid-cols-6 gap-1.5">
          {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as AbilityKey[]).map((ability) => {
            const score = character.abilities[ability]?.score ?? 10;
            const mod = getAbilityMod(ability);
            const save = getSaveBonus(ability);
            const isProf = character.abilities[ability]?.saveProf ?? false;

            return (
              <div
                key={ability}
                className="bg-[#f6efe6] border border-stone-400 p-1.5 text-center rounded flex flex-col justify-between"
              >
                <span className="text-[10px] font-bold text-[#7b1113] uppercase tracking-wider block">
                  {ability.toUpperCase()}
                </span>
                <span className="font-mono text-xl font-extrabold text-stone-900 my-0.5">
                  {mod >= 0 ? `+${mod}` : mod}
                </span>
                <div className="bg-white border border-stone-300 rounded py-0.5 text-[10px] text-stone-700 font-mono font-bold">
                  Score {score}
                </div>
                <div className="mt-1 pt-1 border-t border-stone-300 flex items-center justify-between text-[10px]">
                  <span className="text-stone-500 font-medium">Save:</span>
                  <span className="font-mono font-bold text-stone-900 flex items-center gap-0.5">
                    {isProf && <span className="text-[#1f4e78]">●</span>}
                    {save >= 0 ? `+${save}` : save}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Combat Vitals & Speed Banner */}
        <div className="grid grid-cols-12 gap-2">
          {/* Armor Class */}
          <div className="col-span-2 bg-white border-2 border-stone-400 rounded p-1.5 text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Armor Class</span>
            <span className="font-mono text-2xl font-black text-[#1f4e78]">{effectiveAc}</span>
            <span className="text-[9px] text-stone-400">{bodyArmor ? bodyArmor.name : 'Unarmored'}</span>
          </div>

          {/* Initiative */}
          <div className="col-span-2 bg-white border-2 border-stone-400 rounded p-1.5 text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Initiative</span>
            <span className="font-mono text-2xl font-black text-[#7b1113]">
              {dexMod >= 0 ? `+${dexMod}` : dexMod}
            </span>
            <span className="text-[9px] text-stone-400">DEX Mod</span>
          </div>

          {/* Speed */}
          <div className="col-span-2 bg-white border-2 border-stone-400 rounded p-1.5 text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Speed</span>
            <span className="font-mono text-2xl font-black text-[#276749]">
              {character.speed.walk}
              <span className="text-xs font-normal"> ft</span>
            </span>
            <span className="text-[9px] text-stone-400">
              {character.speed.fly > 0 ? `Fly ${character.speed.fly}'` : 'Walking'}
            </span>
          </div>

          {/* Hit Points */}
          <div className="col-span-3 bg-white border-2 border-stone-400 rounded p-1.5 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[9px] font-bold text-stone-500 uppercase">
              <span>Hit Points</span>
              <span>Max: {character.hp.max}</span>
            </div>
            <div className="flex items-baseline justify-center gap-1.5 font-mono my-0.5">
              <span className="text-2xl font-black text-stone-900">{character.hp.current}</span>
              <span className="text-stone-400 text-sm">/ {character.hp.max}</span>
            </div>
            <div className="text-[9px] text-stone-500 flex justify-between border-t border-stone-200 pt-0.5">
              <span>Temp: {character.hp.temp || 0}</span>
              <span>{character.hp.current <= 0 ? 'Unconscious' : 'Conscious'}</span>
            </div>
          </div>

          {/* Hit Dice & Death Saves */}
          <div className="col-span-3 bg-white border-2 border-stone-400 rounded p-1.5 flex flex-col justify-between text-[10px]">
            <div>
              <span className="font-bold text-stone-600 block uppercase text-[9px]">Hit Dice Pools</span>
              <span className="font-mono font-bold text-stone-800">
                {(character.hitDice || [])
                  .map((hd) => `${hd.current}/${hd.total} (${hd.die})`)
                  .join(', ') || `${character.level}d8`}
              </span>
            </div>
            <div className="border-t border-stone-200 pt-1 mt-1">
              <span className="font-bold text-stone-600 block uppercase text-[9px]">Death Saves</span>
              <div className="flex justify-between text-[9px]">
                <span>
                  Succ: {[0, 1, 2].map((i) => (i < character.deathSaves.successes ? '●' : '○')).join(' ')}
                </span>
                <span>
                  Fail: {[0, 1, 2].map((i) => (i < character.deathSaves.failures ? '●' : '○')).join(' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Attacks Row */}
        <div className="grid grid-cols-12 gap-2.5 items-start">
          {/* Skills Column (5 Cols) */}
          <div className="col-span-5 border border-stone-400 bg-white">
            <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-[11px] uppercase">
              SKILLS
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <tbody>
                {SKILL_LIST.map(({ key, label, ability }) => {
                  const skillData = character.skills[key] || { ability, prof: 'none' };
                  const bonus = getSkillBonus(key);
                  return (
                    <tr key={key} className="border-b border-stone-200 last:border-b-0">
                      <td className="text-center font-mono py-0.5 px-1 border-r border-stone-200 bg-[#f8f9fa] w-10 font-bold text-stone-800">
                        {bonus >= 0 ? `+${bonus}` : bonus}
                      </td>
                      <td className="px-2 py-0.5 text-stone-800 font-medium">{label}</td>
                      <td className="text-center py-0.5 px-1 w-10">
                        {skillData.prof === 'expert' ? (
                          <span className="text-amber-800 font-bold text-[9px] bg-amber-100 px-1 rounded border border-amber-300">
                            EXP
                          </span>
                        ) : skillData.prof === 'prof' ? (
                          <span className="text-stone-900 font-bold">●</span>
                        ) : (
                          <span className="text-stone-300">○</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Attacks, Weapons & Armor (7 Cols) */}
          <div className="col-span-7 space-y-2">
            {/* Weapons Table */}
            <div className="border border-stone-400 bg-white">
              <div className="bg-[#1f4e78] text-white font-bold text-center py-1 tracking-wider text-[11px] uppercase flex justify-between px-3">
                <span>WEAPONS &amp; ATTACKS</span>
                <span className="text-[10px] font-normal">2024 Weapon Masteries</span>
              </div>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-300 text-[10px] font-bold text-stone-600">
                    <th className="p-1 pl-2">Weapon</th>
                    <th className="p-1 text-center">To Hit</th>
                    <th className="p-1">Damage / Type</th>
                    <th className="p-1">Mastery</th>
                  </tr>
                </thead>
                <tbody>
                  {(character.weapons || []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-2 text-center text-stone-400 italic">
                        No weapons recorded.
                      </td>
                    </tr>
                  ) : (
                    (character.weapons || []).map((w) => (
                      <tr key={w.id} className="border-b border-stone-200 last:border-b-0">
                        <td className="p-1 pl-2 font-bold text-stone-900">
                          {w.name}
                          {w.notes && <span className="block text-[9px] font-normal text-stone-500">{w.notes}</span>}
                        </td>
                        <td className="p-1 text-center font-mono font-bold text-[#1f4e78]">
                          {w.toHit || '+0'}
                        </td>
                        <td className="p-1 font-mono text-stone-800">
                          {w.damage} {w.damageType}
                        </td>
                        <td className="p-1">
                          {w.mastery ? (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                w.masteryActive
                                  ? 'bg-[#1f4e78] text-white'
                                  : 'bg-stone-100 text-stone-600 border border-stone-300'
                              }`}
                            >
                              {w.mastery}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Armor Table */}
            <div className="border border-stone-400 bg-white">
              <div className="bg-[#1f4e78] text-white font-bold py-1 text-[11px] uppercase px-3 flex justify-between">
                <span>ARMOR &amp; SHIELDS</span>
                <span className="text-[10px] font-normal">Effective AC: {effectiveAc}</span>
              </div>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-300 text-[10px] font-bold text-stone-600">
                    <th className="p-1 pl-2">Armor Name</th>
                    <th className="p-1">Type</th>
                    <th className="p-1 text-center">AC Bonus</th>
                    <th className="p-1 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(character.armorWorn || []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-2 text-center text-stone-400 italic">
                        No armor recorded.
                      </td>
                    </tr>
                  ) : (
                    (character.armorWorn || []).map((arm, idx) => (
                      <tr key={arm.id || idx} className="border-b border-stone-200 last:border-b-0">
                        <td className="p-1 pl-2 font-bold text-stone-900">{arm.name}</td>
                        <td className="p-1 text-stone-600 capitalize">{arm.type}</td>
                        <td className="p-1 text-center font-mono font-bold text-stone-800">
                          {arm.ac > 0 ? `+${arm.ac}` : arm.ac}
                        </td>
                        <td className="p-1 text-center font-medium">
                          {arm.equipped !== false ? (
                            <span className="text-[#276749] font-bold text-[10px]">Equipped</span>
                          ) : (
                            <span className="text-stone-400 text-[10px]">Stored</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Conditions Box */}
            <div className="border border-stone-400 bg-white p-2">
              <div className="font-bold text-[#7b1113] text-[11px] uppercase border-b border-stone-300 pb-0.5 mb-1 flex justify-between">
                <span>CONDITIONS</span>
                {character.exhaustionLevel > 0 && (
                  <span className="text-red-700 font-bold text-[10px]">
                    Exhaustion Lvl {character.exhaustionLevel}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                {CONDITIONS_LIST.flat().map((c) => {
                  const isActive = character.conditions[c] || false;
                  return (
                    <div
                      key={c}
                      className={`flex items-center gap-1 px-1 py-0.5 rounded border ${
                        isActive
                          ? 'bg-red-50 border-red-300 text-red-800 font-bold'
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      <span className="font-mono text-xs">{isActive ? '☑' : '☐'}</span>
                      <span className="truncate">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Features & Abilities (2 Columns) */}
        <div className="border border-stone-400 bg-white">
          <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-[11px] uppercase">
            FEATURES &amp; TRAITS
          </div>
          <div className="grid grid-cols-2 divide-x divide-stone-300 p-2 text-xs">
            {/* Left: Race / Feats / Background */}
            <div className="pr-2 space-y-1.5">
              <span className="font-bold text-[#1f4e78] text-[11px] uppercase block border-b border-stone-200 pb-0.5">
                Species &amp; Feat Traits
              </span>
              {raceAndFeatFeatures.length === 0 ? (
                <p className="text-stone-400 italic text-[11px]">No species/feat traits recorded.</p>
              ) : (
                raceAndFeatFeatures.map((feat) => (
                  <div key={feat.id} className="text-[11px] print-avoid-break">
                    <span className="font-bold text-stone-900">{feat.name}</span>
                    <span className="text-[9px] text-stone-500 ml-1.5 uppercase">({feat.source})</span>
                    <p className="text-[10px] italic text-stone-600 leading-snug mt-0.5">
                      {feat.description}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Right: Class Features */}
            <div className="pl-2 space-y-1.5">
              <span className="font-bold text-[#1f4e78] text-[11px] uppercase block border-b border-stone-200 pb-0.5">
                Class Features
              </span>
              {classFeatures.length === 0 ? (
                <p className="text-stone-400 italic text-[11px]">No class features recorded.</p>
              ) : (
                classFeatures.map((feat) => (
                  <div key={feat.id} className="text-[11px] print-avoid-break">
                    <span className="font-bold text-stone-900">{feat.name}</span>
                    <span className="text-[9px] text-stone-500 ml-1.5 uppercase">({feat.source})</span>
                    <p className="text-[10px] italic text-stone-600 leading-snug mt-0.5">
                      {feat.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Proficiencies & Training Footer Bar */}
        <div className="grid grid-cols-4 gap-2 bg-[#f6efe6] border border-stone-300 p-2 text-[10px]">
          <div>
            <span className="font-bold text-stone-700 uppercase block">Armor Training</span>
            <span className="text-stone-900">
              {character.proficiencies.armor.length > 0
                ? character.proficiencies.armor.join(', ')
                : 'None'}
            </span>
          </div>
          <div>
            <span className="font-bold text-stone-700 uppercase block">Weapon Training</span>
            <span className="text-stone-900">
              {character.proficiencies.weapons.length > 0
                ? character.proficiencies.weapons.join(', ')
                : 'Simple'}
            </span>
          </div>
          <div>
            <span className="font-bold text-stone-700 uppercase block">Tool Proficiencies</span>
            <span className="text-stone-900">{character.proficiencies.tools.join(', ') || 'None'}</span>
          </div>
          <div>
            <span className="font-bold text-stone-700 uppercase block">Languages</span>
            <span className="text-stone-900">{character.languages.join(', ') || 'Common'}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PAGE 2: BACK SHEET (EQUIPMENT, WEALTH & ROLEPLAYING)
      ========================================================================= */}
      <div className="print-page-break space-y-2.5 pt-2">
        {/* Document Header */}
        <div className="border-b-2 border-[#7b1113] pb-2">
          <div className="flex items-center justify-between">
            <span className="font-fantasy font-extrabold text-[#7b1113] text-lg tracking-wider">
              {character.name ? `${character.name.toUpperCase()} — ` : ''}EQUIPMENT, WEALTH &amp; LORE
            </span>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
              Page 2 of 3 • Back Sheet
            </span>
          </div>
          <span className="text-[11px] text-stone-600 block mt-0.5">
            {classSummary} • {character.race} • Background: {character.background}
          </span>
        </div>

        {/* Currency & Carrying Capacity */}
        <div className="bg-[#f6efe6] border border-stone-300 p-2 space-y-2">
          <div className="flex justify-between items-center border-b border-stone-300 pb-1">
            <span className="font-bold text-[#1f4e78] text-[11px] uppercase">
              Coinage &amp; Wealth
            </span>
            <span className="font-mono text-[10px] text-stone-600">
              Total Weight: {totalWeight} lbs / {maxCarryWeight} lbs Max (STR {strScore} × 15)
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {(['cp', 'sp', 'ep', 'gp', 'pp'] as const).map((coin) => (
              <div key={coin} className="bg-white border border-stone-400 p-1.5 rounded">
                <span className="block text-[9px] font-bold text-stone-600 uppercase tracking-wider">
                  {coin.toUpperCase()}
                </span>
                <span className="font-mono text-lg font-bold text-stone-900 block">
                  {character.currency[coin]}
                </span>
                <span className="text-[8px] text-stone-400 font-mono">
                  {coin === 'cp' && 'Copper'}
                  {coin === 'sp' && 'Silver'}
                  {coin === 'ep' && 'Electrum'}
                  {coin === 'gp' && 'Gold'}
                  {coin === 'pp' && 'Platinum'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="border border-stone-400 bg-white">
          <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-[11px] uppercase flex justify-between">
            <span>INVENTORY &amp; GEAR</span>
            <span className="text-[10px] font-normal">
              {character.inventory.length} Items Recorded • {totalItemWeight} lbs Gear
            </span>
          </div>
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-300 text-[10px] font-bold text-stone-600">
                <th className="p-1 pl-2">Item Name</th>
                <th className="p-1">Category</th>
                <th className="p-1 text-center">Qty</th>
                <th className="p-1 text-center">Weight (ea)</th>
                <th className="p-1 text-center">Total Wt</th>
                <th className="p-1">Notes / Description</th>
              </tr>
            </thead>
            <tbody>
              {character.inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-stone-400 italic">
                    No inventory items recorded.
                  </td>
                </tr>
              ) : (
                character.inventory.map((item) => (
                  <tr key={item.id} className="border-b border-stone-200 last:border-b-0 print-avoid-break">
                    <td className="p-1 pl-2 font-bold text-stone-900">{item.name}</td>
                    <td className="p-1 text-stone-600 text-[10px]">{item.category || 'Backpack'}</td>
                    <td className="p-1 text-center font-mono font-bold text-stone-800">{item.qty || 1}</td>
                    <td className="p-1 text-center font-mono text-stone-600">{item.weight || 0} lbs</td>
                    <td className="p-1 text-center font-mono font-bold text-stone-800">
                      {Math.round(((item.weight || 0) * (item.qty || 1)) * 10) / 10} lbs
                    </td>
                    <td className="p-1 text-[10px] text-stone-600 italic">
                      {item.description || item.desc || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resources & Daily Tracking */}
        {character.resources && character.resources.length > 0 && (
          <div className="border border-stone-400 bg-white p-2">
            <div className="font-bold text-[#1f4e78] text-[11px] uppercase border-b border-stone-300 pb-0.5 mb-1.5 flex justify-between">
              <span>SPECIAL CLASS RESOURCES &amp; FEATURES</span>
              <span className="text-[10px] font-normal text-stone-500">Tracked Resources</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {character.resources.map((res) => (
                <div key={res.id} className="border border-stone-300 rounded p-1.5 bg-[#faf6f0] text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900 truncate">{res.name}</span>
                    <span className="font-mono font-bold text-[#7b1113]">
                      {res.current} / {res.max}
                    </span>
                  </div>
                  <span className="text-[9px] text-stone-500 italic block">Reset: {res.reset}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roleplaying & Storytelling (Personality & Backstory) */}
        <div className="border border-stone-400 bg-white">
          <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-[11px] uppercase">
            ROLEPLAYING &amp; STORYTELLING
          </div>
          <div className="grid grid-cols-2 divide-x divide-stone-300 p-2.5 text-xs">
            {/* Personality Traits & Ideals */}
            <div className="pr-2.5 space-y-1">
              <span className="font-bold text-[#1f4e78] text-[11px] uppercase block border-b border-stone-200 pb-0.5">
                Personality Traits, Ideals &amp; Bonds
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed whitespace-pre-line mt-1">
                {character.roleplaying?.personality || 'No personality notes recorded.'}
              </p>
            </div>

            {/* Backstory & Quest Notes */}
            <div className="pl-2.5 space-y-1">
              <span className="font-bold text-[#1f4e78] text-[11px] uppercase block border-b border-stone-200 pb-0.5">
                Character Bio, Backstory &amp; Notes
              </span>
              <p className="text-[11px] text-stone-700 leading-relaxed whitespace-pre-line mt-1">
                {character.roleplaying?.bio || 'No backstory recorded.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PAGE 3+: SPELLS SHEET (CASTING INFO & PREPARED SPELLS)
      ========================================================================= */}
      <div className="space-y-2.5 pt-2">
        {/* Document Header */}
        <div className="border-b-2 border-[#7b1113] pb-2">
          <div className="flex items-center justify-between">
            <span className="font-fantasy font-extrabold text-[#7b1113] text-lg tracking-wider">
              {character.name ? `${character.name.toUpperCase()} — ` : ''}SPELLCASTING &amp; PREPARED SPELLS
            </span>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
              Page 3 • Spells Sheet
            </span>
          </div>
          <span className="text-[11px] text-stone-600 block mt-0.5">
            {classSummary} • {character.race}
          </span>
        </div>

        {/* Casting Information Cards */}
        <div className="grid grid-cols-12 gap-2">
          {/* Casting Ability */}
          <div className="col-span-3 bg-white border border-stone-400 p-2 rounded text-center">
            <span className="text-[9px] font-bold text-stone-500 uppercase block">Casting Ability</span>
            <span className="font-mono text-xl font-bold text-stone-900">
              {currentCastingStat}
            </span>
            <span className="text-[9px] text-stone-500 block">
              Modifier: {castingStatMod >= 0 ? `+${castingStatMod}` : castingStatMod}
            </span>
          </div>

          {/* Spell Save DC */}
          <div className="col-span-3 bg-white border border-stone-400 p-2 rounded text-center">
            <span className="text-[9px] font-bold text-stone-500 uppercase block">Spell Save DC</span>
            <span className="font-mono text-xl font-extrabold text-[#7b1113]">{saveDC}</span>
            <span className="text-[9px] text-stone-500 block">
              8 + Prof (+{character.proficiencyBonus}) + Mod
            </span>
          </div>

          {/* Spell Attack Bonus */}
          <div className="col-span-3 bg-white border border-stone-400 p-2 rounded text-center">
            <span className="text-[9px] font-bold text-stone-500 uppercase block">Spell Attack Bonus</span>
            <span className="font-mono text-xl font-extrabold text-[#276749]">
              {attackBonus >= 0 ? `+${attackBonus}` : attackBonus}
            </span>
            <span className="text-[9px] text-stone-500 block">
              Prof (+{character.proficiencyBonus}) + Mod
            </span>
          </div>

          {/* Total Prepared Spells Breakdown */}
          <div className="col-span-3 bg-[#f6efe6] border border-stone-400 p-2 rounded flex flex-col justify-between">
            <span className="text-[9px] font-bold text-stone-500 uppercase block">Prepared Spells</span>
            <span className="font-mono text-lg font-bold text-stone-900">
              {preparedSpells.length} Spells
            </span>
            <span className="text-[9px] font-bold text-stone-700 block truncate">
              {classPreparedSpells.length > 0
                ? classPreparedSpells.map((b) => `${b.className}: ${b.prepared}`).join(' • ')
                : 'Free Preparation'}
            </span>
          </div>
        </div>

        {/* Spell Slots Matrix */}
        <div className="border border-stone-400 bg-white p-2">
          <span className="font-bold text-[#1f4e78] text-[11px] uppercase block border-b border-stone-300 pb-0.5 mb-1.5">
            Spell Slots Matrix (2024 Progression)
          </span>
          <div className="grid grid-cols-9 gap-1 text-center text-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
              const slotData = character.spellcasting.slots[lvl.toString()];
              const total = slotData?.total || 0;
              const used = slotData?.used || 0;

              return (
                <div
                  key={lvl}
                  className={`p-1 rounded border ${
                    total > 0 ? 'bg-amber-50/60 border-amber-300' : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <span className="block text-[9px] font-bold text-stone-600 uppercase">Lvl {lvl}</span>
                  <span className="font-mono font-bold text-stone-900 text-sm block">
                    {total > 0 ? `${total - used} / ${total}` : '—'}
                  </span>
                  <div className="flex justify-center gap-0.5 mt-0.5 text-[8px] text-stone-400">
                    {total > 0
                      ? Array.from({ length: total }).map((_, i) => (
                          <span key={i}>{i < used ? '☒' : '☐'}</span>
                        ))
                      : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prepared Spells Catalog */}
        <div className="space-y-3">
          <div className="bg-[#7b1113] text-white font-bold py-1 px-4 text-xs tracking-wider uppercase shadow-sm">
            PREPARED SPELLS &amp; TACTICAL BRIEFS
          </div>

          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
            const levelSpells = spellsByLevel[level] || [];
            if (levelSpells.length === 0) return null;

            const title =
              level === 0 ? 'CANTRIPS (0 LEVEL)' : `LEVEL ${level} SPELLS (${levelSpells.length} Prepared)`;

            return (
              <div key={level} className="space-y-1.5 print-avoid-break">
                {/* Level Bar */}
                <div className="bg-[#1f4e78] text-white font-bold text-xs py-0.5 px-2.5 rounded-sm uppercase tracking-wider flex justify-between">
                  <span>{title}</span>
                  <span className="text-[10px] font-normal">{levelSpells.length} Spells</span>
                </div>

                {/* 2-Column Grid of Spell Cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {levelSpells.map((spell) => {
                    const schoolColor = SCHOOL_COLORS[spell.school] || 'text-stone-800 border-stone-300 bg-stone-50';
                    const customNote = character.spellcasting.spellNotes?.[spell.name];

                    return (
                      <div
                        key={spell.id || spell.name}
                        className="border border-stone-300 rounded p-2 bg-white print-avoid-break space-y-1"
                      >
                        {/* Header: Name, School, Tags */}
                        <div className="flex items-start justify-between gap-1 border-b border-stone-200 pb-1">
                          <div>
                            <span className="font-bold text-stone-900 text-xs block leading-tight">
                              {spell.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-stone-500">
                              <span>{spell.castingTime}</span>
                              <span>•</span>
                              <span>{spell.range}</span>
                              <span>•</span>
                              <span>{spell.duration}</span>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${schoolColor}`}
                          >
                            {spell.school}
                          </span>
                        </div>

                        {/* Tactical 2024 Brief */}
                        <p className="text-[10px] text-stone-700 leading-snug">
                          {spell.effect || spell.fullText}
                        </p>

                        {/* Custom Spell Note */}
                        {customNote && (
                          <div className="text-[9px] bg-amber-50/80 border border-amber-200 text-amber-900 px-1.5 py-0.5 rounded italic">
                            Note: {customNote}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
