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
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 font-mono font-bold text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-stone-600 block mb-0.5">Global Save Note</label>
                <input
                  type="text"
                  value={globalNoteInput}
                  onChange={(e) => setGlobalNoteInput(e.target.value)}
                  placeholder="e.g. Ring of Protection (+1 to all saves)"
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Ability Specific Modifiers & Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs">
                Ability-Specific Modifiers &amp; Notes
              </span>
              <span className="text-[10px] text-stone-500">
                Click an ability card below to configure
              </span>
            </div>

            {/* Single Unified Ability Selector with Live Saves Preview */}
            <div className="grid grid-cols-6 gap-1.5 text-center">
              {STATS.map(({ key, label }) => {
                const total = calculateSave(key);
                const hasNote = !!statNotes[key];
                const hasBonus = !!statBonuses[key] && parseNumber(statBonuses[key]) !== 0;
                const isSelected = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`p-1.5 rounded border transition-all text-center ${
                      isSelected
                        ? 'border-[#1f4e78] bg-blue-50/90 ring-1 ring-[#1f4e78] shadow-xs'
                        : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className={`text-[10px] font-bold ${isSelected ? 'text-[#1f4e78]' : 'text-stone-500'}`}>
                      {label}
                    </div>
                    <div className="font-mono text-sm font-bold text-stone-900 mt-0.5">
                      {total >= 0 ? `+${total}` : total}
                    </div>
                    <div className="h-3 flex items-center justify-center gap-0.5 mt-0.5">
                      {hasBonus && <span className="text-[9px] font-bold text-[#1f4e78] leading-none">•</span>}
                      {hasNote && <span className="text-[9px] leading-none" title="Has custom note">📝</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stat Editor Box */}
            <div className="bg-white border border-stone-300 rounded-lg p-3 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
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
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 font-mono font-bold text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
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
                    className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                  />
                </div>
              </div>
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
