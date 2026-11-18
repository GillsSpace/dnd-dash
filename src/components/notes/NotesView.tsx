import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, StickyNote } from 'lucide-react';

export const NotesView: React.FC = () => {
  const { character, addNote, updateNote, deleteNote, toggleNoteCollapse } = useCharacter();

  const notes = character.notes || [];

  return (
    <div className="space-y-4 font-sans text-stone-900">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-[#7b1113]" />
          <h2 className="font-fantasy font-bold text-stone-800 text-sm tracking-wide">
            CAMPAIGN &amp; CHARACTER NOTES
          </h2>
          <span className="text-[11px] font-semibold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full">
            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => addNote(`Note ${notes.length + 1}`, '')}
          className="flex items-center gap-1.5 bg-[#7b1113] hover:bg-[#630e10] text-white px-3 py-1 rounded text-xs font-bold transition-colors shadow-xs"
          title="Create a new note section"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Note</span>
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="border border-dashed border-stone-300 bg-stone-50/60 rounded-lg p-8 text-center space-y-3">
          <FileText className="w-8 h-8 text-stone-400 mx-auto" />
          <div className="space-y-1">
            <p className="font-bold text-stone-700 text-sm">No notes created yet</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Keep track of campaign quests, NPC contacts, session logs, secrets, and inventory clues.
            </p>
          </div>
          <button
            type="button"
            onClick={() => addNote('Session Log', '')}
            className="inline-flex items-center gap-1.5 bg-[#1f4e78] hover:bg-[#163857] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="space-y-1">
              {/* Section Header Banner */}
              <div className="bg-[#7b1113] text-white font-bold py-1 px-3 text-xs uppercase shadow-sm flex items-center justify-between gap-2">
                {/* Note Title Input (Where the section name is) */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <FileText className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <input
                    type="text"
                    value={note.title}
                    onChange={(e) => updateNote(note.id, { title: e.target.value })}
                    placeholder="Note Title..."
                    className="bg-transparent text-white font-bold tracking-wider text-xs uppercase w-full focus:outline-none focus:bg-white/20 rounded px-1.5 py-0.5 border border-transparent hover:border-white/30 focus:border-white/60 transition-colors placeholder:text-white/60"
                  />
                </div>

                {/* Right Header Controls: Collapse Arrow + Delete Button */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleNoteCollapse(note.id)}
                    className="p-1 rounded hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                    title={note.collapsed ? 'Expand note' : 'Collapse note'}
                  >
                    {note.collapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${note.title || 'Untitled Note'}"?`)) {
                        deleteNote(note.id);
                      }
                    }}
                    className="p-1 rounded hover:bg-red-900/80 text-white/80 hover:text-white transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Section Body */}
              {!note.collapsed && (
                <div className="bg-[#f6efe6] p-2.5 border border-stone-300 shadow-2xs">
                  <textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                    placeholder="Type note contents here... (e.g. quests, NPCs, clues, session logs)"
                    rows={7}
                    className="w-full bg-white border border-stone-300 rounded p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#1f4e78] resize-y font-sans leading-relaxed shadow-inner"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
