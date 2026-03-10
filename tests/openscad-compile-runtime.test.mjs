import test from 'node:test';
import assert from 'node:assert/strict';
import { compileEntry, isExpectedMainExit, normalizeError } from '../src/workers/compileRuntime.js';

test('isExpectedMainExit accepts numeric Emscripten exit values', () => {
  assert.equal(isExpectedMainExit(1124712), true);
});

test('compileEntry continues when callMain throws numeric exit and output exists', () => {
  const instance = {
    callMain() {
      throw 1124712;
    },
    FS: {
      readFile() {
        return new Uint8Array([1, 2, 3, 4]);
      },
    },
  };

  const out = compileEntry(instance, '/input.scad');
  assert.deepEqual(Array.from(out), [1, 2, 3, 4]);
});

test('compileEntry rethrows non-exit errors', () => {
  const instance = {
    callMain() {
      throw new Error('boom');
    },
    FS: {
      readFile() {
        return new Uint8Array([1]);
      },
    },
  };

  assert.throws(() => compileEntry(instance, '/input.scad'), /boom/);
});

test('normalizeError formats runtime numeric codes', () => {
  assert.equal(normalizeError(1172808), 'OpenSCAD runtime error code: 1172808');
});
