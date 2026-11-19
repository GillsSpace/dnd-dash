import React, { useState, useEffect } from 'react';
import { useCharacter, calculateArmorClass } from '../../context/CharacterContext';
import { Shield, X, FileText, Check, RotateCcw } from 'lucide-react';

interface AcModalProps {
  isOpen: boolean;
  onClose: () => void;
  dexMod: number;
  conMod: number;
  wisMod: number;
}

export const AcModal: React.FC<AcModalProps> = ({
  isOpen,
  onClose,
  dexMod,
  conMod,
  wisMod,
}) => {
  const { character, updateCharacter } = useCharacter();

  const [formula, setFormula] = useState<'standard' | 'barbarian' | 'monk' | 'mageArmor' | 'custom'>('standard');
  const [customBase, setCustomBase] = useState<number>(10);
  const [bonusInput, setBonusInput] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setFormula(character.unarmoredFormula || 'standard');
      setCustomBase(character.customBaseAc ?? 10);
      const currentBonus = character.acBonus ?? 0;
      setBonusInput(currentBonus === 0 ? '' : currentBonus > 0 ? `+${currentBonus}` : `${currentBonus}`);
      setNoteInput(character.acNote || '');
    }
  }, [isOpen, character.unarmoredFormula, character.customBaseAc, character.acBonus, character.acNote]);

  if (!isOpen) return null;

  const parsedBonus = (() => {
    if (!bonusInput.trim() || bonusInput.trim() === '+' || bonusInput.trim() === '-') return 0;
    const cleaned = bonusInput.replace(/[^0-9-]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  })();

  const equippedArmor = (character.armorWorn || []).filter((a) => a.equipped !== false);
  const bodyArmor = equippedArmor.find((a) =>
    ['L', 'M', 'H', 'LIGHT', 'MEDIUM', 'HEAVY'].includes(a.type.toUpperCase())
  );
  const shieldItem = equippedArmor.find((a) => a.type.toLowerCase().includes('shield'));

  const calculatedAc = calculateArmorClass(character.armorWorn, dexMod, {
    conMod,
    wisMod,
    unarmoredFormula: formula,
    customBaseAc: customBase,
    acBonus: parsedBonus,
  });

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateCharacter((prev) => ({
      ...prev,
      unarmoredFormula: formula,
      customBaseAc: customBase,
      acBonus: parsedBonus,
      acNote: noteInput.trim(),
      armorClass: calculatedAc,
    }));
    onClose();
  };

  const handleReset = () => {
    setFormula('standard');
    setCustomBase(10);
    setBonusInput('');
    setNoteInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div
        className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-[#1f4e78] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-sm">
              ARMOR CLASS (AC) MODIFIER &amp; FORMULA
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
                Total Armor Class
              </span>
              <div className="text-[11px] text-stone-600 mt-0.5 font-mono">
                {bodyArmor ? (
                  <span>
                    {bodyArmor.name} ({bodyArmor.ac})
                  </span>
                ) : (
                  <span>
                    {formula === 'barbarian' && `Barbarian Unarmored (10 + DEX + CON)`}
                    {formula === 'monk' && `Monk Unarmored (10 + DEX + WIS)`}
                    {formula === 'mageArmor' && `Mage Armor (13 + DEX)`}
                    {formula === 'custom' && `Custom Base (${customBase} + DEX)`}
                    {formula === 'standard' && `Unarmored (10 + DEX)`}
                  </span>
                )}
                {shieldItem && ` + ${shieldItem.name} (+${shieldItem.ac || 2})`}
                {parsedBonus !== 0 && ` + Bonus (${parsedBonus >= 0 ? `+${parsedBonus}` : parsedBonus})`}
              </div>
            </div>

            <div className="w-14 h-10 bg-[#d9ead3] border border-[#276749] rounded flex items-center justify-center font-mono font-extrabold text-2xl text-stone-900 shadow-sm">
              {calculatedAc}
            </div>
          </div>

          {/* Unarmored Calculation Rule */}
          <div className="space-y-1.5 bg-stone-50 p-2.5 rounded border border-stone-200">
            <label className="font-bold text-stone-800 block text-xs">
              Unarmored Defense / Base Formula
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value as any)}
              disabled={!!bodyArmor}
              className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 font-sans text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78] disabled:bg-stone-100 disabled:text-stone-400"
            >
              <option value="standard">Standard Unarmored: 10 + DEX</option>
              <option value="barbarian">Barbarian Unarmored Defense: 10 + DEX + CON ({conMod >= 0 ? `+${conMod}` : conMod})</option>
              <option value="monk">Monk Unarmored Defense: 10 + DEX + WIS ({wisMod >= 0 ? `+${wisMod}` : wisMod})</option>
              <option value="mageArmor">Mage Armor Spell: 13 + DEX</option>
              <option value="custom">Custom Base AC: (Custom + DEX)</option>
            </select>
            {bodyArmor && (
              <p className="text-[10px] text-amber-700 font-medium">
                Note: Equipped armor ({bodyArmor.name}) overrides unarmored defense. Unequip body armor in the inventory to use unarmored formulas.
              </p>
            )}
            {formula === 'custom' && !bodyArmor && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-stone-600 text-[11px]">Base Value:</span>
                <input
                  type="number"
                  value={customBase}
                  onChange={(e) => setCustomBase(parseInt(e.target.value, 10) || 10)}
                  className="w-16 bg-white border border-stone-300 rounded px-2 py-1 font-mono text-xs text-center"
                />
                <span className="text-[10px] text-stone-500">+ DEX modifier</span>
              </div>
            )}
          </div>

          {/* Additional Number Modifier */}
          <div className="space-y-1.5">
            <label htmlFor="ac-mod-input" className="font-bold text-stone-800 block text-xs">
              Additional AC Modifier (Number)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="ac-mod-input"
                type="text"
                value={bonusInput}
                onChange={(e) => setBonusInput(e.target.value)}
                placeholder="+0 (e.g. +1, +2)"
                className="w-32 bg-white border border-stone-300 rounded px-3 py-1.5 font-mono font-bold text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
              />
              <span className="text-[11px] text-stone-500">
                Magic items, Defense fighting style, cover (+2/+5), spells.
              </span>
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="ac-note-input" className="font-bold text-stone-800 block text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>AC Note (Tooltip on Hover)</span>
              </label>
              {noteInput && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Tooltip active
                </span>
              )}
            </div>

            <textarea
              id="ac-note-input"
              rows={2}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Ring of Protection (+1 AC), Shield spell (+5 reaction), Half cover (+2 AC)"
              className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78] resize-none"
            />
            <p className="text-[11px] text-stone-500">
              When saved, this note will pop up as a helpful tooltip whenever you hover over the green AC box on your character sheet.
            </p>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded font-semibold text-xs transition-colors"
              title="Reset AC settings to default"
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
                <span>Save AC</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
