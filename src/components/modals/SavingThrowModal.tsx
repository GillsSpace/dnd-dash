import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { ShieldAlert, X, FileText, Check, RotateCcw } from 'lucide-react';
import { AbilityKey } from '../../types/character';

interface SavingThrowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATS: { key: AbilityKey; label: string; full: string }[] = [
  { key: 'str', label: 'STR', full: 'Strength' },
  { key: 'dex', label: 'DEX', full: 'Dexterity' },
  { key: 'con', label: 'CON', full: 'Constitution' },
  { key: 'int', label: 'INT', full: 'Intelligence' },
  { key: 'wis', label: 'WIS', full: 'Wisdom' },
  { key: 'cha', label: 'CHA', full: 'Charisma' },
];

export const SavingThrowModal: React.FC<SavingThrowModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { character, updateCharacter, getAbilityMod } = useCharacter();

  const [globalBonusInput, setGlobalBonusInput] = useState<string>('');
  const [globalNoteInput, setGlobalNoteInput] = useState<string>('');

  const [activeTab, setActiveTab] = useState<AbilityKey>('dex');
  const [statBonuses, setStatBonuses] = useState<Record<AbilityKey, string>>({
    str: '',
    dex: '',
    con: '',
    int: '',
    wis: '',
    cha: '',
  });
  const [statNotes, setStatNotes] = useState<Record<AbilityKey, string>>({
    str: '',
    dex: '',
    con: '',
    int: '',
    wis: '',
    cha: '',
  });

  useEffect(() => {
    if (isOpen) {
      const gBonus = character.globalSaveBonus ?? 0;
      setGlobalBonusInput(gBonus === 0 ? '' : gBonus > 0 ? `+${gBonus}` : `${gBonus}`);
      setGlobalNoteInput(character.globalSaveNote || '');

      const initialBonuses: Record<AbilityKey, string> = {
        str: '',
        dex: '',
        con: '',
        int: '',
        wis: '',
        cha: '',
      };
      const initialNotes: Record<AbilityKey, string> = {
        str: '',
        dex: '',
        con: '',
        int: '',
        wis: '',
        cha: '',
      };

      STATS.forEach(({ key }) => {
        const b = character.saveBonuses?.[key] ?? 0;
        initialBonuses[key] = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
        initialNotes[key] = character.saveNotes?.[key] || '';
      });

      setStatBonuses(initialBonuses);
      setStatNotes(initialNotes);
    }
  }, [isOpen, character.globalSaveBonus, character.globalSaveNote, character.saveBonuses, character.saveNotes]);

  if (!isOpen) return null;

  const parseNumber = (val: string) => {
    if (!val.trim() || val.trim() === '+' || val.trim() === '-') return 0;
    const cleaned = val.replace(/[^0-9-]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };

  const parsedGlobal = parseNumber(globalBonusInput);

  const calculateSave = (key: AbilityKey) => {
    const mod = getAbilityMod(key);
    const isProf = character.abilities[key]?.saveProf ?? false;
    const profBonus = isProf ? character.proficiencyBonus : 0;
    const specificBonus = parseNumber(statBonuses[key] || '');
    return mod + profBonus + parsedGlobal + specificBonus;
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalBonuses: Partial<Record<AbilityKey, number>> = {};
    const finalNotes: Partial<Record<AbilityKey, string>> = {};

    STATS.forEach(({ key }) => {
      const num = parseNumber(statBonuses[key] || '');
      if (num !== 0) finalBonuses[key] = num;
      const note = (statNotes[key] || '').trim();
      if (note) finalNotes[key] = note;
    });

    updateCharacter((prev) => ({
      ...prev,
      globalSaveBonus: parsedGlobal,
      globalSaveNote: globalNoteInput.trim(),
      saveBonuses: finalBonuses,
      saveNotes: finalNotes,
    }));
    onClose();
  };

  const handleReset = () => {
    setGlobalBonusInput('');
    setGlobalNoteInput('');
    setStatBonuses({ str: '', dex: '', con: '', int: '', wis: '', cha: '' });
    setStatNotes({ str: '', dex: '', con: '', int: '', wis: '', cha: '' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div
        className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-[#1f4e78] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-sm">
              SAVING THROW MODIFIERS &amp; NOTES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 space-y-4 text-xs overflow-y-auto">
          {/* Quick Summary Preview Grid */}
          <div className="bg-white border border-stone-300 rounded-lg p-2.5 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1.5">
              Live Saves Preview
            </span>
            <div className="grid grid-cols-6 gap-1.5 text-center">
              {STATS.map(({ key, label }) => {
                const total = calculateSave(key);
                const hasNote = !!statNotes[key] || !!globalNoteInput;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`p-1.5 rounded border cursor-pointer transition-colors ${
                      activeTab === key
                        ? 'border-[#1f4e78] bg-blue-50 font-bold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-[10px] text-stone-500">{label}</div>
                    <div className="font-mono text-sm font-bold text-stone-900">
                      {total >= 0 ? `+${total}` : total}
                    </div>
                    {hasNote && <div className="text-[9px] text-amber-700 font-bold">📝</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: Global Save Modifier & Note */}
          <div className="space-y-2 bg-stone-50 p-2.5 rounded border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs">
                Global Modifier (All 6 Saves)
              </span>
              {globalNoteInput && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Global Tooltip Active
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-stone-600 block mb-0.5">Bonus (+/-)</label>
                <input
                  type="text"
                  value={globalBonusInput}
                  onChange={(e) => setGlobalBonusInput(e.target.value)}
                  placeholder="+0"
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 font-mono font-bold text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-stone-600 block mb-0.5">Global Save Note</label>
                <input
                  type="text"
                  value={globalNoteInput}
                  onChange={(e) => setGlobalNoteInput(e.target.value)}
                  placeholder="e.g. Ring of Protection (+1 to all saves)"
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Ability Specific Modifiers & Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs">
                Specific Ability Modifiers &amp; Tactical Notes
              </span>
            </div>

            {/* Stat Tabs */}
            <div className="flex border-b border-stone-300 gap-1">
              {STATS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1 font-bold text-xs rounded-t transition-colors ${
                    activeTab === key
                      ? 'bg-white border-t border-x border-stone-300 text-[#1f4e78] -mb-px'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {label}
                  {statNotes[key] && ' •'}
                </button>
              ))}
            </div>

            {/* Active Stat Inputs */}
            <div className="bg-white border border-stone-300 border-t-0 p-3 rounded-b space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1f4e78] text-xs">
                  {STATS.find((s) => s.key === activeTab)?.full} Saving Throw
                </span>
                <span className="text-[11px] font-mono text-stone-600">
                  Total Save: <strong>{calculateSave(activeTab) >= 0 ? `+${calculateSave(activeTab)}` : calculateSave(activeTab)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-stone-600 block mb-0.5">Extra Bonus</label>
                  <input
                    type="text"
                    value={statBonuses[activeTab]}
                    onChange={(e) =>
                      setStatBonuses({ ...statBonuses, [activeTab]: e.target.value })
                    }
                    placeholder="+0"
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 font-mono font-bold text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-stone-600 block mb-0.5">Save Note / Advantage Rule</label>
                  <input
                    type="text"
                    value={statNotes[activeTab]}
                    onChange={(e) =>
                      setStatNotes({ ...statNotes, [activeTab]: e.target.value })
                    }
                    placeholder="e.g. Advantage on DEX saves vs effects you can see (Danger Sense)"
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="pt-1 border-t border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setGlobalBonusInput('+1');
                  setGlobalNoteInput('Ring / Cloak of Protection (+1 to all saving throws).');
                }}
                className="px-2 py-0.5 rounded bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                +1 Ring of Protection (Global)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dex');
                  setStatNotes({
                    ...statNotes,
                    dex: 'Advantage on Dexterity saving throws against effects you can see (Danger Sense).',
                  });
                }}
                className="px-2 py-0.5 rounded bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                Danger Sense (DEX Advantage)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('con');
                  setStatNotes({
                    ...statNotes,
                    con: 'Advantage on saving throws against poison (Dwarven Resilience / Stout).',
                  });
                }}
                className="px-2 py-0.5 rounded bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                Poison Resilience (CON)
              </button>
              <button
                type="button"
                onClick={() => {
                  setGlobalNoteInput('Gnome Cunning: Advantage on all Intelligence, Wisdom, and Charisma saves against magic.');
                }}
                className="px-2 py-0.5 rounded bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                Gnome Cunning (Adv vs Magic)
              </button>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded font-semibold text-xs transition-colors"
              title="Reset all saving throw modifiers and notes"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-1.5 rounded bg-[#1f4e78] hover:bg-[#163a5a] text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Saving Throws</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
