import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { CharacterFeature } from '../../types/character';
import { Sparkles, Plus, BookOpen, Trash2 } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const FeaturesList: React.FC = () => {
  const { character, updateCharacter } = useCharacter();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSource, setNewSource] = useState('Class');
  const [newDesc, setNewDesc] = useState('');

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newFeat: CharacterFeature = {
      id: `feat-${Date.now()}`,
      name: newName.trim(),
      source: newSource,
      description: newDesc.trim() || 'No description provided.',
    };

    updateCharacter((prev) => ({
      ...prev,
      features: [...prev.features, newFeat],
    }));

    setNewName('');
    setNewDesc('');
    setShowAdd(false);
  };

  const removeFeature = (id: string) => {
    updateCharacter((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-lg backdrop-blur space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="font-fantasy font-bold text-slate-200 text-sm tracking-wide">
            Features & Traits
          </h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Feature</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddFeature} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Feature Name"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-500"
            />
            <select
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              className="bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-500"
            >
              <option value="Race">Race / Species</option>
              <option value="Class">Class Feature</option>
              <option value="Feat">Feat</option>
              <option value="Background">Background</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea
            placeholder="Feature rules and mechanical description..."
            rows={2}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-500"
          />
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
              Add
            </button>
          </div>
        </form>
      )}

      {/* Feature Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {character.features.map((f) => (
          <Tooltip
            key={f.id}
            content={
              <div className="space-y-1.5 text-left w-64">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="font-fantasy font-bold text-amber-300 text-xs">{f.name}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {f.source}
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {f.description}
                </p>
              </div>
            }
          >
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition-all w-full group">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-fantasy font-semibold text-xs text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                  {f.name}
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700 shrink-0">
                  {f.source}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFeature(f.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-0.5"
                title="Remove Feature"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
