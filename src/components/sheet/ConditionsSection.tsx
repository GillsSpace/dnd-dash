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

        {/* Middle: Exhaustion Levels */}
        <div className="col-span-12 sm:col-span-4 border border-stone-400 bg-white">
          <div className="bg-[#d9ead3] text-[#276749] font-bold text-center py-0.5 text-[11px] border-b border-stone-300">
            Exhaustion (1 tier removed on L. Rest)
          </div>
          <div className="p-1 space-y-0.5 text-[10px]">
            {EXHAUSTION_LEVELS.map(({ level, text }) => {
              const active = character.exhaustionLevel >= level;
              return (
                <div
                  key={level}
                  onClick={() => setExhaustionLevel(character.exhaustionLevel === level ? level - 1 : level)}
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded cursor-pointer border transition-colors ${
                    active ? 'bg-red-50 text-red-900 border-red-300 font-semibold' : 'hover:bg-stone-50 border-transparent text-stone-700'
                  }`}
                >
                  <span>{text}</span>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-stone-300 cursor-pointer"
                  />
                </div>
              );
            })}
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
