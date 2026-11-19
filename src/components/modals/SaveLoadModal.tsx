import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import {
  Folder,
  Download,
  Upload,
  X,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  HardDrive,
  UserPlus,
  Sparkles,
  Copy,
  FileCheck,
} from 'lucide-react';

interface SaveLoadModalProps {
  isOpen: boolean;
  initialMode?: 'save' | 'load';
  onClose: () => void;
  onToast?: (message: string) => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  initialMode = 'save',
  onClose,
  onToast,
}) => {
  const {
    character,
    updateCharacter,
    currentSaveFilename,
    setCurrentSaveFilename,
    saveToFileSystemPicker,
    loadFromFileSystemPicker,
    exportCharacterJson,
    importCharacterJson,
    createNewCharacter,
  } = useCharacter();

  const [mode, setMode] = useState<'save' | 'load'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetFilename, setTargetFilename] = useState<string>('');
  const [copyName, setCopyName] = useState<string>('');
  const [showCopyPrompt, setShowCopyPrompt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowCopyPrompt(false);
      setError(null);
      const fallbackName = `${(character.name || 'character').trim().replace(/\s+/g, '_')}_sheet.json`;
      const defaultName =
        currentSaveFilename && !currentSaveFilename.endsWith('_5e_2024.json')
          ? currentSaveFilename
          : fallbackName;
      setTargetFilename(defaultName.endsWith('.json') ? defaultName : `${defaultName}.json`);
      setCopyName(`${character.name || 'Character'} (Copy)`);
    }
  }, [isOpen, initialMode, character.name, currentSaveFilename]);

  const handleDownload = async () => {
    if (!targetFilename.trim()) return;
    const finalName = targetFilename.trim().endsWith('.json')
      ? targetFilename.trim()
      : `${targetFilename.trim()}.json`;

    setLoading(true);
    setCurrentSaveFilename(finalName);
    const success = await saveToFileSystemPicker(finalName);
    setLoading(false);

    if (success) {
      if (onToast) onToast(`Saved ${finalName} to your device`);
      onClose();
    }
  };

  const handleSaveAsCopy = () => {
    if (!copyName.trim()) return;
    const cleanName = copyName.trim();
    const copyFilename = `${cleanName.replace(/\s+/g, '_')}_sheet.json`;

    // Duplicate character in state with new name and new ID
    updateCharacter((prev) => ({
      ...prev,
      id: `char-${Date.now()}`,
      name: cleanName,
    }));

    setCurrentSaveFilename(copyFilename);
    exportCharacterJson(copyFilename);

    if (onToast) onToast(`Created copy: "${cleanName}"`);
    setShowCopyPrompt(false);
    onClose();
  };

  const handleNativeLoad = async () => {
    setLoading(true);
    const success = await loadFromFileSystemPicker();
    setLoading(false);
    if (success) {
      if (onToast) onToast('Loaded character from device file');
      onClose();
    }
  };

  const handleTraditionalFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importCharacterJson(content);
          if (success) {
            setCurrentSaveFilename(file.name);
            if (onToast) onToast(`Loaded ${file.name}`);
            onClose();
          } else {
            setError('Invalid character JSON format. Please select a valid DnD Dash character file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCreateNewCharacter = () => {
    if (
      window.confirm(
        'Start a new blank character sheet? Any unsaved edits to your current sheet will be replaced.'
      )
    ) {
      createNewCharacter();
      if (onToast) onToast('Created new blank character sheet');
      onClose();
    }
  };

  if (!isOpen) return null;

  const classSummary = (character.classes || [])
    .map((c) => `${c.name} ${c.level}`)
    .join(' / ') || 'Level 1';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div
        className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-[#7b1113] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-sm">
              {mode === 'save' ? 'SAVE & BACKUP CHARACTER' : 'LOAD CHARACTER'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="bg-stone-200/90 border-b border-stone-300 px-4 py-2 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1 bg-stone-300/80 p-0.5 rounded border border-stone-400/50">
            <button
              type="button"
              onClick={() => {
                setMode('save');
                setShowCopyPrompt(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition-all ${
                mode === 'save'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save / Backup</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('load');
                setShowCopyPrompt(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition-all ${
                mode === 'load'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Load / Import</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auto-Saved in Browser</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-red-700 text-xs flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Active Character Summary Card */}
          <div className="bg-white border border-stone-300 rounded-lg p-3 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-[#7b1113] font-bold text-base font-fantasy shrink-0">
                {(character.name || '?')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-fantasy font-bold text-stone-900 text-sm truncate">
                  {character.name || 'Unnamed Character'}
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  {character.race || 'Unknown Race'} • {classSummary}
                  {character.customSpells && character.customSpells.length > 0
                    ? ` • ${character.customSpells.length} Custom Spell(s)`
                    : ''}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Total Level
              </span>
              <span className="font-mono font-extrabold text-stone-800 text-base">
                {character.level || 1}
              </span>
            </div>
          </div>

          {mode === 'save' ? (
            <div className="space-y-4">
              {/* Device Storage Status Note */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-stone-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <HardDrive className="w-4 h-4 text-amber-700" />
                  <span>Your character is continuously auto-saved</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  All stat tweaks, HP changes, and spell slot tracking are automatically kept in your
                  browser/tablet storage. Use the options below to download an offline JSON file for
                  backup or to copy your character to another device.
                </p>
              </div>

              {/* Download Backup Box */}
              <div className="bg-white border border-stone-300 rounded-lg p-3 space-y-2.5 shadow-2xs">
                <div className="font-bold text-stone-800 flex items-center justify-between">
                  <span>Download Backup (.json)</span>
                  <span className="text-[11px] text-stone-400 font-normal">Compatible with PC & Tablet</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={targetFilename}
                    onChange={(e) => setTargetFilename(e.target.value)}
                    placeholder="character_sheet.json"
                    className="flex-1 bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#7b1113]"
                  />

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={loading || !targetFilename.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7b1113] hover:bg-[#630e10] text-white rounded font-bold transition-colors shadow-xs disabled:opacity-50 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              {/* Save As Copy Section */}
              <div className="bg-white border border-stone-300 rounded-lg p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800">
                    <Copy className="w-4 h-4 text-blue-700" />
                    <span>Save As Copy / Branch Character</span>
                  </div>
                  {!showCopyPrompt && (
                    <button
                      type="button"
                      onClick={() => setShowCopyPrompt(true)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded font-semibold text-xs transition-colors"
                    >
                      Duplicate...
                    </button>
                  )}
                </div>

                {showCopyPrompt ? (
                  <div className="space-y-2 pt-1 border-t border-stone-200">
                    <p className="text-[11px] text-stone-500">
                      Creates a completely independent duplicate of this sheet (e.g., to level up a new build or start a new campaign):
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={copyName}
                        onChange={(e) => setCopyName(e.target.value)}
                        placeholder="Character Name (Copy)"
                        className="flex-1 bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                      <button
                        type="button"
                        onClick={handleSaveAsCopy}
                        disabled={!copyName.trim()}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold transition-colors shadow-xs disabled:opacity-50 whitespace-nowrap"
                      >
                        Create Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCopyPrompt(false)}
                        className="px-2 py-1.5 text-stone-500 hover:text-stone-700 font-semibold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500">
                    Want to keep your base template safe? Create a separate copy under a new name without overwriting your original.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Import From Device File */}
              <div className="bg-white border border-stone-300 rounded-lg p-5 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-fantasy font-bold text-stone-900 text-sm">
                    Open Character File From Device
                  </h3>
                  <p className="text-[11px] text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Select a previously downloaded <span className="font-mono font-bold">.json</span> character file from your computer or tablet storage.
                  </p>
                </div>

                <div className="pt-1 flex flex-wrap justify-center gap-2">
                  {'showOpenFilePicker' in window ? (
                    <button
                      type="button"
                      onClick={handleNativeLoad}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1f4e78] hover:bg-[#163a5a] text-white rounded font-bold transition-colors shadow-xs text-xs"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Browse From Computer...</span>
                    </button>
                  ) : null}

                  <label className="flex items-center gap-2 px-4 py-2 bg-[#1f4e78] hover:bg-[#163a5a] text-white rounded font-bold transition-colors shadow-xs text-xs cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Choose JSON File...</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleTraditionalFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Start Blank Character */}
              <div className="bg-white border border-stone-300 rounded-lg p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 text-stone-700 min-w-0">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold block text-stone-800 text-xs">Start Fresh Character</span>
                    <span className="text-[11px] text-stone-500 block">
                      Resets to a clean blank Level 1 character sheet
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateNewCharacter}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded font-bold transition-colors shadow-xs text-xs shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Character</span>
                </button>
              </div>

              {/* Tips */}
              <div className="bg-stone-50 border border-stone-200 rounded p-2.5 text-[11px] text-stone-500 space-y-1">
                <div className="font-semibold text-stone-700 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Transferring characters between devices:</span>
                </div>
                <p>
                  To play on another device (like your Samsung tablet), download your sheet on PC, email or save the file to your tablet, and click <strong>Choose JSON File</strong> on the tablet. Custom spells are automatically imported with your character!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 border-t border-stone-300 p-3 flex items-center justify-end gap-2 text-xs shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
