import React from 'react';
import { X, Printer, FileText, Check, Palette, Sparkles } from 'lucide-react';
import { PrintSettings } from '../../types/character';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrintSettings;
  onUpdateSettings: (settings: PrintSettings) => void;
  onExecutePrint: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExecutePrint,
}) => {
  if (!isOpen) return null;

  const handlePrintClick = () => {
    onExecutePrint();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-[#1f4e78] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-xs uppercase">
              PRINT &amp; PDF EXPORT SETUP
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 text-xs font-sans text-stone-900">
          {/* Paper Size Selection */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#1f4e78] uppercase text-[11px] block">
              1. Paper Format
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, paperSize: 'letter' })}
                className={`p-2.5 rounded border text-left flex flex-col justify-between transition-all ${
                  settings.paperSize === 'letter'
                    ? 'bg-blue-50/80 border-[#1f4e78] shadow-2xs'
                    : 'bg-white border-stone-300 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">US Letter</span>
                  {settings.paperSize === 'letter' && (
                    <Check className="w-3.5 h-3.5 text-[#1f4e78]" />
                  )}
                </div>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5">
                  8.5 × 11 in (216 × 279 mm)
                </span>
                <span className="text-[9px] text-stone-400 mt-1">Standard Americas format</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, paperSize: 'a4' })}
                className={`p-2.5 rounded border text-left flex flex-col justify-between transition-all ${
                  settings.paperSize === 'a4'
                    ? 'bg-blue-50/80 border-[#1f4e78] shadow-2xs'
                    : 'bg-white border-stone-300 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">International A4</span>
                  {settings.paperSize === 'a4' && (
                    <Check className="w-3.5 h-3.5 text-[#1f4e78]" />
                  )}
                </div>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5">
                  210 × 297 mm (8.27 × 11.69 in)
                </span>
                <span className="text-[9px] text-stone-400 mt-1">Standard International format</span>
              </button>
            </div>
          </div>

          {/* Scope Selection */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#1f4e78] uppercase text-[11px] block">
              2. Print Scope
            </span>
            <div className="grid grid-cols-1 gap-1.5 bg-white border border-stone-300 p-2 rounded">
              {[
                { id: 'all', title: 'Complete Character Sheet', desc: 'Front sheet, Spells (if prepared), Equipment & Notes' },
                { id: 'front', title: 'Front Sheet Only', desc: 'Combat vitals, abilities, skills, attacks & traits' },
                { id: 'spells', title: 'Spells & Spellbook Only', desc: 'Casting stats, slot matrix & tactical spell briefs' },
                { id: 'back', title: 'Equipment & Lore Only', desc: 'Wealth, coin weights, inventory items & backstory' },
                { id: 'notes', title: 'Campaign Notes Only', desc: 'Session notes, quest logs & journal entries' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                    settings.scope === item.id ? 'bg-[#eaf2fd]' : 'hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="printScope"
                    checked={settings.scope === item.id}
                    onChange={() => onUpdateSettings({ ...settings, scope: item.id as any })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block text-xs">{item.title}</span>
                    <span className="text-[10px] text-stone-500 block leading-tight">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Color Mode Selection */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#1f4e78] uppercase text-[11px] block">
              3. Color &amp; Toner Style
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, colorMode: 'color' })}
                className={`p-2 rounded border text-left flex items-center justify-between transition-all ${
                  settings.colorMode === 'color'
                    ? 'bg-amber-50/80 border-[#7b1113] shadow-2xs'
                    : 'bg-white border-stone-300 hover:border-stone-400'
                }`}
              >
                <div>
                  <span className="font-bold text-stone-900 block">Full Color Parchment</span>
                  <span className="text-[10px] text-stone-500">Rich tabletop fantasy look</span>
                </div>
                {settings.colorMode === 'color' && <Check className="w-3.5 h-3.5 text-[#7b1113]" />}
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, colorMode: 'inkSaver' })}
                className={`p-2 rounded border text-left flex items-center justify-between transition-all ${
                  settings.colorMode === 'inkSaver'
                    ? 'bg-stone-100 border-stone-800 shadow-2xs'
                    : 'bg-white border-stone-300 hover:border-stone-400'
                }`}
              >
                <div>
                  <span className="font-bold text-stone-900 block">Ink-Saver Monochrome</span>
                  <span className="text-[10px] text-stone-500">Minimal toner &amp; clean print</span>
                </div>
                {settings.colorMode === 'inkSaver' && <Check className="w-3.5 h-3.5 text-stone-900" />}
              </button>
            </div>
          </div>

          {/* Helpful Print Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[10px] text-amber-900 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Tip:</strong> In your browser&apos;s print preview dialog, ensure <em>&quot;Background graphics&quot;</em> is turned ON if you wish to print colored banners and parchment tones.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[#ede6db] border-t border-stone-300 px-4 py-2.5 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-stone-400 bg-white text-stone-700 font-bold hover:bg-stone-100 text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrintClick}
            className="px-4 py-1.5 rounded bg-[#1f4e78] hover:bg-[#163857] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
