/* global process */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scadDir = path.join(root, 'assets', 'SCAD files');
const catalogPath = path.join(root, 'src', 'data', 'scadCatalog.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function fileList() {
  const out = [];
  const stack = [''];

  while (stack.length > 0) {
    const relDir = stack.pop();
    const absDir = path.join(scadDir, relDir);
    for (const name of fs.readdirSync(absDir)) {
      const rel = relDir ? path.posix.join(relDir, name) : name;
      const abs = path.join(scadDir, rel);
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) stack.push(rel);
      else if (name.toLowerCase().endsWith('.scad')) out.push(rel);
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

test('catalog count matches filesystem scad count', () => {
  const fsFiles = fileList();
  assert.equal(catalog.count, fsFiles.length);
  assert.equal(catalog.entries.length, fsFiles.length);
});

test('catalog includes all files exactly once', () => {
  const fsSet = new Set(fileList());
  const catalogSet = new Set(catalog.entries.map((e) => e.id));
  assert.equal(catalogSet.size, fsSet.size);

  for (const relPath of fsSet) {
    assert.ok(catalogSet.has(relPath), `Missing ${relPath}`);
  }
});

test('award factory bundle files are cataloged with external-asset flags', () => {
  const expectedFiles = [
    'award_factory_pro.scad',
    'coin_edge_text_generator.scad',
    'medal_ribbon_generator.scad',
    'svg_to_coin_layout.scad'
  ];

  for (const fileName of expectedFiles) {
    assert.ok(
      catalog.entries.some((entry) => entry.fileName === fileName),
      `Missing award file ${fileName}`
    );
  }

  const needsImportFiles = ['award_factory_pro.scad', 'svg_to_coin_layout.scad'];
  for (const fileName of needsImportFiles) {
    const entry = catalog.entries.find((item) => item.fileName === fileName);
    assert.equal(
      entry?.needsExternalAsset,
      true,
      `${fileName} should be flagged as needing external assets`
    );
  }
});
