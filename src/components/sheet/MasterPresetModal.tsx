import React, { useState, useMemo } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { MasterFeat, MasterSpeciesTrait, MasterSpeciesOverview } from '../../types/character';
import masterFeatsData from '../../data/masterFeats.json';
import masterSpeciesData from '../../data/masterSpecies.json';
import { Search, X, Plus, Check, Sparkles, BookOpen, ChevronDown, ChevronUp, Layers, Compass, UserCheck } from 'lucide-react';

const masterFeats: MasterFeat[] = masterFeatsData as MasterFeat[];
const masterSpeciesOverview: MasterSpeciesOverview[] = masterSpeciesData.speciesList as MasterSpeciesOverview[];
const masterSpeciesTraits: MasterSpeciesTrait[] = masterSpeciesData.traits as MasterSpeciesTrait[];

interface MasterPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustom: () => void;
}

type MainTab = 'species' | 'feats' | 'all';

const SPECIES_SETTING_TABS = [
  { id: 'all', label: 'All Settings' },
  { id: 'Common', label: 'Common (PHB 2024)' },
  { id: 'Eberron', label: 'Eberron' },
  { id: 'Lorwyn', label: 'Lorwyn' },
  { id: 'Ravenloft', label: 'Ravenloft' },
  { id: 'Warcraft', label: 'Warcraft' },
  { id: 'Exotic', label: 'Exotic' },
];

const FEAT_CATEGORY_TABS = [
  { id: 'all', label: 'All Feats' },
  { id: 'origin', label: 'Origin Feats' },
  { id: 'general', label: 'General Feats (Lvl 4+)' },
  { id: 'fighting', label: 'Fighting Styles' },
  { id: 'epic', label: 'Epic Boons (Lvl 19+)' },
  { id: 'other', label: 'Other Settings' },
];

// Unified item interface for rendering
interface PresetItem {
  id: string;
  name: string;
  kind: 'species' | 'feat';
  category: string;
  subCategory?: string;
  speciesName?: string;
  traitType?: 'Base Trait' | 'Lineage';
  isLineage?: boolean;
  prerequisite?: string | null;
  brief: string;
  fullText: string;
  source?: string;
}

export const MasterPresetModal: React.FC<MasterPresetModalProps> = ({
  isOpen,
  onClose,
  onOpenCustom,
}) => {
  const { character, addFeature } = useCharacter();

  const [mainTab, setMainTab] = useState<MainTab>('species');
  const [speciesSetting, setSpeciesSetting] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [speciesTraitType, setSpeciesTraitType] = useState<'all' | 'base' | 'lineage'>('all');

  const [featCategory, setFeatCategory] = useState<string>('all');
  const [phbOnlyFeats, setPhbOnlyFeats] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Check existing features on character by name
  const existingFeatureNames = useMemo(() => {
    return new Set(
      character.features.map((f) => f.name.toLowerCase().trim())
    );
  }, [character.features]);

  // List of species available based on setting filter
  const availableSpecies = useMemo(() => {
    return masterSpeciesOverview.filter((sp) => {
      if (speciesSetting === 'all') return true;
      return sp.category === speciesSetting;
    });
  }, [speciesSetting]);

  // Convert species traits to unified items
  const speciesPresetItems: PresetItem[] = useMemo(() => {
    return masterSpeciesTraits.map((t) => ({
      id: t.id,
      name: t.name,
      kind: 'species',
      category: t.category,
      speciesName: t.species,
      traitType: t.traitType,
      isLineage: t.isLineage,
      prerequisite: t.prerequisite,
      brief: t.brief,
      fullText: t.fullText,
      source: t.source,
    }));
  }, []);

  // Convert feats to unified items
  const featPresetItems: PresetItem[] = useMemo(() => {
    return masterFeats.map((f) => ({
      id: f.id,
      name: f.name,
      kind: 'feat',
      category: f.category,
      subCategory: f.subCategory,
      prerequisite: f.prerequisite,
      brief: f.brief,
      fullText: f.fullText,
      source: f.source,
    }));
  }, []);

  // Filtered items based on active tabs & search
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let items: PresetItem[] = [];

    if (mainTab === 'species') {
      items = speciesPresetItems.filter((item) => {
        // Setting filter
        if (speciesSetting !== 'all' && item.category !== speciesSetting) return false;
        // Species dropdown filter
        if (selectedSpecies !== 'all' && item.speciesName !== selectedSpecies) return false;
        // Trait type filter
        if (speciesTraitType === 'base' && item.isLineage) return false;
        if (speciesTraitType === 'lineage' && !item.isLineage) return false;
        return true;
      });
    } else if (mainTab === 'feats') {
      items = featPresetItems.filter((item) => {
        // Category filter
        if (featCategory === 'origin' && item.category !== 'Origin Feats') return false;
        if (featCategory === 'general' && item.category !== 'General Feats') return false;
        if (featCategory === 'fighting' && item.category !== 'Fighting Style Feats') return false;
        if (featCategory === 'epic' && item.category !== 'Epic Boon Feats') return false;
        if (
          featCategory === 'other' &&
          ['Origin Feats', 'General Feats', 'Fighting Style Feats', 'Epic Boon Feats'].includes(item.category)
        ) {
          return false;
        }
        // PHB only filter
        if (phbOnlyFeats && item.subCategory !== 'Common' && item.category !== 'Fighting Style Feats') {
          return false;
        }
        return true;
      });
    } else {
      // 'all' tab combines both
      items = [...speciesPresetItems, ...featPresetItems];
    }

    // Search query filter
    if (q) {
      items = items.filter((item) => {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrief = item.brief.toLowerCase().includes(q);
        const matchesFull = (item.fullText || '').toLowerCase().includes(q);
        const matchesPrereq = (item.prerequisite || '').toLowerCase().includes(q);
        const matchesSpecies = (item.speciesName || '').toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        return matchesName || matchesBrief || matchesFull || matchesPrereq || matchesSpecies || matchesCategory;
      });
    }

    return items;
  }, [mainTab, speciesSetting, selectedSpecies, speciesTraitType, featCategory, phbOnlyFeats, searchQuery, speciesPresetItems, featPresetItems]);

  // Base traits for selected species (for bulk add)
  const selectedSpeciesBaseTraits = useMemo(() => {
    if (selectedSpecies === 'all') return [];
    return masterSpeciesTraits.filter(
      (t) => t.species === selectedSpecies && !t.isLineage
    );
  }, [selectedSpecies]);

  const selectedSpeciesUnaddedBaseTraits = useMemo(() => {
    return selectedSpeciesBaseTraits.filter(
      (t) => !existingFeatureNames.has(t.name.toLowerCase().trim())
    );
  }, [selectedSpeciesBaseTraits, existingFeatureNames]);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddItem = (item: PresetItem) => {
    // Add an independent, local character feature instance
    addFeature({
      id: `${item.kind}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: item.name,
      source: item.kind === 'species' ? 'Race' : 'Feat',
      description: item.brief,
      fullText: item.fullText,
      prerequisite: item.prerequisite,
      category: item.speciesName || item.category,
      collapsed: true,
    });
  };

  const handleBulkAddSpecies = () => {
    if (selectedSpeciesUnaddedBaseTraits.length === 0) return;
    selectedSpeciesUnaddedBaseTraits.forEach((trait) => {
      addFeature({
        id: `race-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: trait.name,
        source: 'Race',
        description: trait.brief,
        fullText: trait.fullText,
        prerequisite: trait.prerequisite,
        category: trait.species,
        collapsed: true,
      });
    });
  };

  const getCategoryBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'Origin Feats':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'General Feats':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Fighting Style Feats':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Epic Boon Feats':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Common':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Eberron':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Lorwyn':
        return 'bg-violet-100 text-violet-800 border-violet-300';
      case 'Ravenloft':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Warcraft':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Exotic':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#faf6f0] border border-stone-400 rounded-lg shadow-2xl w-full max-w-4xl max-h-[88vh] h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#7b1113] text-white p-3 sm:px-5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h2 className="font-fantasy font-bold text-base sm:text-lg tracking-wide leading-tight">
                2024 D&amp;D Pre-Set Library
              </h2>
              <span className="text-[11px] text-stone-200">
                Official Species &amp; Race Traits (42 species) and Feats (222 feats)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCustom}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-3 py-1 rounded text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Custom</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top-Level Main Tabs: Species Traits vs Feats vs All */}
        <div className="bg-[#e9decb] border-b border-stone-300 px-4 pt-2 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMainTab('species');
                setSelectedSpecies('all');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-lg text-xs font-bold transition-all border-t border-x ${
                mainTab === 'species'
                  ? 'bg-[#faf6f0] text-[#1f4e78] border-stone-300 border-b-transparent shadow-xs'
                  : 'bg-[#ddcfb8] text-stone-700 hover:bg-[#d4c3a7] border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Species &amp; Race Traits</span>
              <span className="text-[10px] bg-stone-200/80 px-1.5 py-0.2 rounded-full font-semibold">
                {masterSpeciesTraits.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMainTab('feats')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-lg text-xs font-bold transition-all border-t border-x ${
                mainTab === 'feats'
                  ? 'bg-[#faf6f0] text-[#1f4e78] border-stone-300 border-b-transparent shadow-xs'
                  : 'bg-[#ddcfb8] text-stone-700 hover:bg-[#d4c3a7] border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Feats Library</span>
              <span className="text-[10px] bg-stone-200/80 px-1.5 py-0.2 rounded-full font-semibold">
                {masterFeats.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMainTab('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-bold transition-all border-t border-x ${
                mainTab === 'all'
                  ? 'bg-[#faf6f0] text-[#1f4e78] border-stone-300 border-b-transparent shadow-xs'
                  : 'bg-[#ddcfb8] text-stone-700 hover:bg-[#d4c3a7] border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Pre-Sets</span>
            </button>
          </div>
        </div>

        {/* Secondary Toolbar: Filters & Search */}
        <div className="bg-[#f6efe6] border-b border-stone-300 p-3 space-y-2.5 shrink-0">
          {/* Species Specific Sub-Filters */}
          {mainTab === 'species' && (
            <div className="space-y-2">
              {/* Setting Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {SPECIES_SETTING_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSpeciesSetting(tab.id);
                      setSelectedSpecies('all');
                    }}
                    className={`px-2.5 py-0.8 rounded text-xs font-bold transition-all ${
                      speciesSetting === tab.id
                        ? 'bg-[#1f4e78] text-white shadow-2xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Species Selector Dropdown + Trait Type Filter + Bulk Add */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-bold text-stone-700">Species:</span>
                    <select
                      value={selectedSpecies}
                      onChange={(e) => setSelectedSpecies(e.target.value)}
                      className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#1f4e78]"
                    >
                      <option value="all">All Species ({availableSpecies.length})</option>
                      {availableSpecies.map((sp) => (
                        <option key={sp.name} value={sp.name}>
                          {sp.name} ({sp.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-bold text-stone-700">Type:</span>
                    <select
                      value={speciesTraitType}
                      onChange={(e) => setSpeciesTraitType(e.target.value as any)}
                      className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#1f4e78]"
                    >
                      <option value="all">All (Base &amp; Lineages)</option>
                      <option value="base">Base Traits Only</option>
                      <option value="lineage">Lineages &amp; Sub-Options Only</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Add Button for Selected Species */}
                {selectedSpecies !== 'all' && selectedSpeciesBaseTraits.length > 0 && (
                  <div>
                    {selectedSpeciesUnaddedBaseTraits.length > 0 ? (
                      <button
                        type="button"
                        onClick={handleBulkAddSpecies}
                        className="flex items-center gap-1.5 bg-[#1f4e78] hover:bg-[#163857] text-white px-3 py-1 rounded text-xs font-bold shadow-2xs transition-colors"
                        title={`Add all ${selectedSpeciesUnaddedBaseTraits.length} base traits for ${selectedSpecies}`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>+ Add Base {selectedSpecies} Traits ({selectedSpeciesUnaddedBaseTraits.length})</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>All Base {selectedSpecies} Traits Added</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feats Specific Sub-Filters */}
          {mainTab === 'feats' && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {FEAT_CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFeatCategory(tab.id)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      featCategory === tab.id
                        ? 'bg-[#1f4e78] text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1.5 text-xs text-stone-700 font-semibold cursor-pointer select-none bg-white border border-stone-300 rounded px-2.5 py-1">
                <input
                  type="checkbox"
                  checked={phbOnlyFeats}
                  onChange={(e) => setPhbOnlyFeats(e.target.checked)}
                  className="rounded border-stone-300 text-[#1f4e78]"
                />
                <span>Common / PHB 2024 Only</span>
              </label>
            </div>
          )}

          {/* Instant Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                mainTab === 'species'
                  ? 'Search species traits (e.g. "Darkvision", "Elf", "Trance", "Goliath", "Breath Weapon")...'
                  : mainTab === 'feats'
                  ? 'Search feats by name, prerequisite, or rules...'
                  : 'Search all species traits and feats...'
              }
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:border-[#1f4e78] focus:ring-1 focus:ring-[#1f4e78]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-stone-200">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-1">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-bold text-sm">No pre-set abilities found matching your criteria.</p>
              <p className="text-xs text-stone-400">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isAdded = existingFeatureNames.has(item.name.toLowerCase().trim());
              const isExpanded = expandedIds.has(item.id);

              return (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5 group">
                  {/* Top Line: Title, Badges, Add Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="font-bold text-stone-900 text-xs sm:text-sm hover:text-[#1f4e78] text-left flex items-center gap-1"
                        >
                          <span>{item.name}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                          )}
                        </button>

                        {/* Kind & Category Badge */}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCategoryBadgeStyle(
                            item.category
                          )}`}
                        >
                          {item.kind === 'species' ? `${item.category} Species` : item.category.replace(' Feats', '')}
                        </span>

                        {/* Lineage or Base Trait tag */}
                        {item.traitType && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${
                              item.isLineage
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {item.traitType}
                          </span>
                        )}

                        {item.subCategory && item.subCategory !== 'Common' && (
                          <span className="text-[9px] bg-stone-100 text-stone-600 border border-stone-300 px-1.5 py-0.5 rounded">
                            {item.subCategory}
                          </span>
                        )}

                        {item.prerequisite && (
                          <span className="text-[10px] text-stone-500 font-medium italic">
                            Prereq: {item.prerequisite}
                          </span>
                        )}
                      </div>

                      {/* Tactical Brief */}
                      <p className="text-[11px] text-stone-700 leading-snug mt-1">
                        {item.brief}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 pt-0.5">
                      {isAdded ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded shadow-2xs">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Added</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddItem(item)}
                          className="flex items-center gap-1 bg-[#1f4e78] hover:bg-[#163857] text-white px-3 py-1 rounded text-xs font-bold transition-colors shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Full Rules Text */}
                  {isExpanded && (
                    <div className="mt-1.5 p-2.5 bg-stone-50 border border-stone-300 rounded text-xs space-y-1.5 animate-fadeIn">
                      <div className="flex justify-between items-center text-[10px] text-stone-500 border-b border-stone-200 pb-1">
                        <span className="font-bold uppercase tracking-wider">Official Rules Text</span>
                        <span>Source: {item.source || "Player's Handbook"}</span>
                      </div>
                      <p className="text-[11px] text-stone-800 leading-relaxed whitespace-pre-line font-serif">
                        {item.fullText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f6efe6] border-t border-stone-300 p-2.5 px-4 flex justify-between items-center text-xs text-stone-600 shrink-0">
          <span>
            Showing <strong className="text-stone-900">{filteredItems.length}</strong> pre-sets (Click any item to view full rules)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
