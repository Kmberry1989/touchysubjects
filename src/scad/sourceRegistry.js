import catalog from '../data/scadCatalog.json';
import sources from '../data/scadSources.json';

const modelSourceByFileName = new Map(Object.entries(sources.modelSources));
const vendorSourceByRelPath = new Map(Object.entries(sources.vendorSources));

const catalogById = new Map(catalog.entries.map((e) => [e.id, e]));
const catalogByFileName = new Map(catalog.entries.map((e) => [e.fileName, e]));

function normalizeIncludePath(includePath) {
  return includePath.replace(/^\.\//, '');
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

export function getCompileBundleForModel(modelId, overriddenSource) {
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

  return {
    entryFile: `/lib/${entry.fileName}`,
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
