import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { AbilityKey, ResourceTracker } from '../../types/character';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { ResourceTooltipCard } from '../common/TooltipContent';
import { ResourceModal } from './ResourceModal';
import { ClassModal } from './ClassModal';
import { SavingThrowModal } from '../modals/SavingThrowModal';

interface SpeedInputProps {
  value: number;
  onChange: (val: number) => void;
}

const SpeedInput: React.FC<SpeedInputProps> = ({ value, onChange }) => {
  const [localVal, setLocalVal] = useState(value.toString());

  useEffect(() => {
    setLocalVal(value.toString());
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={localVal}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/[^0-9]/g, '');
        setLocalVal(cleaned);
        const parsed = parseInt(cleaned, 10);
        onChange(isNaN(parsed) ? 0 : parsed);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      onBlur={() => {
        if (localVal === '') {
          setLocalVal('0');
          onChange(0);
        }
      }}
      className="w-full text-center font-mono font-bold text-xs text-stone-900 bg-transparent hover:bg-stone-50 focus:bg-amber-50/70 focus:outline-none rounded py-0.5"
    />
  );
};

const ABILITIES: { key: AbilityKey; label: string; full: string }[] = [
  { key: 'str', label: 'STR', full: 'Strength' },
  { key: 'dex', label: 'DEX', full: 'Dexterity' },
  { key: 'con', label: 'CON', full: 'Constitution' },
  { key: 'int', label: 'INT', full: 'Intelligence' },
  { key: 'wis', label: 'WIS', full: 'Wisdom' },
  { key: 'cha', label: 'CHA', full: 'Charisma' },
];

export const CoreInfoSection: React.FC = () => {
  const {
    character,
    updateCharacter,
    getAbilityMod,
    getSaveBonus,
    updateBaseScore,
    toggleBaseStatsLock,
    adjustResource,
    removeResource,
    addClass,
    removeClass,
    updateClassLevel,
    updateClass,
  } = useCharacter();

  const [editingScoreKey, setEditingScoreKey] = useState<AbilityKey | null>(null);
  const [scoreVal, setScoreVal] = useState<string>('');

  // Class Modal state
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  // Resource Modal state
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceTracker | null>(null);

  // Saving Throw Modal state
  const [isSavingThrowModalOpen, setIsSavingThrowModalOpen] = useState(false);

  const conMod = character.abilities.con ? Math.floor((character.abilities.con.score - 10) / 2) : 0;

  const handleStartEdit = (key: AbilityKey) => {
    setEditingScoreKey(key);
    setScoreVal(character.abilities[key].score.toString());
  };

  const handleSaveScore = (key: AbilityKey) => {
    const val = parseInt(scoreVal, 10);
    if (!isNaN(val) && val >= 1 && val <= 30) {
      updateBaseScore(key, val);
    }
    setEditingScoreKey(null);
  };

  const toggleSaveProf = (key: AbilityKey) => {
    updateCharacter((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [key]: {
          ...prev.abilities[key],
          saveProf: !prev.abilities[key].saveProf,
        },
      },
    }));
  };

  const updateSpeed = (field: keyof typeof character.speed, val: number | string) => {
    updateCharacter((prev) => ({
      ...prev,
      speed: {
        ...prev.speed,
        [field]: val,
      },
    }));
  };

  return (
    <div className="space-y-1">
      {/* Deep Crimson Banner */}
      <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-xs uppercase shadow-sm">
        CORE INFORMATION
      </div>

      {/* 3-Column Grid */}
      <div className="bg-[#f6efe6] p-2 border border-stone-300 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        {/* ========================================================= */}
        {/* COLUMN 1: Ability Scores stacked on top of Saving Throws */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-2 min-w-0">
          {/* Ability Scores Table (Always Unlocked) */}
          <div className="border border-stone-400 bg-white overflow-hidden shadow-2xs">
            <div className="bg-[#1f4e78] text-white font-bold h-7 shrink-0 text-[11px] flex items-center justify-between px-2">
              <span>ABILITY SCORES</span>
              <span className="text-[9px] text-stone-300 font-normal">Editable</span>
            </div>

            <table className="w-full text-center border-collapse">
              <tbody>
                {ABILITIES.map(({ key, label }) => {
                  const score = character.abilities[key]?.score ?? 10;
                  const mod = getAbilityMod(key);
                  const isEditing = editingScoreKey === key;

                  return (
                    <tr key={key} className="border-b border-stone-300 last:border-b-0 hover:bg-stone-50">
                      <td className="w-12 bg-black text-white font-bold py-1 px-2 text-xs">
                        {label}
                      </td>
                      <td
                        onClick={() => handleStartEdit(key)}
                        className="w-14 font-bold text-sm cursor-pointer hover:bg-amber-100/70 transition-colors"
                        title="Click to edit score"
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            inputMode="numeric"
                            value={scoreVal}
                            onChange={(e) => setScoreVal(e.target.value.replace(/[^0-9]/g, ''))}
                            onBlur={() => handleSaveScore(key)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveScore(key)}
                            autoFocus
                            className="w-11 text-center font-bold bg-white border border-amber-500 rounded text-xs py-0.5 shadow-xs font-mono"
                          />
                        ) : (
                          <span className="hover:underline decoration-dotted decoration-stone-400">
                            {score}
                          </span>
                        )}
                      </td>
                      <td
                        className={`font-mono font-bold text-sm px-2 ${
                          mod >= 0 ? 'bg-[#e2efda] text-stone-900' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {mod >= 0 ? `+${mod}` : mod}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Saving Throws Table (Stacked directly under Ability Scores) */}
          <div className="border border-stone-400 bg-white overflow-hidden shadow-2xs">
            <div className="bg-[#1f4e78] text-white font-bold h-7 shrink-0 text-[11px] flex items-center justify-between px-2">
              <span className="flex-1 text-center pl-4">SAVING THROWS</span>
              <button
                type="button"
                onClick={() => setIsSavingThrowModalOpen(true)}
                className={`p-1 rounded transition-colors ${
                  (character.globalSaveBonus || character.globalSaveNote || Object.keys(character.saveBonuses || {}).length > 0 || Object.keys(character.saveNotes || {}).length > 0)
                    ? 'hover:bg-white/20 text-amber-300 hover:text-white'
                    : 'hover:bg-white/20 text-white/80 hover:text-white'
                }`}
                title="Edit saving throw modifiers & notes"
                aria-label="Edit Saving Throws"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="text-[10px] bg-stone-100 text-stone-600 border-b border-stone-300">
                  <th className="py-0.5 w-12 text-center">Stat</th>
                  <th className="text-center">Mod</th>
                  <th className="w-10 text-center">Prof</th>
                </tr>
              </thead>
              <tbody>
                {ABILITIES.map(({ key, label }) => {
                  const saveBonus = getSaveBonus(key);
                  const isProf = character.abilities[key]?.saveProf ?? false;
                  const hasNote = character.saveNotes?.[key] || character.globalSaveNote;

                  return (
                    <tr key={key} className="border-b border-stone-300 last:border-b-0 hover:bg-stone-50">
                      <td className="w-12 bg-black text-white font-bold py-1 px-2 text-xs">
                        {label}
                      </td>
                      <td className={`font-mono font-bold text-xs ${isProf ? 'text-[#1f4e78]' : 'text-stone-800'}`}>
                        {hasNote ? (
                          <Tooltip
                            content={
                              <div className="space-y-1">
                                <p className="font-fantasy font-bold text-amber-300">{label} Saving Throw</p>
                                {character.saveNotes?.[key] && (
                                  <p className="text-xs text-slate-200 whitespace-pre-wrap">{character.saveNotes[key]}</p>
                                )}
                                {character.globalSaveNote && (
                                  <p className="text-[11px] text-amber-200 whitespace-pre-wrap">Global: {character.globalSaveNote}</p>
                                )}
                                <p className="text-[10px] text-slate-400 font-mono">
                                  Mod ({getAbilityMod(key) >= 0 ? `+${getAbilityMod(key)}` : getAbilityMod(key)})
                                  {isProf && ` + Prof (+${character.proficiencyBonus})`}
                                  {character.globalSaveBonus ? ` + Global (${character.globalSaveBonus >= 0 ? `+${character.globalSaveBonus}` : character.globalSaveBonus})` : ''}
                                  {character.saveBonuses?.[key] ? ` + Extra (${character.saveBonuses[key]! >= 0 ? `+${character.saveBonuses[key]}` : character.saveBonuses[key]})` : ''}
                                </p>
                              </div>
                            }
                          >
                            <span className="cursor-help hover:text-amber-700 underline decoration-dotted">
                              {saveBonus >= 0 ? `+${saveBonus}` : saveBonus}
                            </span>
                          </Tooltip>
                        ) : (
                          <span>{saveBonus >= 0 ? `+${saveBonus}` : saveBonus}</span>
                        )}
                      </td>
                      <td className="w-10">
                        <button
                          type="button"
                          onClick={() => toggleSaveProf(key)}
                          className="hover:scale-125 transition-transform text-xs"
                          title="Click to toggle saving throw proficiency"
                        >
                          {isProf ? (
                            <span className="text-stone-900 font-bold">●</span>
                          ) : (
                            <span className="text-stone-300">○</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: Class Table with Movement Speeds below it       */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-2 min-w-0">
          {/* Classes Table */}
          <div className="border border-stone-400 bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
            <div>
              <div className="bg-[#1f4e78] text-white font-bold h-7 shrink-0 px-2 text-[11px] flex items-center justify-between">
                <span>CLASSES</span>
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(true)}
                  className="h-5 flex items-center gap-1 text-[10px] bg-white text-[#1f4e78] hover:bg-stone-100 px-2 rounded font-bold transition-colors shadow-xs"
                  title="Add a class or multiclass"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Add Class</span>
                </button>
              </div>
              <table className="w-full text-center border-collapse text-[11px] table-fixed">
                <thead>
                  <tr className="bg-stone-100 text-stone-600 border-b border-stone-300 text-[10px]">
                    <th className="text-left px-1 py-0.5">Class / Subclass</th>
                    <th className="w-9 text-center">Lvl</th>
                    <th className="w-11 text-center">Hit Die</th>
                    <th className="w-9 text-center">Con</th>
                    <th className="w-10 text-center">HP</th>
                    {character.classes.length > 1 && <th className="w-6 text-center"></th>}
                  </tr>
                </thead>
                <tbody>
                  {character.classes.map((c, i) => (
                    <tr key={i} className="border-b border-stone-300 last:border-b-0 hover:bg-stone-50/70">
                      <td className="text-left px-1 py-0.5 truncate">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => updateClass(i, { name: e.target.value })}
                          className="font-semibold text-stone-800 text-[11px] bg-transparent hover:bg-stone-100 focus:bg-amber-50 focus:outline-none rounded px-0.5 w-full block truncate"
                          placeholder="Class"
                        />
                        <input
                          type="text"
                          value={c.subclass || ''}
                          onChange={(e) => updateClass(i, { subclass: e.target.value })}
                          placeholder="Subclass (optional)"
                          className="text-[9px] text-stone-500 bg-transparent hover:bg-stone-100 focus:bg-amber-50 focus:outline-none rounded px-0.5 w-full block truncate placeholder:text-stone-300"
                        />
                      </td>
                      <td className="w-9 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={c.level}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/[^0-9]/g, '');
                            const num = parseInt(clean, 10);
                            updateClassLevel(i, isNaN(num) ? 1 : Math.max(1, num));
                          }}
                          className="w-full text-center font-bold text-stone-900 bg-transparent hover:bg-stone-100 focus:bg-amber-50 focus:outline-none rounded font-mono text-xs py-0.5"
                          title="Class Level"
                        />
                      </td>
                      <td className="w-11 text-center font-mono text-stone-700 text-xs py-0.5" title={`Hit Die: ${c.hitDie}`}>
                        {c.hitDie.startsWith('d') ? c.hitDie : `d${c.hitDie}`}
                      </td>
                      <td className="w-9 font-mono text-stone-600 text-xs text-center">
                        {conMod >= 0 ? `+${conMod}` : conMod}
                      </td>
                      <td className="w-10 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={c.hp ?? 0}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/[^0-9]/g, '');
                            const num = parseInt(clean, 10);
                            updateClass(i, { hp: isNaN(num) ? 0 : num });
                          }}
                          title="HP contribution from this class"
                          className="w-full text-center font-mono font-bold text-stone-900 bg-transparent hover:bg-stone-100 focus:bg-amber-50 focus:outline-none rounded text-xs py-0.5"
                        />
                      </td>
                      {character.classes.length > 1 && (
                        <td className="w-6 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove ${c.name}?`)) {
                                removeClass(i);
                              }
                            }}
                            className="text-stone-400 hover:text-red-700 p-0.5 rounded transition-colors"
                            title={`Delete ${c.name}`}
                          >
                            <Trash2 className="w-3 h-3 inline" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-stone-200 border-t border-stone-400 p-1 flex justify-between items-center text-xs font-bold text-stone-900">
              <span>Total Level: {character.level}</span>
              <span>Total HP: {character.hp.max}</span>
            </div>
          </div>

          {/* Movement Speeds Matrix (Directly below Class table) */}
          <div className="border border-stone-400 bg-white overflow-hidden shadow-2xs">
            <div className="bg-[#1f4e78] text-white font-bold h-7 shrink-0 text-[11px] flex items-center justify-between px-2">
              <span>MOVEMENT SPEEDS</span>
              <span className="text-[9px] text-stone-300 font-normal">Editable</span>
            </div>
            <div className="grid grid-cols-2 text-center text-xs">
              {/* Move & Climb */}
              <div className="bg-black text-white font-bold py-1 text-[11px]">Move</div>
              <div className="bg-black text-white font-bold py-1 text-[11px]">Climb</div>
              <div className="border-b border-r border-stone-300 bg-white p-0.5 flex items-center justify-center">
                <SpeedInput
                  value={character.speed.walk}
                  onChange={(val) => updateSpeed('walk', val)}
                />
              </div>
              <div className="border-b border-stone-300 bg-white p-0.5 flex items-center justify-center">
                <SpeedInput
                  value={character.speed.climb}
                  onChange={(val) => updateSpeed('climb', val)}
                />
              </div>

              {/* Jump & Fly */}
              <div className="bg-black text-white font-bold py-1 text-[11px]">Jump</div>
              <div className="bg-black text-white font-bold py-1 text-[11px]">Fly</div>
              <div className="border-b border-r border-stone-300 bg-white p-0.5 flex items-center justify-center">
                <SpeedInput
                  value={character.speed.jump}
                  onChange={(val) => updateSpeed('jump', val)}
                />
              </div>
              <div className="border-b border-stone-300 bg-white p-0.5 flex items-center justify-center">
                <SpeedInput
                  value={character.speed.fly}
                  onChange={(val) => updateSpeed('fly', val)}
                />
              </div>

              {/* Swim & Other */}
              <div className="bg-black text-white font-bold py-1 text-[11px]">Swim</div>
              <div className="bg-black text-white font-bold py-1 text-[11px]">Other</div>
              <div className="border-r border-stone-300 bg-white p-0.5 flex items-center justify-center">
                <SpeedInput
                  value={character.speed.swim}
                  onChange={(val) => updateSpeed('swim', val)}
                />
              </div>
              <div className="bg-white p-0.5 flex items-center justify-center">
                <input
                  type="text"
                  placeholder="—"
                  value={character.speed.other || ''}
                  onChange={(e) => updateSpeed('other', e.target.value)}
                  className="w-full text-center font-mono text-[11px] text-stone-800 bg-transparent hover:bg-stone-50 focus:bg-amber-50/70 focus:outline-none px-1 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: Ability Uses & Trackers (Resources)             */}
        {/* ========================================================= */}
        <div className="flex flex-col h-full min-w-0">
          {/* Ability Uses / Resources (Editable like weapons) */}
          <div className="border border-stone-400 bg-white flex-1 flex flex-col justify-between overflow-hidden shadow-2xs">
            <div>
              <div className="bg-[#1f4e78] text-white font-bold h-7 shrink-0 px-2 text-[11px] flex items-center justify-between">
                <span>ABILITY USES &amp; TRACKERS</span>
                <button
                  onClick={() => {
                    setEditingResource(null);
                    setIsResourceModalOpen(true);
                  }}
                  className="h-5 flex items-center gap-1 text-[10px] bg-white text-[#1f4e78] px-2 rounded font-bold hover:bg-stone-100 transition-colors shadow-xs"
                  title="Add ability use tracker"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>Add Ability</span>
                </button>
              </div>

              {/* Resources List */}
              <div className="divide-y divide-stone-200 text-xs">
                {character.resources.length === 0 ? (
                  <div className="p-3 text-center text-stone-400 italic text-[11px]">
                    No ability trackers added yet. Click <strong className="text-[#1f4e78]">+ Add Ability</strong> to track limited-use features.
                  </div>
                ) : (
                  character.resources.map((res) => {
                    const effectiveMax = res.useProfBonus ? character.proficiencyBonus : res.max;

                    return (
                      <div
                        key={res.id}
                        className="p-1.5 flex items-center justify-between gap-1 hover:bg-stone-50 transition-colors"
                      >
                        {/* Ability name + reset info with hover tooltip */}
                        <div className="min-w-0 flex-1 pr-1">
                          <Tooltip
                            content={
                              <ResourceTooltipCard
                                name={res.name}
                                reset={res.reset}
                                current={res.current}
                                max={effectiveMax}
                                desc={res.desc}
                                useProfBonus={res.useProfBonus}
                              />
                            }
                          >
                            <span className="font-bold text-[11px] text-stone-900 block truncate cursor-help hover:text-[#1f4e78] underline decoration-dotted">
                              {res.name}
                            </span>
                          </Tooltip>
                          <div className="flex items-center gap-1 text-[9px] text-stone-500">
                            <span>{res.reset}</span>
                            {res.useProfBonus && (
                              <span className="font-bold text-[#1f4e78] bg-blue-50 px-1 rounded">
                                PB (+{character.proficiencyBonus})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Counter badge and -/+ adjustment */}
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="bg-[#d9ead3] border border-[#276749] px-1.5 py-0.5 rounded font-mono font-bold text-xs text-stone-900 min-w-10 text-center">
                            {res.current} / {effectiveMax}
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => adjustResource(res.id, 1)}
                              disabled={res.current >= effectiveMax}
                              className="text-[9px] bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-100 text-stone-700 px-1 rounded font-mono font-bold border border-stone-300"
                              title="Recover 1 use"
                            >
                              +
                            </button>
                            <button
                              onClick={() => adjustResource(res.id, -1)}
                              disabled={res.current <= 0}
                              className="text-[9px] bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-100 text-stone-700 px-1 rounded font-mono font-bold border border-stone-300"
                              title="Spend 1 use"
                            >
                              -
                            </button>
                          </div>

                          {/* Edit button */}
                          <button
                            onClick={() => {
                              setEditingResource(res);
                              setIsResourceModalOpen(true);
                            }}
                            className="p-1 text-stone-400 hover:text-[#1f4e78] rounded hover:bg-stone-100 transition-colors ml-0.5"
                            title="Edit ability details"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${res.name}" tracker?`)) {
                                removeResource(res.id);
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                            title="Remove ability tracker"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-stone-100 border-t border-stone-300 p-1 text-[10px] text-stone-500 text-center">
              Hover ability name for details • Click + / - to track uses
            </div>
          </div>
        </div>
      </div>

      {/* Resource Modal for Adding / Editing Ability Uses */}
      <ResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => {
          setIsResourceModalOpen(false);
          setEditingResource(null);
        }}
        resourceToEdit={editingResource}
      />

      {/* Class Modal for Adding Classes / Multiclasses */}
      <ClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        onAddClass={addClass}
        conMod={conMod}
        isFirstClass={character.classes.length === 0}
      />

      {/* Saving Throw Modal for Global & Specific Modifiers */}
      <SavingThrowModal
        isOpen={isSavingThrowModalOpen}
        onClose={() => setIsSavingThrowModalOpen(false)}
      />
    </div>
  );
};
