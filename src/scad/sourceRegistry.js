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

export function getCompileBundleForModel(modelId, overriddenSource) {
  const entry = catalogById.get(modelId);
  if (!entry) throw new Error(`Unknown model: ${modelId}`);

  const sourceFiles = [];
  const added = new Set();

  const addFile = (path, content) => {
    if (!content || added.has(path)) return;
    added.add(path);
    sourceFiles.push({ path, content });
  };

  for (const [rel, source] of vendorSourceByRelPath.entries()) {
    addFile(`/lib/${rel}`, source);
  }

  for (const model of catalog.entries) {
    const source = modelSourceByFileName.get(model.fileName);
    if (source) addFile(`/lib/${model.fileName}`, source);
  }

  addFile(`/lib/${entry.fileName}`, overriddenSource);

  for (const dep of entry.includeDeps) {
    const depNormalized = normalizeIncludePath(dep);
    const depModel = resolveModelDependency(depNormalized);
    if (depModel) {
      const depSource = modelSourceByFileName.get(depModel.fileName);
      addFile(`/lib/${depModel.fileName}`, depSource);
    }
  }

  return {
    entryFile: `/lib/${entry.fileName}`,
    cleanupRoot: '/lib',
    sourceFiles,
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
