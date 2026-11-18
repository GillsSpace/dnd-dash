import React, { useState, useMemo } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Coins, Backpack, Plus, Trash2, Scale, BookOpen, Edit3, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { InventoryItem } from '../../types/character';
import { Tooltip } from '../common/Tooltip';

export const BackSheetView: React.FC = () => {
  const { character, updateCharacter } = useCharacter();

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemWeight, setNewItemWeight] = useState(1);
  const [newItemCategory, setNewItemCategory] = useState('Backpack');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Edit Item Modal State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState(1);
  const [editWeight, setEditWeight] = useState(0);
  const [editCategory, setEditCategory] = useState('Backpack');
  const [editDesc, setEditDesc] = useState('');

  // Sorting State: 'none' | 'name' | 'unitWeight' | 'totalWeight'
  type SortField = 'none' | 'name' | 'unitWeight' | 'totalWeight';
  type SortDirection = 'asc' | 'desc';
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: 'name' | 'unitWeight' | 'totalWeight') => {
    if (sortField !== field) {
      setSortField(field);
      // For name: default A-Z (asc). For weights: default heaviest first (desc).
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    } else {
      // 3-way toggle: initial -> opposite -> none
      if (field === 'name') {
        if (sortDirection === 'asc') {
          setSortDirection('desc');
        } else {
          setSortField('none');
          setSortDirection('asc');
        }
      } else {
        if (sortDirection === 'desc') {
          setSortDirection('asc');
        } else {
          setSortField('none');
          setSortDirection('desc');
        }
      }
    }
  };

  const sortedInventory = useMemo(() => {
    const withOriginalIndex = character.inventory.map((item, originalIndex) => ({
      item,
      originalIndex,
    }));

    if (sortField === 'none') {
      return withOriginalIndex;
    }

    return [...withOriginalIndex].sort((a, b) => {
      if (sortField === 'name') {
        const cmp = a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (sortField === 'unitWeight') {
        const wA = a.item.weight ?? 0;
        const wB = b.item.weight ?? 0;
        if (wA !== wB) {
          return sortDirection === 'asc' ? wA - wB : wB - wA;
        }
        return a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' });
      }
      if (sortField === 'totalWeight') {
        const totA = (a.item.weight ?? 0) * (a.item.qty ?? 1);
        const totB = (b.item.weight ?? 0) * (b.item.qty ?? 1);
        if (totA !== totB) {
          return sortDirection === 'asc' ? totA - totB : totB - totA;
        }
        return a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' });
      }
      return 0;
    });
  }, [character.inventory, sortField, sortDirection]);

  const getLockedSourceInfo = (item: InventoryItem) => {
    if (item.sourceType === 'weapon' && item.sourceId) {
      const existsInWeapons = (character.weapons || []).some((w) => w.id === item.sourceId);
      if (existsInWeapons) {
        return { isLocked: true, type: 'weapon' as const, label: 'Weapon' };
      }
    }
    if (item.sourceType === 'armor' && item.sourceId) {
      const existsInArmor = (character.armorWorn || []).some(
        (a, idx) => (a.id || `armor-${idx + 1}`) === item.sourceId
      );
      if (existsInArmor) {
        return { isLocked: true, type: 'armor' as const, label: 'Armor' };
      }
    }

    return { isLocked: false, type: undefined, label: undefined };
  };

  const strScore = character.abilities.str?.score ?? 10;
  const maxCarryWeight = strScore * 15;

  const totalItemWeight = character.inventory.reduce(
    (sum, item) => sum + (item.weight || 0) * (item.qty || 1),
    0
  );
  const totalCoins =
    character.currency.cp +
    character.currency.sp +
    character.currency.ep +
    character.currency.gp +
    character.currency.pp;
  const coinWeight = Math.round((totalCoins / 50) * 10) / 10;
  const totalWeight = Math.round((totalItemWeight + coinWeight) * 10) / 10;

  const updateCoin = (coin: keyof typeof character.currency, val: number) => {
    updateCharacter((prev) => ({
      ...prev,
      currency: {
        ...prev.currency,
        [coin]: Math.max(0, val),
      },
    }));
  };

  const updateItemQty = (index: number, newQty: number) => {
    const item = character.inventory[index];
    if (item && getLockedSourceInfo(item).isLocked) return;

    updateCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.map((it, i) =>
        i === index ? { ...it, qty: Math.max(0, newQty) } : it
      ),
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    updateCharacter((prev) => ({
      ...prev,
      inventory: [
        ...prev.inventory,
        {
          id: `inv-${Date.now()}`,
          name: newItemName.trim(),
          qty: Math.max(1, newItemQty),
          weight: Math.max(0, newItemWeight),
          category: newItemCategory,
          sourceType: 'custom',
          description: newItemDesc.trim() || undefined,
        },
      ],
    }));

    setNewItemName('');
    setNewItemQty(1);
    setNewItemWeight(1);
    setNewItemDesc('');
    setShowAdd(false);
  };

  const startEditing = (index: number) => {
    const it = character.inventory[index];
    if (!it || getLockedSourceInfo(it).isLocked) return;
    setEditingIndex(index);
    setEditName(it.name);
    setEditQty(it.qty ?? 1);
    setEditWeight(it.weight ?? 0);
    setEditCategory(it.category || 'Backpack');
    setEditDesc(it.description || it.desc || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editName.trim()) return;

    updateCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item, i) =>
        i === editingIndex
          ? {
              ...item,
              name: editName.trim(),
              qty: Math.max(1, editQty),
              weight: Math.max(0, editWeight),
              category: editCategory,
              description: editDesc.trim() || undefined,
            }
          : item
      ),
    }));

    setEditingIndex(null);
  };

  const removeItem = (index: number) => {
    const item = character.inventory[index];
    if (item && getLockedSourceInfo(item).isLocked) return;

    updateCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4 font-sans text-stone-900">
      {/* Banner: Equipment & Wealth */}
      <div className="space-y-1">
        <div className="bg-[#7b1113] text-white font-bold text-center py-1.5 tracking-wider text-xs uppercase shadow-sm flex items-center justify-between px-4">
          <span>EQUIPMENT & WEALTH</span>
          <span className="text-[11px] font-normal">STR {strScore} • Capacity: {maxCarryWeight} lbs</span>
        </div>

        <div className="bg-[#f6efe6] p-3 border border-stone-300 space-y-3 text-xs">
          {/* Currency Row */}
          <div>
            <div className="flex items-center justify-between border-b border-stone-300 pb-1 mb-2">
              <span className="font-bold text-[#1f4e78] text-xs flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Coinage & Wealth (Click to Edit)</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                Total Coins: {totalCoins} ({coinWeight} lbs)
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              {(['cp', 'sp', 'ep', 'gp', 'pp'] as const).map((coin) => {
                const label = coin.toUpperCase();
                const val = character.currency[coin];
                return (
                  <div key={coin} className="bg-white border border-stone-400 p-2 rounded shadow-2xs">
                    <span className="block text-[10px] font-bold text-stone-600 uppercase tracking-wider">{label}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={val}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9]/g, '');
                        updateCoin(coin, clean === '' ? 0 : parseInt(clean, 10));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-full text-center font-mono text-xl font-bold text-stone-900 bg-transparent hover:bg-stone-50 focus:bg-amber-50/70 focus:outline-none rounded py-0.5 cursor-pointer my-0.5 transition-colors"
                      title={`Click to edit ${label} count`}
                    />
                    <span className="block text-[9px] text-stone-400 font-mono">
                      {coin === 'cp' && 'Copper'}
                      {coin === 'sp' && 'Silver'}
                      {coin === 'ep' && 'Electrum'}
                      {coin === 'gp' && 'Gold'}
                      {coin === 'pp' && 'Platinum'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encumbrance Bar */}
          <div className="bg-white border border-stone-400 p-2 rounded">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-stone-600" />
                <span>Total Encumbrance</span>
              </span>
              <span className="font-mono font-bold text-stone-900">
                {totalWeight} / {maxCarryWeight} lbs
              </span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  totalWeight > maxCarryWeight ? 'bg-red-600' : 'bg-[#276749]'
                }`}
                style={{ width: `${Math.min(100, Math.round((totalWeight / maxCarryWeight) * 100))}%` }}
              />
            </div>
          </div>

          {/* Inventory Items Table */}
          <div className="border border-stone-400 bg-white shadow-2xs">
            <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-[11px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Item & Location ({character.inventory.length} items)</span>
                {sortField !== 'none' && (
                  <div className="flex items-center gap-1.5 bg-white/15 text-white px-2 py-0.5 rounded text-[10px] font-normal border border-white/20">
                    <span>
                      Sorted by: <strong className="font-semibold">{sortField === 'name' ? 'Name' : sortField === 'unitWeight' ? 'Unit Wt' : 'Total Wt'}</strong> ({sortField === 'name' ? (sortDirection === 'asc' ? 'A → Z' : 'Z → A') : (sortDirection === 'desc' ? 'Heaviest' : 'Lightest')})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSortField('none')}
                      className="hover:text-amber-200 ml-0.5 p-0.5 text-stone-200 hover:text-white"
                      title="Reset sorting"
                    >
                      <RotateCcw className="w-3 h-3 inline" />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="bg-white text-[#1f4e78] px-2 py-0.5 rounded font-bold hover:bg-stone-100 flex items-center gap-1 shadow-2xs transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            {showAdd && (
              <form onSubmit={handleAddItem} className="p-3 bg-stone-50 border-b border-stone-300 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Item Name */}
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                      Item Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rope (50ft), Rations, Bedroll"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full border border-stone-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                      autoFocus
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                      Quantity (Qty)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1"
                      value={newItemQty}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9]/g, '');
                        setNewItemQty(clean === '' ? 1 : parseInt(clean, 10));
                      }}
                      className="w-full border border-stone-300 rounded px-2 py-1 text-xs text-center font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                    />
                  </div>

                  {/* Unit Weight */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                      Weight (lbs / unit)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 2.5"
                      value={newItemWeight}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/[^0-9.]/g, '');
                        setNewItemWeight(clean === '' ? 0 : parseFloat(clean));
                      }}
                      className="w-full border border-stone-300 rounded px-2 py-1 text-xs text-center font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                    />
                  </div>
                </div>

                {/* Optional Description */}
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Description / Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Physical details, lore, special properties, charges..."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                  <span className="text-[10px] text-stone-500 font-mono">
                    Total weight added: {Math.round((newItemQty * newItemWeight) * 10) / 10} lbs
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAdd(false)}
                      className="px-2.5 py-1 text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 rounded font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-[#1f4e78] hover:bg-[#1a4266] text-white rounded font-bold shadow-2xs transition-colors"
                    >
                      Add to Inventory
                    </button>
                  </div>
                </div>
              </form>
            )}

            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-stone-100 text-stone-700 border-b border-stone-300 font-bold select-none">
                  <th
                    className="px-3 py-1.5 cursor-pointer hover:bg-stone-200 transition-colors"
                    onClick={() => handleSort('name')}
                    title={
                      sortField === 'name'
                        ? sortDirection === 'asc'
                          ? 'Sorted A-Z. Click for Z-A.'
                          : 'Sorted Z-A. Click to reset.'
                        : 'Click to sort by Name (A-Z)'
                    }
                  >
                    <div className="flex items-center gap-1">
                      <span>Item Name</span>
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-[#1f4e78] stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-[#1f4e78] stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-stone-400 opacity-60 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th className="px-2 w-20 text-center">Qty</th>
                  <th
                    className="px-2 w-24 text-center cursor-pointer hover:bg-stone-200 transition-colors"
                    onClick={() => handleSort('unitWeight')}
                    title={
                      sortField === 'unitWeight'
                        ? sortDirection === 'desc'
                          ? 'Sorted Heaviest to Lightest. Click for Lightest first.'
                          : 'Sorted Lightest to Heaviest. Click to reset.'
                        : 'Click to sort by Unit Weight (Heaviest first)'
                    }
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Unit Wt</span>
                      {sortField === 'unitWeight' ? (
                        sortDirection === 'desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-[#1f4e78] stroke-[2.5]" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-[#1f4e78] stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-stone-400 opacity-60 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 w-24 text-center cursor-pointer hover:bg-stone-200 transition-colors"
                    onClick={() => handleSort('totalWeight')}
                    title={
                      sortField === 'totalWeight'
                        ? sortDirection === 'desc'
                          ? 'Sorted Heaviest Total to Lightest. Click for Lightest first.'
                          : 'Sorted Lightest Total to Heaviest. Click to reset.'
                        : 'Click to sort by Total Weight (Qty × Unit Wt)'
                    }
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Total Wt</span>
                      {sortField === 'totalWeight' ? (
                        sortDirection === 'desc' ? (
                          <ArrowDown className="w-3.5 h-3.5 text-[#1f4e78] stroke-[2.5]" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-[#1f4e78] stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-stone-400 opacity-60 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th className="px-2 w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedInventory.map(({ item, originalIndex }) => {
                  const lockedInfo = getLockedSourceInfo(item);
                  const isLocked = lockedInfo.isLocked;
                  const itemDesc = item.description || item.desc;

                  return (
                    <tr
                      key={item.id || `${item.name}-${originalIndex}`}
                      className={`border-b border-stone-200 last:border-b-0 transition-colors ${
                        isLocked
                          ? 'bg-stone-100/60 opacity-60 text-stone-500'
                          : 'hover:bg-stone-50/80 text-stone-900'
                      }`}
                    >
                      <td className={`px-3 py-1.5 font-medium ${isLocked ? 'text-stone-500' : 'text-stone-900'}`}>
                        {itemDesc ? (
                          <Tooltip
                            content={
                              <div className="space-y-1.5 text-left w-72">
                                <div className="flex items-center justify-between border-b border-amber-500/40 pb-1">
                                  <span className="font-fantasy font-bold text-amber-300 text-xs">{item.name}</span>
                                  {item.category && (
                                    <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                      {item.category}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap">
                                  {itemDesc}
                                </p>
                                <div className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-700/60 flex justify-between">
                                  <span>Weight: {item.weight} lbs</span>
                                  <span>Qty: {item.qty ?? 1}</span>
                                </div>
                              </div>
                            }
                          >
                            <span className="cursor-help hover:text-[#1f4e78] underline decoration-dotted font-semibold">
                              {item.name}
                            </span>
                          </Tooltip>
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </td>
                      <td className="px-2 py-1 text-center">
                        {isLocked ? (
                          <span
                            className="w-12 text-center font-mono font-bold text-xs text-stone-400 select-none py-0.5 inline-block cursor-default"
                            title="Managed in Weapons & Armor"
                          >
                            {item.qty ?? 1}
                          </span>
                        ) : (
                          <input
                            type="text"
                            inputMode="numeric"
                            value={item.qty ?? 1}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^0-9]/g, '');
                              const val = clean === '' ? 0 : parseInt(clean, 10);
                              updateItemQty(originalIndex, val);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="w-12 text-center font-mono font-bold text-xs bg-transparent hover:bg-stone-100 focus:bg-amber-50/70 focus:outline-none rounded py-0.5 cursor-pointer border border-transparent hover:border-stone-300 focus:border-[#1f4e78]"
                            title="Click to edit quantity"
                          />
                        )}
                      </td>
                      <td className={`px-2 py-1 text-center font-mono ${isLocked ? 'text-stone-400' : 'text-stone-600'}`}>
                        {item.weight} lbs
                      </td>
                      <td className={`px-2 py-1 text-center font-mono font-bold ${isLocked ? 'text-stone-500' : 'text-stone-900'}`}>
                        {Math.round(((item.weight || 0) * (item.qty || 1)) * 10) / 10} lbs
                      </td>
                      <td className="px-2 py-1 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => startEditing(originalIndex)}
                            className={`p-1 rounded transition-colors ${
                              isLocked
                                ? 'text-stone-300 opacity-20 cursor-not-allowed'
                                : 'text-stone-400 hover:text-[#1f4e78] hover:bg-stone-100 cursor-pointer'
                            }`}
                            title={isLocked ? 'Managed in Weapons & Armor' : 'Edit item details'}
                          >
                            <Edit3 className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => removeItem(originalIndex)}
                            className={`p-1 rounded transition-colors ${
                              isLocked
                                ? 'text-stone-300 opacity-20 cursor-not-allowed'
                                : 'text-stone-400 hover:text-red-700 hover:bg-red-50 cursor-pointer'
                            }`}
                            title={isLocked ? 'Delete from Weapons & Armor section' : 'Remove item from inventory'}
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {sortedInventory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-stone-400 italic">
                      No items in inventory. Click "Add Item" above to add gear.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#faf6f0] border-2 border-[#1f4e78] rounded-xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-300 pb-2">
              <h3 className="font-fantasy font-bold text-[#1f4e78] text-base flex items-center gap-2">
                <Backpack className="w-4 h-4 text-amber-700" />
                <span>Edit Inventory Item</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                  Item Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Quantity
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editQty}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      setEditQty(clean === '' ? 1 : parseInt(clean, 10));
                    }}
                    className="w-full border border-stone-300 rounded px-2.5 py-1 text-xs text-center font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                    Weight (lbs / unit)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editWeight}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9.]/g, '');
                      setEditWeight(clean === '' ? 0 : parseFloat(clean));
                    }}
                    className="w-full border border-stone-300 rounded px-2.5 py-1 text-xs text-center font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Physical details, special properties, charges, lore..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1f4e78]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-300">
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#1f4e78] hover:bg-[#163857] text-white rounded font-bold shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner: Roleplaying & Storytelling */}
      <div className="space-y-1">
        <div className="bg-[#7b1113] text-white font-bold text-center py-1.5 tracking-wider text-xs uppercase shadow-sm">
          ROLEPLAYING & STORYTELLING
        </div>

        <div className="bg-[#f6efe6] p-3 border border-stone-300 grid grid-cols-12 gap-3 text-xs">
          <div className="col-span-12 sm:col-span-6 border border-stone-400 bg-white p-2.5 space-y-2">
            <span className="font-bold text-[#1f4e78] text-xs block border-b border-stone-300 pb-1">
              Personality Traits & Ideals
            </span>
            <textarea
              rows={5}
              placeholder="Personality traits, ideals, bonds, and flaws..."
              value={character.roleplaying?.personality ?? ''}
              onChange={(e) =>
                updateCharacter((prev) => ({
                  ...prev,
                  roleplaying: {
                    ...prev.roleplaying,
                    personality: e.target.value,
                  },
                }))
              }
              className="w-full text-stone-800 text-[11px] p-2 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1f4e78] resize-y bg-stone-50/50 focus:bg-white transition-colors"
            />
          </div>

          <div className="col-span-12 sm:col-span-6 border border-stone-400 bg-white p-2.5 space-y-2">
            <span className="font-bold text-[#1f4e78] text-xs block border-b border-stone-300 pb-1">
              Character Bio & Notes
            </span>
            <textarea
              rows={5}
              placeholder="Backstory, affiliations, quest notes..."
              value={character.roleplaying?.bio ?? ''}
              onChange={(e) =>
                updateCharacter((prev) => ({
                  ...prev,
                  roleplaying: {
                    ...prev.roleplaying,
                    bio: e.target.value,
                  },
                }))
              }
              className="w-full text-stone-800 text-[11px] p-2 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-[#1f4e78] resize-y bg-stone-50/50 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
