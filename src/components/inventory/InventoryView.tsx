import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Coins, Backpack, Plus, Trash2, Scale } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const InventoryView: React.FC = () => {
  const { character, updateCharacter } = useCharacter();

  const [showAdd, setShowAdd] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemWeight, setItemWeight] = useState(1);
  const [itemCategory, setItemCategory] = useState('Gear');

  const strScore = character.abilities.str?.score ?? 10;
  const maxCarryWeight = strScore * 15; // D&D 5e rule: STR x 15 lbs

  const totalItemWeight = character.inventory.reduce(
    (sum, item) => sum + (item.weight || 0) * (item.qty || 1),
    0
  );

  // Coin weight: 50 coins = 1 lb in 5e
  const totalCoins =
    character.currency.cp +
    character.currency.sp +
    character.currency.ep +
    character.currency.gp +
    character.currency.pp;
  const coinWeight = Math.round((totalCoins / 50) * 10) / 10;
  const totalEncumbrance = Math.round((totalItemWeight + coinWeight) * 10) / 10;

  const encumbrancePercent = Math.min(100, Math.round((totalEncumbrance / maxCarryWeight) * 100));

  const adjustCurrency = (type: keyof typeof character.currency, delta: number) => {
    updateCharacter((prev) => ({
      ...prev,
      currency: {
        ...prev.currency,
        [type]: Math.max(0, prev.currency[type] + delta),
      },
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    updateCharacter((prev) => ({
      ...prev,
      inventory: [
        ...prev.inventory,
        {
          name: itemName.trim(),
          qty: Math.max(1, itemQty),
          weight: Math.max(0, itemWeight),
          category: itemCategory,
        },
      ],
    }));

    setItemName('');
    setItemQty(1);
    setItemWeight(1);
    setShowAdd(false);
  };

  const removeItem = (idx: number) => {
    updateCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg backdrop-blur space-y-4">
      {/* Header & Currency */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <h3 className="font-fantasy font-bold text-slate-200 text-sm tracking-wide">
              Currency & Wealth
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Total Coins: {totalCoins} ({coinWeight} lbs)</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {(['cp', 'sp', 'ep', 'gp', 'pp'] as const).map((coin) => {
            const label = coin.toUpperCase();
            const val = character.currency[coin];
            const colorClass =
              coin === 'gp'
                ? 'text-amber-300 border-amber-600/40 bg-amber-950/40'
                : coin === 'pp'
                ? 'text-slate-100 border-cyan-500/40 bg-cyan-950/40'
                : coin === 'sp'
                ? 'text-slate-300 border-slate-600 bg-slate-800/60'
                : coin === 'ep'
                ? 'text-yellow-200 border-yellow-600/40 bg-yellow-950/40'
                : 'text-amber-600 border-amber-800 bg-amber-950/20';

            return (
              <div
                key={coin}
                className={`p-2 rounded-lg border flex flex-col items-center justify-between text-center ${colorClass}`}
              >
                <span className="text-[10px] font-bold tracking-wider">{label}</span>
                <span className="font-mono text-base font-extrabold my-0.5">{val}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => adjustCurrency(coin, -1)}
                    className="w-4 h-4 rounded bg-slate-900/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center font-mono"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustCurrency(coin, 1)}
                    className="w-4 h-4 rounded bg-slate-900/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center font-mono"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encumbrance Bar */}
      <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Encumbrance Capacity</span>
          </div>
          <span className="font-mono text-slate-200">
            <strong>{totalEncumbrance}</strong> / {maxCarryWeight} lbs ({encumbrancePercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              encumbrancePercent > 90
                ? 'bg-red-500'
                : encumbrancePercent > 66
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${encumbrancePercent}%` }}
          />
        </div>
      </div>

      {/* Equipment List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <div className="flex items-center gap-2">
            <Backpack className="w-4 h-4 text-amber-500" />
            <h4 className="font-fantasy font-bold text-slate-200 text-xs tracking-wide">
              Equipment & Gear ({character.inventory.length})
            </h4>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAddItem} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Item Name"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="sm:col-span-2 bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Qty"
                value={itemQty}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '');
                  setItemQty(clean === '' ? 1 : parseInt(clean, 10));
                }}
                className="bg-slate-900 text-white px-2 py-1.5 rounded border border-slate-700 text-center"
              />
              <input
                type="text"
                inputMode="decimal"
                placeholder="Weight (lbs)"
                value={itemWeight}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9.]/g, '');
                  setItemWeight(clean === '' ? 0 : parseFloat(clean));
                }}
                className="bg-slate-900 text-white px-2 py-1.5 rounded border border-slate-700 text-center"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-2 py-1 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded"
              >
                Save Item
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
          {character.inventory.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-slate-200 truncate">{item.name}</span>
                {item.qty > 1 && (
                  <span className="text-[10px] text-amber-400 font-mono bg-slate-900 px-1 rounded">
                    x{item.qty}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 font-mono">
                  {(item.weight || 0) * (item.qty || 1)} lbs
                </span>
                <button
                  onClick={() => removeItem(idx)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-0.5"
                  title="Remove Item"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
