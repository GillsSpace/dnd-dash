import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Plus, Trash2, Shield, Sword, Sparkles, Crosshair } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { WeaponTooltipCard } from '../common/TooltipContent';
import { WeaponModal } from './WeaponModal';
import { ArmorModal } from './ArmorModal';

export const WeaponsArmorSection: React.FC = () => {
  const {
    character,
    setWeaponAbility,
    toggleWeaponMastery,
    removeWeapon,
    toggleArmorEquipped,
    removeArmor,
    getAbilityMod,
    addAmmunition,
    updateAmmunition,
    removeAmmunition,
  } = useCharacter();

  const [isAddWeaponOpen, setIsAddWeaponOpen] = useState(false);
  const [isAddArmorOpen, setIsAddArmorOpen] = useState(false);

  // Dynamic Armor & AC Calculations
  const dexMod = getAbilityMod('dex');
  const equippedArmor = (character.armorWorn || []).filter((a) => a.equipped !== false);
  const bodyArmor = equippedArmor.find((a) =>
    ['L', 'M', 'H', 'LIGHT', 'MEDIUM', 'HEAVY'].includes(a.type.toUpperCase())
  );
  const shieldItem = equippedArmor.find((a) => a.type.toLowerCase().includes('shield'));

  let dexApplied = 0;
  if (bodyArmor) {
    const t = bodyArmor.type.toUpperCase();
    if (t === 'L' || t === 'LIGHT') dexApplied = dexMod;
    else if (t === 'M' || t === 'MEDIUM') dexApplied = Math.min(2, dexMod);
    else if (t === 'H' || t === 'HEAVY') dexApplied = 0;
    else dexApplied = bodyArmor.dexBonus ?? 0;
  } else {
    dexApplied = dexMod;
  }

  const baseArmorAc = bodyArmor ? bodyArmor.ac : 10;
  const shieldAc = shieldItem ? (shieldItem.ac || 2) : 0;
  const computedTotalAc = baseArmorAc + dexApplied + shieldAc;
  const effectiveAc = character.armorClass || computedTotalAc;

  const totalArmorWeight = (character.armorWorn || []).reduce((sum, a) => sum + (a.weight || 0), 0);
  const hasStealthDa = equippedArmor.some((a) => a.daStealth);

  return (
    <div className="space-y-1">
      {/* Banner */}
      <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-xs uppercase shadow-sm">
        WEAPONS &amp; ARMOR
      </div>

      <div className="bg-[#f6efe6] p-3 border border-stone-300 space-y-4 text-xs">
        {/* ========================================================= */}
        {/* WEAPONS SECTION (Full Width Horizontal Table)            */}
        {/* ========================================================= */}
        <div className="border border-stone-400 bg-white overflow-hidden shadow-xs">
          {/* Section Header */}
          <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sword className="w-3.5 h-3.5" />
              <span className="tracking-wide">WEAPONS &amp; ATTACKS (D&amp;D 2024 RULES)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddWeaponOpen(true)}
              className="flex items-center gap-1 text-[10px] bg-white text-[#1f4e78] hover:bg-stone-100 px-2 py-0.5 rounded font-bold transition-colors shadow-xs"
              title="Add Weapon from D&D 2024 presets or custom"
            >
              <Plus className="w-3 h-3" />
              <span>Add Weapon</span>
            </button>
          </div>

          {/* Weapons Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-[11px]">
              <thead>
                <tr className="bg-stone-200 text-stone-700 border-b border-stone-300 font-bold text-[10px]">
                  <th className="text-left px-3 py-1.5 min-w-[140px]">Weapon</th>
                  <th className="w-20 py-1.5" title="Toggle between STR and DEX scaling">Stat</th>
                  <th className="w-16 py-1.5">To-Hit</th>
                  <th className="w-24 py-1.5">Damage</th>
                  <th className="w-20 py-1.5">Range</th>
                  <th className="w-24 py-1.5" title="Weapon Mastery Property">Mastery</th>
                  <th className="w-20 py-1.5" title="Toggle Weapon Mastery active on this character">Mastered</th>
                  <th className="text-left px-3 py-1.5 min-w-[200px]">Properties &amp; Notes</th>
                  <th className="w-10 py-1.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {character.weapons.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-stone-400 italic text-center text-xs">
                      No weapons equipped. Click <strong className="text-[#1f4e78]">+ Add Weapon</strong> to select from D&amp;D 2024 weapon presets.
                    </td>
                  </tr>
                ) : (
                  character.weapons.map((w) => {
                    const currentAbility = w.ability || 'str';
                    return (
                      <tr key={w.id} className="hover:bg-amber-50/40 transition-colors">
                        {/* Weapon Name + Tooltip */}
                        <td className="text-left px-3 py-1.5 font-bold text-stone-900">
                          <Tooltip
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
                            <span className="cursor-help hover:text-[#1f4e78] underline decoration-dotted">
                              {w.name}
                            </span>
                          </Tooltip>
                        </td>

                        {/* Ability Selector (DEX vs STR Mod) */}
                        <td className="py-1 px-1">
                          <div className="inline-flex rounded border border-stone-300 overflow-hidden text-[9px] font-bold shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setWeaponAbility(w.id, 'str')}
                              className={`px-2 py-0.5 transition-colors ${
                                currentAbility === 'str'
                                  ? 'bg-[#1f4e78] text-white'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                              title="Scale with Strength modifier"
                            >
                              STR
                            </button>
                            <button
                              type="button"
                              onClick={() => setWeaponAbility(w.id, 'dex')}
                              className={`px-2 py-0.5 transition-colors ${
                                currentAbility === 'dex'
                                  ? 'bg-[#1f4e78] text-white'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                              title="Scale with Dexterity modifier"
                            >
                              DEX
                            </button>
                          </div>
                        </td>

                        {/* To-Hit Bonus */}
                        <td className="font-mono font-bold text-stone-900 py-1.5">
                          <span className="bg-[#d9ead3] px-2 py-0.5 rounded border border-[#276749]">
                            {w.toHit}
                          </span>
                        </td>

                        {/* Damage & Type */}
                        <td className="py-1.5">
                          <div className="font-mono font-bold text-stone-900">
                            {w.damage}{' '}
                            <span className="text-[10px] font-sans font-normal text-stone-600">
                              {w.damageType}
                            </span>
                          </div>
                        </td>

                        {/* Range */}
                        <td className="font-mono text-stone-600 py-1.5">
                          {w.range || 'Melee'}
                        </td>

                        {/* Mastery Property Badge */}
                        <td className="py-1.5">
                          {w.mastery ? (
                            <span className="bg-[#d9ead3] text-[#276749] font-bold px-2 py-0.5 rounded text-[10px] border border-[#276749]/30 inline-flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {w.mastery}
                            </span>
                          ) : (
                            <span className="text-stone-400 italic text-[10px]">None</span>
                          )}
                        </td>

                        {/* Mastery Checkbox */}
                        <td className="py-1.5">
                          <button
                            type="button"
                            onClick={() => toggleWeaponMastery(w.id)}
                            className={`w-5 h-5 mx-auto rounded border flex items-center justify-center font-bold text-xs transition-colors ${
                              w.masteryActive
                                ? 'bg-[#276749] text-white border-[#1e4d36] shadow-2xs'
                                : 'bg-white text-stone-300 border-stone-300 hover:border-stone-400'
                            }`}
                            title={
                              w.masteryActive
                                ? 'Mastery Active: You apply this weapon\'s mastery property (Click to deactivate)'
                                : 'Mastery Inactive: Click to toggle mastery on'
                            }
                          >
                            {w.masteryActive ? '✓' : ''}
                          </button>
                        </td>

                        {/* Properties & Notes (Full horizontal space) */}
                        <td className="text-left px-3 py-1.5 text-[11px] text-stone-600">
                          {w.notes || (w.properties && w.properties.length > 0 ? w.properties.join(', ') : '—')}
                        </td>

                        {/* Delete Action */}
                        <td className="py-1.5 pr-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Remove ${w.name}?`)) {
                                removeWeapon(w.id);
                              }
                            }}
                            className="p-1 rounded bg-stone-100 hover:bg-red-100 text-stone-400 hover:text-red-700 transition-colors"
                            title="Remove Weapon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* AMMUNITION TRACKER (Multi-Type, Editable Name & Quantity)  */}
        {/* ========================================================= */}
        <div className="border border-stone-400 bg-white shadow-2xs">
          {/* Header */}
          <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-300" />
              <span className="tracking-wide uppercase">Ammunition</span>
            </div>
            <button
              type="button"
              onClick={() => addAmmunition('Arrows', 20)}
              className="flex items-center gap-1 text-[10px] bg-white text-[#1f4e78] hover:bg-stone-100 px-2 py-0.5 rounded font-bold transition-colors shadow-2xs"
              title="Add a new ammunition type"
            >
              <Plus className="w-3 h-3" />
              <span>Add Ammunition</span>
            </button>
          </div>

          {/* Ammunition List / Grid */}
          <div className="p-2.5">
            {(!character.ammunition || character.ammunition.length === 0) ? (
              <div className="text-center py-2.5 text-stone-400 italic text-xs">
                No ammunition tracked. Click &quot;Add Ammunition&quot; to track arrows, bolts, sling bullets, or darts.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {character.ammunition.map((ammo, idx) => (
                  <div
                    key={ammo.id || idx}
                    className="flex items-center justify-between gap-2 bg-[#faf6f0] border border-stone-300 hover:border-stone-400 rounded px-2.5 py-1.5 transition-colors shadow-2xs min-w-0 overflow-hidden"
                  >
                    {/* Ammo Name Input */}
                    <input
                      type="text"
                      value={ammo.name ?? ammo.weaponName ?? ''}
                      placeholder="Ammo name (e.g. Arrows)"
                      onChange={(e) => updateAmmunition(idx, { name: e.target.value, weaponName: e.target.value })}
                      className="font-medium text-stone-900 bg-transparent border-b border-stone-300/60 hover:border-[#1f4e78] focus:border-[#1f4e78] focus:bg-white focus:outline-none flex-1 min-w-0 py-0.5 text-xs truncate transition-colors"
                      title="Click to edit ammunition name"
                    />

                    {/* Quantity controls: [-] [Qty] [+] [Trash] */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateAmmunition(idx, { total: Math.max(0, (ammo.total || 0) - 1) })}
                        className="w-5 h-5 flex items-center justify-center bg-stone-200 hover:bg-stone-300 rounded text-stone-800 font-mono font-bold text-xs transition-colors shrink-0"
                        title="Spend 1 ammo"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={ammo.total}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, '');
                          updateAmmunition(idx, { total: cleaned === '' ? 0 : parseInt(cleaned, 10) });
                        }}
                        className="w-10 text-center font-mono font-bold text-xs bg-[#d9ead3] text-[#166534] border border-[#276749] rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-[#276749] shrink-0"
                        title="Click to edit quantity directly"
                      />
                      <button
                        type="button"
                        onClick={() => updateAmmunition(idx, { total: (ammo.total || 0) + 1 })}
                        className="w-5 h-5 flex items-center justify-center bg-stone-200 hover:bg-stone-300 rounded text-stone-800 font-mono font-bold text-xs transition-colors shrink-0"
                        title="Add 1 ammo"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete ammunition "${ammo.name || ammo.weaponName || 'Ammunition'}"?`)) {
                            removeAmmunition(idx);
                          }
                        }}
                        className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-0.5 shrink-0"
                        title="Delete ammunition type"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ARMOR SECTION (Full Width Horizontal Table)               */}
        {/* ========================================================= */}
        <div className="border border-stone-400 bg-white overflow-hidden shadow-xs">
          {/* Section Header */}
          <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span className="tracking-wide">ARMOR &amp; SHIELDS (D&amp;D 2024 RULES)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddArmorOpen(true)}
              className="flex items-center gap-1 text-[10px] bg-white text-[#1f4e78] hover:bg-stone-100 px-2 py-0.5 rounded font-bold transition-colors shadow-xs"
              title="Add Armor or Shield from D&D 2024 presets"
            >
              <Plus className="w-3 h-3" />
              <span>Add Armor</span>
            </button>
          </div>

          {/* Armor Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-[11px]">
              <thead>
                <tr className="bg-stone-200 text-stone-700 border-b border-stone-300 font-bold text-[10px]">
                  <th className="text-left px-3 py-1.5 min-w-[140px]">Armor / Shield</th>
                  <th className="w-20 py-1.5">Type</th>
                  <th className="w-16 py-1.5">Base AC</th>
                  <th className="w-20 py-1.5">Dex Bonus</th>
                  <th className="w-20 py-1.5" title="Stealth Disadvantage">Stealth DA</th>
                  <th className="w-16 py-1.5">Weight</th>
                  <th className="text-left px-3 py-1.5 min-w-[200px]">Properties &amp; Don/Doff Rules</th>
                  <th className="w-20 py-1.5" title="Toggle whether item is equipped">Equipped</th>
                  <th className="w-10 py-1.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {(character.armorWorn || []).length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-stone-400 italic text-center text-xs">
                      No armor or shields equipped. Unarmored Defense: Base AC 10 + Dex ({10 + dexMod}).
                    </td>
                  </tr>
                ) : (
                  character.armorWorn.map((armor, idx) => {
                    const isShield = armor.type.toLowerCase().includes('shield');
                    const isEquipped = armor.equipped !== false;

                    return (
                      <tr
                        key={armor.id || idx}
                        className={`transition-colors ${
                          isEquipped ? 'hover:bg-amber-50/40' : 'bg-stone-50/60 opacity-60'
                        }`}
                      >
                        {/* Name */}
                        <td className="text-left px-3 py-1.5 font-bold text-stone-900">
                          {armor.name}
                          {!isEquipped && (
                            <span className="ml-1.5 text-[9px] font-normal text-stone-400 italic">
                              (Unequipped)
                            </span>
                          )}
                        </td>

                        {/* Type Code */}
                        <td className="py-1.5">
                          <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded text-[10px] border border-stone-300">
                            {armor.type}
                          </span>
                        </td>

                        {/* Base AC */}
                        <td className="font-mono font-bold text-stone-900 py-1.5">
                          <span className="bg-[#d9ead3] px-2 py-0.5 rounded border border-[#276749]">
                            {isShield ? `+${armor.ac}` : armor.ac}
                          </span>
                        </td>

                        {/* Dex Bonus */}
                        <td className="font-mono text-stone-800 py-1.5">
                          {armor.dexBonus > 0
                            ? `+${armor.dexBonus}`
                            : armor.dexBonus === 0
                            ? '0'
                            : armor.dexBonus}
                        </td>

                        {/* Stealth Disadvantage */}
                        <td className="py-1.5 font-mono">
                          {armor.daStealth ? (
                            <span className="text-red-700 font-bold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[10px]">
                              [x] Disadv.
                            </span>
                          ) : (
                            <span className="text-stone-400">[ ] None</span>
                          )}
                        </td>

                        {/* Weight */}
                        <td className="font-mono text-stone-800 py-1.5">
                          {armor.weight ? `${armor.weight} lb` : '—'}
                        </td>

                        {/* Properties & Notes (Full horizontal space) */}
                        <td className="text-left px-3 py-1.5 text-[11px] text-stone-600">
                          {armor.notes || '—'}
                        </td>

                        {/* Equipped Checkbox Toggle */}
                        <td className="py-1.5">
                          <button
                            type="button"
                            onClick={() => toggleArmorEquipped(idx)}
                            className={`w-5 h-5 mx-auto rounded border flex items-center justify-center font-bold text-xs transition-colors ${
                              isEquipped
                                ? 'bg-[#1f4e78] text-white border-[#153654] shadow-2xs'
                                : 'bg-white text-stone-300 border-stone-300 hover:border-stone-400'
                            }`}
                            title={isEquipped ? 'Equipped: Affects AC (Click to unequip)' : 'Unequipped (Click to equip)'}
                          >
                            {isEquipped ? '✓' : ''}
                          </button>
                        </td>

                        {/* Delete Action */}
                        <td className="py-1.5 pr-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Remove ${armor.name}?`)) {
                                removeArmor(idx);
                              }
                            }}
                            className="p-1 rounded bg-stone-100 hover:bg-red-100 text-stone-400 hover:text-red-700 transition-colors"
                            title={`Remove ${armor.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Armor Summary Bar */}
          <div className="bg-stone-100 border-t border-stone-300 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-700">Total Effective AC:</span>
                <span className="bg-[#d9ead3] border border-[#276749] text-stone-900 font-mono font-extrabold px-2 py-0.5 rounded text-sm shadow-xs">
                  {computedTotalAc}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  ({baseArmorAc} base + {dexApplied >= 0 ? `+${dexApplied}` : dexApplied} dex
                  {shieldItem ? ` + ${shieldAc} shield` : ''})
                </span>
              </div>

              {hasStealthDa && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded">
                  <span>⚠️ Disadvantage on Dexterity (Stealth) checks</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-stone-600 font-mono text-[11px]">
              <span>Armor Weight:</span>
              <span className="font-bold text-stone-800 bg-white border border-stone-300 px-2 py-0.5 rounded">
                {totalArmorWeight} lbs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WeaponModal
        isOpen={isAddWeaponOpen}
        onClose={() => setIsAddWeaponOpen(false)}
      />

      <ArmorModal
        isOpen={isAddArmorOpen}
        onClose={() => setIsAddArmorOpen(false)}
      />
    </div>
  );
};
