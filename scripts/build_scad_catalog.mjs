/* global console */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseIncludeDependencies, parseScadSource } from '../src/scad/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const scadDir = path.join(repoRoot, 'assets', 'SCAD files');
const outFile = path.join(repoRoot, 'src', 'data', 'scadCatalog.json');
const outSourcesFile = path.join(repoRoot, 'src', 'data', 'scadSources.json');
const vendorDir = path.join(repoRoot, 'assets', 'scad-vendor');

const categoryMap = new Map([
  ['bus_card_holder.scad', ['Utilities', 'Holders & Clips']],
  ['bus_card_holder copy.scad', ['Utilities', 'Holders & Clips']],
  ['Card_Case_Customizer.scad', ['Utilities', 'Holders & Clips']],
  ['CableHolder_v3.scad', ['Utilities', 'Holders & Clips']],
  ['Clip_Stand_v1-0.scad', ['Utilities', 'Holders & Clips']],
  ['TeaClip_Customizer.scad', ['Utilities', 'Holders & Clips']],
  ['CupSleeve_v2_alt2.scad', ['Utilities', 'Holders & Clips']],
  ['Luggage_label_Customizer_2013-11-01.scad', ['Utilities', 'Holders & Clips']],

  ['U_Box_V103.scad', ['Utilities', 'Boxes & Cases']],
  ['U_Box_V104_Test_Cleaned.scad', ['Utilities', 'Boxes & Cases']],
  ['customizable_box.scad', ['Utilities', 'Boxes & Cases']],
  ['Hinged_Box.scad', ['Utilities', 'Boxes & Cases']],
  ['drawer_box_v6_-_hex_pattern.scad', ['Utilities', 'Boxes & Cases']],
  ['SecretHeart.scad', ['Utilities', 'Boxes & Cases']],
  ['SecretHeart2.scad', ['Utilities', 'Boxes & Cases']],
  ['Swatch_Box.scad', ['Utilities', 'Boxes & Cases']],
  ['makerbot_customizable_iphone_case.scad', ['Utilities', 'Boxes & Cases']],

  ['Cable_Tie.scad', ['Utilities', 'Hardware & Fasteners']],
  ['Nut_Job.scad', ['Utilities', 'Hardware & Fasteners']],
  ['Hex_Wrench_Handle.scad', ['Utilities', 'Hardware & Fasteners']],
  ['TireValveStemCap.scad', ['Utilities', 'Hardware & Fasteners']],

  ['Funnel_Customizer_AP2020_v8.6.scad', ['Utilities', 'Pouring & Writing Tools']],
  ['Retro_Word_Pen.scad', ['Utilities', 'Pouring & Writing Tools']],

  ['bracelet.scad', ['Wearables', 'Bracelets & Accessories']],
  ['bracelet (1).scad', ['Wearables', 'Bracelets & Accessories']],
  ['Stretchlet.scad', ['Wearables', 'Bracelets & Accessories']],
  ['parametric_glasses_collectible.scad', ['Wearables', 'Bracelets & Accessories']],
  ['parametric_glasses_collectible (1).scad', ['Wearables', 'Bracelets & Accessories']],
  ['customizer_multitone_whistle.scad', ['Wearables', 'Bracelets & Accessories']],

  ['MakerBot_CodeNametag_Project.scad', ['Personalization', 'Nameplates & Codes']],
  ['MakerBot_CodeNametag_Project_CZ.scad', ['Personalization', 'Nameplates & Codes']],
  ['Sweeping_Name_Plate_VZX.scad', ['Personalization', 'Nameplates & Codes']],
  ['QR_Code.scad', ['Personalization', 'Nameplates & Codes']],

  ['Bobble_Spring.scad', ['Toys & Fidgets', 'Kinetic Objects']],
  ['Gyro.scad', ['Toys & Fidgets', 'Kinetic Objects']],
  ['mathgrrl_fidgetcube.scad', ['Toys & Fidgets', 'Kinetic Objects']],
  ['cubeGears4.scad', ['Toys & Fidgets', 'Kinetic Objects']],
  ['custom_ball_cage.scad', ['Toys & Fidgets', 'Kinetic Objects']],
  ['kokomo_tactile_object.scad', ['Toys & Fidgets', 'Kinetic Objects']],
  ['kokomo_tactile_object (1).scad', ['Toys & Fidgets', 'Kinetic Objects']],

  ['random_maze_cube_generator.scad', ['Toys & Games', 'Mazes & Boards']],
  ['ChessBoard_002.scad', ['Toys & Games', 'Mazes & Boards']],

  ['snowflakerator.scad', ['Decor', 'Seasonal & Artistic']],
  ['Spiral_sphere_ornament_2013-11-23.scad', ['Decor', 'Seasonal & Artistic']],
  ['customizable_tree_v1.0.scad', ['Decor', 'Seasonal & Artistic']],
  ['shadow_display.scad', ['Decor', 'Seasonal & Artistic']],
  ['wall2.0.scad', ['Decor', 'Seasonal & Artistic']],
  ['ContourHandshake_28878.scad', ['Decor', 'Seasonal & Artistic']],

  ['stamp-o-matic.scad', ['Decor', 'Stamps & Stencils']],
  ['stamp-o-matic.OpenSCAD.2014.06.scad', ['Decor', 'Stamps & Stencils']],
  ['stencil-o-matic.scad', ['Decor', 'Stamps & Stencils']],
  ['embossing_stamp.scad', ['Decor', 'Stamps & Stencils']],

  ['mathgrrl_furniture_customizer.scad', ['Architecture & Scale Models', 'General']],
  ['Customizable_Birdhouse_TNH.scad', ['Architecture & Scale Models', 'General']],

  ['lithopane_new.scad', ['Imaging', 'Lithophanes']],

  ['BuildPlate_Array_28878.scad', ['Utilities', 'Build Plate Composition']],
]);

function displayNameFromFile(fileName) {
  return fileName
    .replace(/\.scad$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const fileNames = fs
  .readdirSync(scadDir)
  .filter((name) => name.toLowerCase().endsWith('.scad'))
  .sort((a, b) => a.localeCompare(b));

const entries = [];
const hashToPrimary = new Map();

for (const fileName of fileNames) {
  const absPath = path.join(scadDir, fileName);
  const source = fs.readFileSync(absPath, 'utf8');
  const hash = crypto.createHash('sha1').update(source).digest('hex');

  const parsed = parseScadSource(source);
  const includeDeps = parseIncludeDependencies(source);
  const [category, subcategory] = categoryMap.get(fileName) ?? ['Uncategorized', 'General'];

  const duplicateOf = hashToPrimary.get(hash) ?? null;
  if (!duplicateOf) hashToPrimary.set(hash, fileName);

  entries.push({
    id: fileName,
    fileName,
    filePath: `assets/SCAD files/${fileName}`,
    displayName: displayNameFromFile(fileName),
    category,
    subcategory,
    duplicateOf,
    includeDeps,
    sections: parsed.sections,
    params: parsed.params,
  });
}

const payload = {
  generatedAt: new Date().toISOString(),
  count: entries.length,
  entries,
};

fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const modelSources = {};
for (const fileName of fileNames) {
  modelSources[fileName] = fs.readFileSync(path.join(scadDir, fileName), 'utf8');
}

const vendorSources = {};
if (fs.existsSync(vendorDir)) {
  const stack = [''];
  while (stack.length > 0) {
    const relDir = stack.pop();
    const absDir = path.join(vendorDir, relDir);
    for (const name of fs.readdirSync(absDir)) {
      const rel = path.posix.join(relDir, name);
      const abs = path.join(vendorDir, rel);
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        stack.push(rel);
      } else if (name.toLowerCase().endsWith('.scad')) {
        vendorSources[rel] = fs.readFileSync(abs, 'utf8');
      }
    }
  }
}

fs.writeFileSync(
  outSourcesFile,
  `${JSON.stringify({ generatedAt: payload.generatedAt, modelSources, vendorSources }, null, 2)}\n`,
  'utf8'
);
console.log(`Wrote ${entries.length} entries to ${path.relative(repoRoot, outFile)}`);
