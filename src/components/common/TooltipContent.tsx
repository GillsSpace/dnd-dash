import React from 'react';
import { Spell } from '../../types/spell';
import { WEAPON_MASTERY_DESCRIPTIONS, WEAPON_PROPERTY_DESCRIPTIONS } from '../../data/dnd2024Weapons';

const SCHOOL_COLORS: Record<string, string> = {
  Abjur: 'text-sky-300 border-sky-700/60 bg-sky-950/70',
  Conj: 'text-amber-300 border-amber-700/60 bg-amber-950/70',
  Div: 'text-teal-300 border-teal-700/60 bg-teal-950/70',
  Divin: 'text-teal-300 border-teal-700/60 bg-teal-950/70',
  Ench: 'text-rose-300 border-rose-700/60 bg-rose-950/70',
  Evoc: 'text-red-300 border-red-700/60 bg-red-950/70',
  Illus: 'text-purple-300 border-purple-700/60 bg-purple-950/70',
  Necro: 'text-emerald-300 border-emerald-700/60 bg-emerald-950/70',
  Trans: 'text-amber-400 border-amber-700/60 bg-amber-950/70',
};

const SCHOOL_FULL_NAMES: Record<string, string> = {
  Abjur: 'Abjuration',
  Conj: 'Conjuration',
  Div: 'Divination',
  Divin: 'Divination',
  Ench: 'Enchantment',
  Evoc: 'Evocation',
  Illus: 'Illusion',
  Necro: 'Necromancy',
  Trans: 'Transmutation',
};

export const SpellTooltipCard: React.FC<{ spell: Spell }> = ({ spell }) => {
  const schoolBadge = SCHOOL_COLORS[spell.school] || 'text-stone-300 border-stone-600 bg-stone-800';
  const schoolName = SCHOOL_FULL_NAMES[spell.school] || spell.school;
  const levelText = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;

  return (
    <div className="space-y-2 text-left font-sans">
      {/* Header: Title, Level, School & Tags */}
      <div className="flex items-start justify-between gap-2 border-b border-stone-700/80 pb-1.5">
        <div>
          <h4 className="font-fantasy text-sm font-bold text-amber-200 tracking-wide">
            {spell.name}
          </h4>
          <p className="text-xs text-stone-300">
            {levelText} • {schoolName}
            {spell.source && (
              <span className="text-[11px] text-stone-400 ml-1.5 font-normal">
                ({spell.source})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`px-1.5 py-0.5 text-[11px] font-semibold rounded border ${schoolBadge}`}>
            {spell.school}
          </span>
          {spell.conc && (
            <span
              className="px-1.5 py-0.5 text-[11px] font-semibold rounded bg-amber-900/40 text-amber-200 border border-amber-700/50"
              title="Concentration"
            >
              Conc
            </span>
          )}
          {spell.ritual && (
            <span
              className="px-1.5 py-0.5 text-[11px] font-semibold rounded bg-sky-900/40 text-sky-200 border border-sky-700/50"
              title="Ritual"
            >
              Ritual
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs py-1.5 bg-stone-900/70 rounded px-2.5 border border-stone-700/60">
        <div>
          <span className="text-stone-400">Casting Time:</span>{' '}
          <span className="text-stone-200 font-medium">{spell.castingTime}</span>
        </div>
        <div>
          <span className="text-stone-400">Range:</span>{' '}
          <span className="text-stone-200 font-medium">{spell.range}</span>
        </div>
        <div>
          <span className="text-stone-400">Duration:</span>{' '}
          <span className="text-stone-200 font-medium">{spell.duration}</span>
        </div>
        <div>
          <span className="text-stone-400">Components:</span>{' '}
          <span className="text-stone-200 font-medium">{spell.components || 'V, S'}</span>
          {spell.cost && <span className="text-amber-300 ml-1">({spell.cost})</span>}
        </div>
        {spell.areaOrTargets && (
          <div className="col-span-2">
            <span className="text-stone-400">Target/Area:</span>{' '}
            <span className="text-stone-200">{spell.areaOrTargets}</span>
          </div>
        )}
        {spell.saveOrAttack && (
          <div className="col-span-2">
            <span className="text-stone-400">Save / Attack:</span>{' '}
            <span className="text-amber-200 font-medium">{spell.saveOrAttack}</span>
          </div>
        )}
      </div>

      {/* Tactical Brief */}
      <div className="space-y-1 text-xs text-stone-200 leading-relaxed pt-0.5">
        <div className="border-b border-stone-800 pb-0.5 text-[11px] text-amber-300/90 font-bold uppercase tracking-wider">
          Summary
        </div>
        <p>{spell.effect}</p>
      </div>

      {/* Footer: Classes & Accordion Affordance */}
      <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400 gap-2">
        {spell.classes && spell.classes.length > 0 ? (
          <div className="flex flex-wrap gap-1 items-center max-w-[65%]">
            <span className="text-stone-400">Classes:</span>
            {spell.classes.map((c) => (
              <span key={c} className="text-stone-200 bg-stone-800 px-1.5 py-0.2 rounded border border-stone-700">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}
        <span className="italic text-stone-400 shrink-0">
          Click row for full rules
        </span>
      </div>
    </div>
  );
};

export const WeaponTooltipCard: React.FC<{
  name: string;
  toHit: string;
  damage: string;
  damageType: string;
  range: string;
  properties: string[];
  mastery?: string;
  masteryActive?: boolean;
  notes?: string;
}> = ({ name, toHit, damage, damageType, range, properties, mastery, masteryActive, notes }) => {
  const masteryDesc = (mastery && WEAPON_MASTERY_DESCRIPTIONS[mastery]) || notes;

  return (
    <div className="space-y-2 text-left max-w-xs font-sans">
      <div className="flex items-center justify-between border-b border-stone-700/80 pb-1.5">
        <div>
          <h4 className="font-fantasy text-sm font-bold text-amber-200">{name}</h4>
          <p className="text-xs text-stone-300">
            {damage} {damageType} • {range}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-amber-200 bg-stone-800 px-2 py-0.5 rounded border border-amber-700/40">
            {toHit} to hit
          </span>
        </div>
      </div>

      {mastery && (
        <div className="p-2 rounded bg-amber-950/40 border border-amber-700/40 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-amber-200">
            <span>Mastery: {mastery}</span>
            {masteryActive ? (
              <span className="text-[11px] text-emerald-300 bg-stone-900 px-1.5 rounded border border-emerald-700/40">Active</span>
            ) : (
              <span className="text-[11px] text-stone-400 bg-stone-900 px-1.5 rounded border border-stone-700">Inactive</span>
            )}
          </div>
          {masteryDesc && (
            <p className="text-stone-300 text-xs leading-normal">
              {masteryDesc}
            </p>
          )}
        </div>
      )}

      {properties.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 items-center">
          <span className="text-xs text-stone-400">Properties:</span>
          {properties.map((p) => {
            const baseProp = p.split(' ')[0].replace(/[^a-zA-Z-]/g, '');
            const desc = WEAPON_PROPERTY_DESCRIPTIONS[p] || WEAPON_PROPERTY_DESCRIPTIONS[baseProp];
            return (
              <span
                key={p}
                title={desc || undefined}
                className="text-xs bg-stone-800 text-stone-200 px-1.5 py-0.5 rounded border border-stone-700 cursor-help"
              >
                {p}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SkillTooltipCard: React.FC<{
  name: string;
  ability: string;
  abilityMod: number;
  prof: 'none' | 'half' | 'prof' | 'expert';
  profBonus: number;
  totalBonus: number;
}> = ({ name, ability, abilityMod, prof, profBonus, totalBonus }) => {
  const profContribution =
    prof === 'expert'
      ? profBonus * 2
      : prof === 'prof'
      ? profBonus
      : prof === 'half'
      ? Math.floor(profBonus / 2)
      : 0;

  const profLabel =
    prof === 'expert'
      ? 'Expertise'
      : prof === 'prof'
      ? 'Proficient'
      : prof === 'half'
      ? 'Half-Proficient'
      : 'None';

  return (
    <div className="space-y-1.5 text-left w-52 font-sans">
      <div className="flex items-center justify-between border-b border-stone-700/80 pb-1">
        <span className="font-fantasy font-bold text-amber-200 text-sm">{name}</span>
        <span className="font-mono font-bold text-amber-200 text-sm">
          {totalBonus >= 0 ? `+${totalBonus}` : totalBonus}
        </span>
      </div>

      <div className="text-xs space-y-1 text-stone-300">
        <div className="flex justify-between">
          <span className="text-stone-400">Ability ({ability.toUpperCase()}):</span>
          <span className="font-mono">{abilityMod >= 0 ? `+${abilityMod}` : abilityMod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Proficiency ({profLabel}):</span>
          <span className="font-mono">{profContribution >= 0 ? `+${profContribution}` : profContribution}</span>
        </div>
        <div className="pt-1 border-t border-stone-800 flex justify-between font-semibold text-stone-100">
          <span>Total Modifier:</span>
          <span className="text-amber-300 font-mono">{totalBonus >= 0 ? `+${totalBonus}` : totalBonus}</span>
        </div>
      </div>
    </div>
  );
};

export const ResourceTooltipCard: React.FC<{
  name: string;
  reset: string;
  current: number;
  max: number;
  desc?: string;
  useProfBonus?: boolean;
}> = ({ name, reset, current, max, desc, useProfBonus }) => {
  return (
    <div className="space-y-1.5 text-left max-w-xs font-sans">
      <div className="flex items-center justify-between border-b border-stone-700/80 pb-1">
        <h4 className="font-fantasy text-sm font-bold text-amber-200">{name}</h4>
        <span className="font-mono text-xs font-bold text-amber-200 bg-stone-800 px-2 py-0.5 rounded border border-amber-700/40">
          {current} / {max} {useProfBonus ? '(PB)' : ''}
        </span>
      </div>
      <div className="text-xs text-stone-400">
        Resets on: <span className="text-stone-200 font-semibold">{reset}</span>
      </div>
      {desc ? (
        <p className="text-xs text-stone-300 leading-snug pt-0.5">{desc}</p>
      ) : (
        <p className="text-xs text-stone-400 italic">No description provided.</p>
      )}
    </div>
  );
};
