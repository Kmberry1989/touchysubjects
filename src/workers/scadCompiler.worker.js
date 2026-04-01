import { createOpenSCAD } from 'openscad-wasm';
import {
  applyCompatibilityPatches,
  compileEntry,
  ensureDefaultFont,
  ensureDir,
  normalizeError
} from './compileRuntime.js';

let generator = null;
let mountedPaths = [];

function emitPhase(phase, message, requestId) {
  self.postMessage({ type: 'phase', phase, message, requestId });
}

function normalizeRequest(request) {
  if (!request || typeof request !== 'object') {
    throw new Error('Invalid compile request');
  }

  if (typeof request.entryFile !== 'string' || request.entryFile.length === 0) {
    throw new Error('Compile request is missing entryFile');
  }

  if (!Array.isArray(request.sourceFiles) || request.sourceFiles.length === 0) {
    throw new Error('Compile request has no source files');
  }

  return {
    sourceOrigin: request.sourceOrigin ?? 'unknown',
    entryFile: request.entryFile,
    sourceFiles: request.sourceFiles,
    lockedRef: request.lockedRef ?? null,
    options: {
      includeDefaultFont: request.options?.includeDefaultFont !== false,
      applyCompatibilityPatches: request.options?.applyCompatibilityPatches !== false
    }
  };
}

self.onmessage = async (event) => {
  const { type, request, requestId } = event.data;

  if (type === 'init') {
    try {
      if (!generator) {
        generator = await createOpenSCAD({
          print: (text) => console.log('OpenSCAD stdout:', text),
          printErr: (text) => console.error('OpenSCAD stderr:', text)
        });
      }
      self.postMessage({ type: 'init-success' });
    } catch (err) {
      self.postMessage({ type: 'error', error: normalizeError(err), requestId });
    }
    return;
  }

  if (type !== 'compile-request') return;

  if (!generator) {
    self.postMessage({ type: 'error', error: 'OpenSCAD not initialized', requestId });
    return;
  }

  try {
    const normalized = normalizeRequest(request);
    const instance = generator.getInstance();

    emitPhase('resolving', `Preparing ${normalized.sourceOrigin} source graph…`, requestId);

    if (normalized.options.includeDefaultFont) {
      emitPhase('preparing', 'Loading default fonts…', requestId);
      await ensureDefaultFont(instance);
    }

    emitPhase('preparing', 'Writing virtual filesystem…', requestId);
    for (const existingPath of mountedPaths.sort((a, b) => b.length - a.length)) {
      try {
        instance.FS.unlink(existingPath);
      } catch {
        // ignore cleanup failures
      }
    }
    mountedPaths = [];

    for (const file of normalized.sourceFiles) {
      if (!file || typeof file.path !== 'string') continue;
      ensureDir(instance, file.path);
      const content =
        typeof file.content === 'string'
          ? normalized.options.applyCompatibilityPatches
            ? applyCompatibilityPatches(file.content).source
            : file.content
          : file.content;
      instance.FS.writeFile(file.path, content);
      mountedPaths.push(file.path);
    }

    emitPhase('compiling', 'Computing OpenSCAD geometry…', requestId);
    const stlData = compileEntry(instance, normalized.entryFile);

    try {
      instance.FS.unlink('/output.stl');
    } catch {
      // ignore cleanup failures
    }

    self.postMessage({ type: 'success', stlData, requestId });
    emitPhase('done', 'Compile complete.', requestId);
  } catch (err) {
    self.postMessage({ type: 'error', error: normalizeError(err), requestId });
  }
};
