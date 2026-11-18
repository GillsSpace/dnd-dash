import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { SkillProficiency } from '../../types/character';
import { Tooltip } from '../common/Tooltip';
import { SkillTooltipCard } from '../common/TooltipContent';

const SKILL_METADATA: Record<string, { label: string; ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' }> = {
  acrobatics: { label: 'Acrobatics', ability: 'dex' },
  animalHandling: { label: 'Animal Handling', ability: 'wis' },
  arcana: { label: 'Arcana', ability: 'int' },
  athletics: { label: 'Athletics', ability: 'str' },
  deception: { label: 'Deception', ability: 'cha' },
  history: { label: 'History', ability: 'int' },
  insight: { label: 'Insight', ability: 'wis' },
  intimidation: { label: 'Intimidation', ability: 'cha' },
  investigation: { label: 'Investigation', ability: 'int' },
  medicine: { label: 'Medicine', ability: 'wis' },
  nature: { label: 'Nature', ability: 'int' },
  perception: { label: 'Perception', ability: 'wis' },
  performance: { label: 'Performance', ability: 'cha' },
  persuasion: { label: 'Persuasion', ability: 'cha' },
  religion: { label: 'Religion', ability: 'int' },
  sleightOfHand: { label: 'Sleight of Hand', ability: 'dex' },
  stealth: { label: 'Stealth', ability: 'dex' },
  survival: { label: 'Survival', ability: 'wis' },
};

export const SkillsList: React.FC = () => {
  const { character, updateCharacter, getAbilityMod, getSkillBonus } = useCharacter();

  const cycleProficiency = (key: string) => {
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

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg backdrop-blur space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="font-fantasy font-bold text-slate-200 text-sm tracking-wide">Skills</h3>
        <span className="text-[10px] text-slate-400">Click dot to cycle Prof (○ → ● → ★)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
        {Object.entries(SKILL_METADATA).map(([key, meta]) => {
          const skillData = character.skills[key] || { ability: meta.ability, prof: 'none' };
          const bonus = getSkillBonus(key);
          const mod = getAbilityMod(meta.ability);

          return (
            <Tooltip
              key={key}
              content={
                <SkillTooltipCard
                  name={meta.label}
                  ability={meta.ability}
                  abilityMod={mod}
                  prof={skillData.prof}
                  profBonus={character.proficiencyBonus}
                  totalBonus={bonus}
                />
              }
            >
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors w-full group">
                <div className="flex items-center gap-2">
                  {/* Proficiency Toggle Button */}
                  <button
                    onClick={() => cycleProficiency(key)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs transition-transform active:scale-90"
                    title={`Proficiency: ${skillData.prof}. Click to toggle.`}
                  >
                    {skillData.prof === 'expert' ? (
                      <span className="text-amber-400 font-bold text-sm">★</span>
                    ) : skillData.prof === 'prof' ? (
                      <span className="text-emerald-400 font-bold text-xs">●</span>
                    ) : (
                      <span className="text-slate-600 hover:text-slate-400 text-xs">○</span>
                    )}
                  </button>

                  <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                    {meta.label}
                  </span>
                  <span className="text-[10px] uppercase text-slate-500 font-mono">
                    ({meta.ability})
                  </span>
                </div>

                <span
                  className={`font-mono text-xs font-bold ${
                    skillData.prof === 'expert'
                      ? 'text-amber-400'
                      : skillData.prof === 'prof'
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }`}
                >
                  {bonus >= 0 ? `+${bonus}` : bonus}
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
