import React, { useState, useEffect } from 'react';
import { X, Check, Zap, FileText, RotateCcw } from 'lucide-react';

interface SkillAdvantageModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillKey: string;
  skillLabel: string;
  initialAdv: boolean;
  initialNote: string;
  onSave: (skillKey: string, adv: boolean, note: string) => void;
}

export const SkillAdvantageModal: React.FC<SkillAdvantageModalProps> = ({
  isOpen,
  onClose,
  skillKey,
  skillLabel,
  initialAdv,
  initialNote,
  onSave,
}) => {
  const [adv, setAdv] = useState(initialAdv);
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (isOpen) {
      setAdv(initialAdv);
      setNote(initialNote || '');
    }
  }, [isOpen, initialAdv, initialNote]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(skillKey, adv, note.trim());
    onClose();
  };

  const handleReset = () => {
    setAdv(false);
    setNote('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#faf6f0] border-2 border-stone-400 rounded shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div className="bg-[#1f4e78] text-white px-3.5 py-2 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-300" />
            <h2 className="font-fantasy font-bold tracking-wide text-xs">
              SKILL ADVANTAGE &amp; NOTE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-3.5 space-y-3 text-xs">
          {/* Skill Title Banner */}
          <div className="bg-stone-100 border border-stone-300 rounded px-2.5 py-1.5 flex items-center justify-between">
            <span className="font-bold text-stone-900">{skillLabel}</span>
            <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">
              {skillKey}
            </span>
          </div>

          {/* Advantage Toggle */}
          <label className="flex items-center justify-between p-2 rounded border border-stone-300 bg-white cursor-pointer hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${adv ? 'text-amber-600' : 'text-stone-400'}`} />
              <div>
                <span className="font-bold text-stone-800 block text-xs">Advantage Active</span>
                <span className="text-[10px] text-stone-500 block">
                  Roll 2d20 and take the higher roll
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={adv}
              onChange={(e) => setAdv(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-[#1f4e78] focus:ring-1 focus:ring-[#1f4e78] cursor-pointer"
            />
          </label>

          {/* Note Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="skill-adv-note" className="font-bold text-stone-800 text-[11px] flex items-center gap-1">
                <FileText className="w-3 h-3 text-stone-500" />
                <span>Advantage Reason / Tactical Rule</span>
              </label>
              {note && (
                <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                  Tooltip Active
                </span>
              )}
            </div>
            <textarea
              id="skill-adv-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Keen Hearing/Smell grants Advantage, or 2024 Rule: Proficiency in Thieves' Tools grants Advantage on this check."
              className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1f4e78] resize-none"
            />
            <p className="text-[10px] text-stone-500 leading-snug">
              When saved, this note appears as a hover tooltip on the Adv column cell.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded font-semibold text-xs transition-colors"
              title="Reset advantage and note"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#1f4e78] hover:bg-[#163a5a] text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
