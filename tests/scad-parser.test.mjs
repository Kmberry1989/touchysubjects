import test from 'node:test';
import assert from 'node:assert/strict';
import { parseScadSource } from '../src/scad/parser.js';

test('parser detects sections and enum/range hints', () => {
  const src = `
/* [Global] */
foo = 10; // [1:1:20]
bar = "x"; // [a,b,c]
/* [Hidden] */
secret = 1;
module body() { cube(1); }
`;

  const parsed = parseScadSource(src);
  const foo = parsed.params.find((p) => p.key === 'foo');
  const bar = parsed.params.find((p) => p.key === 'bar');
  const secret = parsed.params.find((p) => p.key === 'secret');

  assert.ok(parsed.sections.includes('Global'));
  assert.ok(parsed.sections.includes('Hidden'));
  assert.equal(foo.min, 1);
  assert.equal(foo.step, 1);
  assert.equal(foo.max, 20);
  assert.equal(bar.type, 'enum');
  assert.equal(secret.visibility, 'advanced');
});

test('parser excludes non-literal expressions from editable params', () => {
  const src = `
/* [Global] */
a = 10;
b = a + 2;
`;
  const parsed = parseScadSource(src);
  const a = parsed.params.find((p) => p.key === 'a');
  const b = parsed.params.find((p) => p.key === 'b');
  assert.equal(a.editable, true);
  assert.equal(b.editable, false);
});

test('parser recognizes image array and image surface hints', () => {
  const src = `
arr = [1,2,3]; // [image_array:20x20]
img = "foo"; // [image_surface:100x100]
`;
  const parsed = parseScadSource(src);
  const arr = parsed.params.find((p) => p.key === 'arr');
  const img = parsed.params.find((p) => p.key === 'img');
  assert.equal(arr.type, 'image_array');
  assert.equal(img.type, 'image_surface');
});
