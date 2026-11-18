import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Spell } from '../../types/spell';
import { AbilityKey } from '../../types/character';
import { Wand2, Plus, BookOpen, X, Lock, Unlock } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { SpellTooltipCard } from '../common/TooltipContent';
import { calculateClassPreparedSpells } from '../../utils/spellSlotHelper';

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

const STAT_OPTIONS: { key: string; name: string; abbr: string }[] = [
  { key: 'INT', name: 'Intelligence', abbr: 'Int' },
  { key: 'WIS', name: 'Wisdom', abbr: 'Wis' },
  { key: 'CHA', name: 'Charisma', abbr: 'Cha' },
  { key: 'CON', name: 'Constitution', abbr: 'Con' },
  { key: 'DEX', name: 'Dexterity', abbr: 'Dex' },
  { key: 'STR', name: 'Strength', abbr: 'Str' },
];

export const SpellSheetView: React.FC<{
  onOpenMasterSpells: (level?: number | 'all') => void;
}> = ({ onOpenMasterSpells }) => {
  const {
    character,
    masterSpells,
    togglePreparedSpell,
    updateSpellNote,
    isSpellLocked,
    toggleSpellLock,
    toggleSpellSlot,
    adjustSpellSlotsUsed,
    setSpellcastingStat,
    getAbilityMod,
    saveDC,
    attackBonus,
  } = useCharacter();

  // Find all prepared spells from masterSpells list
  const preparedSpells: Spell[] = character.spellcasting.preparedSpellNames
    .map((name) =>
      masterSpells.find((s) => s.name.trim().toLowerCase() === name.trim().toLowerCase())
    )
    .filter((s): s is Spell => s !== undefined)
    .sort((a, b) => (a.level === b.level ? a.name.localeCompare(b.name) : a.level - b.level));

  // Group spells by level (0 to 9)
  const spellsByLevel: Record<number, Spell[]> = {};
  for (let lvl = 0; lvl <= 9; lvl++) {
    spellsByLevel[lvl] = [];
  }
  preparedSpells.forEach((s) => {
    spellsByLevel[s.level]?.push(s);
  });

  // Active spellcasting stat and dynamic ability modifier
  const currentStat = (character.spellcasting.stat || 'INT').toUpperCase();
  const currentStatInfo =
    STAT_OPTIONS.find((s) => s.key === currentStat) || {
      key: currentStat,
      name: currentStat,
      abbr: currentStat,
    };
  const spellMod = getAbilityMod((currentStat.toLowerCase() as AbilityKey) || 'int');
  const formattedMod = spellMod >= 0 ? `+${spellMod}` : `${spellMod}`;

  // Breakdown of how many prepared spells each class grants under D&D 2024 rules
  const intMod = getAbilityMod('int');
  const classPreparedSpells = calculateClassPreparedSpells(character.classes, { int: intMod });

  return (
    <div className="space-y-4 font-sans text-stone-900">
      {/* 1. First Red Header: CASTING INFORMATION */}
      <div className="bg-[#7b1113] text-white font-bold py-1.5 px-4 tracking-wider text-xs uppercase shadow-sm flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-amber-300" />
        <span>CASTING INFORMATION</span>
      </div>

      {/* Casting Information Box: Stats & Action Bar */}
      <div className="bg-[#f6efe6] p-3 border border-stone-300 space-y-3">
        {/* Dynamic Spellcasting Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
          {/* Stat Dropdown Card */}
          <div className="bg-white border border-stone-400 p-2.5 rounded shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">
              Spellcasting Stat
            </span>
            <div className="py-1">
              <select
                value={currentStat}
                onChange={(e) => setSpellcastingStat(e.target.value)}
                className="font-mono text-sm font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded px-2 py-0.5 cursor-pointer hover:border-[#1f4e78] focus:outline-none focus:ring-1 focus:ring-[#1f4e78] shadow-2xs"
              >
                {STAT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.key} — {opt.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-stone-500 block">
              {currentStatInfo.name} Modifier: <strong className="text-stone-800">{formattedMod}</strong>
            </span>
          </div>

          {/* Spell Save DC Card */}
          <div className="bg-white border border-stone-400 p-2.5 rounded shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">
              Spell Save DC
            </span>
            <span className="font-mono text-2xl font-extrabold text-[#7b1113]">
              {saveDC}
            </span>
            <span className="text-[10px] text-stone-500 block">
              8 + Prof (+{character.proficiencyBonus}) + {currentStatInfo.abbr} ({formattedMod})
            </span>
          </div>

          {/* Spell Attack Bonus Card */}
          <div className="bg-white border border-stone-400 p-2.5 rounded shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">
              Spell Attack Bonus
            </span>
            <span className="font-mono text-2xl font-extrabold text-[#276749]">
              {attackBonus >= 0 ? `+${attackBonus}` : attackBonus}
            </span>
            <span className="text-[10px] text-stone-500 block">
              Prof (+{character.proficiencyBonus}) + {currentStatInfo.abbr} ({formattedMod})
            </span>
          </div>
        </div>

        {/* Action Bar under stats: Prepared count & Select From Master List */}
        <div className="pt-2 border-t border-stone-300 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-stone-700 font-bold">Total Prepared Spells:</span>
              <span className="bg-[#7b1113] text-white font-mono font-bold px-2 py-0.5 rounded-full text-[11px] shadow-2xs">
                {preparedSpells.length}
              </span>
            </div>

            {/* Breakdown of prepared spells granted per class */}
            {classPreparedSpells.length > 0 && (
              <div className="text-stone-700 font-bold text-xs">
                {classPreparedSpells
                  .map((b) => `${b.subclass ? `${b.className} (${b.subclass})` : b.className}: ${b.prepared}`)
                  .join(' • ')}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenMasterSpells('all')}
            className="flex items-center gap-1.5 bg-[#1f4e78] hover:bg-[#163857] text-white font-bold px-3 py-1.5 rounded text-xs transition-colors shadow-xs"
            title="Open master spells library to select and prepare spells"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Select From Master List</span>
          </button>
        </div>
      </div>

      {/* 2. Second Red Header: SPELL LIST */}
      <div className="bg-[#7b1113] text-white font-bold py-1.5 px-4 tracking-wider text-xs uppercase shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>SPELL LIST</span>
        </div>
        <span className="text-[11px] text-white/80 font-normal">
          Prepared Spells & Integrated Spell Slots
        </span>
      </div>

      {/* Prepared Spells Grouped by Level with Integrated Slot Trackers */}
      <div className="space-y-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
          const spellsInLevel = spellsByLevel[lvl] || [];
          const slotData = character.spellcasting.slots[lvl.toString()];
          const hasSlots = lvl > 0 && !!slotData && slotData.total > 0;
          const hasSpells = spellsInLevel.length > 0;

          // Cantrips (lvl 0) always show so players can prepare cantrips;
          // Levels 1-9 show if the player has slots OR has prepared spells for that level.
          const shouldShowSection = lvl === 0 || hasSlots || hasSpells;
          if (!shouldShowSection) return null;

          const levelTitle = lvl === 0 ? 'CANTRIPS' : `LEVEL ${lvl}`;

          return (
            <div key={lvl} className="border border-stone-400 bg-white shadow-xs overflow-hidden">
              {/* Level Header with integrated slot tracker */}
              <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-[11px] flex flex-wrap items-center justify-between gap-2">
                {/* Left: Level Title */}
                <div className="flex items-center gap-2">
                  <span className="tracking-wide">{levelTitle}</span>
                </div>

                {/* Right: Integrated Slot Tracker */}
                {lvl === 0 ? null : hasSlots ? (
                  <div className="flex items-center gap-2">
                    {/* Available Count */}
                    <span className="font-mono text-[10px] font-bold text-amber-200">
                      {slotData.total - slotData.used} / {slotData.total} Available
                    </span>

                    {/* Interactive Slot Pips */}
                    <div
                      className="flex items-center gap-1"
                      title="Click slot pip to toggle used / available"
                    >
                      {Array.from({ length: slotData.total }).map((_, i) => {
                        const isUsed = i < slotData.used;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggleSpellSlot(lvl, i)}
                            className={`w-3.5 h-3.5 rounded border transition-all cursor-pointer ${
                              !isUsed
                                ? 'bg-amber-300 border-amber-100 shadow-2xs hover:bg-amber-200'
                                : 'bg-stone-500/70 border-stone-400 hover:bg-stone-500/90'
                            }`}
                            title={`Slot ${i + 1}: ${
                              isUsed ? 'Used (click to recover)' : 'Available (click to expend)'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {/* Stepper Buttons: [-1] to subtract available slot (expend), [+1] to add available slot (recover) */}
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        type="button"
                        onClick={() => adjustSpellSlotsUsed(lvl, 1)}
                        disabled={slotData.used >= slotData.total}
                        className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] border transition-colors ${
                          slotData.used < slotData.total
                            ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 border-amber-300 shadow-2xs cursor-pointer'
                            : 'bg-white/20 text-white/30 border-white/10 cursor-not-allowed'
                        }`}
                        title={`Expend 1 Level ${lvl} spell slot (-1 Available)`}
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustSpellSlotsUsed(lvl, -1)}
                        disabled={slotData.used <= 0}
                        className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] border transition-colors ${
                          slotData.used > 0
                            ? 'bg-white text-stone-900 border-stone-200 hover:bg-stone-100 shadow-2xs cursor-pointer'
                            : 'bg-white/20 text-white/30 border-white/10 cursor-not-allowed'
                        }`}
                        title={`Recover 1 Level ${lvl} spell slot (+1 Available)`}
                      >
                        +1
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-stone-300 italic">
                    Innate / Special (No Slots)
                  </span>
                )}
              </div>

              {/* Level Body: Spell Table or Empty State Banner */}
              {hasSpells ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700 border-b border-stone-300 font-bold text-[10px]">
                        <th className="px-3 py-1">Spell Name</th>
                        <th className="px-2 w-20 text-center">School</th>
                        <th className="px-2 w-28">Casting Time</th>
                        <th className="px-2 w-24">Range</th>
                        <th className="px-2 w-28">Duration</th>
                        <th className="px-2 w-16 text-center">Tags</th>
                        <th className="px-2 w-1/5 text-left">Notes</th>
                        <th className="px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {spellsInLevel.map((spell) => {
                        const schoolBadge =
                          SCHOOL_COLORS[spell.school] ||
                          'text-stone-700 border-stone-300 bg-stone-100';
                        const isLocked = isSpellLocked(spell.name);

                        return (
                          <tr
                            key={spell.id}
                            className="border-b border-stone-200 last:border-b-0 hover:bg-stone-50 transition-colors"
                          >
                            {/* Spell Name with Lock Icon & Hover Tooltip */}
                            <td className="px-3 py-1.5 font-bold text-stone-900">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleSpellLock(spell.name)}
                                  title={
                                    isLocked
                                      ? 'Spell is locked (cannot be removed). Click to unlock.'
                                      : 'Lock spell to prevent removal'
                                  }
                                  className={`p-0.5 rounded transition-colors ${
                                    isLocked
                                      ? 'text-amber-700 hover:text-amber-900'
                                      : 'text-stone-300 hover:text-stone-500'
                                  }`}
                                >
                                  {isLocked ? (
                                    <Lock className="w-3.5 h-3.5 fill-amber-700/20" />
                                  ) : (
                                    <Unlock className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <Tooltip maxWidth="max-w-lg" content={<SpellTooltipCard spell={spell} />}>
                                  <span className="cursor-help hover:text-[#1f4e78] underline decoration-dotted">
                                    {spell.name}
                                  </span>
                                </Tooltip>
                              </div>
                            </td>

                            {/* School Badge */}
                            <td className="px-2 text-center">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${schoolBadge}`}
                              >
                                {spell.school}
                              </span>
                            </td>

                            {/* Casting Time */}
                            <td className="px-2 text-stone-700 font-mono text-[11px]">
                              {spell.castingTime}
                            </td>

                            {/* Range */}
                            <td className="px-2 text-stone-700 font-mono text-[11px]">
                              {spell.range}
                            </td>

                            {/* Duration */}
                            <td className="px-2 text-stone-700 font-mono text-[11px]">
                              {spell.duration}
                            </td>

                            {/* Concentration / Ritual Tags */}
                            <td className="px-2 text-center">
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

                            {/* Notes Column */}
                            <td className="px-2 py-1 w-1/5">
                              <input
                                type="text"
                                value={character.spellcasting.spellNotes?.[spell.name] || ''}
                                onChange={(e) => updateSpellNote(spell.name, e.target.value)}
                                placeholder="Add note..."
                                className="w-full bg-transparent hover:bg-stone-100 focus:bg-white border border-transparent hover:border-stone-300 focus:border-[#1f4e78] rounded px-1.5 py-0.5 text-xs text-stone-800 placeholder:text-stone-300 focus:outline-none transition-colors"
                                title={`Notes for ${spell.name}`}
                              />
                            </td>

                            {/* Remove from prepared */}
                            <td className="px-2 text-center">
                              <button
                                type="button"
                                onClick={() => !isLocked && togglePreparedSpell(spell.name)}
                                disabled={isLocked}
                                title={
                                  isLocked
                                    ? 'Spell is locked. Unlock to remove.'
                                    : 'Remove from Prepared Spells'
                                }
                                className={`p-0.5 transition-colors ${
                                  isLocked
                                    ? 'text-stone-200 cursor-not-allowed opacity-30'
                                    : 'text-stone-400 hover:text-red-700 cursor-pointer'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Empty state when player has slots but no prepared spells */
                <div className="py-3 px-4 bg-stone-50/80 flex items-center justify-between text-xs text-stone-600">
                  <span className="italic text-stone-500">
                    {lvl === 0
                      ? 'No cantrips prepared.'
                      : `No Level ${lvl} spells prepared.`}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenMasterSpells(lvl)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded font-bold text-[11px] text-[#1f4e78] hover:text-[#163857] shadow-2xs transition-colors"
                    title={`Open master spells library to prepare Level ${lvl} spells`}
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Prepare {lvl === 0 ? 'Cantrips' : `Level ${lvl} Spells`}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
