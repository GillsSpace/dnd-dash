import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Shield, X, Sparkles } from 'lucide-react';
import { DND2024_ARMOR_PRESETS } from '../../data/dnd2024Armor';

export const ArmorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { character, getAbilityMod, addArmor } = useCharacter();

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'L' | 'M' | 'H' | 'Shield' | string>('M');
  const [ac, setAc] = useState<number>(14);
  const [dexBonus, setDexBonus] = useState<number>(2);
  const [daStealth, setDaStealth] = useState<boolean>(false);
  const [weight, setWeight] = useState<number>(20);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const dexMod = getAbilityMod('dex');

  const handlePresetSelect = (armorName: string) => {
    setSelectedPreset(armorName);
    if (!armorName) return;

    const preset = DND2024_ARMOR_PRESETS.find((a) => a.name === armorName);
    if (!preset) return;

    let calculatedDex = 0;
    if (preset.dexBonusType === 'full') {
      calculatedDex = dexMod;
    } else if (preset.dexBonusType === 'max2') {
      calculatedDex = Math.min(2, dexMod);
    } else {
      calculatedDex = 0;
    }

    setName(preset.name);
    setType(preset.typeCode);
    setAc(preset.ac);
    setDexBonus(calculatedDex);
    setDaStealth(preset.stealthDisadvantage);
    setWeight(preset.weight);

    const extraNotes = [
      preset.cost ? `Cost: ${preset.cost}` : '',
      preset.strengthRequired ? `Req Str ${preset.strengthRequired}` : '',
      preset.donDoffTime || '',
    ]
      .filter(Boolean)
      .join(' • ');

    setNotes(extraNotes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newArmorItem = {
      id: `armor-${Date.now()}`,
      name: name.trim(),
      type,
      ac: Number(ac) || 0,
      dexBonus: Number(dexBonus) || 0,
      daStealth,
      weight: Number(weight) || 0,
      equipped: true,
      notes: notes.trim(),
    };

    addArmor(newArmorItem);
    onClose();
  };

  const lightPresets = DND2024_ARMOR_PRESETS.filter((a) => a.category === 'Light');
  const mediumPresets = DND2024_ARMOR_PRESETS.filter((a) => a.category === 'Medium');
  const heavyPresets = DND2024_ARMOR_PRESETS.filter((a) => a.category === 'Heavy');
  const shieldPresets = DND2024_ARMOR_PRESETS.filter((a) => a.category === 'Shield');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white border border-stone-400 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-sans text-stone-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1f4e78] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base tracking-wide">Add Armor / Shield</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Preset Selector */}
          <div className="bg-[#f0f4f8] p-3 rounded-xl border border-blue-200">
            <label className="block text-xs font-bold text-[#1f4e78] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Choose D&D 2024 Armor Preset
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-semibold focus:border-[#1f4e78] focus:ring-1 focus:ring-[#1f4e78] focus:outline-none"
            >
              <option value="">— Select Official D&D 2024 Armor / Shield —</option>
              <optgroup label="Light Armor (AC + Dex)">
                {lightPresets.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} (AC {a.ac} + Dex{a.stealthDisadvantage ? ', Stealth DA' : ''}, {a.weight} lb)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Medium Armor (AC + Dex max 2)">
                {mediumPresets.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} (AC {a.ac} + Dex max 2{a.stealthDisadvantage ? ', Stealth DA' : ''}, {a.weight} lb)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Heavy Armor (Flat AC, no Dex)">
                {heavyPresets.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} (AC {a.ac}, No Dex{a.strengthRequired ? `, Str ${a.strengthRequired}` : ''}, {a.weight} lb)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Shield (+2 AC)">
                {shieldPresets.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} (+2 AC, {a.weight} lb)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Name & Type */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Armor Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Breastplate, Mithral Half Plate"
                className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:border-[#1f4e78] focus:outline-none"
              />
            </div>
            <div className="col-span-4">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setType(newType);
                  if (newType === 'L') setDexBonus(dexMod);
                  else if (newType === 'M') setDexBonus(Math.min(2, dexMod));
                  else setDexBonus(0);
                }}
                className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:border-[#1f4e78] focus:outline-none"
              >
                <option value="L">Light (L)</option>
                <option value="M">Medium (M)</option>
                <option value="H">Heavy (H)</option>
                <option value="Shield">Shield</option>
                <option value="Other">Other / Magic</option>
              </select>
            </div>
          </div>

          {/* AC, Dex, Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Base AC {type === 'Shield' ? 'Bonus' : ''}
              </label>
              <input
                type="number"
                required
                value={ac}
                onChange={(e) => setAc(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-stone-300 rounded-lg p-2 text-xs font-mono font-bold focus:border-[#1f4e78] focus:outline-none text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Dex Applied
              </label>
              <input
                type="number"
                value={dexBonus}
                onChange={(e) => setDexBonus(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-stone-300 rounded-lg p-2 text-xs font-mono font-bold focus:border-[#1f4e78] focus:outline-none text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-stone-300 rounded-lg p-2 text-xs font-mono focus:border-[#1f4e78] focus:outline-none text-center"
              />
            </div>
          </div>

          {/* Stealth Disadvantage */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="armor-da"
              checked={daStealth}
              onChange={(e) => setDaStealth(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-stone-300 cursor-pointer"
            />
            <label htmlFor="armor-da" className="text-xs text-stone-700 font-medium cursor-pointer">
              Disadvantage on Dexterity (Stealth) Checks
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Properties / Don-Doff Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 5 Mins to Don / 1 Min to Doff, Req Str 13"
              className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:border-[#1f4e78] focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1f4e78] text-white rounded-xl text-xs font-bold hover:bg-[#153654] transition-colors shadow-md"
            >
              Add Armor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
