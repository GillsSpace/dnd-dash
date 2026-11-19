import React from 'react';
import { Spell } from '../../types/spell';
import { WEAPON_MASTERY_DESCRIPTIONS, WEAPON_PROPERTY_DESCRIPTIONS } from '../../data/dnd2024Weapons';
import { useShiftKey } from '../../hooks/useShiftKey';

const SCHOOL_COLORS: Record<string, string> = {
  Abjur: 'text-blue-400 border-blue-500/40 bg-blue-950/60',
  Conj: 'text-yellow-400 border-yellow-500/40 bg-yellow-950/60',
  Div: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
  Divin: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
  Ench: 'text-pink-400 border-pink-500/40 bg-pink-950/60',
  Evoc: 'text-red-400 border-red-500/40 bg-red-950/60',
  Illus: 'text-purple-400 border-purple-500/40 bg-purple-950/60',
  Necro: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
  Trans: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
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
  const isShift = useShiftKey();
  const schoolBadge = SCHOOL_COLORS[spell.school] || 'text-slate-300 border-slate-600 bg-slate-800';
  const schoolName = SCHOOL_FULL_NAMES[spell.school] || spell.school;
  const levelText = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-1.5">
        <div>
          <h4 className="font-fantasy text-sm font-bold text-amber-300 tracking-wide">
            {spell.name}
          </h4>
          <p className="text-[11px] text-slate-400">
            {levelText} • {schoolName}
            {spell.source && (
              <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                ({spell.source})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${schoolBadge}`}>
            {spell.school}
          </span>
          {spell.conc && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40" title="Concentration">
              Conc
            </span>
          )}
          {spell.ritual && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" title="Ritual">
              Ritual
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] py-1 bg-slate-800/50 rounded px-2 border border-slate-700/50">
        <div>
          <span className="text-slate-400">Casting Time:</span>{' '}
          <span className="text-slate-200 font-medium">{spell.castingTime}</span>
        </div>
        <div>
          <span className="text-slate-400">Range:</span>{' '}
          <span className="text-slate-200 font-medium">{spell.range}</span>
        </div>
        <div>
          <span className="text-slate-400">Duration:</span>{' '}
          <span className="text-slate-200 font-medium">{spell.duration}</span>
        </div>
        <div>
          <span className="text-slate-400">Components:</span>{' '}
          <span className="text-slate-200 font-medium">{spell.components || 'V, S'}</span>
          {spell.cost && <span className="text-amber-400 ml-1">({spell.cost})</span>}
        </div>
        {spell.areaOrTargets && (
          <div className="col-span-2">
            <span className="text-slate-400">Target/Area:</span>{' '}
            <span className="text-slate-200">{spell.areaOrTargets}</span>
          </div>
        )}
        {spell.saveOrAttack && (
          <div className="col-span-2">
            <span className="text-slate-400">Save / Attack:</span>{' '}
            <span className="text-amber-300 font-medium">{spell.saveOrAttack}</span>
          </div>
        )}
      </div>

      {/* Rules text: Brief summary or Full rules text toggled with Shift */}
      {isShift ? (
        <div className="space-y-2 text-[11px] text-slate-200 leading-relaxed max-h-80 overflow-y-auto pr-1">
          <div className="flex items-center justify-between border-b border-amber-500/40 pb-0.5 text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            <span>⚡ Full Rules Text</span>
            {spell.source && (
              <span className="text-[9px] text-slate-400 font-normal lowercase tracking-normal">
                ({spell.source})
              </span>
            )}
          </div>
          {(spell.fullText || spell.effect).split('\n\n').map((para, idx) => {
            const isUpgrade =
              para.startsWith('Using a Higher-Level') || para.startsWith('Cantrip Upgrade');
            return (
              <p
                key={idx}
                className={
                  isUpgrade
                    ? 'text-amber-300 font-medium pt-1.5 border-t border-slate-700/70'
                    : 'text-slate-200'
                }
              >
                {para}
              </p>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1 text-[11px] text-slate-300 leading-relaxed max-h-48 overflow-y-auto pr-1">
          <div className="border-b border-slate-700/60 pb-0.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Tactical Brief
          </div>
          <p>{spell.effect}</p>
        </div>
      )}

      {/* Footer: Classes & Shift Hint */}
      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 gap-2">
        {spell.classes && spell.classes.length > 0 ? (
          <div className="flex flex-wrap gap-1 items-center max-w-[65%]">
            <span className="text-slate-500">Classes:</span>
            {spell.classes.map((c) => (
              <span key={c} className="text-slate-300 bg-slate-800 px-1 py-0.2 rounded">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}

        <div className="shrink-0 font-mono text-[10px]">
          {isShift ? (
            <span className="text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40">
              Release [Shift] for Brief
            </span>
          ) : (
            <span className="text-slate-400 italic">
              Hold [Shift] for Full Rules
            </span>
          )}
        </div>
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
    <div className="space-y-2 text-left max-w-xs">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
        <div>
          <h4 className="font-fantasy text-sm font-bold text-amber-300">{name}</h4>
          <p className="text-[11px] text-slate-400">
            {damage} {damageType} • {range}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
            {toHit} to hit
          </span>
        </div>
      </div>

      {mastery && (
        <div className="p-2 rounded bg-amber-950/40 border border-amber-600/40 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <span>Mastery: {mastery}</span>
            {masteryActive ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1 rounded border border-emerald-500/30">Active</span>
            ) : (
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded border border-slate-700">Inactive</span>
            )}
          </div>
          {masteryDesc && (
            <p className="text-slate-300 text-[10px] leading-tight">
              {masteryDesc}
            </p>
          )}
        </div>
      )}

      {properties.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 items-center">
          <span className="text-[10px] text-slate-400">Properties:</span>
          {properties.map((p) => {
            const baseProp = p.split(' ')[0].replace(/[^a-zA-Z-]/g, '');
            const desc = WEAPON_PROPERTY_DESCRIPTIONS[p] || WEAPON_PROPERTY_DESCRIPTIONS[baseProp];
            return (
              <span
                key={p}
                title={desc || undefined}
                className="text-[10px] bg-slate-800 text-slate-200 px-1.5 py-0.2 rounded border border-slate-700 cursor-help"
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
    <div className="space-y-1.5 text-left w-52">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
        <span className="font-fantasy font-bold text-amber-300 text-sm">{name}</span>
        <span className="font-mono font-bold text-emerald-400 text-sm">
          {totalBonus >= 0 ? `+${totalBonus}` : totalBonus}
        </span>
      </div>

      <div className="text-[11px] space-y-1 text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">Ability ({ability.toUpperCase()}):</span>
          <span>{abilityMod >= 0 ? `+${abilityMod}` : abilityMod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Proficiency ({profLabel}):</span>
          <span>{profContribution >= 0 ? `+${profContribution}` : profContribution}</span>
        </div>
        <div className="pt-1 border-t border-slate-800 flex justify-between font-semibold text-slate-100">
          <span>Total Modifier:</span>
          <span className="text-amber-400">{totalBonus >= 0 ? `+${totalBonus}` : totalBonus}</span>
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
    <div className="space-y-1.5 text-left max-w-xs">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
        <h4 className="font-fantasy text-sm font-bold text-amber-300">{name}</h4>
        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
          {current} / {max} {useProfBonus ? '(PB)' : ''}
        </span>
      </div>
      <div className="text-[10px] text-slate-400">
        Resets on: <span className="text-slate-200 font-semibold">{reset}</span>
      </div>
      {desc ? (
        <p className="text-[11px] text-slate-300 leading-snug pt-0.5">{desc}</p>
      ) : (
        <p className="text-[10px] text-slate-400 italic">No description provided.</p>
      )}
    </div>
  );
};
