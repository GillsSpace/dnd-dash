import React, { useState, useMemo } from 'react';
import {
  DND2024_REFERENCE_DATA,
  ReferenceItem,
} from '../../data/dnd2024ReferenceData';
import {
  Search,
  X,
  Swords,
  Zap,
  Shield,
  Footprints,
  AlertCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { DiceRollerSection } from './DiceRollerSection';

type CategoryKey = 'action' | 'bonus' | 'reaction' | 'movement' | 'condition' | 'environment';
type CategoryFilter = 'all' | CategoryKey;

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  subtitle: string;
  column: 1 | 2;
  icon: React.FC<{ className?: string }>;
}

const CATEGORIES: { key: CategoryFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'all', label: 'All', icon: Sparkles },
  { key: 'action', label: 'Actions', icon: Swords },
  { key: 'bonus', label: 'Bonus Actions', icon: Zap },
  { key: 'reaction', label: 'Reactions', icon: Shield },
  { key: 'movement', label: 'Movement', icon: Footprints },
  { key: 'condition', label: 'Conditions', icon: AlertCircle },
  { key: 'environment', label: 'Environment & Rest', icon: BookOpen },
];

const CATEGORY_SECTIONS: CategoryConfig[] = [
  { key: 'action', label: 'Actions', subtitle: '1 / Turn', column: 1, icon: Swords },
  { key: 'bonus', label: 'Bonus Actions', subtitle: '1 / Turn', column: 1, icon: Zap },
  { key: 'reaction', label: 'Reactions', subtitle: '1 / Round', column: 1, icon: Shield },
  { key: 'movement', label: 'Movement & Travel', subtitle: 'Speed & Terrain', column: 1, icon: Footprints },
  { key: 'condition', label: 'Conditions', subtitle: 'Status Effects', column: 2, icon: AlertCircle },
  { key: 'environment', label: 'Environment & Rest', subtitle: 'Cover, Vision & Rests', column: 2, icon: BookOpen },
];

export const ReferenceView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [only2024Updates, setOnly2024Updates] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Filtered list
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return DND2024_REFERENCE_DATA.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (only2024Updates && !item.is2024Updated) {
        return false;
      }
      if (q) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const subMatch = item.subtitle.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const refMatch = item.reference.toLowerCase().includes(q);
        const bulletMatch = item.bullets.some((b) => b.toLowerCase().includes(q));
        if (!titleMatch && !subMatch && !descMatch && !refMatch && !bulletMatch) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery, only2024Updates]);

  // Dynamic counts for category tabs based on search and 2024 filter
  const counts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const map: Record<string, number> = { all: 0 };
    CATEGORIES.forEach((c) => {
      map[c.key] = 0;
    });

    DND2024_REFERENCE_DATA.forEach((item) => {
      if (only2024Updates && !item.is2024Updated) return;
      if (q) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const subMatch = item.subtitle.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const refMatch = item.reference.toLowerCase().includes(q);
        const bulletMatch = item.bullets.some((b) => b.toLowerCase().includes(q));
        if (!titleMatch && !subMatch && !descMatch && !refMatch && !bulletMatch) return;
      }
      map.all += 1;
      map[item.category] = (map[item.category] || 0) + 1;
    });

    return map;
  }, [searchQuery, only2024Updates]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(filteredItems.map((item) => item.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // Group filtered items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<CategoryKey, ReferenceItem[]> = {
      action: [],
      bonus: [],
      reaction: [],
      movement: [],
      condition: [],
      environment: [],
    };
    filteredItems.forEach((item) => {
      grouped[item.category]?.push(item);
    });
    return grouped;
  }, [filteredItems]);

  const renderItemRow = (item: ReferenceItem) => {
    const isExpanded = expandedIds.has(item.id);

    return (
      <div
        key={item.id}
        className="border-b border-stone-200 last:border-b-0 transition-colors"
      >
        <button
          type="button"
          onClick={() => toggleExpand(item.id)}
          className={`w-full text-left py-1.5 px-3 flex items-center justify-between group transition-colors select-none ${
            isExpanded
              ? 'bg-amber-100/40 text-stone-900 font-medium'
              : 'hover:bg-stone-50 text-stone-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <ChevronRight
              className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 shrink-0 transition-transform duration-150 ${
                isExpanded ? 'rotate-90 text-[#1f4e78]' : ''
              }`}
            />
            <span className="font-bold text-xs text-stone-900 group-hover:text-[#1f4e78] transition-colors whitespace-nowrap">
              {item.title}
            </span>
            {item.is2024Updated && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#d9ead3] text-[#276749] border border-[#b2d5ab] shrink-0"
                title="Updated in official 2024 rules revision"
              >
                2024
              </span>
            )}
            <span className="text-[11px] text-stone-500 italic truncate hidden sm:inline">
              — {item.subtitle}
            </span>
          </div>

          <span className="text-[10px] text-stone-400 font-mono shrink-0 hidden md:inline">
            {item.reference.split(',')[0]}
          </span>
        </button>

        {isExpanded && (
          <div className="px-4 py-2.5 bg-[#faf6f0] border-t border-stone-200 space-y-2 text-xs">
            <p className="text-stone-700 leading-relaxed font-sans">
              {item.description}
            </p>

            {item.bullets && item.bullets.length > 0 && (
              <div className="space-y-1 pt-1.5 border-t border-stone-200/80">
                {item.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-stone-800 leading-snug">
                    <span className="font-bold text-[#1f4e78] text-xs leading-none mt-1 shrink-0">
                      •
                    </span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-1.5 border-t border-stone-200 text-[10px] text-stone-400 font-mono italic flex items-center justify-between">
              <span className="font-semibold text-stone-500">RULE REFERENCE:</span>
              <span>{item.reference}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSectionBox = (sec: CategoryConfig, items: ReferenceItem[], isFullWidth = false) => {
    if (items.length === 0) return null;
    const Icon = sec.icon;

    // In single category mode on desktop, split items into 2 columns if more than 6 items
    const splitInTwo = isFullWidth && items.length > 6;
    const mid = Math.ceil(items.length / 2);
    const colA = splitInTwo ? items.slice(0, mid) : items;
    const colB = splitInTwo ? items.slice(mid) : [];

    return (
      <div
        key={sec.key}
        className="border border-stone-400 bg-white shadow-xs overflow-hidden"
      >
        <div className="bg-[#1f4e78] text-white font-bold py-1 px-3 text-xs uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-amber-300" />
            <span>{sec.label}</span>
            {sec.subtitle && (
              <span className="text-[10px] text-stone-300 font-normal lowercase tracking-normal">
                ({sec.subtitle})
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-200 font-mono">
            {items.length} {items.length === 1 ? 'rule' : 'rules'}
          </span>
        </div>

        {splitInTwo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
            <div className="divide-y divide-stone-200">
              {colA.map(renderItemRow)}
            </div>
            <div className="divide-y divide-stone-200">
              {colB.map(renderItemRow)}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {items.map(renderItemRow)}
          </div>
        )}
      </div>
    );
  };

  // Visible sections list based on active category
  const activeSections = CATEGORY_SECTIONS.filter(
    (sec) => activeCategory === 'all' || sec.key === activeCategory
  );

  const col1Sections = activeSections.filter((s) => s.column === 1);
  const col2Sections = activeSections.filter((s) => s.column === 2);
  const totalVisibleCount = filteredItems.length;

  return (
    <div className="space-y-4 font-sans text-stone-900">
      {/* 1. Deep Crimson Section Header matching other pages */}
      <div className="bg-[#7b1113] text-white font-bold py-1.5 px-4 tracking-wider text-xs uppercase shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>RULES & COMBAT QUICK REFERENCE</span>
        </div>
        <span className="text-[11px] text-amber-200 font-normal">
          D&D 5.5e (2024 Player&apos;s Handbook & Rules Glossary)
        </span>
      </div>

      {/* Collapsible Quick Dice Roller Section */}
      <DiceRollerSection />

      {/* 2. Minimalist Parchment Control Box */}
      <div className="bg-[#f6efe6] p-2.5 sm:p-3 border border-stone-300 space-y-2 text-xs">
        {/* Search Bar & Action Toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules, actions, conditions, grapple, cover..."
              className="w-full bg-white text-stone-900 text-xs pl-8 pr-7 py-1 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1f4e78] focus:border-[#1f4e78] placeholder:text-stone-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Filters & Bulk Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-1.5 text-xs text-stone-700 bg-white px-2.5 py-1 rounded border border-stone-300 hover:border-stone-400 cursor-pointer select-none shadow-2xs">
              <input
                type="checkbox"
                checked={only2024Updates}
                onChange={(e) => setOnly2024Updates(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 cursor-pointer"
              />
              <span className="font-semibold text-[#276749] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#276749]" />
                2024 Revisions Only
              </span>
            </label>

            <button
              type="button"
              onClick={handleExpandAll}
              className="text-xs bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-2 py-1 rounded font-medium shadow-2xs transition-colors"
              title="Expand all visible rules"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="text-xs bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-2 py-1 rounded font-medium shadow-2xs transition-colors"
              title="Collapse all visible rules"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Minimalist Category Segmented Navigation Bar */}
        <div className="bg-stone-200/90 p-0.5 rounded border border-stone-300 flex flex-wrap gap-0.5 text-xs">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = counts[cat.key] ?? 0;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1f4e78] text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded-sm ${
                    isActive ? 'bg-white/20 text-white' : 'text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Condensed Categorized Rules Layout */}
      {totalVisibleCount === 0 ? (
        <div className="bg-white border border-stone-300 p-8 text-center text-stone-500 space-y-2 shadow-xs">
          <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
          <p className="font-bold text-sm text-stone-700">No matching rules found</p>
          <p className="text-xs text-stone-500">
            No entries match your current search query or filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setOnly2024Updates(false);
            }}
            className="mt-2 text-xs bg-[#1f4e78] hover:bg-[#163857] text-white px-3 py-1 rounded font-bold shadow-2xs transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : activeCategory !== 'all' ? (
        /* Single Category View (Full Width with internal 2-column split if > 6 items) */
        <div className="space-y-3">
          {activeSections.map((sec) =>
            renderSectionBox(sec, itemsByCategory[sec.key], true)
          )}
        </div>
      ) : (
        /* All Categories 2-Column Responsive Layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
          {/* Column 1: Actions, Bonus Actions, Reactions, Movement */}
          <div className="space-y-3.5">
            {col1Sections.map((sec) =>
              renderSectionBox(sec, itemsByCategory[sec.key])
            )}
          </div>

          {/* Column 2: Conditions, Environment & Rest */}
          <div className="space-y-3.5">
            {col2Sections.map((sec) =>
              renderSectionBox(sec, itemsByCategory[sec.key])
            )}
          </div>
        </div>
      )}
    </div>
  );
};
