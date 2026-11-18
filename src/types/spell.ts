export interface Spell {
  id: string;
  known?: boolean;
  level: number;
  name: string;
  school: string;
  castingTime: string;
  range: string;
  areaOrTargets?: string;
  effect: string;
  version?: string;
  saveOrAttack?: string;
  duration: string;
  conc: boolean;
  ritual: boolean;
  components: string;
  cost?: string;
  source?: string;
  classes: string[];
  fullText?: string;
  higherLevels?: string;
}
