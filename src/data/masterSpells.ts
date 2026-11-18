import { Spell } from '../types/spell';
import rawSpells from './masterSpells.json';

export const masterSpellList: Spell[] = rawSpells as unknown as Spell[];
