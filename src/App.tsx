import React, { useState, useEffect } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { SheetHeader } from './components/sheet/SheetHeader';
import { CoreInfoSection } from './components/sheet/CoreInfoSection';
import { SkillsSection } from './components/sheet/SkillsSection';
import { CombatSection } from './components/sheet/CombatSection';
import { ConditionsSection } from './components/sheet/ConditionsSection';
import { WeaponsArmorSection } from './components/sheet/WeaponsArmorSection';
import { FeaturesSection } from './components/sheet/FeaturesSection';
import { ProficienciesSection } from './components/sheet/ProficienciesSection';
import { SpellSheetView } from './components/spells/SpellSheetView';
import { MasterSpellModal } from './components/spells/MasterSpellModal';
import { CustomSpellModal } from './components/spells/CustomSpellModal';
import { BackSheetView } from './components/inventory/BackSheetView';
import { ReferenceView } from './components/reference/ReferenceView';
import { NotesView } from './components/notes/NotesView';
import { SaveLoadModal } from './components/modals/SaveLoadModal';
import { PrintDocument } from './components/print/PrintDocument';

const SheetContainer: React.FC = () => {
  const { character, currentSaveFilename, saveToProjectSaves } = useCharacter();
  const [currentView, setCurrentView] = useState<'sheet' | 'spells' | 'back' | 'notes' | 'reference'>('sheet');
  const [isMasterSpellsOpen, setIsMasterSpellsOpen] = useState(false);
  const [masterSpellInitialLevel, setMasterSpellInitialLevel] = useState<number | 'all'>('all');
  const [isCustomSpellOpen, setIsCustomSpellOpen] = useState(false);
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);
  const [saveLoadMode, setSaveLoadMode] = useState<'save' | 'load'>('save');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Global Ctrl + S / Cmd + S (Save JSON) & Ctrl + P / Cmd + P (Print / PDF)
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const filename =
          currentSaveFilename ||
          `${(character.name || 'character').replace(/\s+/g, '_')}_5e_2024.json`;
        const finalName = filename.endsWith('.json') ? filename : `${filename}.json`;
        const success = await saveToProjectSaves(finalName);
        if (success) {
          showToast(`✓ Character saved to saves/${finalName}`);
        } else {
          setSaveLoadMode('save');
          setIsSaveLoadOpen(true);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [character, currentSaveFilename, saveToProjectSaves]);

  // Page scaling defaulting to 115% (+15% scale)
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    const saved = localStorage.getItem('dnd_sheet_zoom');
    return saved ? parseFloat(saved) : 1.15;
  });

  const handleSetZoom = (newZoom: number) => {
    const clamped = Math.round(Math.max(0.7, Math.min(1.6, newZoom)) * 100) / 100;
    setZoomLevel(clamped);
    localStorage.setItem('dnd_sheet_zoom', clamped.toString());
  };

  return (
    <div
      style={{ zoom: zoomLevel }}
      className="min-h-screen bg-[#ede6db] py-4 sm:py-6 px-2 sm:px-4 font-sans text-stone-900 selection:bg-[#7b1113] selection:text-white transition-[zoom] duration-200 print:bg-white print:p-0 print:m-0"
    >
      {/* Screen Interactive Container (Hidden during printing) */}
      <div className="print:hidden">
        {/* Paper Sheet Container with realistic drop shadow */}
        <div className="max-w-6xl mx-auto bg-[#faf6f0] border border-stone-400 shadow-xl rounded-sm overflow-hidden">
          {/* Sheet Header */}
          <SheetHeader
            onOpenMasterSpells={() => setIsMasterSpellsOpen(true)}
            currentView={currentView}
            setCurrentView={setCurrentView}
            zoomLevel={zoomLevel}
            onSetZoom={handleSetZoom}
            onOpenSaveModal={() => {
              setSaveLoadMode('save');
              setIsSaveLoadOpen(true);
            }}
            onOpenLoadModal={() => {
              setSaveLoadMode('load');
              setIsSaveLoadOpen(true);
            }}
            onPrint={handlePrint}
          />

          {/* View 1: Front Character Sheet Matching Attached PDF */}
          {currentView === 'sheet' && (
            <div className="p-3 sm:p-5 space-y-4">
              {/* Core Info: Ability Scores, Saves, Classes, Speeds, Resources */}
              <CoreInfoSection />

              {/* Middle Split: Skills (Left) and Combat (Right) */}
              <div className="grid grid-cols-12 gap-3 items-stretch">
                <div className="col-span-12 md:col-span-5 flex flex-col">
                  <SkillsSection />
                </div>
                <div className="col-span-12 md:col-span-7 flex flex-col">
                  <CombatSection />
                </div>
              </div>

              {/* Full-Width Weapons & Armor Section */}
              <WeaponsArmorSection />

              {/* Conditions Section */}
              <ConditionsSection />

              {/* Features & Abilities Section */}
              <FeaturesSection />

              {/* Proficiencies, Languages, Armor & Weapon Training */}
              <ProficienciesSection />
            </div>
          )}

          {/* View 2: Spells Sheet & Master Database */}
          {currentView === 'spells' && (
            <div className="p-3 sm:p-5">
              <SpellSheetView
                onOpenMasterSpells={(level) => {
                  setMasterSpellInitialLevel(level ?? 'all');
                  setIsMasterSpellsOpen(true);
                }}
              />
            </div>
          )}

          {/* View 3: Back Sheet & Inventory */}
          {currentView === 'back' && (
            <div className="p-3 sm:p-5">
              <BackSheetView />
            </div>
          )}

          {/* View 4: Campaign & Character Notes */}
          {currentView === 'notes' && (
            <div className="p-3 sm:p-5">
              <NotesView />
            </div>
          )}

          {/* View 5: D&D 2024 Reference Rules */}
          {currentView === 'reference' && (
            <div className="p-3 sm:p-5">
              <ReferenceView />
            </div>
          )}
        </div>

        {/* Modals */}
        <MasterSpellModal
          isOpen={isMasterSpellsOpen}
          initialLevel={masterSpellInitialLevel}
          onClose={() => setIsMasterSpellsOpen(false)}
          onOpenCustomSpell={() => {
            setIsMasterSpellsOpen(false);
            setIsCustomSpellOpen(true);
          }}
        />

        <CustomSpellModal
          isOpen={isCustomSpellOpen}
          onClose={() => {
            setIsCustomSpellOpen(false);
            setIsMasterSpellsOpen(true);
          }}
        />

        {/* Save & Load Folder View Modal */}
        <SaveLoadModal
          isOpen={isSaveLoadOpen}
          initialMode={saveLoadMode}
          onClose={() => setIsSaveLoadOpen(false)}
          onToast={showToast}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-stone-900/95 text-white px-4 py-2.5 rounded-lg shadow-xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-bounce-short">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Print Document (Hidden on screen, rendered only during native PDF / paper print) */}
      <div className="hidden print:block w-full bg-white">
        <PrintDocument />
      </div>
    </div>
  );
};

export function App() {
  return (
    <CharacterProvider>
      <SheetContainer />
    </CharacterProvider>
  );
}

export default App;
