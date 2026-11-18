import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Sword } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { WeaponTooltipCard } from '../common/TooltipContent';

export const WeaponsCard: React.FC = () => {
  const { character } = useCharacter();

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg backdrop-blur space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Sword className="w-4 h-4 text-amber-500" />
          <h3 className="font-fantasy font-bold text-slate-200 text-sm tracking-wide">
            Weapons & Attacks
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">Hover for Weapon Mastery & Properties</span>
      </div>

      <div className="space-y-1.5">
        {character.weapons.map((w) => (
          <Tooltip
            key={w.id}
            content={
              <WeaponTooltipCard
                name={w.name}
                toHit={w.toHit}
                damage={w.damage}
                damageType={w.damageType}
                range={w.range}
                properties={w.properties}
                mastery={w.mastery}
                masteryActive={w.masteryActive}
                notes={w.notes}
              />
            }
          >
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 transition-colors w-full group">
              <div className="flex items-center gap-3">
                <span className="font-fantasy font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-amber-300 transition-colors">
                  {w.name}
                </span>

                {w.mastery && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                      w.masteryActive
                        ? 'bg-amber-950/70 text-amber-300 border-amber-600/50'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {w.mastery}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {w.toHit}
                </span>

                <span className="font-mono text-xs text-slate-300">
                  {w.damage} <span className="text-[10px] text-slate-400 font-sans">{w.damageType.charAt(0)}</span>
                </span>

                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
                  {w.range}
                </span>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
