import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const masterPath = path.resolve(__dirname, '../src/data/masterSpells.json');
const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

const dataDir = path.resolve(__dirname, '../src/data');
const batchFiles = fs.readdirSync(dataDir)
  .filter(f => f.startsWith('spell_briefs_') && f.endsWith('.json'))
  .map(f => path.join(dataDir, f));

let totalUpdated = 0;
const briefs = {};

for (const bf of batchFiles) {
  if (fs.existsSync(bf)) {
    try {
      const data = JSON.parse(fs.readFileSync(bf, 'utf8'));
      Object.assign(briefs, data);
      console.log(`Loaded ${Object.keys(data).length} briefs from ${path.basename(bf)}`);
    } catch (err) {
      console.error(`Error reading ${bf}:`, err);
    }
  }
}

for (const spell of masterData) {
  if (briefs[spell.id]) {
    spell.effect = briefs[spell.id];
    totalUpdated++;
  }
}

fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), 'utf8');
console.log(`Successfully updated ${totalUpdated} spells in masterSpells.json.`);

// Clean up batch files
for (const bf of batchFiles) {
  if (fs.existsSync(bf)) {
    fs.unlinkSync(bf);
    console.log(`Cleaned up ${path.basename(bf)}`);
  }
}
