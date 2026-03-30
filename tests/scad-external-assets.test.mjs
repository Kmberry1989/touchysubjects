import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeExternalAssetPath,
  resolveExternalAssetPaths
} from '../src/scad/externalAssets.js';

test('normalizeExternalAssetPath normalizes separators and prefixes', () => {
  assert.equal(normalizeExternalAssetPath('./design.svg'), 'design.svg');
  assert.equal(normalizeExternalAssetPath('\\assets\\logo.svg'), 'assets/logo.svg');
  assert.equal(normalizeExternalAssetPath('/foo/bar.svg'), 'foo/bar.svg');
});

test('resolveExternalAssetPaths resolves literal import values', () => {
  const source = `
import("design.svg", center=true);
import("./icons/badge.svg");
`;
  assert.deepEqual(resolveExternalAssetPaths(source), ['design.svg', 'icons/badge.svg']);
});

test('resolveExternalAssetPaths resolves variable import values from assignments and overrides', () => {
  const source = `
svg_file = "design.svg";
import(svg_file, center=true);
`;
  assert.deepEqual(resolveExternalAssetPaths(source), ['design.svg']);
  assert.deepEqual(resolveExternalAssetPaths(source, { svg_file: 'replacement.svg' }), [
    'replacement.svg'
  ]);
});
