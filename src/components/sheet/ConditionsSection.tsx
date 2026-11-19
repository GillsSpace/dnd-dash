import React from 'react';
import { useCharacter } from '../../context/CharacterContext';

const CONDITIONS_LIST = [
  ['Blinded', 'Paralysed'],
  ['Charmed', 'Petrified'],
  ['Deafened', 'Poisoned'],
  ['Frightened', 'Prone'],
  ['Grappled', 'Restrained'],
  ['Incapacitated', 'Stunned'],
  ['Invisible', 'Unconscious'],
];

const EXHAUSTION_LEVELS = [
  { level: 1, text: 'Level 1 - Disadvantage on ability checks' },
  { level: 2, text: 'Level 2 - Speed halved' },
  { level: 3, text: 'Level 3 - Disadv. on attack rolls + saving throws' },
  { level: 4, text: 'Level 4 - Hit point maximum halved' },
  { level: 5, text: 'Level 5 - Speed reduced to 0' },
  { level: 6, text: 'Level 6 - Death' },
];

export const ConditionsSection: React.FC = () => {
  const { character, updateCharacter, toggleCondition, setExhaustionLevel } = useCharacter();

  return (
    <div className="space-y-1">
      {/* Banner */}
      <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-xs uppercase shadow-sm">
        CONDITIONS
      </div>

      <div className="bg-[#f6efe6] p-2 border border-stone-300 grid grid-cols-12 gap-2 text-xs">
        {/* Left: 14 Standard Conditions */}
        <div className="col-span-12 sm:col-span-5 border border-stone-400 bg-white">
          <div className="bg-[#d9ead3] text-[#276749] font-bold text-center py-0.5 text-[11px] border-b border-stone-300">
            Conditions
          </div>
          <table className="w-full text-[11px] border-collapse">
            <tbody>
              {CONDITIONS_LIST.map(([c1, c2]) => {
                const checked1 = character.conditions[c1] || false;
                const checked2 = character.conditions[c2] || false;

                return (
                  <tr key={c1} className="border-b border-stone-200 last:border-b-0 hover:bg-stone-50">
                    <td className="px-2 py-0.5 border-r border-stone-200">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className={checked1 ? 'font-bold text-red-700' : 'text-stone-800'}>{c1}</span>
                        <input
                          type="checkbox"
                          checked={checked1}
                          onChange={() => toggleCondition(c1)}
                          className="w-4 h-4 rounded border-stone-300 ml-1 cursor-pointer"
                        />
                      </label>
                    </td>
                    <td className="px-2 py-0.5">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className={checked2 ? 'font-bold text-red-700' : 'text-stone-800'}>{c2}</span>
                        <input
                          type="checkbox"
                          checked={checked2}
                          onChange={() => toggleCondition(c2)}
                          className="w-4 h-4 rounded border-stone-300 ml-1 cursor-pointer"
                        />
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Middle: Exhaustion Levels (2024 Rules) */}
        <div className="col-span-12 sm:col-span-4 border border-stone-400 bg-white flex flex-col justify-between">
          <div className="bg-[#d9ead3] text-[#276749] font-bold text-center py-0.5 text-[11px] border-b border-stone-300 flex items-center justify-between px-2">
            <span>Exhaustion (2024 Rules)</span>
            <span className="text-[10px] text-stone-600 font-normal">Level {character.exhaustionLevel || 0}/6</span>
          </div>

          <div className="p-2 space-y-2">
            {/* Level Stepper & Input */}
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded p-1.5">
              <span className="font-bold text-stone-700 text-[11px]">Exhaustion Level:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setExhaustionLevel(Math.max(0, (character.exhaustionLevel || 0) - 1))}
                  className="w-5 h-5 flex items-center justify-center bg-stone-200 hover:bg-stone-300 rounded font-mono font-bold text-xs text-stone-800 transition-colors"
                  title="Decrease exhaustion level"
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={character.exhaustionLevel || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setExhaustionLevel(Math.max(0, Math.min(6, val)));
                  }}
                  className="w-9 text-center font-mono font-black text-sm bg-white border border-stone-300 rounded py-0.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                />
                <button
                  type="button"
                  onClick={() => setExhaustionLevel(Math.min(6, (character.exhaustionLevel || 0) + 1))}
                  className="w-5 h-5 flex items-center justify-center bg-stone-200 hover:bg-stone-300 rounded font-mono font-bold text-xs text-stone-800 transition-colors"
                  title="Increase exhaustion level"
                >
                  +
                </button>
              </div>
            </div>

            {/* Two Red Penalty Boxes */}
            <div className="grid grid-cols-2 gap-1.5">
              {/* Box 1: D20 Test Penalty */}
              <div
                className={`p-1.5 rounded border text-center transition-colors ${
                  (character.exhaustionLevel || 0) > 0
                    ? 'bg-red-50 border-red-400 text-red-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <span className="block text-[9px] font-bold uppercase tracking-wider">
                  D20 Tests Penalty
                </span>
                <span
                  className={`block font-mono font-black text-base my-0.5 ${
                    (character.exhaustionLevel || 0) > 0 ? 'text-red-700' : 'text-stone-700'
                  }`}
                >
                  {(character.exhaustionLevel || 0) > 0 ? `-${(character.exhaustionLevel || 0) * 2}` : '0'}
                </span>
                <span className="block text-[8px] text-stone-500 leading-tight">
                  Attacks, Checks &amp; Saves
                </span>
              </div>

              {/* Box 2: Speed Penalty */}
              <div
                className={`p-1.5 rounded border text-center transition-colors ${
                  (character.exhaustionLevel || 0) > 0
                    ? 'bg-red-50 border-red-400 text-red-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <span className="block text-[9px] font-bold uppercase tracking-wider">
                  Speed Penalty
                </span>
                <span
                  className={`block font-mono font-black text-base my-0.5 ${
                    (character.exhaustionLevel || 0) > 0 ? 'text-red-700' : 'text-stone-700'
                  }`}
                >
                  {(character.exhaustionLevel || 0) > 0 ? `-${(character.exhaustionLevel || 0) * 5} ft` : '0 ft'}
                </span>
                <span className="block text-[8px] text-stone-500 leading-tight">
                  Movement Reduced
                </span>
              </div>
            </div>

            {/* Fatal Alert if Level 6 */}
            {(character.exhaustionLevel || 0) >= 6 && (
              <div className="bg-red-600 text-white font-bold text-center py-1 rounded text-[11px] animate-pulse">
                Level 6 Exhaustion: DEATH
              </div>
            )}
          </div>

          <div className="bg-stone-100 border-t border-stone-300 text-[9px] text-stone-500 px-2 py-1 text-center">
            Finishing a Long Rest removes 1 level of Exhaustion.
          </div>
        </div>

        {/* Right: Other Conditions & Temp Bonuses */}
        <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white flex flex-col">
          <div className="bg-[#d9ead3] text-[#276749] font-bold text-center py-0.5 text-[11px] border-b border-stone-300">
            Other Conditions / Temporary Bonuses
          </div>
          <textarea
            rows={7}
            placeholder="● Active spell buffs, temporary AC bonuses, blessings..."
            value={character.otherConditionsNotes}
            onChange={(e) =>
              updateCharacter((prev) => ({ ...prev, otherConditionsNotes: e.target.value }))
            }
            className="w-full flex-1 p-2 text-[11px] text-stone-800 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};
