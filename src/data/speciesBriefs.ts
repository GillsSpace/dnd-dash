// Curated 2024 D&D tactical briefs for all playable species traits
// Strict format: Action economy, exact dice/bonuses, conditions, ranges, and usage limits. Zero fluff.

export const SPECIES_TACTICAL_BRIEFS: Record<string, string> = {
  // === COMMON / PHB 2024 ===
  // Aasimar
  'Aasimar: Celestial Resistance': 'Resistance to Necrotic damage and Radiant damage.',
  'Aasimar: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Aasimar: Healing Hands': 'Magic Action: Touch a creature to heal HP equal to rolled d4s = PB (1/Long Rest).',
  'Aasimar: Light Bearer': 'You know the Light cantrip (Charisma spellcasting ability).',
  'Aasimar: Celestial Revelation': 'Lvl 3+ Bonus Action (1 min): Transform to gain flight, radiant emanation, or fear, plus +PB damage on 1 attack/spell per turn (1/Long Rest).',
  'Aasimar: Heavenly Wings': 'Gain spectral wings with Fly Speed equal to walking speed for 1 min, plus +PB Radiant or Necrotic damage on one attack/spell per turn.',
  'Aasimar: Inner Radiance': 'Shed 10-ft bright light; at turn end, deal Radiant damage = PB to each creature within 10 ft for 1 min, plus +PB damage 1/turn.',
  'Aasimar: Necrotic Shroud': 'Creatures within 10 ft make Cha save (DC 8+Cha+PB) or be Frightened until end of your next turn; deal +PB Necrotic damage 1/turn for 1 min.',

  // Dragonborn
  'Dragonborn: Draconic Ancestry': 'Choose a dragon progenitor determining your Breath Weapon shape (cone or line), damage type, and Damage Resistance.',
  'Dragonborn: Breath Weapon': 'Attack Action: Replace one attack to exhale energy in a 15-ft cone or 5x30-ft line dealing 1d10 damage (+1d10 at lvl 5, 11, 17; save DC 8+Con+PB; PB/Long Rest).',
  'Dragonborn: Damage Resistance': 'Resistance to the damage type associated with your Draconic Ancestry (Acid, Cold, Fire, Lightning, or Poison).',
  'Dragonborn: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Dragonborn: Draconic Flight': 'Lvl 5+ Bonus Action: Sprout spectral wings gaining Fly Speed equal to walking speed for 10 min (1/Long Rest).',
  'Dragonborn: Black Ancestor': 'Black Dragon: Acid damage Breath Weapon (5x30-ft line, Dex save) & Acid Damage Resistance.',
  'Dragonborn: Blue Ancestor': 'Blue Dragon: Lightning damage Breath Weapon (5x30-ft line, Dex save) & Lightning Damage Resistance.',
  'Dragonborn: Brass Ancestor': 'Brass Dragon: Fire damage Breath Weapon (5x30-ft line, Dex save) & Fire Damage Resistance.',
  'Dragonborn: Bronze Ancestor': 'Bronze Dragon: Lightning damage Breath Weapon (5x30-ft line, Dex save) & Lightning Damage Resistance.',
  'Dragonborn: Copper Ancestor': 'Copper Dragon: Acid damage Breath Weapon (5x30-ft line, Dex save) & Acid Damage Resistance.',
  'Dragonborn: Gold Ancestor': 'Gold Dragon: Fire damage Breath Weapon (15-ft cone, Dex save) & Fire Damage Resistance.',
  'Dragonborn: Green Ancestor': 'Green Dragon: Poison damage Breath Weapon (15-ft cone, Con save) & Poison Damage Resistance.',
  'Dragonborn: Red Ancestor': 'Red Dragon: Fire damage Breath Weapon (15-ft cone, Dex save) & Fire Damage Resistance.',
  'Dragonborn: Silver Ancestor': 'Silver Dragon: Cold damage Breath Weapon (15-ft cone, Con save) & Cold Damage Resistance.',
  'Dragonborn: White Ancestor': 'White Dragon: Cold damage Breath Weapon (15-ft cone, Con save) & Cold Damage Resistance.',

  // Dwarf
  'Dwarf: Darkvision': 'Darkvision 120 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Dwarf: Dwarven Resilience': 'Advantage on saving throws to avoid or end the Poisoned condition; Resistance to Poison damage.',
  'Dwarf: Dwarven Toughness': 'Your Hit Point maximum increases by +1 per character level.',
  'Dwarf: Stonecunning': 'Bonus Action: Gain 60-ft Tremorsense on stone surfaces for 10 min (3/Long Rest).',

  // Elf
  'Elf: Darkvision': 'Darkvision 60 ft (or 120 ft for Drow and Shadowmoor lineages).',
  'Elf: Elven Lineage': 'Choose an elven lineage granting innate spells at levels 1, 3, and 5 (Int, Wis, or Cha spellcasting ability).',
  'Elf: Fey Ancestry': 'Advantage on saving throws to avoid or end the Charmed condition.',
  'Elf: Keen Senses': 'Proficiency in the Insight, Perception, or Survival skill.',
  'Elf: Trance': 'Need no sleep (magic cannot put you to sleep); finish a Long Rest in 4 hours of conscious meditation.',
  'Elf: Drow Lineage': 'Darkvision increases to 120 ft; Dancing Lights cantrip. Lvl 3: Faerie Fire. Lvl 5: Darkness (1/Long Rest each).',
  'Elf: High Elf Lineage': 'Prestidigitation cantrip (swap on Long Rest with any Wizard cantrip). Lvl 3: Detect Magic. Lvl 5: Misty Step (1/Long Rest each).',
  'Elf: Wood Elf Lineage': 'Speed increases to 35 ft; Druidcraft cantrip. Lvl 3: Longstrider. Lvl 5: Pass without Trace (1/Long Rest each).',
  'Elf: Lorwyn Elf Lineage': 'Thorn Whip cantrip (swap on Long Rest with Druid cantrips). Lvl 3: Command. Lvl 5: Silence (1/Long Rest each).',
  'Elf: Shadowmoor Elf Lineage': 'Darkvision increases to 120 ft; Starry Wisp cantrip. Lvl 3: Heroism. Lvl 5: Gentle Repose (1/Long Rest each).',

  // Gnome
  'Gnome: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Gnome: Gnomish Cunning': 'Advantage on all Intelligence, Wisdom, and Charisma saving throws.',
  'Gnome: Gnomish Lineage': 'Choose Forest Gnome (Minor Illusion & Speak with Animals) or Rock Gnome (Mending & Clockwork Devices).',
  'Gnome: Forest Gnome': 'Minor Illusion cantrip (gesture or whisper); cast Speak with Animals without spell slot PB times/Long Rest.',
  'Gnome: Rock Gnome': 'Mending & Prestidigitation cantrips; spend 10 min to create a Tiny clockwork device (fire starter, music box, or cam).',

  // Goliath
  'Goliath: Giant Ancestry': 'Descended from giants; choose one supernatural boon from your ancestral giant type usable PB times/Long Rest.',
  "Goliath: Cloud's Jaunt (Cloud Giant)": 'Bonus Action: Magically teleport up to 30 ft to an unoccupied visible space (PB/Long Rest).',
  "Goliath: Fire's Burn (Fire Giant)": 'On hit with attack: Deal an extra 1d10 Fire damage to target (PB/Long Rest).',
  "Goliath: Frost's Chill (Frost Giant)": 'On hit with attack: Deal extra 1d6 Cold damage and reduce target Speed by 10 ft until start of your next turn (PB/Long Rest).',
  "Goliath: Hill's Tumble (Hill Giant)": 'On hit with attack: Knock a Large or smaller target Prone without a save (PB/Long Rest).',
  "Goliath: Stone's Endurance (Stone Giant)": 'Reaction when taking damage: Roll 1d12 + Con modifier and reduce incoming damage by total (PB/Long Rest).',
  "Goliath: Storm's Thunder (Storm Giant)": 'Reaction when taking damage from creature within 60 ft: Deal 1d8 Thunder damage to attacker (PB/Long Rest).',
  'Goliath: Large Form': 'Lvl 5+ Bonus Action (10 min): Become Large; gain Advantage on Str checks and +1d6 damage to melee weapon attacks 1/turn (1/Long Rest).',
  'Goliath: Powerful Build': 'Advantage on ability checks to end Grappled; count as one size larger for carrying capacity.',

  // Halfling
  'Halfling: Brave': 'Advantage on saving throws to avoid or end the Frightened condition.',
  'Halfling: Halfling Nimbleness': 'Move through the space of any creature that is of a size larger than yours.',
  'Halfling: Luck': 'Reroll a d20 roll of 1 on an attack roll, ability check, or saving throw; must use the new roll.',
  'Halfling: Naturally Stealthy': 'Can attempt to Hide even when obscured only by a creature at least one size larger than you.',

  // Human
  'Human: Resourceful': 'Gain Heroic Inspiration whenever you finish a Long Rest.',
  'Human: Skillful': 'Gain proficiency in one skill of your choice.',
  'Human: Versatile': 'Gain an Origin Feat of your choice (e.g. Alert, Tough, or Magic Initiate).',

  // Orc
  'Orc: Adrenaline Rush': 'Bonus Action: Take the Dash action and gain Temporary Hit Points equal to your Proficiency Bonus (PB/Long Rest).',
  'Orc: Darkvision': 'Darkvision 120 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Orc: Relentless Endurance': 'When reduced to 0 HP but not killed outright, drop to 1 HP instead (1/Long Rest).',

  // Tiefling
  'Tiefling: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Tiefling: Otherworldly Presence': 'You know the Thaumaturgy cantrip (Int, Wis, or Cha spellcasting ability).',
  'Tiefling: Fiendish Legacy': 'Choose an Abyssal, Chthonic, or Infernal legacy granting damage resistance and prepared spells at levels 1, 3, and 5.',
  'Tiefling: Abyssal Lineage': 'Resistance to Poison damage; Poison Spray cantrip. Lvl 3: Ray of Sickness. Lvl 5: Hold Person (1/Long Rest each).',
  'Tiefling: Chthonic Lineage': 'Resistance to Necrotic damage; Chill Touch cantrip. Lvl 3: False Life. Lvl 5: Ray of Enfeeblement (1/Long Rest each).',
  'Tiefling: Infernal Lineage': 'Resistance to Fire damage; Fire Bolt cantrip. Lvl 3: Hellish Rebuke. Lvl 5: Darkness (1/Long Rest each).',

  // === EBERRON ===
  // Changeling
  'Changeling: Changeling Instincts': 'Proficiency in two skills: Deception, Insight, Intimidation, Performance, or Persuasion.',
  'Changeling: Shape-Shifter': 'Action: Shape-shift your appearance, voice, size (Medium/Small), and coloration into any humanoid form seen.',

  // Kalashtar
  'Kalashtar: Dual Mind': 'Advantage on all Wisdom saving throws.',
  'Kalashtar: Mental Discipline': 'Resistance to Psychic damage.',
  'Kalashtar: Mind Link': 'Bonus Action: Telepathically speak to any visible creature within 10 x level ft; creature can telepathically respond.',
  'Kalashtar: Severed from Dreams': 'Immune to magical sleep and effects that require dream manipulation.',

  // Khoravar
  'Khoravar: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Khoravar: Fey Ancestry': 'Advantage on saving throws to avoid or end the Charmed condition.',
  'Khoravar: Fey Gift': 'Help action as Bonus Action; when helping ally within 30 ft, grant them +10 ft Speed, temp HP = PB, or Disadvantage vs them (PB/Long Rest).',
  'Khoravar: Lethargy Resilience': 'Advantage on saving throws against effects that induce Exhaustion or sleep.',
  'Khoravar: Skill Versatility': 'Proficiency in two skills of your choice.',

  // Shifter
  'Shifter: Bestial Instincts': 'Proficiency in Acrobatics, Athletics, Intimidation, or Survival.',
  'Shifter: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Shifter: Shifting': 'Bonus Action (1 min): Shape-shift into bestial form, gaining Temp HP = 2xPB + level and ancestral feature (PB/Long Rest).',
  'Shifter: Beasthide': 'While shifted, gain +1d6 additional Temporary HP and a +1 bonus to Armor Class.',
  'Shifter: Longtooth': 'While shifted, make an Unarmed Strike with fangs as a Bonus Action dealing 1d6 + Str Piercing damage.',
  'Shifter: Swiftstride': 'While shifted, Speed increases by +10 ft; Reaction when enemy ends turn within 5 ft: Move up to 10 ft without Opportunity Attacks.',
  'Shifter: Wildhunt': 'While shifted, Advantage on Wisdom checks, and no creature within 30 ft can make attack rolls with Advantage against you.',

  // Warforged
  'Warforged: Construct Resilience': 'Advantage on saves vs Poisoned; Resistance to Poison; immune to disease; do not need to eat, drink, breathe, or sleep.',
  'Warforged: Integrated Protection': '+1 bonus to Armor Class; can integrate armor into body over 1 hour (cannot be removed against your will).',
  'Warforged: Sentry’s Rest': 'Need no sleep; finish Long Rest in 6 hours of motionless, conscious rest (remain alert).',
  'Warforged: Specialized Design': 'Gain proficiency in one skill and one tool of your choice.',
  'Warforged: Tireless': 'Cannot suffer Exhaustion from lack of rest.',

  // === LORWYN ===
  // Boggart
  'Boggart: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Boggart: Fey Ancestry': 'Advantage on saving throws to avoid or end the Charmed condition.',
  'Boggart: Fury of the Small': 'When damaging a creature larger than you, deal extra damage equal to your Proficiency Bonus (PB/Long Rest).',
  'Boggart: Nimble Escape': 'Bonus Action: Take the Disengage or Hide action on each of your turns.',

  // Faerie
  'Faerie: Fairy Magic': 'Druidcraft cantrip. Lvl 3: Faerie Fire (1/Long Rest). Lvl 5: Enlarge/Reduce (1/Long Rest; Int, Wis, or Cha).',
  'Faerie: Flight': 'Fly Speed equal to walking speed while not wearing Medium or Heavy armor.',

  // Flamekin
  'Flamekin: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Flamekin: Fire Resistance': 'Resistance to Fire damage.',
  'Flamekin: Reach to the Blaze': 'Produce Flame cantrip. Lvl 3: Hellish Rebuke (1/Long Rest). Lvl 5: Heat Metal (1/Long Rest; Charisma).',

  // Lorwyn Changeling
  'Lorwyn Changeling: Shape Self': 'Action: Shape-shift your appearance, size (Medium/Small), and voice into any humanoid form.',
  'Lorwyn Changeling: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Lorwyn Changeling: Delightful Imitator': 'Advantage on Deception and Performance checks made while shape-shifted.',
  'Lorwyn Changeling: Unpredictable Movement': 'Reaction when missed by an attack: Move up to 10 ft without provoking Opportunity Attacks (PB/Long Rest).',

  // Rimekin
  'Rimekin: Cold Fire Magic': 'Ray of Frost cantrip. Lvl 3: Armor of Agathys (1/Long Rest). Lvl 5: Rime\'s Binding Ice (1/Long Rest; Con or Cha).',
  'Rimekin: Cold Resistance': 'Resistance to Cold damage.',
  'Rimekin: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',

  // === RAVENLOFT ===
  // Dhampir
  'Dhampir: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Dhampir: Spider Climb': 'Climb Speed equal to walking speed; at lvl 3+, move across vertical surfaces and ceilings hands-free.',
  'Dhampir: Trace of Undeath': 'Resistance to Necrotic damage; you do not need to breathe.',
  'Dhampir: Vampiric Bite': 'Unarmed Strike with fangs dealing 1d4 + Con Piercing damage (Advantage while Bloodied); heal HP or boost next d20 roll (PB/Long Rest).',
  'Dhampir: Drain': 'When hitting with Vampiric Bite, regain Hit Points equal to the Piercing damage dealt (PB/Long Rest).',
  'Dhampir: Strengthen': 'When hitting with Vampiric Bite, add a bonus equal to the Piercing damage dealt to your next ability check or attack roll within 1 min.',

  // Hexblood
  'Hexblood: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Hexblood: Eerie Token': 'Bonus Action: Detach a lock of hair or nail to create a token for telepathic messages (10 miles) or remote sensory spying (PB/Long Rest).',
  'Hexblood: Distant Message': 'While holding an Eerie Token, mentally send a telepathic message up to 25 words to the creature holding it (10 miles).',
  'Hexblood: Remote Viewing': 'Action: Enter a trance for up to 1 min to see and hear from your Eerie Token as if you were in its space.',
  'Hexblood: Hex Magic': 'Disguise Self & Hex spells; cast each once per Long Rest without a slot or using regular spell slots (Int, Wis, or Cha).',

  // Lupin
  'Lupin: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Lupin: Feral Pounce': 'If you move 20+ ft straight toward a target and hit with Unarmed Strike, target makes Str save (DC 8+Str+PB) or falls Prone.',
  'Lupin: Howl': 'Bonus Action: Howl to grant Advantage on attack rolls to allies within 30 ft until start of your next turn (1/Long Rest).',
  'Lupin: Werewolf Instincts': 'Advantage on Perception checks relying on hearing or smell; Unarmed Strikes deal 1d6 + Str Slashing damage.',

  // Reborn
  'Reborn: Escaped Death': 'Advantage on Death Saving Throws.',
  'Reborn: Everlasting': 'Do not need to breathe, eat, drink, or sleep; finish a Long Rest in 4 hours of motionless rest.',
  'Reborn: Knowledge from a Past Life': 'Add +1d6 to any failed ability check, using past life memories (PB/Long Rest).',
  'Reborn: Strange Endurance': 'Advantage on saves vs Poisoned; Resistance to Poison damage; immune to magical sleep.',

  // === WARCRAFT ===
  // Dracthyr
  'Dracthyr: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Dracthyr: Gliding Wings': 'Subtract up to 100 ft from falling distance; glide horizontally 2 ft for every 1 ft descended while not Incapacitated.',
  'Dracthyr: Natural Weaponry': 'Bonus Action: Strike with wings or tail to Shove a creature within 5 ft (DC 8+Str+PB) or deal 1d6 + Str Bludgeoning damage.',
  'Dracthyr: Visage': 'Magic Action: Shape-shift between your natural draconic form and a chosen humanoid visage form.',
  'Dracthyr: Draconic Flight': 'Lvl 5+ Bonus Action: Channel wings to gain Fly Speed equal to walking speed for 10 min (1/Long Rest).',

  // Draenei
  'Draenei: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Draenei: Eredar Lineage': 'Choose an Eredar lineage granting damage resistance and prepared spells at levels 1, 3, and 5 (Int, Wis, or Cha).',
  'Draenei: Heroic Presence': 'Whenever you or an ally within 30 ft fails a d20 roll, add +1d4 to the roll (PB/Long Rest).',
  'Draenei: Draenei Lineage': 'Resistance to Necrotic damage; Spare the Dying cantrip. Lvl 3: Healing Word. Lvl 5: Prayer of Healing (1/Long Rest each).',
  'Draenei: Krokul Lineage': 'Resistance to Poison damage; Poison Spray cantrip. Lvl 3: Ray of Sickness. Lvl 5: Hold Person (1/Long Rest each).',
  'Draenei: Lightforged Lineage': 'Resistance to Radiant damage; Sacred Flame cantrip. Lvl 3: Guiding Bolt. Lvl 5: Aid (1/Long Rest each).',
  "Draenei: Man'ari Lineage": 'Resistance to Fire damage; Fire Bolt cantrip. Lvl 3: Hellish Rebuke. Lvl 5: Darkness (1/Long Rest each).',

  // Dwarf (Warcraft)
  'Dwarf (Warcraft): Darkvision': 'Darkvision 120 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Dwarf (Warcraft): Dwarven Resilience': 'Advantage on saving throws to avoid or end the Poisoned condition; Resistance to Poison damage.',
  'Dwarf (Warcraft): Dwarven Toughness': 'Your Hit Point maximum increases by +1 per character level.',
  'Dwarf (Warcraft): Stonecunning': 'Bonus Action: Gain 60-ft Tremorsense on stone surfaces for 10 min (3/Long Rest).',

  // Earthen
  'Earthen: Azerite Surge': 'Bonus Action: Unleash Azerite dealing 2d6 Fire or Thunder in 15-ft cone (Dex save DC 8+Con+PB) and grant ally 1d6 temp HP (PB/Long Rest).',
  'Earthen: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Earthen: Earthen Resilience': 'Advantage on saves vs Poisoned; Resistance to Poison damage; +1 bonus to Armor Class.',
  'Earthen: Ingest Minerals': 'Consume gems/minerals instead of food; gain +1d4 to next D20 Test after consuming precious minerals.',
  'Earthen: Quiet Contemplation': 'Concentrate for 1 min during rest to regain Hit Dice or clear one level of Exhaustion (1/Long Rest).',

  // Elf (Warcraft)
  'Elf (Warcraft): Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Elf (Warcraft): Elven Lineage': 'Choose an Azerothian elven lineage granting innate spells at levels 1, 3, and 5 (Int, Wis, or Cha).',
  'Elf (Warcraft): Fey Ancestry': 'Advantage on saving throws to avoid or end the Charmed condition.',
  'Elf (Warcraft): Keen Senses': 'Proficiency in the Insight, Perception, or Survival skill.',
  'Elf (Warcraft): Trance': 'Need no sleep; finish a Long Rest in 4 hours of conscious meditation.',
  'Elf (Warcraft): Blood Elf Lineage': 'Prestidigitation cantrip (swap on Long Rest with Wizard cantrips). Lvl 3: Detect Magic. Lvl 5: Arcane Vigor (1/Long Rest each).',
  'Elf (Warcraft): High Elf Lineage': 'Prestidigitation cantrip (swap on Long Rest with Wizard cantrips). Lvl 3: Detect Magic. Lvl 5: Misty Step (1/Long Rest each).',
  'Elf (Warcraft): Night Elf Lineage': 'Proficiency in Stealth; Bonus Action Hide in Dim Light/Darkness. Lvl 3: Longstrider. Lvl 5: Pass Without Trace (1/Long Rest each).',
  'Elf (Warcraft): Nightborne Lineage': 'Darkvision increases to 120 ft; Arcane Pulse cantrip. Lvl 3: Faerie Fire. Lvl 5: Darkness (1/Long Rest each).',
  'Elf (Warcraft): Void Elf Lineage': 'Darkvision increases to 120 ft; Mind Sliver cantrip. Lvl 3: Entropic Embrace. Lvl 5: Misty Step (1/Long Rest each).',

  // Forsaken
  'Forsaken: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Forsaken: Deathly Endurance': 'Advantage on saves vs Poisoned; Resistance to Necrotic and Poison; immune to magical sleep.',
  'Forsaken: Everlasting': 'Do not need to breathe, eat, drink, or sleep; finish Long Rest in 4 hours of inactivity.',
  'Forsaken: Touch of the Grave': 'When you hit with attack/spell, deal extra Necrotic damage = PB and heal that amount (PB/Long Rest).',
  'Forsaken: Will of the Forsaken': 'Reaction: End Charmed, Frightened, or Sleep effect currently affecting you (1/Long Rest).',

  // Gnome (Warcraft)
  'Gnome (Warcraft): Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Gnome (Warcraft): Gnomish Cunning': 'Advantage on all Intelligence, Wisdom, and Charisma saving throws.',
  'Gnome (Warcraft): Gnomish Lineage': 'Know Mending & Prestidigitation; spend 10 min to create clockwork tools or devices.',
  'Gnome (Warcraft): Built for Success': 'Add +1d4 to one failed attack roll, ability check, or saving throw after seeing the roll (PB/Long Rest).',
  'Gnome (Warcraft): Emergency Fail-Safe': 'Reaction when Bloodied: Spend 1 Hit Die, roll it + Con mod, and regain that many Hit Points (1/Long Rest).',
  'Gnome (Warcraft): Mechanical Nature': 'Advantage on saves vs Poisoned; Resistance to Poison damage; do not need to breathe, eat, drink, or sleep.',
  'Gnome (Warcraft): Sentry’s Rest': 'Need no sleep; finish a Long Rest in 6 hours of conscious, motionless rest.',
  'Gnome (Warcraft): Specialized Design': 'Gain proficiency with two tools of your choice.',

  // Goblin
  'Goblin: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Goblin: Fey Ancestry': 'Advantage on saving throws to avoid or end the Charmed condition.',
  'Goblin: Fury of the Small': 'When damaging a creature larger than you, deal extra damage equal to your Proficiency Bonus (PB/Long Rest).',
  'Goblin: Nimble Escape': 'Bonus Action: Take the Disengage or Hide action on each of your turns.',

  // Haranir
  'Haranir: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Haranir: Gift of the World Trees': 'Gain Climb Speed equal to walking speed; Advantage on saves vs Poisoned; Resistance to Poison damage.',
  'Haranir: Haranir Magic': 'Druidcraft cantrip. Lvl 3: Entangle (1/Long Rest). Lvl 5: Spike Growth (1/Long Rest; Wis or Cha).',

  // Human (Warcraft)
  'Human (Warcraft): Resourceful': 'Gain Heroic Inspiration whenever you finish a Long Rest.',
  'Human (Warcraft): Skillful': 'Gain proficiency in one skill of your choice.',
  'Human (Warcraft): Versatile': 'Gain an Origin Feat of your choice (reflecting your Warcraft national background, e.g. Magic Initiate for Dalaran).',

  // Orc (Warcraft)
  'Orc (Warcraft): Adrenaline Rush': 'Bonus Action: Take the Dash action and gain Temporary Hit Points equal to your Proficiency Bonus (PB/Long Rest).',
  'Orc (Warcraft): Darkvision': 'Darkvision 120 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Orc (Warcraft): Relentless Endurance': 'When reduced to 0 HP but not killed outright, drop to 1 HP instead (1/Long Rest).',

  // Pandaren
  'Pandaren: Bouncy': 'Resistance to falling damage; subtract up to 30 ft when calculating fall damage.',
  'Pandaren: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Pandaren: Inner Peace': 'Double Proficiency Bonus (Expertise) with Cook\'s Utensils and Brewer\'s Supplies; Advantage on saves vs Poisoned.',
  'Pandaren: Quaking Palm': 'Action: Strike a creature within 5 ft to Incapacitate it until the end of your next turn (DC 8+Dex/Wis+PB; 1/Short or Long Rest).',

  // Tauren
  'Tauren: Horns': 'Unarmed Strike with horns dealing 1d6 + Str Piercing damage.',
  'Tauren: Goring Rush': 'Immediately after Dashing 20+ ft, make a Horns attack as a Bonus Action dealing +1d6 extra Piercing damage on hit.',
  'Tauren: Hammering Horns': 'Immediately after hitting a creature with melee attack, use Bonus Action to push target 10 ft away (Str save DC 8+Str+PB).',
  'Tauren: Tauren Lineage': 'Choose a lineage: Mulgore (War Stomp Stun), Highmountain (Bull Rush Charge), or Taunka (+1 AC & Cold Resistance).',
  'Tauren: Mulgore Tauren': 'War Stomp: Action to stomp; up to 4 creatures within 10 ft make Con save (DC 8+Str/Con+PB) or be Stunned until turn end (PB/Long Rest).',
  'Tauren: Highmountain Tauren': 'Bull Rush: Action to move Speed without Opportunity Attacks; creatures hit make Str save or fall Prone taking 1d8 damage (PB/Long Rest).',
  'Tauren: Taunka': '+1 bonus to Armor Class and Resistance to Cold damage.',

  // Troll
  'Troll: Bloodied Frenzy': 'While Bloodied (half max HP or lower), you have Advantage on all attack rolls.',
  'Troll: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Troll: Troll Healing': 'When spending Hit Dice on Short Rest, regain additional HP equal to Con mod x dice rolled; regrow lost limbs on Long Rest.',
  'Troll: Troll Lineage': 'Choose an ancestral tribe granting Heroic Inspiration or terrain advantages (Amani, Darkspear, or Zandalari).',
  'Troll: Amani Troll': 'Regain 1 expended Hit Die whenever you spend Heroic Inspiration.',
  'Troll: Darkspear Troll': 'Difficult Terrain composed of ice, rubble, snow, or undergrowth does not cost extra movement while Dashing.',
  'Troll: Zandalari Troll': 'When you roll a 1 on a d20 test, immediately gain Heroic Inspiration at the end of the turn.',

  // Vulpera
  'Vulpera: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Vulpera: Fire Resistance': 'Resistance to Fire damage.',
  'Vulpera: Nose for Trouble': 'When taking damage, take a Reaction to reduce the damage by 1d4 + Con mod (PB/Long Rest).',
  'Vulpera: Vulpera Nimbleness': 'Bonus Action: Disengage; move through the space of any creature larger than you.',

  // Worgen
  'Worgen: Darkvision': 'Darkvision 60 ft (see in dim light as bright light, darkness as dim light in grayscale).',
  'Worgen: Darkflight': 'Bonus Action: Increase Speed by +10 ft and ignore Difficult Terrain for 1 min (PB/Long Rest).',
  'Worgen: Necrotic Resistance': 'Resistance to Necrotic damage.',
  'Worgen: Instinctual Shift': 'Unarmed Strikes deal 1d6 + Str Slashing damage; Bonus Action shift between human and lupine worgen form.',

  // === EXOTIC ===
  // Bariaur
  'Bariaur: Ram': 'Unarmed Strike deals 1d6 + Str Bludgeoning; if you move 10+ ft straight before hitting, deal +1d6 extra damage and knock target Prone (DC 8+Str+PB).',
  'Bariaur: Stable Stance': 'Advantage on saving throws and ability checks to avoid being knocked Prone.',
  'Bariaur: Wanderer’s Instincts': 'Proficiency in Animal Handling, Arcana, Nature, or Survival skill.',

  // Duskling
  'Duskling: Enhanced Jump': 'Jump distance is doubled; always count as having a running start for High and Long Jumps.',
  'Duskling: Inner Magic': 'Magic Action (1 min): Channel incarnum to gain +10 ft Speed (Mobility), +1d4 weapon damage (Ardor), or +PB Temp HP (Vigor) (PB/Long Rest).',
  'Duskling: Ardor': 'While Inner Magic is active, your weapon attacks deal an extra 1d4 damage.',
  'Duskling: Mobility': 'While Inner Magic is active, your Speed increases by 10 feet.',
  'Duskling: Vigor': 'When activating Inner Magic, you gain Temporary Hit Points equal to your Proficiency Bonus.',
};

/**
 * Helper to get a curated tactical brief for a species trait.
 * Falls back to the raw brief if no curated version exists.
 */
export function getSpeciesTacticalBrief(traitFullName: string, traitBaseName: string, fallbackBrief: string): string {
  if (SPECIES_TACTICAL_BRIEFS[traitFullName]) {
    return SPECIES_TACTICAL_BRIEFS[traitFullName];
  }
  if (SPECIES_TACTICAL_BRIEFS[traitBaseName]) {
    return SPECIES_TACTICAL_BRIEFS[traitBaseName];
  }
  // Clean up any common artifacts in fallback
  let b = fallbackBrief || '';
  b = b.replace(/([a-z])([A-Z])/g, '$1 $2');
  b = b.replace(/theLightcantrip/g, 'the Light cantrip');
  b = b.replace(/theMinor Illusioncantrip/g, 'the Minor Illusion cantrip');
  b = b.replace(/theSpeak with Animalsspell/g, 'the Speak with Animals spell');
  if (b.endsWith('...')) {
    b = b.slice(0, -3).trim();
    const lastSpace = b.lastIndexOf(' ');
    if (lastSpace > 0) {
      b = b.slice(0, lastSpace);
    }
    b += '.';
  }
  return b;
}
