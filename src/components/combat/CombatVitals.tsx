import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Shield, Zap, Footprints, Eye, Award } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const CombatVitals: React.FC = () => {
  const { character, updateCharacter, getAbilityMod } = useCharacter();
  const dexMod = getAbilityMod('dex');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {/* Armor Class */}
      <Tooltip
        content={
          <div className="space-y-1">
            <p className="font-fantasy font-bold text-amber-300">Armor Class (AC): {character.armorClass}</p>
            <p className="text-[11px] text-slate-300">
              {character.armorWorn?.[0]?.name || 'Breastplate'}: Base AC 14 + Dex modifier (max +2) = 16.
            </p>
            <p className="text-[10px] text-slate-400">Shield: None equipped</p>
          </div>
        }
      >
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3 shadow hover:border-amber-600/40 transition-colors w-full">
          <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-600/30 text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Armor Class
            </span>
            <span className="font-mono text-xl font-bold text-white">{character.armorClass}</span>
          </div>
        </div>
      </Tooltip>

      {/* Initiative */}
      <Tooltip
        content={
          <div className="space-y-1">
            <p className="font-fantasy font-bold text-amber-300">Initiative: {character.initiative >= 0 ? `+${character.initiative}` : character.initiative}</p>
            <p className="text-[11px] text-slate-300">
              Calculated from your Dexterity modifier ({dexMod >= 0 ? `+${dexMod}` : dexMod}).
            </p>
            <p className="text-[10px] text-slate-400">Rolled at the start of combat for turn order.</p>
          </div>
        }
      >
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3 shadow hover:border-amber-600/40 transition-colors w-full">
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-600/30 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Initiative
            </span>
            <span className="font-mono text-xl font-bold text-amber-300">
              {character.initiative >= 0 ? `+${character.initiative}` : character.initiative}
            </span>
          </div>
        </div>
      </Tooltip>

      {/* Speed */}
      <Tooltip
        content={
          <div className="space-y-1">
            <p className="font-fantasy font-bold text-amber-300">Movement Speeds</p>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div className="flex justify-between"><span>Walk:</span><span className="font-mono font-semibold">{character.speed.walk} ft</span></div>
              <div className="flex justify-between"><span>Climb:</span><span className="font-mono">{character.speed.climb} ft</span></div>
              <div className="flex justify-between"><span>Swim:</span><span className="font-mono">{character.speed.swim} ft</span></div>
              <div className="flex justify-between"><span>Jump:</span><span className="font-mono">{character.speed.jump} ft</span></div>
            </div>
          </div>
        }
      >
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3 shadow hover:border-amber-600/40 transition-colors w-full">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-600/30 text-emerald-400">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Speed
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-white">{character.speed.walk}'</span>
              <span className="text-[10px] text-slate-400 font-mono">C15/S15</span>
            </div>
          </div>
        </div>
      </Tooltip>

      {/* Proficiency Bonus & Passives */}
      <Tooltip
        content={
          <div className="space-y-1 text-left">
            <p className="font-fantasy font-bold text-amber-300">Proficiency & Passive Senses</p>
            <div className="text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Proficiency Bonus:</span>
                <span className="font-bold text-amber-400">+{character.proficiencyBonus}</span>
              </div>
              <div className="flex justify-between">
                <span>Passive Perception:</span>
                <span className="font-semibold text-emerald-400">{character.passives.perception} (Expertise)</span>
              </div>
              <div className="flex justify-between">
                <span>Passive Insight:</span>
                <span className="font-semibold">{character.passives.insight}</span>
              </div>
              <div className="flex justify-between">
                <span>Passive Investigation:</span>
                <span className="font-semibold">{character.passives.investigation}</span>
              </div>
            </div>
          </div>
        }
      >
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center gap-3 shadow hover:border-amber-600/40 transition-colors w-full">
          <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-600/30 text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Prof / Passives
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold text-purple-300">+{character.proficiencyBonus}</span>
              <span className="text-[10px] text-emerald-400 font-mono font-medium">👁 {character.passives.perception}</span>
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};
