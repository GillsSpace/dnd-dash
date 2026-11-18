import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Edit3 } from 'lucide-react';

const STANDARD_ACTIONS = [
  {
    name: 'Dash',
    desc: 'Double your movement speed for the turn.',
  },
  {
    name: 'Disarm',
    desc: 'Contested Athletics/Acrobatics check to knock weapon or item from target\'s grasp.',
  },
  {
    name: 'Disengage',
    desc: 'Your movement doesn’t provoke opportunity attacks for the rest of the turn.',
  },
  {
    name: 'Dodge',
    desc: 'Until your next turn, attacks against you have disadvantage if you can see the attacker, and you have advantage on Dexterity saves.',
  },
  {
    name: 'Grapple',
    desc: 'Athletics check contested by target’s Athletics or Acrobatics check. On success, target is grappled (0 speed).',
  },
  {
    name: 'Help',
    desc: 'Aided creature gains advantage on next ability check, or first attack roll against adjacent target.',
  },
  {
    name: 'Hide',
    desc: 'Make a Stealth check in an attempt to hide from enemies.',
  },
  {
    name: 'Shove',
    desc: 'Contested Athletics check to knock target prone or push it 5 feet away.',
  },
];

export const ActionsSection: React.FC = () => {
  const { character, updateCharacter } = useCharacter();

  const [languagesText, setLanguagesText] = useState(character.languages.join(', '));
  const [armorText, setArmorText] = useState(character.proficiencies.armor.join(', '));
  const [weaponsText, setWeaponsText] = useState(character.proficiencies.weapons.join(', '));
  const [toolsText, setToolsText] = useState(character.proficiencies.tools.join(', '));

  // Keep in sync with character data changes (e.g. JSON load or reset)
  useEffect(() => {
    setLanguagesText(character.languages.join(', '));
  }, [character.languages]);

  useEffect(() => {
    setArmorText(character.proficiencies.armor.join(', '));
  }, [character.proficiencies.armor]);

  useEffect(() => {
    setWeaponsText(character.proficiencies.weapons.join(', '));
  }, [character.proficiencies.weapons]);

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

  const handleSaveProf = (field: 'armor' | 'weapons' | 'tools', text: string) => {
    const arr = text
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    updateCharacter((prev) => ({
      ...prev,
      proficiencies: {
        ...prev.proficiencies,
        [field]: arr,
      },
    }));
  };

  return (
    <div className="space-y-4 font-sans text-stone-900">
      {/* Proficiencies and Languages */}
      <div className="space-y-1">
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

          {/* 2. Armor */}
          <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white p-2 flex flex-col justify-between">
            <div className="border-b border-stone-300 pb-0.5 mb-1.5">
              <span className="font-bold text-[#1f4e78] text-[11px] block">
                Armor
              </span>
            </div>
            <div className="space-y-1.5 py-0.5 text-[11px] text-stone-800 flex-1 flex flex-col justify-center">
              {[
                { key: 'Light', label: 'Light Armor' },
                { key: 'Medium', label: 'Medium Armor' },
                { key: 'Heavy', label: 'Heavy Armor' },
                { key: 'Shields', label: 'Shields' },
              ].map(({ key, label }) => {
                const checked = (character.proficiencies.armor || [])
                  .map((s) => s.toLowerCase())
                  .some((item) =>
                    key === 'Shields' ? item.includes('shield') : item.includes(key.toLowerCase())
                  );

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
                            .some((item) =>
                              key === 'Shields' ? item.includes('shield') : item.includes(key.toLowerCase())
                            );

                          let updated: string[];
                          if (isCurrentlyChecked) {
                            updated = list
                              .flatMap((item) => item.split(/(?:and|,)+/).map((s) => s.trim()))
                              .filter((item) => {
                                if (!item) return false;
                                return key === 'Shields'
                                  ? !item.toLowerCase().includes('shield')
                                  : !item.toLowerCase().includes(key.toLowerCase());
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

          {/* 3. Weapons */}
          <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white p-2 flex flex-col justify-between">
            <div className="border-b border-stone-300 pb-0.5 mb-1.5">
              <span className="font-bold text-[#1f4e78] text-[11px] block">
                Weapons
              </span>
            </div>
            <div className="space-y-1.5 py-0.5 text-[11px] text-stone-800 flex-1 flex flex-col justify-center">
              {[
                { key: 'Simple', label: 'Simple Weapons' },
                { key: 'Martial', label: 'Martial Weapons' },
                { key: 'Firearms', label: 'Firearms' },
              ].map(({ key, label }) => {
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
          <div className="col-span-12 sm:col-span-3 border border-stone-400 bg-white p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-stone-300 pb-0.5 mb-1">
              <span className="font-bold text-[#1f4e78] text-[11px] block">
                Tools & Other
              </span>
              <Edit3 className="w-3 h-3 text-stone-400" />
            </div>
            <textarea
              rows={3}
              placeholder="e.g. Herbalism Kit, Thieves' Tools, Flute"
              value={toolsText}
              onChange={(e) => setToolsText(e.target.value)}
              onBlur={() => handleSaveProf('tools', toolsText)}
              className="w-full text-stone-800 text-[11px] bg-stone-50/50 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-[#1f4e78] rounded p-1 resize-y focus:outline-none leading-relaxed transition-colors flex-1"
            />
          </div>
        </div>
      </div>

      {/* Actions Reference (Static, no hover color change / animation) */}
      <div className="space-y-1">
        <div className="bg-[#7b1113] text-white font-bold text-center py-1 tracking-wider text-xs uppercase shadow-sm">
          ACTIONS REFERENCE
        </div>

        <div className="bg-[#f6efe6] p-2 border border-stone-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {STANDARD_ACTIONS.map((act) => (
            <div key={act.name} className="border border-stone-400 bg-white p-2">
              <span className="font-bold text-stone-900 text-xs block text-[#1f4e78] border-b border-stone-200 pb-0.5">
                {act.name}
              </span>
              <p className="text-[11px] text-stone-700 mt-1 leading-snug">
                {act.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
