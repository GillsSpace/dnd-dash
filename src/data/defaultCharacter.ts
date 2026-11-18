import { CharacterData } from '../types/character';
import rawData from './defaultCharacter.json';

export const initialCharacter: CharacterData = rawData as unknown as CharacterData;
