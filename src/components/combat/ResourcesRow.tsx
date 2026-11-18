import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Sparkles, Target, Flame } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

export const ResourcesRow: React.FC = () => {
  const { character, adjustResource } = useCharacter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {character.resources.map((res) => {
        const isExhausted = res.current <= 0;

        return (
          <Tooltip
            key={res.id}
            content={
              <div className="space-y-1 text-left w-52">
                <p className="font-fantasy font-bold text-amber-300">{res.name}</p>
                <p className="text-[11px] text-slate-300">{res.desc}</p>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                  <span>Resets On:</span>
                  <span className="text-amber-400 font-medium">{res.reset}</span>
                </div>
              </div>
            }
          >
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 flex items-center justify-between shadow hover:border-amber-600/40 transition-colors w-full">
              <div>
                <span className="font-fantasy font-semibold text-xs text-slate-200 block">
                  {res.name}
                </span>
                <span className="text-[10px] text-slate-400">{res.reset}</span>
              </div>

              {/* Pip Counter */}
              <div className="flex items-center gap-1.5">
                {res.max > 0 ? (
                  Array.from({ length: res.max }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (i < res.current) {
                          adjustResource(res.id, -1);
                        } else {
                          adjustResource(res.id, 1);
                        }
                      }}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        i < res.current
                          ? 'bg-amber-500 border-amber-400 shadow-sm shadow-amber-500/50 scale-105'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                      }`}
                      title={`${res.name}: Click to toggle use`}
                    />
                  ))
                ) : (
                  <span className="text-xs font-mono text-slate-500">0/0</span>
                )}
                <span className="font-mono text-xs font-bold text-slate-300 ml-1">
                  {res.current}/{res.max}
                </span>
              </div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};
