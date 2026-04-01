const DEFAULT_OPTIONS = {
  includeDefaultFont: true,
  applyCompatibilityPatches: true
};

function normalizePath(path) {
  const normalized = String(path || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
  return normalized ? `/${normalized}` : '/main.scad';
}

export function createCompileRequest({
  entryFile = '/main.scad',
  sourceFiles = [],
  sourceOrigin = 'generated',
  lockedRef = null,
  options = {}
} = {}) {
  return {
    engine: 'scadder',
    entryFile: normalizePath(entryFile),
    sourceFiles: sourceFiles.map((file) => ({
      path: normalizePath(file.path),
      content: file.content
    })),
    sourceOrigin,
    lockedRef,
    options: {
      ...DEFAULT_OPTIONS,
      ...options
    }
  };
}

export function createInlineCompileRequest(code, options = {}) {
  return createCompileRequest({
    entryFile: '/main.scad',
    sourceFiles: [{ path: '/main.scad', content: String(code ?? '') }],
    sourceOrigin: 'generated',
    options
  });
}

export function normalizeCompilePayload(payload) {
  if (typeof payload === 'string') {
    return createInlineCompileRequest(payload);
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid compile payload');
  }

  if (Array.isArray(payload.sourceFiles) && typeof payload.entryFile === 'string') {
    return createCompileRequest(payload);
  }

  throw new Error('Invalid compile payload');
}
