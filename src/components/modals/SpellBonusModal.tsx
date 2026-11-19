import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Wand2, X, FileText, Check, RotateCcw } from 'lucide-react';
import { AbilityKey } from '../../types/character';

interface SpellBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpellBonusModal: React.FC<SpellBonusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { character, updateCharacter, getAbilityMod } = useCharacter();

  const [dcBonusInput, setDcBonusInput] = useState<string>('');
  const [atkBonusInput, setAtkBonusInput] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const dcB = character.spellcasting?.dcBonus ?? 0;
      const atkB = character.spellcasting?.attackBonusMod ?? 0;
      setDcBonusInput(dcB === 0 ? '' : dcB > 0 ? `+${dcB}` : `${dcB}`);
      setAtkBonusInput(atkB === 0 ? '' : atkB > 0 ? `+${atkB}` : `${atkB}`);
      setNoteInput(character.spellcasting?.bonusNote || '');
    }
  }, [isOpen, character.spellcasting?.dcBonus, character.spellcasting?.attackBonusMod, character.spellcasting?.bonusNote]);

  if (!isOpen) return null;

  const parseNumber = (val: string) => {
    if (!val.trim() || val.trim() === '+' || val.trim() === '-') return 0;
    const cleaned = val.replace(/[^0-9-]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };

  const parsedDcBonus = parseNumber(dcBonusInput);
  const parsedAtkBonus = parseNumber(atkBonusInput);

  const spellStatKey = (character.spellcasting.stat.toLowerCase() as AbilityKey) || 'wis';
  const spellStatMod = getAbilityMod(spellStatKey);
  const profBonus = character.proficiencyBonus;

  const totalDc = 8 + profBonus + spellStatMod + parsedDcBonus;
  const totalAtk = profBonus + spellStatMod + parsedAtkBonus;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateCharacter((prev) => ({
      ...prev,
      spellcasting: {
        ...prev.spellcasting,
        dcBonus: parsedDcBonus,
        attackBonusMod: parsedAtkBonus,
        bonusNote: noteInput.trim(),
        saveDC: totalDc,
        attackMod: totalAtk,
      },
    }));
    onClose();
  };

  const handleReset = () => {
    setDcBonusInput('');
    setAtkBonusInput('');
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
            <Wand2 className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-sm">
              SPELL SAVE DC &amp; ATTACK BONUS MODIFIER
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
          {/* Live Preview Boxes */}
          <div className="grid grid-cols-2 gap-2">
            {/* DC Box */}
            <div className="bg-white border border-stone-300 rounded p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                  Spell Save DC
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  8 + Prof (+{profBonus}) + {character.spellcasting.stat} ({spellStatMod >= 0 ? `+${spellStatMod}` : spellStatMod})
                  {parsedDcBonus !== 0 && ` + Bonus (${parsedDcBonus >= 0 ? `+${parsedDcBonus}` : parsedDcBonus})`}
                </span>
              </div>
              <div className="mt-1 text-2xl font-extrabold font-mono text-[#7b1113]">
                {totalDc}
              </div>
            </div>

            {/* Attack Bonus Box */}
            <div className="bg-white border border-stone-300 rounded p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                  Spell Attack Bonus
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  Prof (+{profBonus}) + {character.spellcasting.stat} ({spellStatMod >= 0 ? `+${spellStatMod}` : spellStatMod})
                  {parsedAtkBonus !== 0 && ` + Bonus (${parsedAtkBonus >= 0 ? `+${parsedAtkBonus}` : parsedAtkBonus})`}
                </span>
              </div>
              <div className="mt-1 text-2xl font-extrabold font-mono text-[#276749]">
                {totalAtk >= 0 ? `+${totalAtk}` : totalAtk}
              </div>
            </div>
          </div>

          {/* Modifier Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dc-bonus-input" className="font-bold text-stone-800 block mb-1">
                Save DC Bonus (Number)
              </label>
              <input
                id="dc-bonus-input"
                type="text"
                value={dcBonusInput}
                onChange={(e) => setDcBonusInput(e.target.value)}
                placeholder="+0 (e.g. +1)"
                className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-mono font-bold text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
              />
            </div>

            <div>
              <label htmlFor="atk-bonus-input" className="font-bold text-stone-800 block mb-1">
                Attack Bonus Mod (Number)
              </label>
              <input
                id="atk-bonus-input"
                type="text"
                value={atkBonusInput}
                onChange={(e) => setAtkBonusInput(e.target.value)}
                placeholder="+0 (e.g. +1)"
                className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-mono font-bold text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
              />
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="spell-note-input" className="font-bold text-stone-800 block text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>Spell Focus Note (Tooltip on Hover)</span>
              </label>
              {noteInput && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Tooltip active
                </span>
              )}
            </div>

            <textarea
              id="spell-note-input"
              rows={2}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Wand of the War Mage +1: +1 to spell attack rolls; ignores half cover."
              className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78] resize-none"
            />
            <p className="text-[11px] text-stone-500">
              When saved, this note appears as a hover tooltip on the Spell Save DC and Spell Attack cards.
            </p>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded font-semibold text-xs transition-colors"
              title="Reset spellcasting bonus and note"
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
                <span>Save Spell Bonuses</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
