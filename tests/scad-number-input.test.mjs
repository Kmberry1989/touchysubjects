import test from 'node:test';
import assert from 'node:assert/strict';
import { coerceNumberChange, resolveNumberValue } from '../src/scad/numberInput.js';

test('resolveNumberValue falls back when value is undefined', () => {
  assert.equal(resolveNumberValue(undefined, 42), 42);
});

test('resolveNumberValue falls back to zero when value and fallback are invalid', () => {
  assert.equal(resolveNumberValue('abc', 'def'), 0);
});

test('coerceNumberChange keeps current value when next value is invalid', () => {
  assert.equal(coerceNumberChange('-', 12), 12);
});

test('coerceNumberChange accepts valid numeric text', () => {
  assert.equal(coerceNumberChange('3.5', 12), 3.5);
});
