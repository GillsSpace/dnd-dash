import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import {
  Folder,
  FileText,
  Download,
  Upload,
  Trash2,
  X,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  HardDrive,
  UserPlus,
  Sparkles,
} from 'lucide-react';

interface SaveFileInfo {
  filename: string;
  size: number;
  mtime: string;
  meta?: {
    name?: string;
    level?: number;
    race?: string;
    classes?: string;
  } | null;
}

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
    currentSaveFilename,
    saveToProjectSaves,
    loadFromProjectSaves,
    saveToFileSystemPicker,
    loadFromFileSystemPicker,
    importCharacterJson,
    createNewCharacter,
  } = useCharacter();

  const [mode, setMode] = useState<'save' | 'load'>(initialMode);
  const [saveFiles, setSaveFiles] = useState<SaveFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filename input state in save mode
  const [targetFilename, setTargetFilename] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      const defaultName =
        currentSaveFilename ||
        `${(character.name || 'character').replace(/\s+/g, '_')}_5e_2024.json`;
      setTargetFilename(defaultName.endsWith('.json') ? defaultName : `${defaultName}.json`);
      fetchSaves();
    }
  }, [isOpen, initialMode]);

  const fetchSaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/saves');
      if (res.ok) {
        const data = await res.json();
        setSaveFiles(data);
      } else {
        setError('Failed to list files from project /saves folder.');
      }
    } catch (e: any) {
      setError('Could not reach project /api/saves endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetFilename.trim()) return;

    const finalName = targetFilename.trim().endsWith('.json')
      ? targetFilename.trim()
      : `${targetFilename.trim()}.json`;

    setLoading(true);
    const success = await saveToProjectSaves(finalName);
    setLoading(false);

    if (success) {
      if (onToast) onToast(`Saved to saves/${finalName}`);
      onClose();
    } else {
      setError(`Failed to save to ${finalName}. Please check folder permissions.`);
    }
  };

  const handleLoadFromProject = async (filename: string) => {
    setLoading(true);
    const success = await loadFromProjectSaves(filename);
    setLoading(false);

    if (success) {
      if (onToast) onToast(`Loaded ${filename}`);
      onClose();
    } else {
      setError(`Failed to load ${filename}. Invalid or corrupted JSON.`);
    }
  };

  const handleDeleteSave = async (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Permanently delete "${filename}" from project saves folder?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/saves?file=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSaveFiles((prev) => prev.filter((f) => f.filename !== filename));
        if (onToast) onToast(`Deleted ${filename}`);
      }
    } catch (e) {
      setError(`Could not delete ${filename}.`);
    }
  };

  const handleNativeSave = async () => {
    const success = await saveToFileSystemPicker();
    if (success) {
      if (onToast) onToast('Saved to selected location on computer');
      onClose();
    }
  };

  const handleNativeLoad = async () => {
    const success = await loadFromFileSystemPicker();
    if (success) {
      if (onToast) onToast('Loaded character from computer file');
      onClose();
    }
  };

  const handleCreateNewCharacter = () => {
    if (
      window.confirm(
        'Create a new blank character sheet? Any unsaved changes on your current character will be replaced.'
      )
    ) {
      createNewCharacter();
      if (onToast) onToast('Created new blank character sheet');
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
            if (onToast) onToast(`Loaded ${file.name}`);
            onClose();
          } else {
            alert('Invalid character JSON format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  const willOverwrite =
    mode === 'save' &&
    saveFiles.some(
      (f) =>
        f.filename.toLowerCase() ===
        (targetFilename.endsWith('.json') ? targetFilename : `${targetFilename}.json`).toLowerCase()
    );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div
        className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-[#7b1113] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-sm">
              {mode === 'save' ? 'SAVE CHARACTER SHEET' : 'LOAD CHARACTER SHEET'}
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

        {/* Mode Switch Tabs & Path Header */}
        <div className="bg-stone-200/90 border-b border-stone-300 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1 bg-stone-300/80 p-0.5 rounded border border-stone-400/50">
            <button
              type="button"
              onClick={() => setMode('save')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition-all ${
                mode === 'save'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('load')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition-all ${
                mode === 'load'
                  ? 'bg-[#7b1113] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Load Mode</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-stone-600">
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-stone-300 flex items-center gap-1">
              <FolderOpen className="w-3 h-3 text-amber-700" />
              <span>Location: project/saves/</span>
            </span>
            <button
              type="button"
              onClick={fetchSaves}
              className="p-1 hover:bg-stone-300 rounded text-stone-600 hover:text-stone-900 transition-colors"
              title="Refresh saves list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-red-700 text-xs flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Save Form (Only in Save Mode) */}
        {mode === 'save' && (
          <form
            onSubmit={handleSaveToProject}
            className="p-3 bg-[#f6efe6] border-b border-stone-300 flex items-center gap-2 shrink-0 text-xs"
          >
            <div className="flex-1 flex items-center gap-1.5">
              <label htmlFor="save-filename-input" className="font-bold text-stone-700 whitespace-nowrap">
                Filename:
              </label>
              <input
                id="save-filename-input"
                type="text"
                value={targetFilename}
                onChange={(e) => setTargetFilename(e.target.value)}
                placeholder="character_sheet.json"
                className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#7b1113]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !targetFilename.trim()}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#7b1113] hover:bg-[#630e10] text-white rounded font-bold transition-colors shadow-xs disabled:opacity-50 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{willOverwrite ? 'Overwrite in /saves' : 'Save to /saves'}</span>
            </button>
          </form>
        )}

        {/* Load Actions / Create New Character Bar (Only in Load Mode) */}
        {mode === 'load' && (
          <div className="p-2.5 bg-[#f6efe6] border-b border-stone-300 flex items-center justify-between gap-3 shrink-0 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold block text-stone-800">Start with a blank sheet?</span>
                <span className="text-[11px] text-stone-500">Resets to the default Level 1 Wizard template</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateNewCharacter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white rounded font-bold transition-colors shadow-xs whitespace-nowrap text-xs"
              title="Create a fresh blank Level 1 character sheet"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Character</span>
            </button>
          </div>
        )}

        {/* Folder View Table */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Files in project /saves directory ({saveFiles.length})</span>
            {mode === 'save' && (
              <span className="font-normal text-stone-400">Click a file to select its name</span>
            )}
          </div>

          {saveFiles.length === 0 ? (
            <div className="border border-dashed border-stone-300 rounded-md p-6 text-center text-stone-500 text-xs bg-white/50">
              <Folder className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
              <p className="font-semibold">No save files found in saves/ folder.</p>
              <p className="text-[11px] text-stone-400 mt-1">
                Save your character above to create your first project save file.
              </p>
            </div>
          ) : (
            <div className="border border-stone-300 rounded bg-white overflow-hidden divide-y divide-stone-200">
              {saveFiles.map((file) => {
                const isSelected =
                  targetFilename.toLowerCase() === file.filename.toLowerCase();
                const formattedDate = new Date(file.mtime).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const sizeKb = (file.size / 1024).toFixed(1);

                return (
                  <div
                    key={file.filename}
                    onClick={() => {
                      if (mode === 'save') {
                        setTargetFilename(file.filename);
                      }
                    }}
                    className={`p-2.5 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                      isSelected && mode === 'save'
                        ? 'bg-amber-50/80 border-l-4 border-l-[#7b1113]'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <FileText className="w-4 h-4 text-[#1f4e78] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-stone-900 text-xs">
                            {file.filename}
                          </span>
                          {file.meta?.name && (
                            <span className="font-sans text-[11px] font-semibold text-[#7b1113] bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                              {file.meta.name}
                              {file.meta.level ? ` (Lvl ${file.meta.level})` : ''}
                            </span>
                          )}
                          {file.meta?.classes && (
                            <span className="text-[10px] text-stone-500 truncate">
                              {file.meta.classes}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formattedDate}
                          </span>
                          <span>•</span>
                          <span>{sizeKb} KB</span>
                        </div>
                      </div>
                    </div>

                    {/* Action on row */}
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {mode === 'load' ? (
                        <button
                          type="button"
                          onClick={() => handleLoadFromProject(file.filename)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#7b1113] hover:bg-[#630e10] text-white font-bold text-xs transition-colors shadow-2xs"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Load</span>
                        </button>
                      ) : (
                        isSelected && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-amber-700" />
                            Selected
                          </span>
                        )
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDeleteSave(file.filename, e)}
                        className="p-1 text-stone-400 hover:text-red-700 hover:bg-stone-100 rounded transition-colors"
                        title={`Delete ${file.filename}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer: External Native OS Folder Picker Fallback */}
        <div className="bg-stone-100 border-t border-stone-300 p-3 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1 text-stone-600">
            <HardDrive className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-[11px]">Save/Load outside project:</span>
          </div>

          <div className="flex items-center gap-2">
            {'showSaveFilePicker' in window && mode === 'save' ? (
              <button
                type="button"
                onClick={handleNativeSave}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-semibold transition-colors shadow-2xs"
                title="Open system folder dialog to choose any folder on your computer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Browse Other Folder...</span>
              </button>
            ) : 'showOpenFilePicker' in window && mode === 'load' ? (
              <button
                type="button"
                onClick={handleNativeLoad}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-semibold transition-colors shadow-2xs"
                title="Open system file picker to select a JSON file on your computer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Browse From Computer...</span>
              </button>
            ) : (
              <label className="flex items-center gap-1.5 px-3 py-1 rounded bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-semibold transition-colors shadow-2xs cursor-pointer">
                <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Browse File...</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleTraditionalFileImport}
                  className="hidden"
                />
              </label>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
