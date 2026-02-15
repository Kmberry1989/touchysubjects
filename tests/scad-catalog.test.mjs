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
  return fs
    .readdirSync(scadDir)
    .filter((name) => name.toLowerCase().endsWith('.scad'))
    .sort((a, b) => a.localeCompare(b));
}

test('catalog count matches filesystem scad count', () => {
  const fsFiles = fileList();
  assert.equal(catalog.count, fsFiles.length);
  assert.equal(catalog.entries.length, fsFiles.length);
});

test('catalog includes all files exactly once', () => {
  const fsSet = new Set(fileList());
  const catalogSet = new Set(catalog.entries.map((e) => e.fileName));
  assert.equal(catalogSet.size, fsSet.size);

  for (const fileName of fsSet) {
    assert.ok(catalogSet.has(fileName), `Missing ${fileName}`);
  }
});
