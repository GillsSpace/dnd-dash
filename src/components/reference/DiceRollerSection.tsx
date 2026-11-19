import React, { useState } from 'react';
import { Dices, ChevronDown, ChevronUp, RotateCcw, Sparkles } from 'lucide-react';

interface RollRecord {
  id: string;
  timestamp: string;
  label: string;
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  isNat20?: boolean;
  isNat1?: boolean;
}

const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;

export const DiceRollerSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [latestRoll, setLatestRoll] = useState<RollRecord | null>(null);
  const [history, setHistory] = useState<RollRecord[]>([]);

  const rollDie = (sides: number): number => {
    return Math.floor(Math.random() * sides) + 1;
  };

  const handleStandardRoll = (sides: number) => {
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(rollDie(sides));
    }
    const sum = rolls.reduce((acc, r) => acc + r, 0);
    const total = sum + modifier;

    const isNat20 = sides === 20 && diceCount === 1 && rolls[0] === 20;
    const isNat1 = sides === 20 && diceCount === 1 && rolls[0] === 1;

    const rollData: RollRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      label: `${diceCount}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`,
      formula: `[${rolls.join(', ')}]${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}`,
      rolls,
      modifier,
      total,
      isNat20,
      isNat1,
    };

    setLatestRoll(rollData);
    setHistory((prev) => [rollData, ...prev.slice(0, 7)]);
  };

  const handleAdvantageRoll = (type: 'adv' | 'dis') => {
    const r1 = rollDie(20);
    const r2 = rollDie(20);
    const chosen = type === 'adv' ? Math.max(r1, r2) : Math.min(r1, r2);
    const total = chosen + modifier;

    const isNat20 = chosen === 20;
    const isNat1 = chosen === 1;

    const label = type === 'adv' ? '1d20 (Advantage)' : '1d20 (Disadvantage)';
    const formula = `[${r1}, ${r2}] -> ${chosen}${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}`;

    const rollData: RollRecord = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      label,
      formula,
      rolls: [r1, r2],
      modifier,
      total,
      isNat20,
      isNat1,
    };

    setLatestRoll(rollData);
    setHistory((prev) => [rollData, ...prev.slice(0, 7)]);
  };

  const clearHistory = () => {
    setHistory([]);
    setLatestRoll(null);
  };

  return (
    <div className="border border-stone-300 bg-[#f6efe6] rounded overflow-hidden shadow-xs transition-all">
      {/* Header Banner - Toggleable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1f4e78] text-white px-3.5 py-1.5 flex items-center justify-between hover:bg-[#1a4266] transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <Dices className="w-4 h-4 text-amber-300" />
          <span className="font-fantasy font-bold tracking-wider text-xs">
            DICE ROLLER &amp; QUICK TOSS
          </span>
          {latestRoll && !isOpen && (
            <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded text-amber-200">
              Last: {latestRoll.label} = {latestRoll.total}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/80">
          <span className="text-[11px] font-sans">{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-3 space-y-3 text-xs">
          {/* Controls Bar: Dice Count, Modifier, and Advantage Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded border border-stone-300">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-600 font-semibold text-[11px]">Dice Qty:</span>
              <div className="flex items-center border border-stone-300 rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDiceCount((c) => Math.max(1, c - 1))}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                  title="Decrease dice count"
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={diceCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                    setDiceCount(isNaN(val) || val < 1 ? 1 : Math.min(20, val));
                  }}
                  className="w-10 text-center font-mono font-bold text-xs py-0.5 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDiceCount((c) => Math.min(20, c + 1))}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                  title="Increase dice count"
                >
                  +
                </button>
              </div>
            </div>

            {/* Modifier Stepper */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-600 font-semibold text-[11px]">Modifier:</span>
              <div className="flex items-center border border-stone-300 rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setModifier((m) => m - 1)}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                  title="Decrease modifier"
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={modifier >= 0 ? `+${modifier}` : `${modifier}`}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^-0-9]/g, '');
                    const val = parseInt(raw, 10);
                    setModifier(isNaN(val) ? 0 : val);
                  }}
                  className="w-12 text-center font-mono font-bold text-xs py-0.5 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setModifier((m) => m + 1)}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                  title="Increase modifier"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick D20 Advantage Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAdvantageRoll('adv')}
                className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 text-emerald-800 font-bold text-xs shadow-2xs transition-colors flex items-center gap-1"
                title="Roll 2d20 take highest + modifier"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Advantage</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdvantageRoll('dis')}
                className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-bold text-xs shadow-2xs transition-colors"
                title="Roll 2d20 take lowest + modifier"
              >
                Disadvantage
              </button>
            </div>
          </div>

          {/* Die Buttons Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {DIE_TYPES.map((sides) => (
              <button
                key={sides}
                type="button"
                onClick={() => handleStandardRoll(sides)}
                className="flex flex-col items-center justify-center py-2 px-1 bg-white hover:bg-amber-50 border border-stone-300 hover:border-amber-500 rounded shadow-2xs transition-all active:scale-95 group"
              >
                <span className="font-fantasy font-bold text-sm text-[#1f4e78] group-hover:text-amber-800">
                  d{sides}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {diceCount}d{sides}
                </span>
              </button>
            ))}
          </div>

          {/* Roll Result Display Banner */}
          {latestRoll && (
            <div
              className={`p-3 rounded border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                latestRoll.isNat20
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : latestRoll.isNat1
                  ? 'bg-rose-50 border-rose-400 text-rose-950'
                  : 'bg-white border-stone-300 text-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center font-mono font-black text-2xl shadow-sm shrink-0 ${
                    latestRoll.isNat20
                      ? 'bg-emerald-600 text-white animate-bounce'
                      : latestRoll.isNat1
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#1f4e78] text-white'
                  }`}
                >
                  {latestRoll.total}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm font-fantasy">{latestRoll.label}</span>
                    {latestRoll.isNat20 && (
                      <span className="text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-400">
                        NAT 20! Critical Hit!
                      </span>
                    )}
                    {latestRoll.isNat1 && (
                      <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded border border-rose-400">
                        NAT 1! Critical Miss!
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-stone-600 mt-0.5">
                    Breakdown: {latestRoll.formula} = <strong className="text-stone-900 font-bold">{latestRoll.total}</strong>
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                <span>{latestRoll.timestamp}</span>
              </div>
            </div>
          )}

          {/* Recent Roll History */}
          {history.length > 1 && (
            <div className="pt-2 border-t border-stone-300">
              <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1.5 font-medium">
                <span>Recent Rolls ({history.length})</span>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-700 transition-colors"
                  title="Clear history"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.slice(1).map((h) => (
                  <div
                    key={h.id}
                    className="inline-flex items-center gap-1.5 bg-white border border-stone-200 rounded px-2 py-0.5 text-[11px] font-mono text-stone-700 shadow-2xs"
                  >
                    <span className="text-stone-500 text-[10px]">{h.label}:</span>
                    <span className={`font-bold ${h.isNat20 ? 'text-emerald-700' : h.isNat1 ? 'text-rose-700' : 'text-[#1f4e78]'}`}>
                      {h.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
