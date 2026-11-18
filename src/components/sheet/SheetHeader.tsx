import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Download, Upload, Sunrise, Moon, Sparkles, BookOpen, HelpCircle, StickyNote, User, Shield, Printer } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { getAppearanceColorStyle } from '../../utils/colorHelper';

export const SheetHeader: React.FC<{
  onOpenMasterSpells: () => void;
  currentView: 'sheet' | 'spells' | 'back' | 'notes' | 'reference';
  setCurrentView: (v: 'sheet' | 'spells' | 'back' | 'notes' | 'reference') => void;
  zoomLevel?: number;
  onSetZoom?: (z: number) => void;
  onOpenSaveModal?: () => void;
  onOpenLoadModal?: () => void;
  onPrint?: () => void;
}> = ({ onOpenMasterSpells, currentView, setCurrentView, zoomLevel, onSetZoom, onOpenSaveModal, onOpenLoadModal, onPrint }) => {
  const { character, updateCharacter, exportCharacterJson, importCharacterJson, shortRest, longRest } =
    useCharacter();

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importCharacterJson(content);
          if (success) {
            alert('Character loaded successfully from JSON!');
          } else {
            alert('Could not parse character file. Please verify it is a valid D&D JSON export.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const updateIdentity = (field: keyof typeof character, val: string) => {
    updateCharacter((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const updateAppearance = (field: keyof typeof character.appearance, val: string) => {
    updateCharacter((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: val,
      },
    }));
  };

  const classSummary = character.classes
    .map((c) => `${c.name}${c.subclass ? ` (${c.subclass})` : ''} (${c.level})`)
    .join(', ');

  const hairStyle = getAppearanceColorStyle(character.appearance.hair);
  const eyesStyle = getAppearanceColorStyle(character.appearance.eyes);
  const skinStyle = getAppearanceColorStyle(character.appearance.skin);

  return (
    <div
      className={`bg-[#faf6f0] border-b border-stone-300 pt-3 px-4 shadow-sm select-none ${
        currentView === 'sheet' ? 'pb-4' : 'pb-2.5'
      }`}
    >
      {/* Top Utility & Navigation Header */}
      <div
        className={`max-w-6xl mx-auto space-y-2.5 ${
          currentView === 'sheet' ? 'mb-4 pb-2 border-b border-stone-300/80' : ''
        }`}
      >
        {/* Tier 1: Branding & Secondary Utilities (Scale, Save/Load) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* App Branding */}
          <div className="flex items-center gap-2">
            <span className="font-fantasy font-bold text-stone-900 tracking-wide text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#7b1113]" />
              D&D 5.5e (2024) Character Sheet
            </span>
          </div>

          {/* Utilities: Scale & File Sync */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Scale / Zoom Control */}
            {zoomLevel !== undefined && onSetZoom && (
              <div className="flex items-center gap-1 bg-stone-200/80 rounded px-2 py-0.5 border border-stone-300 text-xs shadow-2xs">
                <span className="text-stone-500 font-semibold text-[10px] uppercase tracking-wider">Scale:</span>
                <button
                  type="button"
                  onClick={() => onSetZoom(zoomLevel - 0.15)}
                  className="w-4 h-4 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-300 rounded font-mono text-xs leading-none"
                  title="Scale down by 15%"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => onSetZoom(1.15)}
                  className="px-1 font-mono font-bold text-[#1f4e78] hover:underline text-[11px]"
                  title="Reset scale to default 115%"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => onSetZoom(zoomLevel + 0.15)}
                  className="w-4 h-4 flex items-center justify-center font-bold text-stone-700 hover:bg-stone-300 rounded font-mono text-xs leading-none"
                  title="Scale up by 15%"
                >
                  +
                </button>
              </div>
            )}

            {/* File Operations (Save/Load) */}
            <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded border border-stone-300 shadow-2xs">
              <Tooltip content="Save character sheet to project saves folder or computer (Ctrl + S).">
                <button
                  type="button"
                  onClick={onOpenSaveModal || exportCharacterJson}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300/80 font-medium transition-colors text-xs shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Save JSON</span>
                </button>
              </Tooltip>

              <Tooltip content="Load character sheet from project saves folder or computer.">
                <button
                  type="button"
                  onClick={onOpenLoadModal}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300/80 font-medium transition-colors text-xs shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-700" />
                  <span>Load JSON</span>
                </button>
              </Tooltip>

              <button
                type="button"
                onClick={onPrint || (() => window.print())}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300/80 font-medium transition-colors text-xs shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-purple-700" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Primary Navigation Tabs & In-Game Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-stone-300/60">
          {/* Section A: Page Navigation (Enclosed Segmented Tab Bar) */}
          <div className="flex items-center bg-stone-200/90 p-1 rounded-lg border border-stone-300/90 shadow-inner gap-1">
            {/* Front Sheet */}
            <button
              onClick={() => setCurrentView('sheet')}
              className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'sheet'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60 font-semibold'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Front Sheet</span>
            </button>

            {/* Spells */}
            <button
              onClick={() => setCurrentView('spells')}
              className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'spells'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60 font-semibold'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spells</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  currentView === 'spells'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-300 text-stone-700'
                }`}
              >
                {character.spellcasting.preparedSpellNames.length}
              </span>
            </button>

            {/* Back & Inventory */}
            <button
              onClick={() => setCurrentView('back')}
              className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'back'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60 font-semibold'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Back & Inventory</span>
            </button>

            {/* Notes */}
            <button
              onClick={() => setCurrentView('notes')}
              className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'notes'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60 font-semibold'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>Notes</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  currentView === 'notes'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-300 text-stone-700'
                }`}
              >
                {(character.notes || []).length}
              </span>
            </button>

            {/* Reference */}
            <button
              onClick={() => setCurrentView('reference')}
              className={`px-3 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
                currentView === 'reference'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/60 font-semibold'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Reference</span>
            </button>
          </div>

          {/* Section B: Action Buttons (Gameplay Actions - Rests) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider hidden sm:inline">
              Actions:
            </span>

            {/* Short Rest Button */}
            <Tooltip content="Short Rest (1 hr): Recovers short-rest resources and lets you spend hit dice.">
              <button
                onClick={() => {
                  if (window.confirm('Take a Short Rest?')) shortRest();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 font-bold transition-colors shadow-2xs hover:shadow-xs active:scale-95"
              >
                <Sunrise className="w-3.5 h-3.5 text-amber-700" />
                <span>Short Rest</span>
              </button>
            </Tooltip>

            {/* Long Rest Button (Dark twilight / night themed, NOT highlighted like active page) */}
            <Tooltip content="Long Rest (8 hrs / 4 hrs Trance): Restores full HP, all spell slots, half max hit dice, and resets abilities.">
              <button
                onClick={() => {
                  if (window.confirm('Take a Long Rest? Fully restores HP, spell slots, and daily abilities.'))
                    longRest();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100/90 text-indigo-950 border border-indigo-300/80 font-bold transition-colors shadow-2xs hover:shadow-xs active:scale-95"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Long Rest</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Reference Header Matching PDF Page 1 (Only on Front Sheet) */}
      {currentView === 'sheet' && (
        <div className="max-w-6xl mx-auto space-y-3 font-sans text-stone-900 mt-3">
        {/* Row 1: Name, Level, Race/Species, Background, Deity, Size, Age/Height/Weight */}
        <div className="grid grid-cols-12 gap-2 items-end">
          {/* Character Name */}
          <div className="col-span-12 sm:col-span-3">
            <input
              type="text"
              value={character.name}
              onChange={(e) => updateIdentity('name', e.target.value)}
              className="w-full text-center font-bold text-lg text-[#1f4e78] bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none"
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Character Name
            </span>
          </div>

          {/* Level */}
          <div className="col-span-3 sm:col-span-1 flex flex-col items-center">
            <div
              className="w-10 h-7 bg-[#d9ead3] border border-[#276749] rounded flex items-center justify-center font-bold text-stone-800 text-sm shadow-sm"
              title={`Total Level: ${character.level}`}
            >
              {character.level}
            </div>
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Level
            </span>
          </div>

          {/* Race/Species */}
          <div className="col-span-5 sm:col-span-2">
            <input
              type="text"
              value={character.race}
              onChange={(e) => updateIdentity('race', e.target.value)}
              className="w-full text-center text-xs font-semibold bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none pb-0.5"
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Race/Species
            </span>
          </div>

          {/* Background */}
          <div className="col-span-4 sm:col-span-2">
            <input
              type="text"
              value={character.background}
              onChange={(e) => updateIdentity('background', e.target.value)}
              className="w-full text-center text-xs bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none pb-0.5"
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Background
            </span>
          </div>

          {/* Deity */}
          <div className="col-span-3 sm:col-span-1">
            <input
              type="text"
              value={character.deity || ''}
              onChange={(e) => updateIdentity('deity', e.target.value)}
              placeholder="—"
              className="w-full text-center text-xs bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none pb-0.5"
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Deity
            </span>
          </div>

          {/* Size */}
          <div className="col-span-3 sm:col-span-1">
            <input
              type="text"
              value={character.size}
              onChange={(e) => updateIdentity('size', e.target.value)}
              className="w-full text-center text-xs bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none pb-0.5"
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Size
            </span>
          </div>

          {/* Age / Height / Weight */}
          <div className="col-span-6 sm:col-span-2">
            <input
              type="text"
              value={`${character.appearance.age}, ${character.appearance.height}, ${character.appearance.weight}`}
              onChange={(e) => {
                const parts = e.target.value.split(',');
                if (parts[0]) updateAppearance('age', parts[0].trim());
                if (parts[1]) updateAppearance('height', parts[1].trim());
                if (parts[2]) updateAppearance('weight', parts[2].trim());
              }}
              className="w-full text-center text-xs bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none pb-0.5 font-mono"
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Age / Height / Weight
            </span>
          </div>
        </div>

        {/* Row 2: Hair, Eyes, Skin, Class and Subclass, Gender */}
        <div className="grid grid-cols-12 gap-2 items-end">
          {/* Hair */}
          <div className="col-span-4 sm:col-span-1">
            <input
              type="text"
              value={character.appearance.hair}
              onChange={(e) => updateAppearance('hair', e.target.value)}
              placeholder="—"
              style={hairStyle.style}
              className={hairStyle.className}
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Hair
            </span>
          </div>

          {/* Eyes */}
          <div className="col-span-4 sm:col-span-1">
            <input
              type="text"
              value={character.appearance.eyes}
              onChange={(e) => updateAppearance('eyes', e.target.value)}
              placeholder="—"
              style={eyesStyle.style}
              className={eyesStyle.className}
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Eyes
            </span>
          </div>

          {/* Skin */}
          <div className="col-span-4 sm:col-span-1">
            <input
              type="text"
              value={character.appearance.skin}
              onChange={(e) => updateAppearance('skin', e.target.value)}
              placeholder="—"
              style={skinStyle.style}
              className={skinStyle.className}
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Skin
            </span>
          </div>

          {/* Class and Subclass */}
          <div className="col-span-8 sm:col-span-8">
            <div className="w-full text-left text-xs font-bold text-stone-800 border-b border-stone-400 pb-0.5 min-h-[22px] flex items-center">
              <span>{classSummary || 'No Class'}</span>
            </div>
            <span className="block text-left text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Class and Subclass
            </span>
          </div>

          {/* Gender */}
          <div className="col-span-4 sm:col-span-1">
            <input
              type="text"
              value={character.gender}
              onChange={(e) => updateIdentity('gender', e.target.value)}
              className="w-full text-center text-xs bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none pb-0.5"
            />
            <span className="block text-center text-[10px] text-[#991b1b] font-medium tracking-tight mt-0.5">
              Gender
            </span>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
