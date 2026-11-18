import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Spell } from '../../types/spell';
import { Plus, X } from 'lucide-react';

const SCHOOLS = ['Abjur', 'Conj', 'Divin', 'Ench', 'Evoc', 'Illus', 'Necro', 'Trans'];
const CLASSES = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];

export const CustomSpellModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addCustomSpell } = useCharacter();

  const [name, setName] = useState('');
  const [level, setLevel] = useState<number>(1);
  const [school, setSchool] = useState<string>('Evoc');
  const [castingTime, setCastingTime] = useState('1 Action');
  const [range, setRange] = useState('60 feet');
  const [duration, setDuration] = useState('Instantaneous');
  const [components, setComponents] = useState('V, S');
  const [cost, setCost] = useState('');
  const [saveOrAttack, setSaveOrAttack] = useState('');
  const [effect, setEffect] = useState('');
  const [conc, setConc] = useState(false);
  const [ritual, setRitual] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Ranger', 'Cleric']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomSpell({
      name: name.trim(),
      level,
      school,
      castingTime,
      range,
      duration,
      components,
      cost,
      saveOrAttack,
      effect: effect.trim() || 'No description provided.',
      conc,
      ritual,
      classes: selectedClasses,
      source: 'Homebrew',
    });

    onClose();
  };

  const toggleClass = (c: string) => {
    setSelectedClasses((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0">
      <div className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] text-stone-900 font-sans">
        <div className="bg-[#7b1113] text-white px-4 py-2.5 border-b border-stone-300 flex items-center justify-between shrink-0 shadow-sm">
          <h3 className="font-fantasy font-bold text-sm tracking-wide text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-300" />
            <span>CREATE CUSTOM / HOMEBREW SPELL</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto text-xs bg-[#faf6f0]">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Spell Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zephyr Strike, Radiant Burst"
              className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] focus:border-[#7b1113] shadow-2xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Spell Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] shadow-2xs font-medium"
              >
                <option value={0}>Cantrip (Level 0)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">School of Magic</label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] shadow-2xs font-medium"
              >
                {SCHOOLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Casting Time</label>
              <input
                type="text"
                value={castingTime}
                onChange={(e) => setCastingTime(e.target.value)}
                className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] shadow-2xs font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Range</label>
              <input
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] shadow-2xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] shadow-2xs font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Save or Attack</label>
              <input
                type="text"
                value={saveOrAttack}
                onChange={(e) => setSaveOrAttack(e.target.value)}
                placeholder="e.g. Dex save, Spell attack"
                className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] shadow-2xs font-medium"
              />
            </div>
          </div>

          <div className="flex gap-4 items-center pt-1 text-stone-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={conc}
                onChange={(e) => setConc(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 cursor-pointer"
              />
              <span className="font-semibold text-xs">Requires Concentration</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ritual}
                onChange={(e) => setRitual(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 cursor-pointer"
              />
              <span className="font-semibold text-xs">Can Cast as Ritual</span>
            </label>
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Spell Effect / Description</label>
            <textarea
              rows={4}
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              placeholder="Describe the spell effects, damage dice, upcasting rules..."
              className="w-full bg-white text-stone-900 px-2.5 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] text-xs shadow-2xs font-sans"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-bold mb-1">Available to Classes</label>
            <div className="flex flex-wrap gap-1.5">
              {CLASSES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleClass(c)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                    selectedClasses.includes(c)
                      ? 'bg-[#1f4e78] text-white border-[#1f4e78] shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-300 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#7b1113] hover:bg-[#630e10] text-white font-bold shadow-xs transition-colors"
            >
              Save Spell & Prepare
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
