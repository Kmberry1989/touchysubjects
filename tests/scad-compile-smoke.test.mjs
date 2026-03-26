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
const modelBasenames = new Map();

(function collectModel(dir, prefix = '') {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = path.posix.join(prefix, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) collectModel(abs, rel);
    else if (name.endsWith('.scad')) {
      modelFiles.add(rel);
      const base = path.basename(rel);
      const existing = modelBasenames.get(base) ?? [];
      existing.push(rel);
      modelBasenames.set(base, existing);
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

function normalizeIncludePath(includePath) {
  const normalized = String(includePath || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');

  const parts = [];
  for (const part of normalized.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      parts.pop();
      continue;
    }
    parts.push(part);
  }

  return parts.join('/');
}

function dirName(relPath) {
  const idx = relPath.lastIndexOf('/');
  return idx >= 0 ? relPath.slice(0, idx) : '';
}

function joinRelativePath(baseDir, includePath) {
  return normalizeIncludePath(baseDir ? `${baseDir}/${includePath}` : includePath);
}

test('compile smoke: all include dependencies resolve to model or vendor path', () => {
  for (const entry of catalog.entries) {
    for (const dep of entry.includeDeps) {
      const normalizedDep = normalizeIncludePath(dep);
      const scopedDep = joinRelativePath(dirName(entry.id), normalizedDep);
      const basenameMatches = modelBasenames.get(path.basename(normalizedDep)) ?? [];
      const ok =
        modelFiles.has(scopedDep) ||
        modelFiles.has(normalizedDep) ||
        vendorFiles.has(scopedDep) ||
        vendorFiles.has(normalizedDep) ||
        basenameMatches.length === 1;
      assert.ok(ok, `Unresolved dependency in ${entry.id}: ${dep}`);
    }
  }
});
