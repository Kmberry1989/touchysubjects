import test from 'node:test';
import assert from 'node:assert/strict';
import { applyParamOverrides } from '../src/scad/override.js';

test('override updates special $ variables', () => {
  const source = `
$fn = 48;
size = 20;
`;
  const params = [
    {
      key: '$fn',
      editable: true,
      rawValue: '48',
      sourceSpan: { lineStart: 2, lineEnd: 2 },
    },
  ];

  const updated = applyParamOverrides(source, params, { $fn: 96 });
  assert.match(updated, /\$fn = 96;/);
});
