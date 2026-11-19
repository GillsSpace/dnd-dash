import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { SkillProficiency } from '../../types/character';
import { Tooltip } from '../common/Tooltip';
import { SkillTooltipCard } from '../common/TooltipContent';
import { Edit2 } from 'lucide-react';
import { PassiveModal, PassiveSenseKey } from '../modals/PassiveModal';

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

export const SkillsSection: React.FC = () => {
  const { character, updateCharacter, getAbilityMod, getSkillBonus } = useCharacter();
  const [selectedSense, setSelectedSense] = useState<PassiveSenseKey | null>(null);

  const cycleSkillProf = (key: string) => {
    updateCharacter((prev) => {
      const current = prev.skills[key]?.prof || 'none';
      const next: SkillProficiency =
        current === 'none' ? 'prof' : current === 'prof' ? 'expert' : 'none';

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [key]: {
            ...prev.skills[key],
            prof: next,
          },
        },
      };
    });
  };

  const insightBonus = character.passives?.insightBonus || 0;
  const investigationBonus = character.passives?.investigationBonus || 0;
  const perceptionBonus = character.passives?.perceptionBonus || 0;

  const passiveInsight = 10 + getSkillBonus('insight') + insightBonus;
  const passiveInvestigation = 10 + getSkillBonus('investigation') + investigationBonus;
  const passivePerception = 10 + getSkillBonus('perception') + perceptionBonus;

  return (
    <div className="space-y-1">
      {/* Banner */}
      <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-xs uppercase shadow-sm">
        SKILLS
      </div>

      <div className="border border-stone-400 bg-white">
        {/* Table Header */}
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#1f4e78] text-white font-bold text-xs text-center">
              <th className="py-1 px-1 w-14">Roll</th>
              <th className="text-left px-2.5 py-1">Skill</th>
              <th className="w-11 py-1">Prof</th>
              <th className="w-11 py-1">Adv</th>
            </tr>
          </thead>
          <tbody>
            {SKILL_LIST.map(({ key, label, ability }) => {
              const skillData = character.skills[key] || { ability, prof: 'none' };
              const bonus = getSkillBonus(key);
              const mod = getAbilityMod(ability);
              const rollColorClass =
                bonus > 0
                  ? 'text-[#166534]'
                  : bonus === 0
                  ? 'text-stone-900 font-bold'
                  : 'text-[#991b1b]';

              return (
                <tr
                  key={key}
                  className="group border-b border-stone-300 last:border-b-0 hover:bg-[#eaf2fd] transition-colors"
                >
                  {/* Calculated Roll */}
                  <td className="text-center font-mono py-1 px-1 border-r border-stone-300 bg-[#f8f9fa] group-hover:bg-[#d5e5fc] group-hover:border-r-blue-300 transition-colors">
                    <Tooltip
                      content={
                        <SkillTooltipCard
                          name={label}
                          ability={ability}
                          abilityMod={mod}
                          prof={skillData.prof}
                          profBonus={character.proficiencyBonus}
                          totalBonus={bonus}
                        />
                      }
                    >
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono font-bold tracking-tight transition-all duration-150 group-hover:scale-110 group-hover:bg-white/90 group-hover:shadow-xs cursor-help ${rollColorClass}`}
                        title="Click or hover to inspect calculation"
                      >
                        {bonus >= 0 ? `+${bonus}` : bonus}
                      </span>
                    </Tooltip>
                  </td>

                  {/* Skill Name */}
                  <td className="px-2.5 py-1 text-stone-800 text-xs font-medium border-r border-stone-300 group-hover:text-[#1f4e78] group-hover:font-semibold transition-colors">
                    {label}
                  </td>

                  {/* Proficiency Toggle */}
                  <td className="text-center font-bold text-stone-900 py-1">
                    <button
                      onClick={() => cycleSkillProf(key)}
                      className="hover:scale-125 transition-transform text-xs"
                      title="Click to toggle (None -> Proficient -> Expertise)"
                    >
                      {skillData.prof === 'expert' ? (
                        <span className="text-amber-800 font-bold text-[10px] bg-amber-100 px-1 rounded border border-amber-300">
                          exp
                        </span>
                      ) : skillData.prof === 'prof' ? (
                        <span className="text-stone-900 text-xs">●</span>
                      ) : (
                        <span className="text-stone-300 text-xs">○</span>
                      )}
                    </button>
                  </td>

                  {/* Advantage */}
                  <td className="text-center text-stone-400 text-xs py-1">
                    —
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Bottom Senses Blocks Matching PDF */}
        <div className="border-t border-stone-400 grid grid-cols-12 text-xs">
          <div className="col-span-3 bg-[#d9ead3] border-r border-stone-400 font-mono font-bold text-center py-1 text-stone-900">
            +{character.proficiencyBonus}
          </div>
          <div className="col-span-9 bg-[#1f4e78] text-white font-bold px-2 py-1 flex items-center">
            Proficiency Bonus
          </div>
        </div>

        {/* Passive Insight */}
        <div className="border-t border-stone-400 grid grid-cols-12 text-xs">
          <div className="col-span-3 bg-black text-white font-mono font-bold text-center py-1 flex items-center justify-center">
            {character.passives?.insightNote ? (
              <Tooltip
                content={
                  <div className="space-y-1">
                    <p className="font-fantasy font-bold text-amber-300">Passive Insight Note</p>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap">{character.passives.insightNote}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Formula: 10 + Insight ({getSkillBonus('insight') >= 0 ? `+${getSkillBonus('insight')}` : getSkillBonus('insight')}){insightBonus !== 0 ? ` + Extra (${insightBonus >= 0 ? `+${insightBonus}` : insightBonus})` : ''}</p>
                  </div>
                }
              >
                <span className="cursor-help text-amber-300 hover:text-white transition-colors underline decoration-dotted">
                  {passiveInsight}
                </span>
              </Tooltip>
            ) : (
              <span>{passiveInsight}</span>
            )}
          </div>
          <div className="col-span-9 bg-black text-white font-bold px-2 py-1 flex items-center justify-between">
            <span>Passive Insight</span>
            <button
              type="button"
              onClick={() => setSelectedSense('insight')}
              className="p-0.5 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Edit Passive Insight bonus & note"
              aria-label="Edit Passive Insight"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Passive Investigation */}
        <div className="border-t border-stone-400 grid grid-cols-12 text-xs">
          <div className="col-span-3 bg-black text-white font-mono font-bold text-center py-1 flex items-center justify-center">
            {character.passives?.investigationNote ? (
              <Tooltip
                content={
                  <div className="space-y-1">
                    <p className="font-fantasy font-bold text-amber-300">Passive Investigation Note</p>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap">{character.passives.investigationNote}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Formula: 10 + Investigation ({getSkillBonus('investigation') >= 0 ? `+${getSkillBonus('investigation')}` : getSkillBonus('investigation')}){investigationBonus !== 0 ? ` + Extra (${investigationBonus >= 0 ? `+${investigationBonus}` : investigationBonus})` : ''}</p>
                  </div>
                }
              >
                <span className="cursor-help text-amber-300 hover:text-white transition-colors underline decoration-dotted">
                  {passiveInvestigation}
                </span>
              </Tooltip>
            ) : (
              <span>{passiveInvestigation}</span>
            )}
          </div>
          <div className="col-span-9 bg-black text-white font-bold px-2 py-1 flex items-center justify-between">
            <span>Passive Investigation</span>
            <button
              type="button"
              onClick={() => setSelectedSense('investigation')}
              className="p-0.5 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Edit Passive Investigation bonus & note"
              aria-label="Edit Passive Investigation"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Passive Perception */}
        <div className="border-t border-stone-400 grid grid-cols-12 text-xs">
          <div className="col-span-3 bg-black text-white font-mono font-bold text-center py-1 flex items-center justify-center">
            {character.passives?.perceptionNote ? (
              <Tooltip
                content={
                  <div className="space-y-1">
                    <p className="font-fantasy font-bold text-amber-300">Passive Perception Note</p>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap">{character.passives.perceptionNote}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Formula: 10 + Perception ({getSkillBonus('perception') >= 0 ? `+${getSkillBonus('perception')}` : getSkillBonus('perception')}){perceptionBonus !== 0 ? ` + Extra (${perceptionBonus >= 0 ? `+${perceptionBonus}` : perceptionBonus})` : ''}</p>
                  </div>
                }
              >
                <span className="cursor-help text-amber-300 hover:text-white transition-colors underline decoration-dotted">
                  {passivePerception}
                </span>
              </Tooltip>
            ) : (
              <span>{passivePerception}</span>
            )}
          </div>
          <div className="col-span-9 bg-black text-white font-bold px-2 py-1 flex items-center justify-between">
            <span>Passive Perception</span>
            <button
              type="button"
              onClick={() => setSelectedSense('perception')}
              className="p-0.5 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Edit Passive Perception bonus & note"
              aria-label="Edit Passive Perception"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Passive Sense Modal */}
      {selectedSense && (
        <PassiveModal
          isOpen={!!selectedSense}
          onClose={() => setSelectedSense(null)}
          senseKey={selectedSense}
        />
      )}
    </div>
  );
};
