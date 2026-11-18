import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Heart, Plus, Minus, ShieldAlert, Skull, CheckCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const HealthCard: React.FC = () => {
  const { character, adjustHp, setTempHp, updateCharacter, useHitDie } = useCharacter();
  const [customHpVal, setCustomHpVal] = useState<string>('');
  const [isEditingMax, setIsEditingMax] = useState(false);
  const [maxInput, setMaxInput] = useState(character.hp.max.toString());

  const hpPercent = Math.max(0, Math.min(100, Math.round((character.hp.current / character.hp.max) * 100)));

  const handleApplyDamage = () => {
    const val = parseInt(customHpVal, 10);
    if (!isNaN(val) && val > 0) {
      adjustHp(val, true);
      setCustomHpVal('');
    }
  };

  const handleApplyHeal = () => {
    const val = parseInt(customHpVal, 10);
    if (!isNaN(val) && val > 0) {
      adjustHp(val, false);
      setCustomHpVal('');
    }
  };

  const handleApplyTemp = () => {
    const val = parseInt(customHpVal, 10);
    if (!isNaN(val) && val >= 0) {
      setTempHp(val);
      setCustomHpVal('');
    }
  };

  const handleSaveMaxHp = () => {
    const val = parseInt(maxInput, 10);
    if (!isNaN(val) && val > 0) {
      updateCharacter((prev) => ({
        ...prev,
        hp: { ...prev.hp, max: val },
      }));
    }
    setIsEditingMax(false);
  };

  const toggleDeathSave = (type: 'successes' | 'failures', index: number) => {
    updateCharacter((prev) => {
      const current = prev.deathSaves[type];
      const newCount = index < current ? index : current + 1;
      return {
        ...prev,
        deathSaves: {
          ...prev.deathSaves,
          [type]: Math.max(0, Math.min(3, newCount)),
        },
      };
    });
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg backdrop-blur space-y-4">
      {/* HP Header & Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
            <span className="font-fantasy font-bold text-slate-200 tracking-wide">Hit Points</span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-extrabold text-white">
              {character.hp.current}
            </span>
            <span className="text-slate-500 font-mono text-sm">/</span>
            {isEditingMax ? (
              <input
                type="text"
                inputMode="numeric"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={handleSaveMaxHp}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveMaxHp()}
                autoFocus
                className="w-12 bg-slate-800 text-slate-300 font-mono text-sm px-1 py-0.5 rounded border border-amber-500 text-center"
              />
            ) : (
              <span
                onClick={() => {
                  setMaxInput(character.hp.max.toString());
                  setIsEditingMax(true);
                }}
                className="font-mono text-sm text-slate-400 hover:text-amber-400 cursor-pointer"
                title="Click to edit Max HP"
              >
                {character.hp.max}
              </span>
            )}

            {character.hp.temp > 0 && (
              <Tooltip content="Temporary Hit Points. Absorbs damage before your regular Hit Points. Does not stack.">
                <span className="ml-1.5 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                  +{character.hp.temp} Temp
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              hpPercent > 50
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                : hpPercent > 20
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-red-600 to-red-500'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Adjust Buttons */}
      <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
        <button
          onClick={() => adjustHp(1, true)}
          className="py-1 rounded bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-600/40 transition-colors"
        >
          -1 HP
        </button>
        <button
          onClick={() => adjustHp(5, true)}
          className="py-1 rounded bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-600/40 transition-colors"
        >
          -5 HP
        </button>
        <button
          onClick={() => adjustHp(1, false)}
          className="py-1 rounded bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600/40 transition-colors"
        >
          +1 HP
        </button>
        <button
          onClick={() => adjustHp(5, false)}
          className="py-1 rounded bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600/40 transition-colors"
        >
          +5 HP
        </button>
      </div>

      {/* Custom Amount Form */}
      <div className="flex gap-1.5 items-center">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Amt"
          value={customHpVal}
          onChange={(e) => setCustomHpVal(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-16 bg-slate-800 text-slate-200 text-xs font-mono px-2 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-500 text-center"
        />
        <button
          onClick={handleApplyDamage}
          className="flex-1 py-1.5 text-xs font-semibold rounded bg-red-950/70 hover:bg-red-900/80 text-red-300 border border-red-600/40 transition-colors"
        >
          Damage
        </button>
        <button
          onClick={handleApplyHeal}
          className="flex-1 py-1.5 text-xs font-semibold rounded bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-600/40 transition-colors"
        >
          Heal
        </button>
        <button
          onClick={handleApplyTemp}
          className="px-2.5 py-1.5 text-xs font-semibold rounded bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-600/40 transition-colors"
          title="Set Temporary HP"
        >
          Temp
        </button>
      </div>

      {/* Hit Dice & Death Saves Row */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Hit Dice */}
        <div>
          <span className="text-[11px] text-slate-400 font-medium block mb-1">Hit Dice (Spend in Short Rest)</span>
          <div className="flex flex-wrap gap-1.5">
            {character.hitDice.map((hd) => (
              <Tooltip
                key={hd.die}
                content={`Class: ${hd.source}. Click to spend 1 ${hd.die} hit die during a short rest.`}
              >
                <button
                  onClick={() => useHitDie(hd.die)}
                  disabled={hd.current <= 0}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-mono font-medium transition-colors ${
                    hd.current > 0
                      ? 'bg-slate-800 hover:bg-amber-950/50 text-amber-200 border-amber-600/40'
                      : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span className="font-fantasy">{hd.die}:</span>
                  <span className="font-bold">{hd.current}</span>
                  <span className="text-slate-500">/{hd.total}</span>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Death Saves */}
        <div>
          <span className="text-[11px] text-slate-400 font-medium block mb-1">Death Saving Throws</span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-semibold w-12">Success</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleDeathSave('successes', i)}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      i < character.deathSaves.successes
                        ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/50'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-400 font-semibold w-12">Failure</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleDeathSave('failures', i)}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      i < character.deathSaves.failures
                        ? 'bg-red-500 border-red-400 shadow-sm shadow-red-500/50'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
