import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Moon, Sunrise, Download, Upload, RotateCcw, Shield, Sparkles } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const Header: React.FC<{ onOpenMasterSpells: () => void }> = ({ onOpenMasterSpells }) => {
  const { character, updateCharacter, longRest, shortRest, exportCharacterJson, importCharacterJson, resetToTemplate } =
    useCharacter();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(character.name);

  const handleNameSave = () => {
    if (nameInput.trim()) {
      updateCharacter((prev) => ({ ...prev, name: nameInput.trim() }));
    }
    setIsEditingName(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importCharacterJson(content);
          if (success) {
            alert('Character loaded successfully!');
          } else {
            alert('Could not parse character file. Ensure it is a valid D&D Dash JSON export.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const classSummary = character.classes
    .map((c) => `${c.name} (${c.level})${c.subclass ? ` - ${c.subclass}` : ''}`)
    .join(' / ');

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-30 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Character Name & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-inner border border-amber-500/30 text-amber-100 font-fantasy text-xl font-bold">
            {character.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  autoFocus
                  className="bg-slate-800 text-amber-300 font-fantasy text-xl font-bold px-2 py-0.5 rounded border border-amber-500 focus:outline-none"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingName(true)}
                  className="font-fantasy text-xl sm:text-2xl font-bold text-amber-200 hover:text-amber-300 cursor-pointer transition-colors"
                  title="Click to rename"
                >
                  {character.name}
                </h1>
              )}
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-950/60 text-amber-300 border border-amber-600/40">
                Lvl {character.level}
              </span>
              <span className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline-block">
                {character.race}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className="text-amber-400/90 font-medium">{classSummary}</span> •{' '}
              <span>{character.background}</span>
            </p>
          </div>
        </div>

        {/* Right: Actions & Rests */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Master Spells Button */}
          <button
            onClick={onOpenMasterSpells}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border border-purple-500/40 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Manage Spells</span>
            <span className="ml-1 px-1.5 py-0.2 bg-purple-950/80 rounded-full text-[10px] text-purple-200 border border-purple-400/30">
              {character.spellcasting.preparedSpellNames.length}
            </span>
          </button>

          {/* Short Rest */}
          <Tooltip content="Take a Short Rest (1 hour). Recovers short-rest resources and allows spending hit dice for HP.">
            <button
              onClick={() => {
                if (window.confirm('Take a Short Rest? This recovers short-rest resources.')) {
                  shortRest();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Sunrise className="w-3.5 h-3.5 text-amber-400" />
              <span>Short Rest</span>
            </button>
          </Tooltip>

          {/* Long Rest */}
          <Tooltip content="Take a Long Rest (8 hours / 4 hours Trance). Restores full HP, resets all spell slots, recovers half your hit dice, and resets Luck Points & Favored Enemy.">
            <button
              onClick={() => {
                if (window.confirm('Take a Long Rest? This fully restores HP, spell slots, and daily features.')) {
                  longRest();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-600/40 transition-colors"
            >
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Long Rest</span>
            </button>
          </Tooltip>

          {/* Export JSON */}
          <Tooltip content="Export character state to a JSON file for backup or sharing.">
            <button
              onClick={exportCharacterJson}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              aria-label="Export Character"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          {/* Import JSON */}
          <Tooltip content="Import character from a saved JSON file.">
            <label className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </Tooltip>

          {/* Reset Template */}
          <Tooltip content="Reset character back to the original spreadsheet data.">
            <button
              onClick={resetToTemplate}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors"
              aria-label="Reset Template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
