import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { AbilityKey } from '../../types/character';
import { Tooltip } from '../common/Tooltip';

const ABILITY_NAMES: Record<AbilityKey, { short: string; full: string }> = {
  str: { short: 'STR', full: 'Strength' },
  dex: { short: 'DEX', full: 'Dexterity' },
  con: { short: 'CON', full: 'Constitution' },
  int: { short: 'INT', full: 'Intelligence' },
  wis: { short: 'WIS', full: 'Wisdom' },
  cha: { short: 'CHA', full: 'Charisma' },
};

export const AbilityScores: React.FC = () => {
  const { character, updateCharacter, getAbilityMod, getSaveBonus } = useCharacter();
  const [editingKey, setEditingKey] = useState<AbilityKey | null>(null);
  const [editVal, setEditVal] = useState<string>('');

  const keys: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  const handleStartEdit = (k: AbilityKey) => {
    setEditingKey(k);
    setEditVal(character.abilities[k].score.toString());
  };

  const handleSaveEdit = (k: AbilityKey) => {
    const val = parseInt(editVal, 10);
    if (!isNaN(val) && val >= 1 && val <= 30) {
      updateCharacter((prev) => ({
        ...prev,
        abilities: {
          ...prev.abilities,
          [k]: {
            ...prev.abilities[k],
            score: val,
          },
        },
      }));
    }
    setEditingKey(null);
  };

  const toggleSaveProf = (k: AbilityKey, e: React.MouseEvent) => {
    e.stopPropagation();
    updateCharacter((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [k]: {
          ...prev.abilities[k],
          saveProf: !prev.abilities[k].saveProf,
        },
      },
    }));
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg backdrop-blur space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="font-fantasy font-bold text-slate-200 text-sm tracking-wide">
          Ability Scores & Saving Throws
        </h3>
        <span className="text-[10px] text-slate-400">Click score to edit • ● = Proficient Save</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {keys.map((k) => {
          const info = ABILITY_NAMES[k];
          const score = character.abilities[k]?.score ?? 10;
          const mod = getAbilityMod(k);
          const saveBonus = getSaveBonus(k);
          const isProf = character.abilities[k]?.saveProf ?? false;

          return (
            <Tooltip
              key={k}
              content={
                <div className="space-y-1.5 text-left w-48">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                    <span className="font-fantasy font-bold text-amber-300">{info.full}</span>
                    <span className="font-mono text-slate-200">Score: {score}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Modifier:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {mod >= 0 ? `+${mod}` : mod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Calculation:</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        ({score} - 10) / 2
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Saving Throw:</span>
                      <span className={`font-mono font-bold ${isProf ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {saveBonus >= 0 ? `+${saveBonus}` : saveBonus} {isProf && '●'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-0.5">
                      {isProf ? 'Proficient saving throw (+2 bonus added)' : 'Non-proficient saving throw'}
                    </p>
                  </div>
                </div>
              }
            >
              <div
                onClick={() => handleStartEdit(k)}
                className="bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/70 p-2 flex flex-col items-center justify-between cursor-pointer transition-all hover:border-amber-500/50 group"
              >
                {/* Ability Label */}
                <span className="text-[11px] font-bold tracking-wider text-slate-400 group-hover:text-amber-300 transition-colors">
                  {info.short}
                </span>

                {/* Big Modifier */}
                <div className="my-1 font-mono text-xl sm:text-2xl font-extrabold text-white">
                  {mod >= 0 ? `+${mod}` : mod}
                </div>

                {/* Score badge / editor */}
                {editingKey === k ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value.replace(/[^0-9]/g, ''))}
                    onBlur={() => handleSaveEdit(k)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(k)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 bg-slate-900 text-amber-300 font-mono text-xs px-1 py-0.5 rounded border border-amber-500 text-center"
                  />
                ) : (
                  <div className="px-1.5 py-0.5 rounded bg-slate-900/90 text-[11px] font-mono font-medium text-slate-300 border border-slate-700">
                    {score}
                  </div>
                )}

                {/* Saving Throw Pill */}
                <button
                  onClick={(e) => toggleSaveProf(k, e)}
                  title="Click to toggle save proficiency"
                  className={`mt-2 w-full flex items-center justify-center gap-1 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                    isProf
                      ? 'bg-amber-950/70 text-amber-300 border-amber-600/50'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>Save</span>
                  <span className="font-bold">{saveBonus >= 0 ? `+${saveBonus}` : saveBonus}</span>
                  {isProf && <span className="text-amber-400">●</span>}
                </button>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
