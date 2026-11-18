export interface Dnd2024ArmorPreset {
  name: string;
  category: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  typeCode: 'L' | 'M' | 'H' | 'Shield';
  ac: number;
  dexBonusType: 'full' | 'max2' | 'none';
  stealthDisadvantage: boolean;
  weight: number;
  cost: string;
  strengthRequired?: number;
  donDoffTime: string;
  notes?: string;
}

export const DND2024_ARMOR_PRESETS: Dnd2024ArmorPreset[] = [
  // Light Armor (1 Minute to Don or Doff)
  {
    name: 'Padded Armor',
    category: 'Light',
    typeCode: 'L',
    ac: 11,
    dexBonusType: 'full',
    stealthDisadvantage: true,
    weight: 8,
    cost: '5 GP',
    donDoffTime: '1 Minute to Don or Doff',
  },
  {
    name: 'Leather Armor',
    category: 'Light',
    typeCode: 'L',
    ac: 11,
    dexBonusType: 'full',
    stealthDisadvantage: false,
    weight: 10,
    cost: '10 GP',
    donDoffTime: '1 Minute to Don or Doff',
  },
  {
    name: 'Studded Leather Armor',
    category: 'Light',
    typeCode: 'L',
    ac: 12,
    dexBonusType: 'full',
    stealthDisadvantage: false,
    weight: 13,
    cost: '45 GP',
    donDoffTime: '1 Minute to Don or Doff',
  },

  // Medium Armor (5 Minutes to Don / 1 Minute to Doff)
  {
    name: 'Hide Armor',
    category: 'Medium',
    typeCode: 'M',
    ac: 12,
    dexBonusType: 'max2',
    stealthDisadvantage: false,
    weight: 12,
    cost: '10 GP',
    donDoffTime: '5 Mins to Don / 1 Min to Doff',
  },
  {
    name: 'Chain Shirt',
    category: 'Medium',
    typeCode: 'M',
    ac: 13,
    dexBonusType: 'max2',
    stealthDisadvantage: false,
    weight: 20,
    cost: '50 GP',
    donDoffTime: '5 Mins to Don / 1 Min to Doff',
  },
  {
    name: 'Scale Mail',
    category: 'Medium',
    typeCode: 'M',
    ac: 14,
    dexBonusType: 'max2',
    stealthDisadvantage: true,
    weight: 45,
    cost: '50 GP',
    donDoffTime: '5 Mins to Don / 1 Min to Doff',
  },
  {
    name: 'Breastplate',
    category: 'Medium',
    typeCode: 'M',
    ac: 14,
    dexBonusType: 'max2',
    stealthDisadvantage: false,
    weight: 20,
    cost: '400 GP',
    donDoffTime: '5 Mins to Don / 1 Min to Doff',
  },
  {
    name: 'Half Plate Armor',
    category: 'Medium',
    typeCode: 'M',
    ac: 15,
    dexBonusType: 'max2',
    stealthDisadvantage: true,
    weight: 40,
    cost: '750 GP',
    donDoffTime: '5 Mins to Don / 1 Min to Doff',
  },

  // Heavy Armor (10 Minutes to Don / 5 Minutes to Doff)
  {
    name: 'Ring Mail',
    category: 'Heavy',
    typeCode: 'H',
    ac: 14,
    dexBonusType: 'none',
    stealthDisadvantage: true,
    weight: 40,
    cost: '30 GP',
    donDoffTime: '10 Mins to Don / 5 Mins to Doff',
  },
  {
    name: 'Chain Mail',
    category: 'Heavy',
    typeCode: 'H',
    ac: 16,
    dexBonusType: 'none',
    stealthDisadvantage: true,
    weight: 55,
    cost: '75 GP',
    strengthRequired: 13,
    donDoffTime: '10 Mins to Don / 5 Mins to Doff',
  },
  {
    name: 'Splint Armor',
    category: 'Heavy',
    typeCode: 'H',
    ac: 17,
    dexBonusType: 'none',
    stealthDisadvantage: true,
    weight: 60,
    cost: '200 GP',
    strengthRequired: 15,
    donDoffTime: '10 Mins to Don / 5 Mins to Doff',
  },
  {
    name: 'Plate Armor',
    category: 'Heavy',
    typeCode: 'H',
    ac: 18,
    dexBonusType: 'none',
    stealthDisadvantage: true,
    weight: 65,
    cost: '1,500 GP',
    strengthRequired: 15,
    donDoffTime: '10 Mins to Don / 5 Mins to Doff',
  },

  // Shield (Utilize Action to Don or Doff)
  {
    name: 'Shield',
    category: 'Shield',
    typeCode: 'Shield',
    ac: 2,
    dexBonusType: 'none',
    stealthDisadvantage: false,
    weight: 6,
    cost: '10 GP',
    donDoffTime: 'Utilize Action to Don or Doff',
  },
];
