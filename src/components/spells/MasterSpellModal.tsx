import React, { useState, useMemo, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Spell } from '../../types/spell';
import { Search, X, Plus, BookOpen, Lock, CheckSquare, Square } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { SpellTooltipCard } from '../common/TooltipContent';

const SCHOOL_COLORS: Record<string, string> = {
  Abjur: 'text-blue-800 border-blue-400 bg-blue-50',
  Conj: 'text-yellow-800 border-yellow-400 bg-yellow-50',
  Divin: 'text-cyan-800 border-cyan-400 bg-cyan-50',
  Ench: 'text-pink-800 border-pink-400 bg-pink-50',
  Evoc: 'text-red-800 border-red-400 bg-red-50',
  Illus: 'text-purple-800 border-purple-400 bg-purple-50',
  Necro: 'text-emerald-800 border-emerald-400 bg-emerald-50',
  Trans: 'text-amber-800 border-amber-400 bg-amber-50',
};

const CLASSES = ['All', 'Wizard', 'Cleric', 'Druid', 'Bard', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Artificer'];

export const MasterSpellModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomSpell: () => void;
  initialLevel?: number | 'all';
}> = ({ isOpen, onClose, onOpenCustomSpell, initialLevel = 'all' }) => {
  const { character, masterSpells, isSpellPrepared, isSpellLocked, togglePreparedSpell } = useCharacter();

  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>(initialLevel);

  useEffect(() => {
    if (isOpen && initialLevel !== undefined) {
      setSelectedLevel(initialLevel);
    }
  }, [isOpen, initialLevel]);

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [onlyPrepared, setOnlyPrepared] = useState<boolean>(false);
  const [onlyConc, setOnlyConc] = useState<boolean>(false);
  const [onlyRitual, setOnlyRitual] = useState<boolean>(false);

  // Filter spells
  const filteredSpells = useMemo(() => {
    return masterSpells.filter((spell) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = spell.name.toLowerCase().includes(query);
        const matchesEffect = spell.effect.toLowerCase().includes(query);
        const matchesSchool = spell.school.toLowerCase().includes(query);
        if (!matchesName && !matchesEffect && !matchesSchool) return false;
      }

      // Level
      if (selectedLevel !== 'all' && spell.level !== selectedLevel) {
        return false;
      }

      // Class
      if (selectedClass !== 'All') {
        if (!spell.classes.includes(selectedClass)) return false;
      }

      // Prepared Only
      if (onlyPrepared && !isSpellPrepared(spell.name)) {
        return false;
      }

      // Concentration Only
      if (onlyConc && !spell.conc) {
        return false;
      }

      // Ritual Only
      if (onlyRitual && !spell.ritual) {
        return false;
      }

      return true;
    });
  }, [
    masterSpells,
    search,
    selectedLevel,
    selectedClass,
    onlyPrepared,
    onlyConc,
    onlyRitual,
    isSpellPrepared,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0">
      <div className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-5xl max-h-[82vh] h-[82vh] my-auto flex flex-col overflow-hidden text-stone-900 font-sans">
        {/* Banner Header */}
        <div className="bg-[#7b1113] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <div>
              <h2 className="font-fantasy font-bold text-sm tracking-wide">
                MASTER SPELL DATABASE
              </h2>
              <p className="text-[11px] text-stone-300 font-normal">
                Check any spell to add it to your prepared spell sheet • Hover name for full rules text
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCustomSpell}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f4e78] hover:bg-[#163857] text-white text-xs font-bold transition-colors shadow-xs"
              title="Create a new custom or homebrew spell"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Spell</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls (Parchment Themed) */}
        <div className="p-3 bg-stone-200/90 border-b border-stone-300 space-y-2 shrink-0 text-xs">
          {/* Search bar & Quick Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search spells by name, description, school..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs pl-8 pr-3 py-1.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#7b1113] focus:border-[#7b1113] placeholder:text-stone-400 shadow-2xs font-medium"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer bg-white px-2.5 py-1.5 rounded border border-stone-300 hover:border-stone-400 shadow-2xs select-none">
              <input
                type="checkbox"
                checked={onlyPrepared}
                onChange={(e) => setOnlyPrepared(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 cursor-pointer"
              />
              <span className="font-bold text-[#7b1113]">Prepared Only</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer bg-white px-2.5 py-1.5 rounded border border-stone-300 hover:border-stone-400 shadow-2xs select-none">
              <input
                type="checkbox"
                checked={onlyConc}
                onChange={(e) => setOnlyConc(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 cursor-pointer"
              />
              <span>Concentration</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer bg-white px-2.5 py-1.5 rounded border border-stone-300 hover:border-stone-400 shadow-2xs select-none">
              <input
                type="checkbox"
                checked={onlyRitual}
                onChange={(e) => setOnlyRitual(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 cursor-pointer"
              />
              <span>Ritual</span>
            </label>
          </div>

          {/* Spell Level Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
            <span className="text-[11px] font-bold text-stone-600 mr-1 shrink-0 uppercase tracking-wider">
              Level:
            </span>
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 transition-all ${
                selectedLevel === 'all'
                  ? 'bg-[#7b1113] text-white shadow-2xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel(0)}
              className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 transition-all ${
                selectedLevel === 0
                  ? 'bg-[#7b1113] text-white shadow-2xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
              }`}
            >
              Cantrips
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#7b1113] text-white shadow-2xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>

          {/* Class Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-xs">
            <span className="text-[11px] font-bold text-stone-600 mr-1 shrink-0 uppercase tracking-wider">
              Class:
            </span>
            {CLASSES.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 transition-all ${
                  selectedClass === cls
                    ? 'bg-[#1f4e78] text-white shadow-2xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Spells (1 row per spell, true table layout) */}
        <div className="flex-1 overflow-y-auto bg-white min-h-[300px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-stone-100 border-b border-stone-300 text-stone-700 font-bold text-[10px] uppercase shadow-2xs">
              <tr>
                <th className="w-10 text-center py-2 px-1">Prep</th>
                <th className="w-16 text-center px-1">Level</th>
                <th className="text-left px-3">Spell Name</th>
                <th className="w-20 text-center px-1">School</th>
                <th className="w-28 text-left px-2">Casting Time</th>
                <th className="w-24 text-left px-2">Range</th>
                <th className="w-28 text-left px-2">Duration</th>
                <th className="w-14 text-center px-1">Tags</th>
                <th className="w-24 text-center px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpells.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-500 text-xs">
                    No spells match your current search and filters.
                  </td>
                </tr>
              ) : (
                filteredSpells.map((spell) => {
                  const prepared = isSpellPrepared(spell.name);
                  const locked = isSpellLocked(spell.name);
                  const schoolBadge =
                    SCHOOL_COLORS[spell.school] ||
                    'text-stone-700 border-stone-300 bg-stone-100';

                  return (
                    <tr
                      key={spell.id}
                      onClick={() => {
                        if (prepared && locked) return;
                        togglePreparedSpell(spell.name);
                      }}
                      className={`border-b border-stone-200 last:border-b-0 transition-colors ${
                        prepared && locked
                          ? 'bg-amber-100/60 cursor-default'
                          : prepared
                          ? 'bg-amber-100/50 hover:bg-amber-100/80 cursor-pointer font-medium'
                          : 'hover:bg-stone-50 cursor-pointer'
                      }`}
                    >
                      {/* Checkbox / Lock Status */}
                      <td className="w-10 text-center py-2 px-1">
                        {prepared && locked ? (
                          <span
                            title="Spell is locked on spell sheet. Unlock to remove."
                            className="cursor-not-allowed inline-flex items-center justify-center p-0.5 text-amber-800"
                          >
                            <Lock className="w-4 h-4 fill-amber-700/20" />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePreparedSpell(spell.name);
                            }}
                            className="cursor-pointer"
                            title={prepared ? 'Remove from prepared' : 'Add to prepared'}
                          >
                            {prepared ? (
                              <CheckSquare className="w-4 h-4 text-[#7b1113] fill-[#7b1113]/20 mx-auto" />
                            ) : (
                              <Square className="w-4 h-4 text-stone-400 hover:text-stone-600 mx-auto" />
                            )}
                          </button>
                        )}
                      </td>

                      {/* Level */}
                      <td className="w-16 text-center px-1 font-mono text-[11px] font-bold text-stone-600">
                        {spell.level === 0 ? 'Cantrip' : `Lvl ${spell.level}`}
                      </td>

                      {/* Spell Name with Hover Tooltip */}
                      <td className="text-left px-3 font-fantasy font-bold text-xs sm:text-sm text-stone-900">
                        <Tooltip maxWidth="max-w-lg" content={<SpellTooltipCard spell={spell} />}>
                          <span className="cursor-help hover:text-[#1f4e78] underline decoration-dotted">
                            {spell.name}
                          </span>
                        </Tooltip>
                      </td>

                      {/* School Badge */}
                      <td className="w-20 text-center px-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${schoolBadge}`}
                        >
                          {spell.school}
                        </span>
                      </td>

                      {/* Casting Time */}
                      <td className="w-28 text-left px-2 font-mono text-stone-700 text-[11px] truncate">
                        {spell.castingTime}
                      </td>

                      {/* Range */}
                      <td className="w-24 text-left px-2 font-mono text-stone-700 text-[11px] truncate">
                        {spell.range}
                      </td>

                      {/* Duration */}
                      <td className="w-28 text-left px-2 font-mono text-stone-700 text-[11px] truncate">
                        {spell.duration}
                      </td>

                      {/* Concentration / Ritual Tags */}
                      <td className="w-14 text-center px-1">
                        <div className="flex items-center justify-center gap-1">
                          {spell.conc && (
                            <span
                              className="px-1 py-0.2 text-[9px] font-bold rounded bg-amber-100 text-amber-900 border border-amber-300"
                              title="Concentration"
                            >
                              C
                            </span>
                          )}
                          {spell.ritual && (
                            <span
                              className="px-1 py-0.2 text-[9px] font-bold rounded bg-cyan-100 text-cyan-900 border border-cyan-300"
                              title="Ritual"
                            >
                              R
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Prepare Action Button */}
                      <td className="w-24 text-center px-2">
                        {prepared && locked ? (
                          <button
                            type="button"
                            disabled
                            title="Spell is locked on spell sheet. Unlock on spell sheet to remove."
                            className="w-full py-0.5 rounded text-[10px] font-bold bg-[#7b1113]/70 text-white cursor-not-allowed opacity-80 flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePreparedSpell(spell.name);
                            }}
                            className={`w-full py-0.5 rounded text-[10px] font-bold transition-all shadow-2xs ${
                              prepared
                                ? 'bg-[#7b1113] hover:bg-[#630e10] text-white'
                                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            {prepared ? 'Prepared' : '+ Prepare'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-200/90 border-t border-stone-300 flex items-center justify-between text-xs text-stone-700 shrink-0">
          <div>
            Showing <strong className="text-stone-900 font-mono">{filteredSpells.length}</strong> spells •{' '}
            <strong className="text-[#7b1113] font-mono">
              {character.spellcasting.preparedSpellNames.length}
            </strong>{' '}
            total prepared
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#7b1113] hover:bg-[#630e10] text-white font-bold shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
