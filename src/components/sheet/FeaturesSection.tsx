import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { CharacterFeature } from '../../types/character';
import { Plus, Trash2, Edit3, Sparkles, ChevronDown, ChevronRight, ChevronsUpDown } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const { character, addFeature, removeFeature, updateFeature } = useCharacter();

  const [showAddModal, setShowAddModal] = useState(false);

  // Custom Feature Form State
  const [featureName, setFeatureName] = useState('');
  const [featureSource, setFeatureSource] = useState<'Race' | 'Class' | 'Feat' | 'Background' | 'Other'>('Class');
  const [featureDesc, setFeatureDesc] = useState('');
  const [featureFullText, setFeatureFullText] = useState('');
  const [featurePrereq, setFeaturePrereq] = useState('');

  // Edit Feature State
  const [editingFeature, setEditingFeature] = useState<CharacterFeature | null>(null);
  const [editFeatName, setEditFeatName] = useState('');
  const [editFeatSource, setEditFeatSource] = useState<'Race' | 'Class' | 'Feat' | 'Background' | 'Other'>('Class');
  const [editFeatDesc, setEditFeatDesc] = useState('');
  const [editFeatFullText, setEditFeatFullText] = useState('');
  const [editFeatPrereq, setEditFeatPrereq] = useState('');

  // Accordion Expanded Set (Feature IDs)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const raceAndFeatFeatures = character.features.filter(
    (f) => f.source === 'Race' || f.source === 'Feat' || f.source === 'Background'
  );
  const classFeatures = character.features.filter(
    (f) => f.source === 'Class' || f.source === 'Other' || !raceAndFeatFeatures.includes(f)
  );

  const allFeatureIds = character.features.map((f) => f.id);
  const allExpanded = allFeatureIds.length > 0 && allFeatureIds.every((id) => expandedIds.has(id));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllExpanded = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(allFeatureIds));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureName.trim()) return;

    addFeature({
      id: `feat-${Date.now()}`,
      name: featureName.trim(),
      source: featureSource,
      description: featureDesc.trim() || 'No description provided.',
      fullText: featureFullText.trim() || undefined,
      prerequisite: featurePrereq.trim() || undefined,
    });

    setFeatureName('');
    setFeatureDesc('');
    setFeatureFullText('');
    setFeaturePrereq('');
    setShowAddModal(false);
  };

  const startEditingFeature = (feat: CharacterFeature) => {
    setEditingFeature(feat);
    setEditFeatName(feat.name);
    setEditFeatSource(feat.source as any);
    setEditFeatDesc(feat.description);
    setEditFeatFullText(feat.fullText || '');
    setEditFeatPrereq(feat.prerequisite || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature || !editFeatName.trim()) return;

    // Updates only this character's local feature instance
    updateFeature({
      ...editingFeature,
      name: editFeatName.trim(),
      source: editFeatSource,
      description: editFeatDesc.trim() || 'No description provided.',
      fullText: editFeatFullText.trim() || undefined,
      prerequisite: editFeatPrereq.trim() || undefined,
    });

    setEditingFeature(null);
  };

  const renderFeatureCard = (feat: CharacterFeature) => {
    const isExpanded = expandedIds.has(feat.id);
    const hasMoreDetails = !!feat.fullText && feat.fullText.trim() !== feat.description.trim();

    return (
      <div key={feat.id} className="py-1 px-2 hover:bg-stone-50 transition-colors group">
        {/* Header row: Toggle Caret, Title, Badges, Actions */}
        <div className="flex items-center justify-between gap-1.5">
          <div
            onClick={() => toggleExpand(feat.id)}
            className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer select-none"
          >
            {hasMoreDetails ? (
              isExpanded ? (
                <ChevronDown className="w-3 h-3 text-stone-500 shrink-0" />
              ) : (
                <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
              )
            ) : (
              <span className="w-3 h-3 shrink-0 flex items-center justify-center text-stone-300 text-[9px]">
                •
              </span>
            )}

            <span className="font-bold text-stone-900 text-xs truncate hover:text-[#1f4e78]">
              {feat.name}
            </span>

            <span className="text-[9px] bg-stone-100 border border-stone-300 px-1 py-0 rounded text-stone-600 shrink-0 font-medium">
              {feat.source}
            </span>

            {feat.prerequisite && (
              <span className="text-[9px] text-stone-400 italic truncate hidden sm:inline">
                ({feat.prerequisite})
              </span>
            )}
          </div>

          {/* Action buttons: Edit & Delete always available */}
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 shrink-0">
            <button
              type="button"
              onClick={() => startEditingFeature(feat)}
              className="text-stone-400 hover:text-[#1f4e78] p-0.5 transition-colors"
              title="Edit Ability / Add Notes"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => removeFeature(feat.id)}
              className="text-stone-400 hover:text-red-700 p-0.5 transition-colors"
              title="Remove Ability"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Primary Tactical Brief (Always visible, compact line-height) */}
        <p
          onClick={() => toggleExpand(feat.id)}
          className="text-[10.5px] italic text-stone-600 mt-0.5 leading-snug whitespace-pre-line cursor-pointer"
        >
          {feat.description}
        </p>

        {/* Expanded Full Rules & Mechanics */}
        {isExpanded && hasMoreDetails && (
          <div className="mt-1 pt-1 border-t border-stone-200 text-[10.5px] text-stone-800 leading-snug whitespace-pre-line bg-[#faf6f0] p-1.5 rounded border border-stone-200/80 font-serif">
            <div className="flex items-center justify-between text-[9px] text-stone-500 font-sans font-bold uppercase tracking-wider mb-0.5">
              <span>Full Rules &amp; Mechanics</span>
              {feat.prerequisite && <span>Prereq: {feat.prerequisite}</span>}
            </div>
            {feat.fullText}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans text-stone-900">
      {/* Banner */}
      <div className="bg-[#7b1113] text-white font-bold text-center py-1.5 tracking-wider text-xs uppercase shadow-sm flex flex-wrap items-center justify-between px-3 sm:px-4 gap-2">
        <div className="flex items-center gap-2">
          <span>FEATURES &amp; ABILITIES</span>
          <span className="text-[10px] text-white/70 font-normal lowercase">
            ({character.features.length} abilities)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {/* Expand / Collapse All Toggle */}
          {character.features.length > 0 && (
            <button
              type="button"
              onClick={toggleAllExpanded}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
              title={allExpanded ? 'Collapse all feature mechanics' : 'Expand all feature mechanics'}
            >
              <ChevronsUpDown className="w-3 h-3" />
              <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>
          )}

          {/* Add Ability */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 bg-white hover:bg-stone-100 text-[#7b1113] px-2.5 py-0.5 rounded text-[11px] font-bold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Ability</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout Matching Page 2 of Attached PDF */}
      <div className="bg-[#f6efe6] p-2 border border-stone-300 grid grid-cols-12 gap-3 text-xs">
        {/* Left Column: Race / Species / Background / Feats */}
        <div className="col-span-12 md:col-span-6 border border-stone-400 bg-white">
          <div className="bg-[#1f4e78] text-white font-bold text-center py-1 text-xs">
            Race / Species / Background / Feats
          </div>

          <div className="divide-y divide-stone-300">
            {raceAndFeatFeatures.length === 0 ? (
              <div className="p-4 text-center text-stone-400">
                No species traits or feats recorded. Click &quot;Add Ability&quot; to record features.
              </div>
            ) : (
              raceAndFeatFeatures.map(renderFeatureCard)
            )}
          </div>
        </div>

        {/* Right Column: Class Features */}
        <div className="col-span-12 md:col-span-6 border border-stone-400 bg-white">
          <div className="bg-[#1f4e78] text-white font-bold text-center py-1 text-xs">
            Class
          </div>

          <div className="divide-y divide-stone-300">
            {classFeatures.length === 0 ? (
              <div className="p-4 text-center text-stone-400">No class abilities recorded.</div>
            ) : (
              classFeatures.map(renderFeatureCard)
            )}
          </div>
        </div>
      </div>

      {/* Add Feature Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-400 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <h3 className="font-fantasy font-bold text-[#1f4e78] text-base border-b border-stone-300 pb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Add Ability / Feature</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Ability Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Action Surge, Darkvision, War Caster"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Source Category</label>
                  <select
                    value={featureSource}
                    onChange={(e) => setFeatureSource(e.target.value as any)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
                  >
                    <option value="Class">Class Feature</option>
                    <option value="Feat">Feat</option>
                    <option value="Race">Race / Species Trait</option>
                    <option value="Background">Background Trait</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Prerequisite (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Level 4+, Str 13"
                    value={featurePrereq}
                    onChange={(e) => setFeaturePrereq(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700">
                  Tactical Brief (Displayed on Sheet) *
                </label>
                <p className="text-[10px] text-stone-500 mb-1">
                  Ideal place to record chosen weapon masteries, spells, or notes
                </p>
                <textarea
                  rows={2}
                  required
                  placeholder="1-2 sentences summarizing mechanics, bonuses, or chosen options..."
                  value={featureDesc}
                  onChange={(e) => setFeatureDesc(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none italic"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Rules &amp; Mechanics (Optional - Visible when expanded)
                </label>
                <textarea
                  rows={4}
                  placeholder="Complete verbatim rules, edge cases, tables..."
                  value={featureFullText}
                  onChange={(e) => setFeatureFullText(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#1f4e78] hover:bg-[#163857] text-white rounded font-bold shadow-sm"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Feature Modal */}
      {editingFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#1f4e78] rounded-xl p-5 max-w-lg w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-300 pb-1">
              <h3 className="font-fantasy font-bold text-[#1f4e78] text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Edit Character Ability / Feature</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingFeature(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Ability Name *</label>
                <input
                  type="text"
                  required
                  value={editFeatName}
                  onChange={(e) => setEditFeatName(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none font-bold"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Source Category</label>
                  <select
                    value={editFeatSource}
                    onChange={(e) => setEditFeatSource(e.target.value as any)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
                  >
                    <option value="Class">Class Feature</option>
                    <option value="Feat">Feat</option>
                    <option value="Race">Race / Species Trait</option>
                    <option value="Background">Background Trait</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Prerequisite</label>
                  <input
                    type="text"
                    placeholder="e.g. Level 4+"
                    value={editFeatPrereq}
                    onChange={(e) => setEditFeatPrereq(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700">
                  Tactical Brief (Displayed on Sheet) *
                </label>
                <p className="text-[10px] text-stone-500 mb-1">
                  Ideal place to record chosen weapon masteries, spells, or notes
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder="1-2 sentences summarizing mechanics, chosen options, or bonuses..."
                  value={editFeatDesc}
                  onChange={(e) => setEditFeatDesc(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none italic"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Rules &amp; Mechanics (Visible when expanded)
                </label>
                <textarea
                  rows={5}
                  placeholder="Complete rules text, edge cases, tables..."
                  value={editFeatFullText}
                  onChange={(e) => setEditFeatFullText(e.target.value)}
                  className="w-full border border-stone-300 rounded px-2.5 py-1.5 focus:border-[#1f4e78] focus:outline-none font-serif text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#1f4e78] hover:bg-[#163857] text-white rounded font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
