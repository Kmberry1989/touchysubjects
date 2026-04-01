import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCompatibilityPatches,
  compileEntry,
  ensureDir,
  isExpectedMainExit,
  normalizeError
} from '../src/workers/compileRuntime.js';

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
      }
    }
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
      }
    }
  };

  assert.throws(() => compileEntry(instance, '/input.scad'), /boom/);
});

test('normalizeError formats runtime numeric codes', () => {
  assert.equal(normalizeError(1172808), 'OpenSCAD runtime error code: 1172808');
});

test('applyCompatibilityPatches converts legacy assert and assign syntax', () => {
  const source = `
assert(version() > [2020, 0, 0], "needs newer version");
assign(x = 1) cube(x);
`;

  const patched = applyCompatibilityPatches(source);
  assert.match(patched.source, /echo\("PATCHED_ASSERT"/);
  assert.match(patched.source, /let\(x = 1\)/);
  assert.deepEqual(patched.applied, ['assert->echo', 'assign->let']);
});

test('ensureDir creates missing path segments for virtual files', () => {
  const calls = [];
  const instance = {
    FS: {
      mkdir(path) {
        calls.push(path);
      }
    }
  };

  ensureDir(instance, '/lib/examples/Parametric/sign.scad');
  assert.deepEqual(calls, ['/lib', '/lib/examples', '/lib/examples/Parametric']);
});
