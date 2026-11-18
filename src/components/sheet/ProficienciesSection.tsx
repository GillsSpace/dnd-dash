import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Edit3 } from 'lucide-react';

export const ProficienciesSection: React.FC = () => {
  const { character, updateCharacter } = useCharacter();

  const [languagesText, setLanguagesText] = useState(character.languages.join(', '));
  const [toolsText, setToolsText] = useState(character.proficiencies.tools.join(', '));

  // Keep in sync with character data changes
  useEffect(() => {
    setLanguagesText(character.languages.join(', '));
  }, [character.languages]);

  useEffect(() => {
    setToolsText(character.proficiencies.tools.join(', '));
  }, [character.proficiencies.tools]);

  const handleSaveLanguages = () => {
    const arr = languagesText
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    updateCharacter((prev) => ({
      ...prev,
      languages: arr,
    }));
  };

  const handleSaveTools = () => {
    const arr = toolsText
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    updateCharacter((prev) => ({
      ...prev,
      proficiencies: {
        ...prev.proficiencies,
        tools: arr,
      },
    }));
  };

  const ARMOR_OPTIONS = [
    { key: 'light', label: 'Light Armor' },
    { key: 'medium', label: 'Medium Armor' },
    { key: 'heavy', label: 'Heavy Armor' },
    { key: 'shield', label: 'Shields' },
  ];

  const WEAPON_OPTIONS = [
    { key: 'simple', label: 'Simple Weapons' },
    { key: 'martial', label: 'Martial Weapons' },
    { key: 'firearm', label: 'Firearms' },
  ];

  return (
    <div className="space-y-1 font-sans text-stone-900">
      {/* Banner */}
      <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-xs uppercase shadow-sm">
        PROFICIENCIES / LANGUAGES
      </div>

      <div className="bg-[#f6efe6] p-2 border border-stone-300 grid grid-cols-12 gap-2 text-xs">
        {/* 1. Languages */}
        <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-stone-300 pb-0.5 mb-1">
            <span className="font-bold text-[#1f4e78] text-[11px] block">
              Languages
            </span>
            <Edit3 className="w-3 h-3 text-stone-400" />
          </div>
          <textarea
            rows={3}
            placeholder="e.g. Common, Elvish, Thieves' Cant"
            value={languagesText}
            onChange={(e) => setLanguagesText(e.target.value)}
            onBlur={handleSaveLanguages}
            className="w-full text-stone-800 text-[11px] bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#1f4e78] rounded p-1 resize-y focus:outline-none leading-relaxed transition-colors flex-1"
          />
        </div>

        {/* 2. Armor Training Checkboxes */}
        <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white p-2 flex flex-col">
          <div className="border-b border-stone-300 pb-0.5 mb-1.5">
            <span className="font-bold text-[#1f4e78] text-[11px] block">
              Armor Training
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-stone-800 py-0.5">
            {ARMOR_OPTIONS.map(({ key, label }) => {
              const checked = (character.proficiencies.armor || [])
                .map((s) => s.toLowerCase())
                .some((item) => item.includes(key.toLowerCase()));

              return (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#1f4e78] select-none font-medium"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      updateCharacter((prev) => {
                        const list = prev.proficiencies.armor || [];
                        const isCurrentlyChecked = list
                          .map((s) => s.toLowerCase())
                          .some((item) => item.includes(key.toLowerCase()));

                        let updated: string[];
                        if (isCurrentlyChecked) {
                          updated = list
                            .flatMap((item) => item.split(/(?:and|,)+/).map((s) => s.trim()))
                            .filter((item) => {
                              if (!item) return false;
                              return !item.toLowerCase().includes(key.toLowerCase());
                            });
                        } else {
                          updated = [...list, label];
                        }

                        return {
                          ...prev,
                          proficiencies: {
                            ...prev.proficiencies,
                            armor: Array.from(new Set(updated.filter(Boolean))),
                          },
                        };
                      });
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Weapon Training Checkboxes */}
        <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white p-2 flex flex-col">
          <div className="border-b border-stone-300 pb-0.5 mb-1.5">
            <span className="font-bold text-[#1f4e78] text-[11px] block">
              Weapon Training
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-stone-800 py-0.5">
            {WEAPON_OPTIONS.map(({ key, label }) => {
              const checked = (character.proficiencies.weapons || [])
                .map((s) => s.toLowerCase())
                .some((item) => item.includes(key.toLowerCase()));

              return (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#1f4e78] select-none font-medium"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      updateCharacter((prev) => {
                        const list = prev.proficiencies.weapons || [];
                        const isCurrentlyChecked = list
                          .map((s) => s.toLowerCase())
                          .some((item) => item.includes(key.toLowerCase()));

                        let updated: string[];
                        if (isCurrentlyChecked) {
                          updated = list
                            .flatMap((item) => item.split(/(?:and|,)+/).map((s) => s.trim()))
                            .filter((item) => {
                              if (!item) return false;
                              return !item.toLowerCase().includes(key.toLowerCase());
                            });
                        } else {
                          updated = [...list, label];
                        }

                        return {
                          ...prev,
                          proficiencies: {
                            ...prev.proficiencies,
                            weapons: Array.from(new Set(updated.filter(Boolean))),
                          },
                        };
                      });
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. Tools & Other */}
        <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white p-2 flex flex-col">
          <div className="flex items-center justify-between border-b border-stone-300 pb-0.5 mb-1">
            <span className="font-bold text-[#1f4e78] text-[11px] block">
              Tools &amp; Other
            </span>
            <Edit3 className="w-3 h-3 text-stone-400" />
          </div>
          <textarea
            rows={3}
            placeholder="e.g. Herbalism Kit, Thieves' Tools, Flute"
            value={toolsText}
            onChange={(e) => setToolsText(e.target.value)}
            onBlur={handleSaveTools}
            className="w-full text-stone-800 text-[11px] bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#1f4e78] rounded p-1 resize-y focus:outline-none leading-relaxed transition-colors flex-1"
          />
        </div>
      </div>
    </div>
  );
};
