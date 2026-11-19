import React from 'react';
import { useCharacter, calculateArmorClass } from '../../context/CharacterContext';
import { calculateClassPreparedSpells } from '../../utils/spellSlotHelper';
import { Spell } from '../../types/spell';
import { AbilityKey, PrintSettings } from '../../types/character';

interface PrintDocumentProps {
  settings?: PrintSettings;
}

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

export const PrintDocument: React.FC<PrintDocumentProps> = ({ settings }) => {
  const {
    character,
    masterSpells,
    getAbilityMod,
    getSaveBonus,
    getSkillBonus,
    saveDC,
    attackBonus,
  } = useCharacter();

  const activeSettings: PrintSettings = settings || character.printSettings || {
    paperSize: 'letter',
    colorMode: 'color',
    scope: 'all',
  };

  const classSummary = character.classes
    .map((c) => `${c.name}${c.subclass ? ` (${c.subclass})` : ''} (${c.level})`)
    .join(', ');

  const dexMod = getAbilityMod('dex');
  const conMod = getAbilityMod('con');
  const wisMod = getAbilityMod('wis');

  // Armor Class with formulas, unarmored defense, and bonus
  const computedBaseAc = calculateArmorClass(character.armorWorn, dexMod, {
    conMod,
    wisMod,
    unarmoredFormula: character.unarmoredFormula,
  });
  const effectiveAc = computedBaseAc + (character.acBonus || 0);

  // Initiative with custom bonus
  const totalInitiative = dexMod + (character.initiativeBonus || 0);

  // Passive Senses
  const passiveInsight = 10 + getSkillBonus('insight') + (character.passives?.insightBonus || 0);
  const passiveInvestigation = 10 + getSkillBonus('investigation') + (character.passives?.investigationBonus || 0);
  const passivePerception = 10 + getSkillBonus('perception') + (character.passives?.perceptionBonus || 0);

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

  const totalSpellSlots = Object.values(character.spellcasting.slots || {}).reduce(
    (sum, slot) => sum + (slot.total || 0),
    0
  );
  const hasSpellsOrSlots = totalSpellSlots > 0 || preparedSpells.length > 0;

  // Determine which sections to render based on scope
  const shouldRenderFront = activeSettings.scope === 'all' || activeSettings.scope === 'front';
  const shouldRenderBack = activeSettings.scope === 'all' || activeSettings.scope === 'back';
  const shouldRenderSpells =
    activeSettings.scope === 'spells' || (activeSettings.scope === 'all' && hasSpellsOrSlots);
  const shouldRenderNotes =
    activeSettings.scope === 'notes' ||
    (activeSettings.scope === 'all' && (character.notes || []).length > 0);

  const containerClass = `w-full text-stone-900 font-sans print:text-xs ${
    activeSettings.colorMode === 'inkSaver' ? 'ink-saver' : ''
  }`;

  return (
    <div className={containerClass}>
      {/* =========================================================================
          PAGE 1: FRONT CHARACTER SHEET
      ========================================================================= */}
      {shouldRenderFront && (
        <div className={`space-y-2 pb-2 ${shouldRenderBack || shouldRenderSpells || shouldRenderNotes ? 'print-page-break' : ''}`}>
          {/* Document Header */}
          <div className="border-b-2 border-[#7b1113] pb-1.5">
            <div className="flex items-center justify-between">
              <span className="font-fantasy font-extrabold text-[#7b1113] text-base tracking-wider">
                D&amp;D 5.5e (2024) CHARACTER SHEET
              </span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                Front Sheet • {character.name || 'Adventurer'}
              </span>
            </div>

            {/* Reference Info Grid */}
            <div className="grid grid-cols-12 gap-1.5 mt-1.5 bg-[#f6efe6] border border-stone-300 p-1.5 text-xs">
              <div className="col-span-4 border-r border-stone-300 pr-2">
                <span className="text-[8px] font-bold text-[#991b1b] uppercase block">Character Name</span>
                <span className="text-sm font-extrabold text-[#1f4e78] block truncate">
                  {character.name || 'Unnamed Adventurer'}
                </span>
              </div>

              <div className="col-span-2 border-r border-stone-300 pr-2">
                <span className="text-[8px] font-bold text-[#991b1b] uppercase block">Class &amp; Level</span>
                <span className="font-bold text-stone-900 block truncate text-[11px]">
                  {classSummary || `Level ${character.level}`}
                </span>
              </div>

              <div className="col-span-2 border-r border-stone-300 pr-2">
                <span className="text-[8px] font-bold text-[#991b1b] uppercase block">Race / Species</span>
                <span className="font-semibold text-stone-800 block truncate text-[11px]">{character.race || '—'}</span>
              </div>

              <div className="col-span-2 border-r border-stone-300 pr-2">
                <span className="text-[8px] font-bold text-[#991b1b] uppercase block">Background</span>
                <span className="font-semibold text-stone-800 block truncate text-[11px]">{character.background || '—'}</span>
              </div>

              <div className="col-span-2">
                <span className="text-[8px] font-bold text-[#991b1b] uppercase block">Proficiency</span>
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
                  className="bg-[#f6efe6] border border-stone-400 p-1 text-center rounded flex flex-col justify-between"
                >
                  <span className="text-[9px] font-bold text-[#7b1113] uppercase tracking-wider block">
                    {ability.toUpperCase()}
                  </span>
                  <span className="font-mono text-lg font-extrabold text-stone-900 my-0.5">
                    {mod >= 0 ? `+${mod}` : mod}
                  </span>
                  <div className="bg-white border border-stone-300 rounded py-0.2 text-[9px] text-stone-700 font-mono font-bold">
                    Score {score}
                  </div>
                  <div className="mt-0.5 pt-0.5 border-t border-stone-300 flex items-center justify-between text-[9px]">
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

          {/* Saving Throw Notes Banner (if any) */}
          {(character.globalSaveNote || Object.values(character.saveNotes || {}).some(Boolean)) && (
            <div className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[9.5px] text-amber-900 flex flex-wrap items-center justify-between gap-1">
              <span className="font-bold">Saving Throw Modifiers:</span>
              <span>
                {character.globalSaveNote && `${character.globalSaveNote} `}
                {Object.entries(character.saveNotes || {})
                  .filter(([_, note]) => !!note)
                  .map(([k, note]) => `${k.toUpperCase()}: ${note}`)
                  .join(' • ')}
              </span>
            </div>
          )}

          {/* Combat Vitals & Speed Banner */}
          <div className="grid grid-cols-12 gap-1.5">
            {/* Armor Class */}
            <div className="col-span-2 bg-white border-2 border-stone-400 rounded p-1 text-center flex flex-col justify-between">
              <span className="text-[8px] font-bold text-stone-500 uppercase tracking-wider">Armor Class</span>
              <span className="font-mono text-xl font-black text-[#1f4e78]">{effectiveAc}</span>
              <span className="text-[8px] text-stone-400 truncate">
                {character.acNote ? character.acNote : character.acBonus ? `+${character.acBonus} Bonus` : 'Calculated'}
              </span>
            </div>

            {/* Initiative */}
            <div className="col-span-2 bg-white border-2 border-stone-400 rounded p-1 text-center flex flex-col justify-between">
              <span className="text-[8px] font-bold text-stone-500 uppercase tracking-wider">Initiative</span>
              <span className="font-mono text-xl font-black text-[#7b1113]">
                {totalInitiative >= 0 ? `+${totalInitiative}` : totalInitiative}
              </span>
              <span className="text-[8px] text-stone-400 truncate">
                {character.initiativeNote || `DEX (${dexMod >= 0 ? `+${dexMod}` : dexMod})`}
              </span>
            </div>

            {/* Speed */}
            <div className="col-span-2 bg-white border-2 border-stone-400 rounded p-1 text-center flex flex-col justify-between">
              <span className="text-[8px] font-bold text-stone-500 uppercase tracking-wider">Speed</span>
              <span className="font-mono text-xl font-black text-[#276749]">
                {character.speed.walk}
                <span className="text-[10px] font-normal"> ft</span>
              </span>
              <span className="text-[8px] text-stone-400 truncate">
                {character.speed.fly > 0 ? `Fly ${character.speed.fly}'` : 'Walking'}
              </span>
            </div>

            {/* Hit Points */}
            <div className="col-span-3 bg-white border-2 border-stone-400 rounded p-1 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[8px] font-bold text-stone-500 uppercase">
                <span>Hit Points</span>
                <span>Max: {character.hp.max}</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 font-mono my-0.5">
                <span className="text-xl font-black text-stone-900">{character.hp.current}</span>
                <span className="text-stone-400 text-xs">/ {character.hp.max}</span>
              </div>
              <div className="text-[8px] text-stone-500 flex justify-between border-t border-stone-200 pt-0.5">
                <span>Temp: {character.hp.temp || 0}</span>
                <span>{character.hp.current <= 0 ? 'Unconscious' : 'Conscious'}</span>
              </div>
            </div>

            {/* Hit Dice & Death Saves */}
            <div className="col-span-3 bg-white border-2 border-stone-400 rounded p-1 flex flex-col justify-between text-[9px]">
              <div>
                <span className="font-bold text-stone-600 block uppercase text-[8px]">Hit Dice Pools</span>
                <span className="font-mono font-bold text-stone-800 text-[9.5px]">
                  {(character.hitDice || [])
                    .map((hd) => `${hd.current}/${hd.total} (${hd.die})`)
                    .join(', ') || `${character.level}d8`}
                </span>
              </div>
              <div className="border-t border-stone-200 pt-0.5 mt-0.5">
                <span className="font-bold text-stone-600 block uppercase text-[8px]">Death Saves</span>
                <div className="flex justify-between text-[8px]">
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
          <div className="grid grid-cols-12 gap-2 items-start">
            {/* Skills Column (5 Cols) */}
            <div className="col-span-5 border border-stone-400 bg-white">
              <div className="bg-[#7b1113] text-white font-bold text-center py-0.5 tracking-wider text-[10px] uppercase">
                SKILLS
              </div>
              <table className="w-full text-left border-collapse text-[10px]">
                <tbody>
                  {SKILL_LIST.map(({ key, label, ability }) => {
                    const skillData = character.skills[key] || { ability, prof: 'none' };
                    const bonus = getSkillBonus(key);
                    return (
                      <tr key={key} className="border-b border-stone-200 last:border-b-0 leading-tight">
                        <td className="text-center font-mono py-0.5 px-1 border-r border-stone-200 bg-[#f8f9fa] w-8 font-bold text-stone-800">
                          {bonus >= 0 ? `+${bonus}` : bonus}
                        </td>
                        <td className="px-1.5 py-0.5 text-stone-800 font-medium truncate">
                          {label}
                        </td>
                        <td className="text-center py-0.5 px-1 w-8">
                          {skillData.prof === 'expert' ? (
                            <span className="text-amber-800 font-bold text-[8px] bg-amber-100 px-1 rounded border border-amber-300">
                              EXP
                            </span>
                          ) : skillData.prof === 'prof' ? (
                            <span className="text-stone-900 font-bold">●</span>
                          ) : skillData.prof === 'half' ? (
                            <span className="text-sky-800 font-bold text-[8px] bg-sky-100 px-0.5 rounded border border-sky-300">
                              ½
                            </span>
                          ) : (
                            <span className="text-stone-300">○</span>
                          )}
                        </td>
                        <td className="text-center py-0.5 px-1 w-7">
                          {skillData.adv ? (
                            <span className="text-emerald-800 font-bold text-[8px] bg-emerald-100 px-1 rounded border border-emerald-300">
                              ADV
                            </span>
                          ) : (
                            <span className="text-stone-300 text-[9px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Passive Senses Grid Under Skills */}
              <div className="border-t border-stone-400 grid grid-cols-3 divide-x divide-stone-300 text-center bg-stone-900 text-white text-[9px] py-1">
                <div>
                  <span className="block text-[8px] text-stone-400 uppercase">Passive Perception</span>
                  <span className="font-mono font-bold text-amber-300 text-xs">{passivePerception}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-stone-400 uppercase">Passive Insight</span>
                  <span className="font-mono font-bold text-amber-300 text-xs">{passiveInsight}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-stone-400 uppercase">Passive Invest.</span>
                  <span className="font-mono font-bold text-amber-300 text-xs">{passiveInvestigation}</span>
                </div>
              </div>
            </div>

            {/* Attacks, Weapons & Armor (7 Cols) */}
            <div className="col-span-7 space-y-1.5">
              {/* Weapons Table */}
              <div className="border border-stone-400 bg-white">
                <div className="bg-[#1f4e78] text-white font-bold text-center py-0.5 tracking-wider text-[10px] uppercase flex justify-between px-2">
                  <span>WEAPONS &amp; ATTACKS</span>
                  <span className="text-[9px] font-normal">2024 Weapon Masteries</span>
                </div>
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-300 text-[9px] font-bold text-stone-600">
                      <th className="p-1 pl-1.5">Weapon</th>
                      <th className="p-1 text-center">To Hit</th>
                      <th className="p-1">Damage</th>
                      <th className="p-1">Mastery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(character.weapons || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-1.5 text-center text-stone-400 italic">
                          No weapons recorded.
                        </td>
                      </tr>
                    ) : (
                      (character.weapons || []).map((w) => (
                        <tr key={w.id} className="border-b border-stone-200 last:border-b-0 leading-tight">
                          <td className="p-1 pl-1.5 font-bold text-stone-900">
                            {w.name}
                            {w.notes && <span className="block text-[8px] font-normal text-stone-500">{w.notes}</span>}
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
                                className={`text-[8px] font-bold px-1 py-0.2 rounded ${
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

              {/* Ammunition Tracker (if any) */}
              {(character.ammunition || []).length > 0 && (
                <div className="border border-stone-400 bg-white p-1 text-[9.5px]">
                  <div className="font-bold text-[#1f4e78] text-[9px] uppercase border-b border-stone-200 pb-0.5 mb-1 flex justify-between">
                    <span>Ammunition Tracker</span>
                    <span className="text-[8px] text-stone-500 font-normal">Recover 50% after combat</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {character.ammunition.map((ammo, idx) => (
                      <div key={ammo.id || idx} className="bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 flex justify-between items-center">
                        <span className="font-medium text-stone-800 truncate">{ammo.name || ammo.weaponName || 'Ammo'}</span>
                        <span className="font-mono font-bold text-[#7b1113]">Total: {ammo.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Armor Table */}
              <div className="border border-stone-400 bg-white">
                <div className="bg-[#1f4e78] text-white font-bold py-0.5 text-[10px] uppercase px-2 flex justify-between">
                  <span>ARMOR &amp; SHIELDS</span>
                  <span className="text-[9px] font-normal">Effective AC: {effectiveAc}</span>
                </div>
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-300 text-[9px] font-bold text-stone-600">
                      <th className="p-1 pl-1.5">Armor Name</th>
                      <th className="p-1">Type</th>
                      <th className="p-1 text-center">AC Bonus</th>
                      <th className="p-1 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(character.armorWorn || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-1.5 text-center text-stone-400 italic">
                          No armor recorded. Unarmored Defense active.
                        </td>
                      </tr>
                    ) : (
                      (character.armorWorn || []).map((arm, idx) => (
                        <tr key={arm.id || idx} className="border-b border-stone-200 last:border-b-0 leading-tight">
                          <td className="p-1 pl-1.5 font-bold text-stone-900">{arm.name}</td>
                          <td className="p-1 text-stone-600 capitalize">{arm.type}</td>
                          <td className="p-1 text-center font-mono font-bold text-stone-800">
                            {arm.ac > 0 ? `+${arm.ac}` : arm.ac}
                          </td>
                          <td className="p-1 text-center font-medium">
                            {arm.equipped !== false ? (
                              <span className="text-[#276749] font-bold text-[9px]">Equipped</span>
                            ) : (
                              <span className="text-stone-400 text-[9px]">Stored</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Conditions Box */}
              <div className="border border-stone-400 bg-white p-1.5">
                <div className="font-bold text-[#7b1113] text-[10px] uppercase border-b border-stone-300 pb-0.5 mb-1 flex justify-between">
                  <span>CONDITIONS &amp; EXHAUSTION</span>
                  {character.exhaustionLevel > 0 && (
                    <span className="text-red-700 font-bold text-[9px]">
                      Exhaustion Lvl {character.exhaustionLevel} (-{character.exhaustionLevel * 2} d20, -{character.exhaustionLevel * 5}ft speed)
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1 text-[9px]">
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
                        <span className="font-mono text-[10px]">{isActive ? '☑' : '☐'}</span>
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
            <div className="bg-[#7b1113] text-white font-bold text-center py-0.5 tracking-wider text-[10px] uppercase">
              FEATURES &amp; TRAITS
            </div>
            <div className="grid grid-cols-2 divide-x divide-stone-300 p-1.5 text-xs">
              {/* Left: Species / Feats / Background */}
              <div className="pr-1.5 space-y-1">
                <span className="font-bold text-[#1f4e78] text-[10px] uppercase block border-b border-stone-200 pb-0.5">
                  Species &amp; Feat Traits
                </span>
                {raceAndFeatFeatures.length === 0 ? (
                  <p className="text-stone-400 italic text-[10px]">No species/feat traits recorded.</p>
                ) : (
                  raceAndFeatFeatures.map((feat) => (
                    <div key={feat.id} className="text-[10px] print-avoid-break">
                      <span className="font-bold text-stone-900">{feat.name}</span>
                      <span className="text-[8px] text-stone-500 ml-1 uppercase">({feat.source})</span>
                      <p className="text-[9px] italic text-stone-600 leading-tight mt-0.5 line-clamp-2">
                        {feat.description}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Right: Class Features */}
              <div className="pl-1.5 space-y-1">
                <span className="font-bold text-[#1f4e78] text-[10px] uppercase block border-b border-stone-200 pb-0.5">
                  Class Features
                </span>
                {classFeatures.length === 0 ? (
                  <p className="text-stone-400 italic text-[10px]">No class features recorded.</p>
                ) : (
                  classFeatures.map((feat) => (
                    <div key={feat.id} className="text-[10px] print-avoid-break">
                      <span className="font-bold text-stone-900">{feat.name}</span>
                      <span className="text-[8px] text-stone-500 ml-1 uppercase">({feat.source})</span>
                      <p className="text-[9px] italic text-stone-600 leading-tight mt-0.5 line-clamp-2">
                        {feat.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Proficiencies & Training Footer Bar */}
          <div className="grid grid-cols-4 gap-1.5 bg-[#f6efe6] border border-stone-300 p-1.5 text-[9px]">
            <div>
              <span className="font-bold text-stone-700 uppercase block">Armor Training</span>
              <span className="text-stone-900 truncate block">
                {character.proficiencies.armor.length > 0
                  ? character.proficiencies.armor.join(', ')
                  : 'None'}
              </span>
            </div>
            <div>
              <span className="font-bold text-stone-700 uppercase block">Weapon Training</span>
              <span className="text-stone-900 truncate block">
                {character.proficiencies.weapons.length > 0
                  ? character.proficiencies.weapons.join(', ')
                  : 'Simple'}
              </span>
            </div>
            <div>
              <span className="font-bold text-stone-700 uppercase block">Tool Proficiencies</span>
              <span className="text-stone-900 truncate block">{character.proficiencies.tools.join(', ') || 'None'}</span>
            </div>
            <div>
              <span className="font-bold text-stone-700 uppercase block">Languages</span>
              <span className="text-stone-900 truncate block">{character.languages.join(', ') || 'Common'}</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 2: BACK SHEET (EQUIPMENT, WEALTH & ROLEPLAYING)
      ========================================================================= */}
      {shouldRenderBack && (
        <div className={`space-y-2 pt-1 pb-2 ${shouldRenderSpells || shouldRenderNotes ? 'print-page-break' : ''}`}>
          {/* Document Header */}
          <div className="border-b-2 border-[#7b1113] pb-1.5">
            <div className="flex items-center justify-between">
              <span className="font-fantasy font-extrabold text-[#7b1113] text-base tracking-wider">
                {character.name ? `${character.name.toUpperCase()} — ` : ''}EQUIPMENT, WEALTH &amp; LORE
              </span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                Back Sheet
              </span>
            </div>
            <span className="text-[10px] text-stone-600 block mt-0.5">
              {classSummary} • {character.race} • Background: {character.background}
            </span>
          </div>

          {/* Currency & Carrying Capacity */}
          <div className="bg-[#f6efe6] border border-stone-300 p-1.5 space-y-1.5">
            <div className="flex justify-between items-center border-b border-stone-300 pb-1">
              <span className="font-bold text-[#1f4e78] text-[10px] uppercase">
                Coinage &amp; Wealth
              </span>
              <span className="font-mono text-[9px] text-stone-600">
                Total Weight: {totalWeight} lbs / {maxCarryWeight} lbs Max (STR {strScore} × 15)
                {character.useVariantEncumbrance && ` • Variant: Encumbered at >${strScore * 5} lbs`}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {(['cp', 'sp', 'ep', 'gp', 'pp'] as const).map((coin) => (
                <div key={coin} className="bg-white border border-stone-400 p-1 rounded">
                  <span className="block text-[8px] font-bold text-stone-600 uppercase tracking-wider">
                    {coin.toUpperCase()}
                  </span>
                  <span className="font-mono text-base font-bold text-stone-900 block">
                    {character.currency[coin]}
                  </span>
                  <span className="text-[7.5px] text-stone-400 font-mono">
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
            <div className="bg-[#1f4e78] text-white font-bold py-0.5 px-2 text-[10px] uppercase flex justify-between">
              <span>INVENTORY &amp; GEAR</span>
              <span className="text-[9px] font-normal">
                {character.inventory.length} Items Recorded • {totalItemWeight} lbs Gear
              </span>
            </div>
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-300 text-[9px] font-bold text-stone-600">
                  <th className="p-1 pl-1.5">Item Name</th>
                  <th className="p-1">Category</th>
                  <th className="p-1 text-center">Qty</th>
                  <th className="p-1 text-center">Weight</th>
                  <th className="p-1 text-center">Total</th>
                  <th className="p-1">Notes / Description</th>
                </tr>
              </thead>
              <tbody>
                {character.inventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-2 text-center text-stone-400 italic">
                      No inventory items recorded.
                    </td>
                  </tr>
                ) : (
                  character.inventory.map((item) => (
                    <tr key={item.id} className="border-b border-stone-200 last:border-b-0 print-avoid-break leading-tight">
                      <td className="p-1 pl-1.5 font-bold text-stone-900">{item.name}</td>
                      <td className="p-1 text-stone-600 text-[9px]">{item.category || 'Backpack'}</td>
                      <td className="p-1 text-center font-mono font-bold text-stone-800">{item.qty || 1}</td>
                      <td className="p-1 text-center font-mono text-stone-600">{item.weight || 0} lbs</td>
                      <td className="p-1 text-center font-mono font-bold text-stone-800">
                        {Math.round(((item.weight || 0) * (item.qty || 1)) * 10) / 10} lbs
                      </td>
                      <td className="p-1 text-[9px] text-stone-600 italic">
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
            <div className="border border-stone-400 bg-white p-1.5">
              <div className="font-bold text-[#1f4e78] text-[10px] uppercase border-b border-stone-300 pb-0.5 mb-1 flex justify-between">
                <span>SPECIAL CLASS RESOURCES &amp; FEATURES</span>
                <span className="text-[9px] font-normal text-stone-500">Tracked Resources</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {character.resources.map((res) => (
                  <div key={res.id} className="border border-stone-300 rounded p-1 bg-[#faf6f0] text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900 truncate text-[10px]">{res.name}</span>
                      <span className="font-mono font-bold text-[#7b1113] text-[10px]">
                        {res.current} / {res.max}
                      </span>
                    </div>
                    <span className="text-[8px] text-stone-500 italic block">Reset: {res.reset}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roleplaying & Storytelling */}
          <div className="border border-stone-400 bg-white">
            <div className="bg-[#7b1113] text-white font-bold text-center py-0.5 tracking-wider text-[10px] uppercase">
              ROLEPLAYING &amp; STORYTELLING
            </div>
            <div className="grid grid-cols-2 divide-x divide-stone-300 p-2 text-xs">
              <div className="pr-2 space-y-1">
                <span className="font-bold text-[#1f4e78] text-[10px] uppercase block border-b border-stone-200 pb-0.5">
                  Personality Traits, Ideals &amp; Bonds
                </span>
                <p className="text-[10px] text-stone-700 leading-relaxed whitespace-pre-line mt-0.5">
                  {character.roleplaying?.personality || 'No personality notes recorded.'}
                </p>
              </div>

              <div className="pl-2 space-y-1">
                <span className="font-bold text-[#1f4e78] text-[10px] uppercase block border-b border-stone-200 pb-0.5">
                  Character Bio, Backstory &amp; Notes
                </span>
                <p className="text-[10px] text-stone-700 leading-relaxed whitespace-pre-line mt-0.5">
                  {character.roleplaying?.bio || 'No backstory recorded.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 3+: SPELLS SHEET (CASTING INFO & PREPARED SPELLS)
      ========================================================================= */}
      {shouldRenderSpells && (
        <div className={`space-y-2 pt-1 pb-2 ${shouldRenderNotes ? 'print-page-break' : ''}`}>
          {/* Document Header */}
          <div className="border-b-2 border-[#7b1113] pb-1.5">
            <div className="flex items-center justify-between">
              <span className="font-fantasy font-extrabold text-[#7b1113] text-base tracking-wider">
                {character.name ? `${character.name.toUpperCase()} — ` : ''}SPELLCASTING &amp; PREPARED SPELLS
              </span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                Spells Sheet
              </span>
            </div>
            <span className="text-[10px] text-stone-600 block mt-0.5">
              {classSummary} • {character.race} • Warlock Pact Slots recover on Short Rest
            </span>
          </div>

          {/* Casting Information Cards */}
          <div className="grid grid-cols-12 gap-1.5">
            <div className="col-span-3 bg-white border border-stone-400 p-1.5 rounded text-center">
              <span className="text-[8px] font-bold text-stone-500 uppercase block">Casting Ability</span>
              <span className="font-mono text-lg font-bold text-stone-900">
                {currentCastingStat}
              </span>
              <span className="text-[8px] text-stone-500 block">
                Modifier: {castingStatMod >= 0 ? `+${castingStatMod}` : castingStatMod}
              </span>
            </div>

            <div className="col-span-3 bg-white border border-stone-400 p-1.5 rounded text-center">
              <span className="text-[8px] font-bold text-stone-500 uppercase block">Spell Save DC</span>
              <span className="font-mono text-lg font-extrabold text-[#7b1113]">{saveDC}</span>
              <span className="text-[8px] text-stone-500 block">
                8 + PB (+{character.proficiencyBonus}) + Mod
              </span>
            </div>

            <div className="col-span-3 bg-white border border-stone-400 p-1.5 rounded text-center">
              <span className="text-[8px] font-bold text-stone-500 uppercase block">Spell Attack Bonus</span>
              <span className="font-mono text-lg font-extrabold text-[#276749]">
                {attackBonus >= 0 ? `+${attackBonus}` : attackBonus}
              </span>
              <span className="text-[8px] text-stone-500 block">
                PB (+{character.proficiencyBonus}) + Mod
              </span>
            </div>

            <div className="col-span-3 bg-[#f6efe6] border border-stone-400 p-1.5 rounded flex flex-col justify-between">
              <span className="text-[8px] font-bold text-stone-500 uppercase block">Prepared Spells</span>
              <span className="font-mono text-base font-bold text-stone-900">
                {preparedSpells.length} Spells
              </span>
              <span className="text-[8px] font-bold text-stone-700 block truncate">
                {classPreparedSpells.length > 0
                  ? classPreparedSpells.map((b) => `${b.className}: ${b.prepared}`).join(' • ')
                  : 'Free Preparation'}
              </span>
            </div>
          </div>

          {/* Spell Slots Matrix */}
          <div className="border border-stone-400 bg-white p-1.5">
            <span className="font-bold text-[#1f4e78] text-[10px] uppercase block border-b border-stone-300 pb-0.5 mb-1">
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
                    <span className="block text-[8px] font-bold text-stone-600 uppercase">Lvl {lvl}</span>
                    <span className="font-mono font-bold text-stone-900 text-xs block">
                      {total > 0 ? `${total - used}/${total}` : '—'}
                    </span>
                    <div className="flex justify-center gap-0.5 mt-0.5 text-[7px] text-stone-400">
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
          <div className="space-y-2">
            <div className="bg-[#7b1113] text-white font-bold py-0.5 px-3 text-[10px] tracking-wider uppercase shadow-sm">
              PREPARED SPELLS &amp; TACTICAL BRIEFS
            </div>

            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
              const levelSpells = spellsByLevel[level] || [];
              if (levelSpells.length === 0) return null;

              const title =
                level === 0 ? 'CANTRIPS (0 LEVEL)' : `LEVEL ${level} SPELLS (${levelSpells.length} Prepared)`;

              return (
                <div key={level} className="space-y-1 print-avoid-break">
                  <div className="bg-[#1f4e78] text-white font-bold text-[10px] py-0.5 px-2 rounded-sm uppercase tracking-wider flex justify-between">
                    <span>{title}</span>
                    <span className="text-[9px] font-normal">{levelSpells.length} Spells</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {levelSpells.map((spell) => {
                      const schoolColor = SCHOOL_COLORS[spell.school] || 'text-stone-800 border-stone-300 bg-stone-50';
                      const customNote = character.spellcasting.spellNotes?.[spell.name];

                      return (
                        <div
                          key={spell.id || spell.name}
                          className="border border-stone-300 rounded p-1.5 bg-white print-avoid-break space-y-0.5"
                        >
                          <div className="flex items-start justify-between gap-1 border-b border-stone-200 pb-0.5">
                            <div>
                              <span className="font-bold text-stone-900 text-[10.5px] block leading-tight">
                                {spell.name}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5 text-[8px] text-stone-500">
                                <span>{spell.castingTime}</span>
                                <span>•</span>
                                <span>{spell.range}</span>
                                <span>•</span>
                                <span>{spell.duration}</span>
                              </div>
                            </div>
                            <span
                              className={`text-[8px] font-bold px-1 py-0.2 rounded border uppercase tracking-wider shrink-0 ${schoolColor}`}
                            >
                              {spell.school}
                            </span>
                          </div>

                          <p className="text-[9px] text-stone-700 leading-snug line-clamp-3">
                            {spell.effect || spell.fullText}
                          </p>

                          {customNote && (
                            <div className="text-[8px] bg-amber-50/80 border border-amber-200 text-amber-900 px-1 py-0.2 rounded italic">
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
      )}

      {/* =========================================================================
          PAGE 4: CAMPAIGN & CHARACTER NOTES
      ========================================================================= */}
      {shouldRenderNotes && (
        <div className="space-y-2 pt-1 pb-2">
          {/* Document Header */}
          <div className="border-b-2 border-[#7b1113] pb-1.5">
            <div className="flex items-center justify-between">
              <span className="font-fantasy font-extrabold text-[#7b1113] text-base tracking-wider">
                {character.name ? `${character.name.toUpperCase()} — ` : ''}CAMPAIGN &amp; SESSION NOTES
              </span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                Notes Sheet • {(character.notes || []).length} Recorded
              </span>
            </div>
            <span className="text-[10px] text-stone-600 block mt-0.5">
              {classSummary} • {character.race}
            </span>
          </div>

          {(character.notes || []).length === 0 ? (
            <div className="border border-stone-300 p-4 text-center text-stone-400 italic text-xs">
              No campaign notes recorded.
            </div>
          ) : (
            <div className="space-y-2">
              {(character.notes || []).map((note) => (
                <div key={note.id} className="border border-stone-300 rounded overflow-hidden print-avoid-break bg-white">
                  <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-[10px] uppercase flex justify-between items-center">
                    <span>{note.title || 'Untitled Note'}</span>
                    <span className="text-[8px] text-stone-300 font-mono">
                      {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="p-2 text-[10px] text-stone-800 whitespace-pre-wrap leading-relaxed">
                    {note.content || <em className="text-stone-400">Empty note</em>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
