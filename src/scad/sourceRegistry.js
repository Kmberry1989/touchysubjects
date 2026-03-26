import catalog from '../data/scadCatalog.json';
import sources from '../data/scadSources.json';
import { parseIncludeDependencies } from './parser.js';

const modelSourceById = new Map(Object.entries(sources.modelSources));
const vendorSourceByRelPath = new Map(Object.entries(sources.vendorSources));

const catalogById = new Map(catalog.entries.map((e) => [e.id, e]));
const catalogByFileName = new Map();

for (const entry of catalog.entries) {
  const existing = catalogByFileName.get(entry.fileName) ?? [];
  existing.push(entry);
  catalogByFileName.set(entry.fileName, existing);
}

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

function getDirName(filePath) {
  const normalized = normalizeIncludePath(filePath);
  const idx = normalized.lastIndexOf('/');
  return idx >= 0 ? normalized.slice(0, idx) : '';
}

function joinRelativePath(baseDir, includePath) {
  return normalizeIncludePath(baseDir ? `${baseDir}/${includePath}` : includePath);
}

function resolveModelDependency(entry, includePath) {
  const normalized = normalizeIncludePath(includePath);
  if (!normalized) return null;

  const localPath = joinRelativePath(getDirName(entry.id), normalized);
  if (catalogById.has(localPath)) return catalogById.get(localPath);
  if (catalogById.has(normalized)) return catalogById.get(normalized);

  const base = normalized.split('/').pop();
  const matches = catalogByFileName.get(base) ?? [];
  if (matches.length === 1) return matches[0];

  return null;
}

function collectModelDependencies(entry) {
  const seen = new Set();
  const queue = [entry];
  const out = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current.id)) continue;
    seen.add(current.id);
    out.push(current);

    for (const dep of current.includeDeps ?? []) {
      const depModel = resolveModelDependency(current, dep);
      if (depModel && !seen.has(depModel.id)) {
        queue.push(depModel);
      }
    }
  }

  return out;
}

export function getCompileBundleForModel(modelId, overriddenSource, externalAssetFiles = []) {
  const entry = catalogById.get(modelId);
  if (!entry) throw new Error(`Unknown model: ${modelId}`);

  const sourceFilesByPath = new Map();

  const upsertFile = (path, content) => {
    if (!content) return;
    sourceFilesByPath.set(path, content);
  };

  for (const [rel, source] of vendorSourceByRelPath.entries()) {
    upsertFile(`/lib/${rel}`, source);
  }

  for (const model of collectModelDependencies(entry)) {
    const source = modelSourceById.get(model.id);
    if (source) upsertFile(`/lib/${model.id}`, source);
  }

  // Ensure edited source always overrides the baseline model source.
  upsertFile(`/lib/${entry.id}`, overriddenSource);
  for (const file of externalAssetFiles) {
    if (!file || typeof file.path !== 'string') continue;
    const normalized = normalizeIncludePath(file.path);
    if (!normalized) continue;
    upsertFile(`/lib/${normalized}`, file.content);
  }

  return {
    entryFile: `/lib/${entry.id}`,
    cleanupRoot: '/lib',
    sourceFiles: Array.from(sourceFilesByPath.entries()).map(([path, content]) => ({ path, content })),
  };
}

function createAdditionalSourceLookup(additionalFiles) {
  const byPath = new Map();
  const byBase = new Map();

  for (const file of additionalFiles) {
    if (!file || typeof file.fileName !== 'string' || typeof file.source !== 'string') continue;
    const normalized = normalizeIncludePath(file.fileName);
    if (!normalized) continue;
    const base = normalized.split('/').pop();
    const descriptor = { source: file.source, virtualPath: normalized };
    byPath.set(normalized, descriptor);
    byBase.set(base, descriptor);
  }

  return { byPath, byBase };
}

function resolveAdHocDependency(dep, additionalLookup, fromDir = '') {
  const normalized = normalizeIncludePath(dep);
  if (!normalized) return null;

  const candidates = [joinRelativePath(fromDir, normalized), normalized].filter(Boolean);

  for (const candidate of candidates) {
    if (vendorSourceByRelPath.has(candidate)) {
      return { source: vendorSourceByRelPath.get(candidate), virtualPath: candidate };
    }

    const extraByPath = additionalLookup.byPath.get(candidate);
    if (extraByPath) return extraByPath;

    if (modelSourceById.has(candidate)) {
      return { source: modelSourceById.get(candidate), virtualPath: candidate };
    }
  }

  const base = normalized.split('/').pop();
  const extraByBase = additionalLookup.byBase.get(base);
  if (extraByBase) return extraByBase;

  const matches = catalogByFileName.get(base) ?? [];
  if (matches.length === 1 && modelSourceById.has(matches[0].id)) {
    return { source: modelSourceById.get(matches[0].id), virtualPath: matches[0].id };
  }

  return null;
}

function collectRecursiveDeps(entryFileName, entrySource, additionalLookup) {
  const deps = [];
  const seen = new Set();
  const queue = parseIncludeDependencies(entrySource).map((dep) => ({
    dep,
    fromDir: getDirName(entryFileName),
  }));

  while (queue.length > 0) {
    const { dep, fromDir } = queue.shift();
    const normalized = normalizeIncludePath(dep);
    const attemptKey = joinRelativePath(fromDir, normalized) || normalized;
    if (!normalized || seen.has(attemptKey)) continue;

    const resolved = resolveAdHocDependency(normalized, additionalLookup, fromDir);
    if (!resolved) {
      seen.add(attemptKey);
      continue;
    }

    seen.add(resolved.virtualPath);
    deps.push(resolved);
    const childDeps = parseIncludeDependencies(resolved.source);
    const childDir = getDirName(resolved.virtualPath);
    for (const child of childDeps) {
      const childNormalized = normalizeIncludePath(child);
      const childAttemptKey = joinRelativePath(childDir, childNormalized) || childNormalized;
      if (!seen.has(childAttemptKey)) {
        queue.push({ dep: childNormalized, fromDir: childDir });
      }
    }
  }

  return deps;
}

export function getCompileBundleForAdHoc(entryFileName, overriddenSource, additionalFiles = [], externalAssetFiles = []) {
  if (typeof entryFileName !== 'string' || !entryFileName.trim()) {
    throw new Error('entryFileName is required for ad-hoc compile bundles');
  }

  if (typeof overriddenSource !== 'string') {
    throw new Error('overriddenSource must be a string for ad-hoc compile bundles');
  }

  const sourceFilesByPath = new Map();
  const upsertFile = (path, content) => {
    if (!content) return;
    sourceFilesByPath.set(path, content);
  };

  for (const [rel, source] of vendorSourceByRelPath.entries()) {
    upsertFile(`/lib/${rel}`, source);
  }

  const additionalLookup = createAdditionalSourceLookup(additionalFiles);
  for (const descriptor of additionalLookup.byPath.values()) {
    upsertFile(`/lib/${descriptor.virtualPath}`, descriptor.source);
  }

  for (const depFile of collectRecursiveDeps(entryFileName, overriddenSource, additionalLookup)) {
    upsertFile(`/lib/${depFile.virtualPath}`, depFile.source);
  }

  const entryPath = normalizeIncludePath(entryFileName);
  upsertFile(`/lib/${entryPath}`, overriddenSource);
  for (const file of externalAssetFiles) {
    if (!file || typeof file.path !== 'string') continue;
    const normalized = normalizeIncludePath(file.path);
    if (!normalized) continue;
    upsertFile(`/lib/${normalized}`, file.content);
  }

  return {
    entryFile: `/lib/${entryPath}`,
    cleanupRoot: '/lib',
    sourceFiles: Array.from(sourceFilesByPath.entries()).map(([path, content]) => ({ path, content })),
  };
}

export function getModelSource(modelId) {
  const entry = catalogById.get(modelId);
  if (!entry) return null;
  return modelSourceById.get(entry.id) ?? null;
}

export function getCatalog() {
  return catalog;
}
