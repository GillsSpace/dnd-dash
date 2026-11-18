import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { ResourceTracker } from '../../types/character';
import { Sparkles, X, Plus, Edit2, ShieldAlert } from 'lucide-react';

const COMMON_RESOURCE_PRESETS: {
  name: string;
  reset: string;
  useProfBonus: boolean;
  fixedMax: number;
  desc: string;
}[] = [
  {
    name: "Favored Enemy",
    reset: "Long Rest",
    useProfBonus: true,
    fixedMax: 2,
    desc: "Cast Hunter's Mark without expending a spell slot (uses equal to Wisdom modifier or Proficiency Bonus).",
  },
  {
    name: "Channel Divinity",
    reset: "Short or Long Rest",
    useProfBonus: false,
    fixedMax: 2,
    desc: "Channel divine energy for Turn Undead, Divine Spark, or subclass features (recharges on short or long rest).",
  },
  {
    name: "Luck Points",
    reset: "Long Rest",
    useProfBonus: true,
    fixedMax: 2,
    desc: "From Lucky feat: Spend 1 luck point to gain Advantage on a d20 roll or impose Disadvantage on an attack against you.",
  },
  {
    name: "Second Wind",
    reset: "Short or Long Rest",
    useProfBonus: false,
    fixedMax: 2,
    desc: "Regain hit points equal to 1d10 + Fighter level as a Bonus Action.",
  },
  {
    name: "Action Surge",
    reset: "Short or Long Rest",
    useProfBonus: false,
    fixedMax: 1,
    desc: "Take one additional action on your turn.",
  },
  {
    name: "Wild Shape",
    reset: "Short or Long Rest",
    useProfBonus: false,
    fixedMax: 2,
    desc: "Magically assume the shape of a beast you have seen before.",
  },
  {
    name: "Bardic Inspiration",
    reset: "Short or Long Rest",
    useProfBonus: false,
    fixedMax: 3,
    desc: "Grant an ally an inspiration die to add to one ability check, attack roll, or saving throw.",
  },
  {
    name: "Rage",
    reset: "Long Rest",
    useProfBonus: false,
    fixedMax: 2,
    desc: "Enter a rage for advantage on Strength checks/saves, bonus melee damage, and damage resistances.",
  },
];

const RESET_OPTIONS = [
  'Long Rest',
  'Short Rest',
  'Short or Long Rest',
  'Turn',
  'Round',
  'Dawn',
  'Special',
];

export const ResourceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  resourceToEdit?: ResourceTracker | null;
}> = ({ isOpen, onClose, resourceToEdit }) => {
  const { addResource, updateResource, character } = useCharacter();

  const [name, setName] = useState('');
  const [reset, setReset] = useState('Long Rest');
  const [usesType, setUsesType] = useState<'fixed' | 'profBonus'>('fixed');
  const [fixedMax, setFixedMax] = useState(2);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (resourceToEdit) {
      setName(resourceToEdit.name);
      setReset(resourceToEdit.reset);
      setUsesType(resourceToEdit.useProfBonus ? 'profBonus' : 'fixed');
      setFixedMax(resourceToEdit.max);
      setDesc(resourceToEdit.desc || '');
    } else {
      setName('');
      setReset('Long Rest');
      setUsesType('fixed');
      setFixedMax(2);
      setDesc('');
    }
  }, [resourceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (presetName: string) => {
    const preset = COMMON_RESOURCE_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;

    setName(preset.name);
    setReset(preset.reset);
    setUsesType(preset.useProfBonus ? 'profBonus' : 'fixed');
    setFixedMax(preset.useProfBonus ? character.proficiencyBonus : preset.fixedMax);
    setDesc(preset.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const usePB = usesType === 'profBonus';
    const finalMax = usePB ? character.proficiencyBonus : Math.max(1, fixedMax);

    if (resourceToEdit) {
      updateResource({
        ...resourceToEdit,
        name: name.trim(),
        reset,
        useProfBonus: usePB,
        max: finalMax,
        current: Math.min(resourceToEdit.current, finalMax),
        desc: desc.trim(),
      });
    } else {
      addResource({
        id: `res-${Date.now()}`,
        name: name.trim(),
        reset,
        useProfBonus: usePB,
        max: finalMax,
        current: finalMax,
        desc: desc.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white border border-stone-400 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden font-sans text-stone-900">
        {/* Header */}
        <div className="bg-[#1f4e78] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h3 className="font-fantasy font-bold text-base">
              {resourceToEdit ? 'Edit Ability / Resource' : 'Add Ability / Resource Tracker'}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Preset Selector */}
          {!resourceToEdit && (
            <div className="bg-stone-50 p-2.5 rounded border border-stone-300">
              <label className="block font-bold text-[#1f4e78] mb-1">
                Quick Preset (Optional):
              </label>
              <select
                onChange={(e) => handleApplyPreset(e.target.value)}
                defaultValue=""
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none bg-white"
              >
                <option value="">-- Choose a standard ability preset --</option>
                {COMMON_RESOURCE_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} ({p.useProfBonus ? 'PB' : p.fixedMax} uses, resets on {p.reset})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Ability / Resource Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Favored Enemy, Channel Divinity, Second Wind"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none text-xs"
            />
          </div>

          {/* Reset Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">When It Resets</label>
              <select
                value={reset}
                onChange={(e) => setReset(e.target.value)}
                className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
              >
                {RESET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Uses / Max count */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">Max Uses</label>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usesType"
                      checked={usesType === 'fixed'}
                      onChange={() => setUsesType('fixed')}
                      className="accent-[#1f4e78]"
                    />
                    <span>Fixed</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usesType"
                      checked={usesType === 'profBonus'}
                      onChange={() => setUsesType('profBonus')}
                      className="accent-[#1f4e78]"
                    />
                    <span className="font-bold text-[#1f4e78]">= PB (+{character.proficiencyBonus})</span>
                  </label>
                </div>

                {usesType === 'fixed' && (
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fixedMax}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      setFixedMax(clean === '' ? 1 : parseInt(clean, 10));
                    }}
                    className="w-full border border-stone-300 rounded px-2 py-1 font-mono text-center focus:border-[#1f4e78] focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Hover Description */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Hover Tooltip Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe tactical mechanics, conditions, actions, or how uses are spent on hover..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1f4e78] hover:bg-[#163857] text-white rounded font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              {resourceToEdit ? (
                <>
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ability Tracker</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
