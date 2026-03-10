import catalog from '../data/scadCatalog.json';
import sources from '../data/scadSources.json';
import { parseIncludeDependencies } from './parser.js';

const modelSourceByFileName = new Map(Object.entries(sources.modelSources));
const vendorSourceByRelPath = new Map(Object.entries(sources.vendorSources));

const catalogById = new Map(catalog.entries.map((e) => [e.id, e]));
const catalogByFileName = new Map(catalog.entries.map((e) => [e.fileName, e]));

function normalizeIncludePath(includePath) {
  return String(includePath || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');
}

function resolveModelDependency(includePath) {
  const normalized = normalizeIncludePath(includePath);
  const base = normalized.split('/').pop();
  return catalogByFileName.get(base);
}

function collectModelDependencies(entry) {
  const seen = new Set();
  const queue = [entry];
  const out = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current.fileName)) continue;
    seen.add(current.fileName);
    out.push(current);

    for (const dep of current.includeDeps ?? []) {
      const depModel = resolveModelDependency(dep);
      if (depModel && !seen.has(depModel.fileName)) {
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
    const source = modelSourceByFileName.get(model.fileName);
    if (source) upsertFile(`/lib/${model.fileName}`, source);
  }

  // Ensure edited source always overrides the baseline model source.
  upsertFile(`/lib/${entry.fileName}`, overriddenSource);
  for (const file of externalAssetFiles) {
    if (!file || typeof file.path !== 'string') continue;
    const normalized = normalizeIncludePath(file.path);
    if (!normalized) continue;
    upsertFile(`/lib/${normalized}`, file.content);
  }

  return {
    entryFile: `/lib/${entry.fileName}`,
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

function resolveAdHocDependency(dep, additionalLookup) {
  const normalized = normalizeIncludePath(dep);
  if (!normalized) return null;

  if (vendorSourceByRelPath.has(normalized)) {
    return { source: vendorSourceByRelPath.get(normalized), virtualPath: normalized };
  }

  const extraByPath = additionalLookup.byPath.get(normalized);
  if (extraByPath) return extraByPath;

  const base = normalized.split('/').pop();
  const extraByBase = additionalLookup.byBase.get(base);
  if (extraByBase) return extraByBase;

  if (modelSourceByFileName.has(base)) {
    return { source: modelSourceByFileName.get(base), virtualPath: base };
  }

  return null;
}

function collectRecursiveDeps(entrySource, additionalLookup) {
  const deps = [];
  const seen = new Set();
  const queue = [...parseIncludeDependencies(entrySource)];

  while (queue.length > 0) {
    const dep = queue.shift();
    const normalized = normalizeIncludePath(dep);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);

    const resolved = resolveAdHocDependency(normalized, additionalLookup);
    if (!resolved) continue;

    deps.push(resolved);
    const childDeps = parseIncludeDependencies(resolved.source);
    for (const child of childDeps) {
      const childNormalized = normalizeIncludePath(child);
      if (!seen.has(childNormalized)) queue.push(childNormalized);
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

  for (const depFile of collectRecursiveDeps(overriddenSource, additionalLookup)) {
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
  return modelSourceByFileName.get(entry.fileName) ?? null;
}

export function getCatalog() {
  return catalog;
}
