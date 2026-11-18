import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DND_2024_CLASSES, getCasterTypeForClass } from '../../utils/spellSlotHelper';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClass: (classData: {
    name: string;
    subclass?: string;
    level: number;
    hitDie: string;
    hp?: number;
  }) => void;
  conMod: number;
  isFirstClass: boolean;
}

const PRESET_CLASSES = [
  { key: 'barbarian', label: 'Barbarian', hitDie: 'd12' },
  { key: 'bard', label: 'Bard (Full Caster)', hitDie: 'd8' },
  { key: 'cleric', label: 'Cleric (Full Caster)', hitDie: 'd8' },
  { key: 'druid', label: 'Druid (Full Caster)', hitDie: 'd8' },
  { key: 'fighter', label: 'Fighter', hitDie: 'd10' },
  { key: 'monk', label: 'Monk', hitDie: 'd8' },
  { key: 'paladin', label: 'Paladin (Half Caster)', hitDie: 'd10' },
  { key: 'ranger', label: 'Ranger (Half Caster)', hitDie: 'd10' },
  { key: 'rogue', label: 'Rogue', hitDie: 'd8' },
  { key: 'sorcerer', label: 'Sorcerer (Full Caster)', hitDie: 'd6' },
  { key: 'warlock', label: 'Warlock (Pact Magic)', hitDie: 'd8' },
  { key: 'wizard', label: 'Wizard (Full Caster)', hitDie: 'd6' },
  { key: 'artificer', label: 'Artificer (Half Caster)', hitDie: 'd8' },
  { key: 'custom', label: '— Custom Class —', hitDie: 'd8' },
];

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onAddClass,
  conMod,
  isFirstClass,
}) => {
  const [selectedPreset, setSelectedPreset] = useState('fighter');
  const [className, setClassName] = useState('Fighter');
  const [subclass, setSubclass] = useState('');
  const [level, setLevel] = useState(1);
  const [hitDie, setHitDie] = useState('d10');

  if (!isOpen) return null;

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    if (key === 'custom') {
      setClassName('');
      setHitDie('d8');
    } else {
      const meta = DND_2024_CLASSES[key];
      if (meta) {
        setClassName(meta.name);
        setHitDie(meta.defaultHitDie);
      }
    }
  };

  const casterType = getCasterTypeForClass(className, subclass);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      alert('Please enter a class name.');
      return;
    }

    onAddClass({
      name: className.trim(),
      subclass: subclass.trim() || undefined,
      level: Math.max(1, level),
      hitDie,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#faf6f0] border-2 border-[#1f4e78] rounded-lg shadow-xl w-full max-w-md overflow-hidden text-stone-900">
        {/* Header */}
        <div className="bg-[#1f4e78] text-white px-4 py-2 flex items-center justify-between">
          <span className="font-fantasy font-bold text-base tracking-wide">
            Add Class / Multiclass
          </span>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Quick Preset Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              Choose D&D 2024 Class Preset
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full border border-stone-300 bg-white rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
            >
              {PRESET_CLASSES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Class Name */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Paladin, Wizard, Blood Hunter"
              className="w-full border border-stone-300 bg-white rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none font-semibold"
            />
          </div>

          {/* Subclass */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              Subclass <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={subclass}
              onChange={(e) => setSubclass(e.target.value)}
              placeholder="e.g. Gloom Stalker, Eldritch Knight, Life Domain"
              className="w-full border border-stone-300 bg-white rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
            />
          </div>

          {/* Level & Hit Die Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Class Level
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={level}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '');
                  setLevel(clean === '' ? 1 : parseInt(clean, 10));
                }}
                className="w-full border border-stone-300 bg-white rounded px-2.5 py-1.5 font-mono text-center font-bold focus:border-[#1f4e78] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Hit Die
              </label>
              <select
                value={hitDie}
                onChange={(e) => setHitDie(e.target.value)}
                className="w-full border border-stone-300 bg-white rounded px-2.5 py-1.5 font-mono font-bold focus:border-[#1f4e78] focus:outline-none text-center"
              >
                <option value="d6">d6 (Sorcerer, Wizard)</option>
                <option value="d8">d8 (Bard, Cleric, Druid, Monk, Rogue, Warlock)</option>
                <option value="d10">d10 (Fighter, Paladin, Ranger)</option>
                <option value="d12">d12 (Barbarian)</option>
              </select>
            </div>
          </div>

          {/* 2024 Caster Information Badge */}
          <div className="bg-[#f0f4f8] border border-[#1f4e78]/30 rounded p-2 text-[11px] text-stone-700">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1f4e78]">Caster Type (2024):</span>
              <span className="font-semibold uppercase tracking-wider text-[10px] bg-white px-2 py-0.5 rounded border border-stone-300">
                {casterType === 'full' && 'Full Caster (1x Level)'}
                {casterType === 'half' && 'Half Caster (Round-Up in Multiclass)'}
                {casterType === 'third' && 'Third Caster (1/3 Level)'}
                {casterType === 'pact' && 'Pact Magic (Short Rest Slots)'}
                {casterType === 'none' && 'Non-Caster'}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-300">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-stone-300 bg-white hover:bg-stone-100 font-semibold text-stone-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#1f4e78] hover:bg-[#163a5c] text-white font-bold shadow-sm transition-colors"
            >
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
