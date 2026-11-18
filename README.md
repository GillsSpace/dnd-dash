# ⚔️ DnD Dash

> A modern, high-density, interactive character dashboard and digital character sheet designed for **Dungeons & Dragons 5th Edition (2024 Rules)**. Built with React 18, TypeScript, Vite, and Tailwind CSS.

![DnD 2024](https://img.shields.io/badge/D%26D%20Rules-2024%205e-8b0000?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. 2024 D&D Rules Support](#1-2024-dd-rules-support)
  - [2. Front Sheet (Core & Combat)](#2-front-sheet-core--combat)
  - [3. Back Sheet (Inventory & Wealth)](#3-back-sheet-inventory--wealth)
  - [4. Spells & Spellcasting Dashboard](#4-spells--spellcasting-dashboard)
  - [5. Rules Quick Reference](#5-rules-quick-reference)
  - [6. Save & Load System](#6-save--load-system)
  - [7. High-Density Print / PDF Export](#7-high-density-print--pdf-export)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Project Architecture](#-project-architecture)
- [Privacy & Local Data](#-privacy--local-data)
- [License](#-license)

---

## 🌟 Overview

**DnD Dash** combines the tactile feel and visual authenticity of a classic parchment character sheet with the automation, search speed, and convenience of a digital tabletop dashboard.

It features complete support for the **2024 Revised 5th Edition ruleset**, including **Weapon Masteries**, discrete **Multiclass Hit Dice pools**, updated **Species & Master Feats**, an extensive **2024 Spell Catalog**, and a high-density print stylesheet engineered for standard letter paper.

---

## ✨ Key Features

### 1. 2024 D&D Rules Support
- **Weapon Masteries**: Full integration of 2024 mastery properties (*Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex*) with tactical tooltips.
- **Multiclassing Engine**: Track multiple classes simultaneously with independent level progression and separate Hit Dice pools (e.g., `3d10` Fighter + `2d6` Wizard).
- **Revised Species & Feats**: Preloaded 2024 species traits and master feats with instant search and stat synchronization.
- **Dynamic Proficiency & Scaling**: Proficiency Bonus (+2 to +6) scales automatically with total character level across all checks and attacks.

### 2. Front Sheet (Core & Combat)
- **Ability Scores & Saving Throws**: Manage Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. Automatically calculates modifiers, saving throw bonuses, and proficiency checkboxes.
- **Skills Matrix**: Complete list of 18 skills with standard proficiency ($\bullet$) and Expertise ($\bigstar$) toggles, passive scores (Perception, Investigation, Insight), and modifier breakdowns.
- **Combat Stats**:
  - **Armor Class (AC)**: Auto-computed from equipped armor, shield, Dexterity cap, and active bonuses.
  - **Initiative & Speeds**: Base walking speed plus climb, fly, and swim speeds.
  - **Hit Point Tracker**: Current HP, Max HP, Temporary HP, and interactive Death Saving Throws counter (Successes & Failures).
- **Weapons & Attacks**:
  - Configurable weapon attacks with attack bonus calculation, damage dice, ability modifier choice, and damage types.
  - **Versatile Weapon Toggle**: Instantly switch between one-handed and two-handed damage (e.g., `1d8` vs `1d10` for longswords/battleaxes).
  - Synchronizes equipped weapons directly to inventory with auto-calculated encumbrance.
- **Conditions & Status Effects**: Quick-toggle condition badges (*Blinded, Charmed, Grappled, Incapacitated, Invisible, Paralyzed, Poisoned, Prone, Restrained, Stunned, Unconscious*) plus Exhaustion level tracking.
- **Features & Abilities (Collapsible Dual-View Cards)**:
  - **Tactical Brief**: Concise 1–2 sentence summary rendered directly on the sheet for high-speed reference during combat.
  - **Full Rules Mechanics**: Expandable parchment card displaying full description, mechanics, and references.
  - **Global Toggle**: Instant **Expand All / Collapse All** button.
- **Proficiencies & Training**: Armor training, weapon proficiencies, tool kits, and languages known.

### 3. Back Sheet (Inventory & Wealth)
- **Coinage & Encumbrance**:
  - Currency counters for Copper (CP), Silver (SP), Electrum (EP), Gold (GP), and Platinum (PP).
  - Automatically calculates total coin weight (50 coins = 1 lb) and aggregates total gear weight.
  - Visual **Encumbrance Bar** with capacity indicators based on Strength ($15 \times \text{STR}$).
- **Interactive Multi-Field Sorting**:
  - **Item Name**: 3-way toggle between **A → Z** (ascending), **Z → A** (descending), and default order.
  - **Unit Weight**: 3-way toggle between **Heaviest First**, **Lightest First**, and default order.
  - **Total Weight**: Sort by total encumbrance ($\text{Qty} \times \text{Unit Weight}$) to identify heaviest pack items immediately.
  - **Safe Mutation Indexing**: Quantity adjustments, item edits, and deletions safely map to original inventory indices regardless of active sort.
- **Item Details & Sync**:
  - Hover tooltips displaying category, lore, charges, and notes.
  - Locked item protection for weapons and armor synced from the combat sheet to prevent duplicate entries.

### 4. Spells & Spellcasting Dashboard
- **2024 Master Spell Library**: Complete catalog of over 400 spells searchable by name, class list, spell level (Cantrip to 9th level), and school of magic.
- **Spellcasting Metrics**: Automatically derives Spellcasting Ability, Spell Save DC ($8 + \text{PB} + \text{Ability Mod}$), and Spell Attack Bonus.
- **Prepared Spells Tracker**: Manage prepared vs. always-prepared spells with quick preparation toggles.
- **Interactive Spell Slots**: Click-to-expend slot counters for 1st through 9th level spell slots.
- **Custom / Homebrew Spell Creator**: Add custom spells with custom casting times, ranges, material costs, damage/save types, and descriptions.

### 5. Rules Quick Reference
- Built-in on-demand reference card covering core 2024 D&D rules:
  - **Actions** (Attack, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Study, Utilize)
  - **Bonus Actions & Reactions** (Opportunity Attacks, Two-Weapon Fighting)
  - **Movement & Environment** (Cover, Difficult Terrain, Suffocation, Vision, Light)
  - **Resting Rules** (Short Rest, Long Rest recovery mechanics)

### 6. Save & Load System
- **Dual Persistence**:
  - **Browser LocalStorage**: Automatic real-time auto-saving between sessions.
  - **Project `/saves/` Integration**: Direct file system read/write via Vite dev server API (`/api/saves`) with overwrite protection.
- **File Management**: Export and download character sheets as `.json` or import existing backup files anytime.

### 7. High-Density Print / PDF Export
- Engineered `@media print` stylesheet matching the density and aesthetic of official D&D character sheets:
  - **Page 1**: Front Sheet (Core Stats, Skills, Combat, Weapons, Armor, Abilities)
  - **Page 2**: Back Sheet (Equipment, Inventory, Wealth, Details)
  - **Page 3+**: Spellcasting Sheet (Spell Slots, Cantrips, Leveled Spells)
  - Protected against awkward mid-section page breaks using `print-avoid-break` CSS rules.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [npm](https://www.npmjs.com/) (version 9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GillsSpace/dnd-dash.git
   cd dnd-dash
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/` (or `http://localhost:3000/`).

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with hot module replacement and `/api/saves` middleware |
| `npm run build` | Compiles TypeScript and creates optimized production assets in `dist/` |
| `npm run preview` | Locally serves the production build for testing |
| `npm run merge-spells` | Internal helper script to reconcile curated spell briefs into master data |

---

## 🎮 How to Use

### 1. Creating or Editing a Character
- Click on character details (Name, Class, Species, Background) in the header to modify them.
- Adjust ability scores in the top-left boxes; saving throws and skills will update their modifiers automatically.
- Click skill circles to toggle **Proficiency** ($\bullet$), and stars for **Expertise** ($\bigstar$).

### 2. Managing Weapons & Attacks
- Click **"Add Weapon"** in the Combat section.
- Select from the preloaded 2024 weapons catalog or enter custom values.
- If a weapon has the **Versatile** property, click the hand toggle icon on the sheet to switch between one-handed and two-handed damage rolls.

### 3. Tracking Inventory & Sorting
- Switch to the **Back Sheet** using the top navigation bar.
- Click **"Add Item"** to record equipment, potions, or treasures.
- Click column headers (**Item Name**, **Unit Wt**, or **Total Wt**) to sort your gear.
- Active sorting displays a status badge in the table banner; click the reset icon (`RotateCcw`) to return to standard order.

### 4. Casting & Managing Spells
- Switch to the **Spells** view.
- Click **"Master Spell Library"** to browse and add 2024 spells to your known or prepared list.
- Click **"Create Custom Spell"** to add homebrew magic.
- Click spell slot bubbles to track expended and available slots.

### 5. Saving, Loading & Backing Up
- Press `Ctrl + S` or click the **Save** icon in the header.
- Choose a file name to save directly into the local `saves/` folder, or download as a standalone JSON file.
- Click **Load** to switch characters or restore previous backups.

### 6. Printing to Paper or PDF
- Click the **Print** icon in the top header (or press `Ctrl + P`).
- Select your printer or choose **"Save as PDF"**.
- Ensure background graphics are enabled in your browser print dialog for full parchment styling.

---

## 📁 Project Architecture

```
DnD_Dash/
├── index.html                   # HTML entry point with Google Fonts (Cinzel, MedievalSharp)
├── package.json                 # Project dependencies & npm scripts
├── vite.config.ts               # Vite configuration + custom /api/saves middleware
├── tailwind.config.js           # Custom parchment, crimson, and fantasy typography theme
├── tsconfig.json                # TypeScript compiler configuration
├── saves/                       # Character save folder (gitignored, kept via .gitkeep)
│   └── .gitkeep
├── scripts/                     # Data processing utilities
│   └── merge_spells.js
└── src/
    ├── main.tsx                 # React DOM root render
    ├── App.tsx                  # Main app layout, zoom controls, and view routing
    ├── index.css                # Base Tailwind styles & print stylesheet rules
    ├── types/                   # TypeScript interfaces (character, spells, weapons, armor)
    ├── context/                 # React Context (CharacterContext state management)
    ├── data/                    # 2024 reference datasets
    │   ├── masterSpells.json    # 400+ 2024 spells catalog
    │   ├── masterFeats.json     # 2024 feats & prerequisites
    │   ├── masterSpecies.json   # 2024 species traits & briefs
    │   ├── dnd2024Weapons.ts    # Weapons, damage, properties & masteries
    │   └── dnd2024Armor.ts      # Armor categories, AC equations & stealth rules
    └── components/
        ├── sheet/               # Front sheet sections (Combat, Skills, CoreInfo, Abilities)
        ├── inventory/           # Back sheet (Currency, Encumbrance, Sortable Inventory)
        ├── spells/              # Spell sheet, master library modal, custom spell creator
        ├── reference/           # 2024 quick reference dashboard
        ├── modals/              # Save/Load modal and item editors
        └── print/               # Dedicated high-density print document layout
```

---

## 🔒 Privacy & Local Data

- **Character Saves**: All personal save files stored in `saves/` (`*.json`) are intentionally **ignored by Git** via `.gitignore`. Your personal character sheets, backstory notes, and campaign data will never be published to public repositories.
- **Custom Spells**: Custom homebrew spells created locally (`custom_spells.json`, `*custom_spell*.json`) are also gitignored to keep your private campaign content separate from the core code.
- **Local Storage**: In-browser session data is saved exclusively on your local client and never transmitted to external servers.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

*Dungeons & Dragons, D&D, and their respective logos are trademarks of Wizards of the Coast LLC. This software is an independent companion tool designed for tabletop roleplaying games.*
