import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Tooltip } from '../common/Tooltip';

export const CombatSection: React.FC = () => {
  const {
    character,
    updateCharacter,
    adjustHp,
    setTempHp,
    updateHitDieCurrent,
    setInspiration,
    getAbilityMod,
  } = useCharacter();

  const [customHpVal, setCustomHpVal] = useState('');

  const toggleDeathSave = (type: 'successes' | 'failures', index: number) => {
    updateCharacter((prev) => {
      const current = prev.deathSaves[type];
      const newCount = index < current ? index : current + 1;
      return {
        ...prev,
        deathSaves: {
          ...prev.deathSaves,
          [type]: Math.max(0, Math.min(3, newCount)),
        },
      };
    });
  };

  // Dynamic Armor & AC Calculations
  const dexMod = getAbilityMod('dex');
  const conMod = getAbilityMod('con');
  const conModFormatted = conMod >= 0 ? `+${conMod}` : `${conMod}`;
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
  const shieldAc = shieldItem ? (shieldItem.ac || 2) : 0;
  const computedTotalAc = baseArmorAc + dexApplied + shieldAc;
  const effectiveAc = character.armorClass || computedTotalAc;

  return (
    <div className="h-full flex flex-col space-y-1">
      {/* Banner */}
      <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-xs uppercase shadow-sm">
        COMBAT
      </div>

      <div className="bg-[#f6efe6] p-2 border border-stone-300 flex-1 flex flex-col justify-between space-y-2 text-xs">
        {/* Top Combat Row: HP, AC, Initiative */}
        <div className="grid grid-cols-12 gap-2">
          {/* Hit Points Box */}
          <div className="col-span-12 sm:col-span-5 border border-stone-400 bg-white flex flex-col justify-between">
            <div className="bg-[#1f4e78] text-white font-bold text-center py-0.5 text-[11px]">
              Hit Points
            </div>
            <div className="p-2 text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-mono text-2xl font-extrabold text-stone-900">
                  {character.hp.current}
                </span>
                <span className="font-mono text-stone-500 text-sm">/{character.hp.max}</span>
                {character.hp.temp > 0 && (
                  <span className="ml-1 text-[10px] font-mono font-bold text-cyan-800 bg-cyan-100 px-1 rounded border border-cyan-300">
                    +{character.hp.temp} Temp
                  </span>
                )}
              </div>

              {/* Quick damage / heal buttons */}
              <div className="flex items-center justify-center gap-1 mt-2">
                <button
                  onClick={() => adjustHp(1, true)}
                  className="px-1.5 py-0.5 bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-800 rounded border border-stone-300 text-[10px] font-mono"
                >
                  -1
                </button>
                <button
                  onClick={() => adjustHp(5, true)}
                  className="px-1.5 py-0.5 bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-800 rounded border border-stone-300 text-[10px] font-mono"
                >
                  -5
                </button>
                <button
                  onClick={() => adjustHp(1, false)}
                  className="px-1.5 py-0.5 bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 rounded border border-stone-300 text-[10px] font-mono"
                >
                  +1
                </button>
                <button
                  onClick={() => adjustHp(5, false)}
                  className="px-1.5 py-0.5 bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 rounded border border-stone-300 text-[10px] font-mono"
                >
                  +5
                </button>
              </div>

              {/* Temp HP input */}
              <div className="flex items-center justify-center gap-1 mt-1 text-[10px]">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Temp"
                  value={customHpVal}
                  onChange={(e) => setCustomHpVal(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt(customHpVal, 10);
                      if (!isNaN(val)) setTempHp(val);
                      setCustomHpVal('');
                    }
                  }}
                  className="w-12 text-center border border-stone-300 rounded px-1 py-0.5 focus:border-[#1f4e78] focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = parseInt(customHpVal, 10);
                    if (!isNaN(val)) setTempHp(val);
                    setCustomHpVal('');
                  }}
                  className="bg-stone-200 hover:bg-stone-300 px-1.5 py-0.5 rounded text-stone-700 font-semibold"
                >
                  Set Temp
                </button>
              </div>
            </div>
            <div className="bg-stone-100 border-t border-stone-300 text-[10px] text-stone-600 px-2 py-0.5 text-center">
              Temp: {character.hp.temp}
            </div>
          </div>

          {/* AC Box */}
          <div className="col-span-6 sm:col-span-3 border border-stone-400 bg-white flex flex-col justify-between text-center">
            <div className="bg-[#1f4e78] text-white font-bold py-0.5 text-[11px] tracking-wide">
              AC
            </div>
            <div className="p-2 flex flex-col items-center justify-center flex-1">
              <div
                className="w-14 h-10 bg-[#d9ead3] border border-[#276749] rounded flex items-center justify-center font-mono font-extrabold text-2xl text-stone-900 shadow-sm"
                title={`Computed AC: ${computedTotalAc}`}
              >
                {effectiveAc}
              </div>
              <span className="text-[10px] text-stone-500 mt-1 font-mono text-center">
                = {baseArmorAc} ({bodyArmor ? bodyArmor.name : 'Unarmored'}) + {dexApplied >= 0 ? `+${dexApplied}` : dexApplied} (Dex)
                {shieldItem ? ` + ${shieldAc} (Shield)` : ''}
              </span>
            </div>
            <div className="bg-stone-100 border-t border-stone-300 text-[10px] text-stone-600 py-0.5 px-1 truncate">
              {shieldItem ? `${shieldItem.name} (+${shieldAc} AC)` : 'No shield'}
            </div>
          </div>

          {/* Initiative Box (Moved from Core Info to right of AC) */}
          <div className="col-span-6 sm:col-span-4 border border-stone-400 bg-white flex flex-col justify-between text-center">
            <div className="bg-[#1f4e78] text-white font-bold py-0.5 text-[11px] tracking-wide">
              INITIATIVE
            </div>
            <div className="p-2 flex flex-col items-center justify-center flex-1">
              {(() => {
                const hasAlert = (character.features || []).some(
                  (f) => f.name?.toLowerCase().trim() === 'alert' || f.name?.toLowerCase().includes('alert')
                );
                const alertBonus = hasAlert ? (character.proficiencyBonus || 2) : 0;
                const effectiveInitiative = dexMod + alertBonus;
                return (
                  <>
                    <div className="w-14 h-10 bg-[#d9ead3] border border-[#276749] rounded flex items-center justify-center font-mono font-extrabold text-2xl text-stone-900 shadow-sm">
                      {effectiveInitiative >= 0 ? `+${effectiveInitiative}` : effectiveInitiative}
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1 font-mono text-center">
                      = DEX Modifier ({dexMod >= 0 ? `+${dexMod}` : dexMod})
                      {hasAlert ? ` + Alert (+${alertBonus})` : ''}
                    </span>
                  </>
                );
              })()}
            </div>
            <div className="bg-stone-100 border-t border-stone-300 text-[10px] text-stone-600 py-0.5 px-1 truncate text-center">
              Bonus to Initiative rolls
            </div>
          </div>
        </div>

        {/* Middle Combat Row: Insp Pts, Hit Dice, Death Saves */}
        <div className="grid grid-cols-12 gap-2 text-xs">
          {/* Inspiration Points */}
          <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white text-center flex flex-col justify-between">
            <div className="bg-black text-white font-bold py-0.5 text-[10px] tracking-wider uppercase">
              Insp. Pts
            </div>
            <div className="p-1.5 flex items-center justify-center flex-1">
              <input
                type="text"
                inputMode="numeric"
                value={character.inspiration ?? 0}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setInspiration(val === '' ? 0 : parseInt(val, 10));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className={`w-14 text-center font-mono font-extrabold text-xl bg-transparent hover:bg-stone-50 focus:bg-amber-50/70 focus:outline-none rounded py-0.5 cursor-pointer transition-colors ${
                  (character.inspiration || 0) > 0 ? 'text-[#166534]' : 'text-stone-700'
                }`}
                title="Click to edit Inspiration Points"
              />
            </div>
            <div className="bg-stone-100 border-t border-stone-300 text-[9px] text-stone-500 py-0.5 font-medium">
              {(character.inspiration || 0) > 0 ? 'Heroic Inspired' : 'No Inspiration'}
            </div>
          </div>

          {/* Hit Dice Box */}
          <div className="col-span-12 sm:col-span-5 border border-stone-400 bg-white flex flex-col justify-between">
            <div className="bg-black text-white font-bold grid grid-cols-12 text-[10px] py-0.5 text-center shrink-0">
              <div className="col-span-5">Hit Dice</div>
              <div className="col-span-7">Avail / Total</div>
            </div>
            <div className="flex-1 flex flex-col divide-y divide-stone-300">
              {character.hitDice.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-stone-400 text-[10px] py-2">
                  No Hit Dice
                </div>
              ) : (
                character.hitDice.map((hd, idx) => (
                  <div key={`${hd.source || ''}-${hd.die}-${idx}`} className="flex-1 grid grid-cols-12 text-center text-xs min-h-[30px] items-stretch">
                    <div
                      className="col-span-5 bg-[#d9ead3] font-bold border-r border-stone-300 text-stone-800 flex flex-col items-center justify-center py-1 px-1"
                      title={hd.source ? `Class: ${hd.source}` : undefined}
                    >
                      <span className="font-mono text-xs leading-tight">{hd.total}{hd.die}</span>
                      {hd.source && character.hitDice.length > 1 && (
                        <span className="text-[8px] font-normal text-stone-600 truncate max-w-[80px]">
                          {hd.source}
                        </span>
                      )}
                    </div>
                    <div className="col-span-7 bg-white flex items-center justify-center gap-1 font-mono text-xs py-1 px-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={hd.current}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, '');
                          const val = cleaned === '' ? 0 : parseInt(cleaned, 10);
                          updateHitDieCurrent(idx, Math.max(0, val));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="w-8 text-center font-mono font-bold text-xs bg-transparent hover:bg-stone-100 focus:bg-amber-50/70 focus:outline-none rounded py-0.5 cursor-pointer transition-colors"
                        title="Click to edit available hit dice"
                      />
                      <span className="text-stone-500 font-mono text-xs select-none">
                        / {hd.total}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="bg-stone-100 border-t border-stone-300 text-[9px] text-stone-500 py-0.5 text-center font-medium flex items-center justify-center">
              <Tooltip
                placement="top"
                maxWidth="max-w-xs"
                className="justify-center cursor-help"
                content={
                  <div className="space-y-1.5 text-left">
                    <div className="font-bold text-amber-300 text-xs border-b border-stone-700/60 pb-1 flex items-center justify-between">
                      <span>How to Use Hit Dice</span>
                      <span className="text-[10px] text-amber-100/90 font-mono">CON {conModFormatted}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-300 text-[11px] block">Short Rest (1 Hour):</span>
                      <span className="text-stone-300 text-[10px] leading-relaxed block">
                        Spend 1 or more available Hit Dice to regain Hit Points. For each die rolled, add your Constitution modifier ({conModFormatted}) to the roll.
                      </span>
                    </div>
                    <div className="border-t border-stone-800 pt-1">
                      <span className="font-semibold text-sky-300 text-[11px] block">Long Rest (8 Hours):</span>
                      <span className="text-stone-300 text-[10px] leading-relaxed block">
                        Regain all lost HP, plus spent Hit Dice up to half your total Hit Dice (minimum of 1 die).
                      </span>
                    </div>
                  </div>
                }
              >
                <span className="underline decoration-dotted decoration-stone-400 underline-offset-2 hover:text-[#1f4e78] transition-colors">
                  Regain half total on Long Rest ⓘ
                </span>
              </Tooltip>
            </div>
          </div>

          {/* Death Saves */}
          <div className="col-span-12 sm:col-span-4 border border-stone-400 bg-white flex flex-col justify-between">
            <div className="bg-stone-100 border-b border-stone-300 font-bold text-center py-0.5 text-[10px] text-stone-800">
              Death Saves
            </div>
            <div className="p-1.5 space-y-1.5 flex-1 flex flex-col justify-center text-[10px]">
              <div className="flex items-center justify-between px-2">
                <span className="text-emerald-800 font-bold">Success</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDeathSave('successes', i)}
                      className={`w-3.5 h-3.5 rounded border border-stone-600 transition-colors ${
                        i < character.deathSaves.successes ? 'bg-emerald-600' : 'bg-white'
                      }`}
                      title={`Toggle death save success #${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-red-800 font-bold">Failure</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDeathSave('failures', i)}
                      className={`w-3.5 h-3.5 rounded border border-stone-600 transition-colors ${
                        i < character.deathSaves.failures ? 'bg-red-600' : 'bg-white'
                      }`}
                      title={`Toggle death save failure #${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-stone-100 border-t border-stone-300 text-[9px] text-stone-500 py-0.5 text-center font-medium">
              3 Success = Stable • 3 Failure = Dead
            </div>
          </div>
        </div>

        {/* Special Attacks & Defenses (Stretches to bottom edge of Skills section) */}
        <div className="grid grid-cols-12 gap-2 text-xs flex-1 min-h-[140px]">
          <div className="col-span-12 sm:col-span-6 border border-stone-400 bg-white flex flex-col">
            <div className="bg-black text-white font-bold py-0.5 text-center text-[10px]">
              Special Attacks
            </div>
            <textarea
              value={character.specialAttacks}
              onChange={(e) =>
                updateCharacter((prev) => ({ ...prev, specialAttacks: e.target.value }))
              }
              placeholder="e.g. Sneak Attack (1d6), Extra Attack, Stunning Strike..."
              className="w-full flex-1 p-2 text-[11px] text-stone-800 focus:outline-none resize-none font-sans"
            />
          </div>

          <div className="col-span-12 sm:col-span-6 border border-stone-400 bg-white flex flex-col">
            <div className="bg-black text-white font-bold py-0.5 text-center text-[10px]">
              Special Defenses
            </div>
            <textarea
              value={character.specialDefenses}
              onChange={(e) =>
                updateCharacter((prev) => ({ ...prev, specialDefenses: e.target.value }))
              }
              placeholder="e.g. Uncanny Dodge, Evasion, Damage Resistances..."
              className="w-full flex-1 p-2 text-[11px] text-stone-800 focus:outline-none resize-none font-sans"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
