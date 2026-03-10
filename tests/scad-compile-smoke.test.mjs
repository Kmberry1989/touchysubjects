/* global process */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(root, 'src', 'data', 'scadCatalog.json');
const vendorRoot = path.join(root, 'assets', 'scad-vendor');
const modelRoot = path.join(root, 'assets', 'SCAD files');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const vendorFiles = new Set();
const modelFiles = new Set();
const modelBasenames = new Set();

(function collectModel(dir, prefix = '') {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = path.posix.join(prefix, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) collectModel(abs, rel);
    else if (name.endsWith('.scad')) {
      modelFiles.add(rel);
      modelBasenames.add(path.basename(rel));
    }
  }
})(modelRoot);

(function collectVendor(dir, prefix = '') {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = path.posix.join(prefix, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) collectVendor(abs, rel);
    else if (name.endsWith('.scad')) vendorFiles.add(rel);
  }
})(vendorRoot);

test('compile smoke: all include dependencies resolve to model or vendor path', () => {
  for (const entry of catalog.entries) {
    for (const dep of entry.includeDeps) {
      const normalizedDep = dep.replace(/^\.\//, '');
      const ok = modelFiles.has(normalizedDep) || modelBasenames.has(path.basename(normalizedDep)) || vendorFiles.has(normalizedDep);
      assert.ok(ok, `Unresolved dependency in ${entry.fileName}: ${dep}`);
    }
  }
});
