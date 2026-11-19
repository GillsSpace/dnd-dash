import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Zap, X, FileText, Check, RotateCcw } from 'lucide-react';

interface InitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dexMod: number;
  alertBonus: number;
}

export const InitiativeModal: React.FC<InitiativeModalProps> = ({
  isOpen,
  onClose,
  dexMod,
  alertBonus,
}) => {
  const { character, updateCharacter } = useCharacter();

  const [bonusInput, setBonusInput] = useState<string>('0');
  const [noteInput, setNoteInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const currentBonus = character.initiativeBonus ?? 0;
      setBonusInput(currentBonus === 0 ? '' : currentBonus > 0 ? `+${currentBonus}` : `${currentBonus}`);
      setNoteInput(character.initiativeNote || '');
    }
  }, [isOpen, character.initiativeBonus, character.initiativeNote]);

  if (!isOpen) return null;

  const parsedBonus = (() => {
    if (!bonusInput.trim() || bonusInput.trim() === '+' || bonusInput.trim() === '-') return 0;
    const cleaned = bonusInput.replace(/[^0-9-]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  })();

  const totalCalculated = dexMod + alertBonus + parsedBonus;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateCharacter((prev) => ({
      ...prev,
      initiativeBonus: parsedBonus,
      initiativeNote: noteInput.trim(),
      initiative: totalCalculated,
    }));
    onClose();
  };

  const handleReset = () => {
    setBonusInput('');
    setNoteInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div
        className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-[#1f4e78] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-sm">
              INITIATIVE MODIFIER & NOTE
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
          {/* Live Preview Box */}
          <div className="bg-white border border-stone-300 rounded-lg p-3 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                Total Initiative
              </span>
              <div className="text-[11px] text-stone-600 mt-0.5 font-mono">
                DEX ({dexMod >= 0 ? `+${dexMod}` : dexMod})
                {alertBonus > 0 && ` + Alert (+${alertBonus})`}
                {parsedBonus !== 0 && ` + Extra (${parsedBonus >= 0 ? `+${parsedBonus}` : parsedBonus})`}
              </div>
            </div>

            <div className="w-14 h-10 bg-[#d9ead3] border border-[#276749] rounded flex items-center justify-center font-mono font-extrabold text-2xl text-stone-900 shadow-sm">
              {totalCalculated >= 0 ? `+${totalCalculated}` : totalCalculated}
            </div>
          </div>

          {/* Number Modifier Input */}
          <div className="space-y-1.5">
            <label htmlFor="init-mod-input" className="font-bold text-stone-800 block text-xs">
              Additional Modifier (Number)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="init-mod-input"
                type="text"
                value={bonusInput}
                onChange={(e) => setBonusInput(e.target.value)}
                placeholder="+0 (e.g. +2, -1)"
                className="w-32 bg-white border border-stone-300 rounded px-3 py-1.5 font-mono font-bold text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
              />
              <span className="text-[11px] text-stone-500">
                Added directly to your Dexterity bonus.
              </span>
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="init-note-input" className="font-bold text-stone-800 block text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>Initiative Note (Tooltip on Hover)</span>
              </label>
              {noteInput && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Tooltip active
                </span>
              )}
            </div>

            <textarea
              id="init-note-input"
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Advantage on Initiative from Sentinel Shield, or Alert: Can swap initiative with willing ally."
              className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78] resize-none"
            />
            <p className="text-[11px] text-stone-500">
              When saved, this note will pop up as a helpful tooltip whenever you hover over the green Initiative box on your character sheet.
            </p>
          </div>

          {/* Common Quick Chips */}
          <div className="pt-1 border-t border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setNoteInput('Advantage on Initiative rolls (Sentinel Shield / Weapon of Warning).')}
                className="px-2 py-0.5 rounded bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                Sentinel Shield (Advantage)
              </button>
              <button
                type="button"
                onClick={() => setNoteInput('Alert Feat: You can swap initiative with a willing ally in the same combat.')}
                className="px-2 py-0.5 rounded bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                Alert Feat (Swap with Ally)
              </button>
              <button
                type="button"
                onClick={() => {
                  setBonusInput('+2');
                  setNoteInput('Swashbuckler: Rakish Audacity (+Charisma modifier).');
                }}
                className="px-2 py-0.5 rounded bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
              >
                +2 (Rakish Audacity)
              </button>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded font-semibold text-xs transition-colors"
              title="Reset modifier and note to default"
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
                <span>Save Initiative</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
