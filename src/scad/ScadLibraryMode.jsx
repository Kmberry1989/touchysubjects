import React from 'react';
import { Download, Upload, Save, RefreshCw } from 'lucide-react';
import SCADViewer from '../components/SCADViewer';
import ScadControls from './controls';
import { parseIncludeDependencies, parseScadSource } from './parser';
import { applyParamOverrides } from './override';
import { normalizeExternalAssetPath, resolveExternalAssetPaths } from './externalAssets';
import {
  getCatalog,
  getCompileBundleForAdHoc,
  getCompileBundleForModel,
  getModelSource
} from './sourceRegistry';

const PRESET_KEY = 'scad-library-presets-v1';

function safeJsonParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function getInitialModeModel() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const model = params.get('model');
  if (mode === 'library' && model) return model;
  return null;
}

function buildCategoryTree(entries) {
  const tree = new Map();
  for (const entry of entries) {
    if (!tree.has(entry.category)) tree.set(entry.category, new Map());
    const subMap = tree.get(entry.category);
    if (!subMap.has(entry.subcategory)) subMap.set(entry.subcategory, []);
    subMap.get(entry.subcategory).push(entry);
  }
  for (const subMap of tree.values()) {
    for (const list of subMap.values()) {
      list.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
  }
  return tree;
}

function updateUrl(modelId, presetName) {
  if (!modelId) return;
  const params = new URLSearchParams(window.location.search);
  params.set('mode', 'library');
  params.set('model', modelId);
  if (presetName) params.set('preset', presetName);
  else params.delete('preset');
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', next);
}

function displayNameFromFileName(fileName) {
  return String(fileName || 'Untitled')
    .replace(/\.scad$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasExternalAssetImports(source) {
  return /\bimport\s*\(/.test(String(source || ''));
}

function createCustomEntry(fileName, source) {
  const parsed = parseScadSource(source);
  return {
    id: `custom:${fileName}`,
    fileName,
    filePath: `Local upload/${fileName}`,
    displayName: displayNameFromFileName(fileName),
    category: 'My Files',
    subcategory: 'Uploads',
    duplicateOf: null,
    includeDeps: parseIncludeDependencies(source),
    needsExternalAsset: hasExternalAssetImports(source),
    sections: parsed.sections,
    params: parsed.params,
    sourceType: 'custom'
  };
}

function makeDefaultCustomSource() {
  return `/* [General] */
size = 20; // [5:1:100]
$fn = 48;

cube([size, size, size], center=true);
`;
}

function statusForModel(entry, availableFileNames) {
  const hasMissingDeps = (entry.includeDeps ?? []).some((dep) => {
    const normalized = String(dep || '')
      .replace(/\\/g, '/')
      .replace(/^\.\//, '');
    if (!normalized) return false;

    const knownVendor =
      normalized.startsWith('utils/') ||
      normalized.startsWith('write/') ||
      normalized.startsWith('MCAD/') ||
      normalized === 'threads.scad' ||
      normalized === 'text_on.scad' ||
      normalized === 'write.scad';
    if (knownVendor) return false;

    const base = normalized.split('/').pop();
    return !availableFileNames.has(normalized) && !availableFileNames.has(base);
  });

  const imageParam = (entry.params ?? []).some(
    (p) => p.type === 'image_surface' || p.type === 'image_array'
  );
  if (entry.needsExternalAsset) return 'Needs file input';
  if (hasMissingDeps) return 'Missing lib';
  if (imageParam) return 'Needs image input';
  return 'Ready';
}

export default function ScadLibraryMode() {
  const catalog = React.useMemo(() => getCatalog(), []);
  const initialModel = getInitialModeModel() ?? catalog.entries[0]?.id;

  const [selectedModelId, setSelectedModelId] = React.useState(initialModel);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [presets, setPresets] = React.useState(() =>
    safeJsonParse(localStorage.getItem(PRESET_KEY), {})
  );
  const [customEntries, setCustomEntries] = React.useState([]);
  const [customSources, setCustomSources] = React.useState({});
  const [externalAssets, setExternalAssets] = React.useState({});
  const [values, setValues] = React.useState({});

  const allEntries = React.useMemo(
    () => [...customEntries, ...catalog.entries],
    [catalog.entries, customEntries]
  );
  const categoryTree = React.useMemo(() => buildCategoryTree(allEntries), [allEntries]);
  const availableFileNames = React.useMemo(
    () => new Set(allEntries.map((entry) => entry.fileName)),
    [allEntries]
  );

  const selectedEntry = React.useMemo(
    () => allEntries.find((entry) => entry.id === selectedModelId) ?? allEntries[0],
    [allEntries, selectedModelId]
  );

  React.useEffect(() => {
    if (!selectedEntry) return;
    const initialValues = {};
    selectedEntry.params.forEach((param) => {
      if (!param.editable) return;
      initialValues[param.key] = param.defaultValue;
    });
    setValues(initialValues);
    updateUrl(selectedEntry.id);
  }, [selectedEntry]);

  const basicParams = React.useMemo(
    () => selectedEntry?.params.filter((p) => p.editable && p.visibility === 'basic') ?? [],
    [selectedEntry]
  );

  const advancedParams = React.useMemo(
    () => selectedEntry?.params.filter((p) => p.editable && p.visibility === 'advanced') ?? [],
    [selectedEntry]
  );

  const selectedSource = React.useMemo(() => {
    if (!selectedEntry) return '';
    if (selectedEntry.sourceType === 'custom') {
      return customSources[selectedEntry.id] ?? '';
    }
    return getModelSource(selectedEntry.id) ?? '';
  }, [customSources, selectedEntry]);

  const overriddenSource = React.useMemo(() => {
    if (!selectedEntry) return '';
    return applyParamOverrides(selectedSource, selectedEntry.params, values);
  }, [selectedEntry, selectedSource, values]);

  const requiredExternalAssetPaths = React.useMemo(() => {
    if (!selectedEntry?.needsExternalAsset) return [];
    return resolveExternalAssetPaths(overriddenSource, values);
  }, [overriddenSource, selectedEntry, values]);

  const externalAssetResolution = React.useMemo(() => {
    return requiredExternalAssetPaths.map((assetPath) => {
      const exact = externalAssets[assetPath];
      const base = assetPath.split('/').pop();
      const baseMatch = !exact && base ? externalAssets[base] : null;
      const content = exact ?? baseMatch ?? null;
      const providedBy = exact ? assetPath : baseMatch ? base : null;
      return {
        assetPath,
        content,
        provided: Boolean(content),
        providedBy
      };
    });
  }, [externalAssets, requiredExternalAssetPaths]);

  const missingExternalAssetPaths = React.useMemo(
    () => externalAssetResolution.filter((item) => !item.provided).map((item) => item.assetPath),
    [externalAssetResolution]
  );

  const mountedExternalAssetFiles = React.useMemo(
    () =>
      externalAssetResolution
        .filter((item) => item.provided)
        .map((item) => ({ path: item.assetPath, content: item.content })),
    [externalAssetResolution]
  );

  const compileBlockReason = React.useMemo(() => {
    if (!selectedEntry?.needsExternalAsset) return null;

    if (requiredExternalAssetPaths.length === 0) {
      return 'This model calls import() but no concrete import filename was resolved. Set the filename parameter and upload a matching asset file.';
    }

    if (missingExternalAssetPaths.length > 0) {
      return `Missing external asset file(s): ${missingExternalAssetPaths.join(', ')}. Upload matching file(s) to render this model.`;
    }

    return null;
  }, [missingExternalAssetPaths, requiredExternalAssetPaths, selectedEntry]);

  const compileRequest = React.useMemo(() => {
    if (!selectedEntry) return null;
    if (compileBlockReason) return null;

    if (selectedEntry.sourceType === 'custom') {
      const additionalFiles = customEntries
        .map((entry) => ({ fileName: entry.fileName, source: customSources[entry.id] }))
        .filter((file) => typeof file.source === 'string');

      return {
        type: 'compile-v2',
        ...getCompileBundleForAdHoc(
          selectedEntry.fileName,
          overriddenSource,
          additionalFiles,
          mountedExternalAssetFiles
        )
      };
    }

    return {
      type: 'compile-v2',
      ...getCompileBundleForModel(selectedEntry.id, overriddenSource, mountedExternalAssetFiles)
    };
  }, [
    compileBlockReason,
    customEntries,
    customSources,
    mountedExternalAssetFiles,
    overriddenSource,
    selectedEntry
  ]);

  const onChangeParam = React.useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const importExternalAssets = React.useCallback(async (event) => {
    const input = event.target;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) {
      input.value = '';
      return;
    }

    try {
      const loaded = await Promise.all(
        files.map(async (file) => ({
          fileName: file.name,
          content: new Uint8Array(await file.arrayBuffer())
        }))
      );

      setExternalAssets((prev) => {
        const next = { ...prev };
        for (const file of loaded) {
          const normalized = normalizeExternalAssetPath(file.fileName);
          if (!normalized) continue;
          next[normalized] = file.content;
        }
        return next;
      });
    } finally {
      input.value = '';
    }
  }, []);

  const addCustomSources = React.useCallback((loadedFiles) => {
    if (loadedFiles.length === 0) return;

    const nextEntries = loadedFiles.map(({ fileName, source }) =>
      createCustomEntry(fileName, source)
    );
    setCustomEntries((prev) => {
      const byId = new Map(prev.map((entry) => [entry.id, entry]));
      for (const entry of nextEntries) {
        byId.set(entry.id, entry);
      }
      return Array.from(byId.values());
    });

    setCustomSources((prev) => {
      const next = { ...prev };
      for (const { fileName, source } of loadedFiles) {
        next[`custom:${fileName}`] = source;
      }
      return next;
    });

    setSelectedModelId(nextEntries[0].id);
  }, []);

  const importScadFiles = React.useCallback(
    async (event) => {
      const input = event.target;
      const files = Array.from(input.files ?? []).filter((file) =>
        file.name.toLowerCase().endsWith('.scad')
      );
      if (files.length === 0) {
        input.value = '';
        return;
      }

      try {
        const loaded = await Promise.all(
          files.map(async (file) => ({
            fileName: file.name,
            source: await file.text()
          }))
        );
        addCustomSources(loaded);
      } finally {
        input.value = '';
      }
    },
    [addCustomSources]
  );

  const createBlankFile = React.useCallback(() => {
    const existingNames = new Set(customEntries.map((entry) => entry.fileName.toLowerCase()));
    let idx = 1;
    let fileName = `untitled_${idx}.scad`;
    while (existingNames.has(fileName.toLowerCase())) {
      idx += 1;
      fileName = `untitled_${idx}.scad`;
    }
    addCustomSources([{ fileName, source: makeDefaultCustomSource() }]);
  }, [addCustomSources, customEntries]);

  const removeLocalFile = React.useCallback(() => {
    if (!selectedEntry || selectedEntry.sourceType !== 'custom') return;
    const removeId = selectedEntry.id;
    setCustomEntries((prev) => prev.filter((entry) => entry.id !== removeId));
    setCustomSources((prev) => {
      const next = { ...prev };
      delete next[removeId];
      return next;
    });
    setPresets((prev) => {
      if (!prev[removeId]) return prev;
      const next = { ...prev };
      delete next[removeId];
      localStorage.setItem(PRESET_KEY, JSON.stringify(next));
      return next;
    });
    setSelectedModelId((current) => {
      if (current !== removeId) return current;
      return catalog.entries[0]?.id ?? null;
    });
  }, [catalog.entries, selectedEntry]);

  const savePreset = React.useCallback(() => {
    if (!selectedEntry) return;
    const name = window.prompt('Preset name');
    if (!name) return;
    const next = {
      ...presets,
      [selectedEntry.id]: {
        ...(presets[selectedEntry.id] ?? {}),
        [name]: values
      }
    };
    setPresets(next);
    localStorage.setItem(PRESET_KEY, JSON.stringify(next));
    updateUrl(selectedEntry.id, name);
  }, [presets, selectedEntry, values]);

  const loadPreset = React.useCallback(
    (name) => {
      if (!selectedEntry || !name) return;
      const presetValues = presets[selectedEntry.id]?.[name];
      if (!presetValues) return;
      setValues((prev) => ({ ...prev, ...presetValues }));
      updateUrl(selectedEntry.id, name);
    },
    [presets, selectedEntry]
  );

  const exportPreset = React.useCallback(() => {
    if (!selectedEntry) return;
    const payload = {
      model: selectedEntry.id,
      fileName: selectedEntry.fileName,
      values,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedEntry.fileName}.preset.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [selectedEntry, values]);

  const importPreset = React.useCallback((event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const parsed = safeJsonParse(text, null);
      if (!parsed?.values) return;
      setValues((prev) => ({ ...prev, ...parsed.values }));
    });
    input.value = '';
  }, []);

  if (!selectedEntry) {
    return <div className="text-gray-600">No SCAD entries available.</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 min-h-[720px]">
      <aside className="col-span-3 bg-white border border-gray-200 rounded-xl p-3 overflow-auto max-h-[80vh]">
        <h2 className="text-lg font-bold mb-3">
          SCAD Library ({catalog.count}
          {customEntries.length > 0 ? ` + ${customEntries.length} local` : ''})
        </h2>

        <div className="space-y-2 mb-4 pb-3 border-b border-gray-100">
          <label className="w-full px-3 py-2 rounded bg-indigo-100 text-indigo-900 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={14} /> Open .scad file(s)
            <input
              type="file"
              accept=".scad,text/plain"
              multiple
              className="hidden"
              onChange={importScadFiles}
            />
          </label>
          <button
            onClick={createBlankFile}
            className="w-full px-3 py-2 rounded bg-gray-100 border border-gray-300 text-gray-800 text-sm font-semibold"
          >
            Create Blank File
          </button>
          <p className="text-[11px] text-gray-500">
            Local files are available in this browser session.
          </p>
        </div>

        {[...categoryTree.entries()].map(([category, subMap]) => (
          <div key={category} className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1">{category}</h3>
            {[...subMap.entries()].map(([sub, entries]) => (
              <details key={`${category}-${sub}`} open className="mb-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  {sub}
                </summary>
                <div className="mt-2 space-y-1 pl-2">
                  {entries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedModelId(entry.id)}
                      className={`w-full text-left text-xs px-2 py-1 rounded border ${selectedModelId === entry.id ? 'bg-blue-50 border-blue-300 text-blue-900' : 'border-transparent hover:bg-gray-50'}`}
                    >
                      <div className="font-semibold">{entry.displayName}</div>
                      {entry.sourceType === 'custom' && (
                        <div className="text-[11px] text-indigo-700">Local file</div>
                      )}
                      {entry.duplicateOf && (
                        <div className="text-[11px] text-orange-700">
                          Exact duplicate of {entry.duplicateOf}
                        </div>
                      )}
                      <div className="text-[11px] text-gray-500">
                        {statusForModel(entry, availableFileNames)}
                      </div>
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>
        ))}
      </aside>

      <section className="col-span-4 space-y-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
          <h2 className="text-lg font-bold">{selectedEntry.displayName}</h2>
          <p className="text-xs text-gray-500 font-mono">{selectedEntry.filePath}</p>
          {selectedEntry.sourceType === 'custom' && (
            <p className="text-xs text-indigo-700">Editing a local uploaded SCAD file.</p>
          )}
          {selectedEntry.duplicateOf && (
            <p className="text-sm text-orange-700">
              Exact duplicate of `{selectedEntry.duplicateOf}`.
            </p>
          )}
          <div className="text-xs text-gray-600">
            Dependency status: {statusForModel(selectedEntry, availableFileNames)}
          </div>
          {selectedEntry.needsExternalAsset && (
            <div
              data-testid="external-asset-panel"
              className="space-y-2 rounded border border-amber-200 bg-amber-50 px-2 py-2"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-xs font-semibold text-amber-900">External Asset Files</p>
                <label className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs font-semibold cursor-pointer">
                  Upload asset file(s)
                  <input
                    data-testid="external-asset-input"
                    type="file"
                    multiple
                    accept=".svg,.dxf,.stl,.off,.amf,.3mf,.png,.jpg,.jpeg,.bmp,.gif"
                    className="hidden"
                    onChange={importExternalAssets}
                  />
                </label>
              </div>

              {requiredExternalAssetPaths.length > 0 ? (
                <div className="space-y-1">
                  {externalAssetResolution.map((item) => (
                    <div
                      key={item.assetPath}
                      className="flex items-center justify-between gap-2 text-[11px]"
                    >
                      <span className="font-mono text-amber-900">{item.assetPath}</span>
                      <span
                        className={
                          item.provided
                            ? 'text-green-700 font-semibold'
                            : 'text-red-700 font-semibold'
                        }
                      >
                        {item.provided
                          ? `Provided${item.providedBy && item.providedBy !== item.assetPath ? ` (${item.providedBy})` : ''}`
                          : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-amber-900">
                  No concrete import filename detected yet. Set the filename parameter to a literal
                  file path.
                </p>
              )}
            </div>
          )}
          {compileBlockReason && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              {compileBlockReason}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <button
              onClick={savePreset}
              className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-semibold inline-flex items-center gap-1"
            >
              <Save size={14} /> Save
            </button>
            <button
              onClick={exportPreset}
              className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 text-sm font-semibold inline-flex items-center gap-1"
            >
              <Download size={14} /> Export
            </button>
            <label className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 text-sm font-semibold inline-flex items-center gap-1 cursor-pointer">
              <Upload size={14} /> Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={importPreset}
              />
            </label>
            <select
              className="px-2 py-1.5 rounded border border-gray-300 text-sm"
              onChange={(e) => loadPreset(e.target.value)}
              defaultValue=""
            >
              <option value="">Load preset...</option>
              {Object.keys(presets[selectedEntry.id] ?? {}).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {selectedEntry.sourceType === 'custom' && (
              <button
                onClick={removeLocalFile}
                className="px-3 py-1.5 rounded bg-red-100 border border-red-200 text-red-800 text-sm font-semibold"
              >
                Remove Local File
              </button>
            )}
          </div>
        </div>

        <ScadControls
          title="Basic Parameters"
          params={basicParams}
          values={values}
          onChange={onChangeParam}
        />

        <div className="space-y-2">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="px-3 py-2 rounded bg-amber-100 border border-amber-300 text-amber-900 text-sm font-semibold inline-flex items-center gap-1"
          >
            <RefreshCw size={14} /> {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          {showAdvanced && (
            <ScadControls
              title="Advanced Parameters"
              params={advancedParams}
              values={values}
              onChange={onChangeParam}
            />
          )}
        </div>
      </section>

      <section className="col-span-5 space-y-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 h-[500px]">
          <SCADViewer compileRequest={compileRequest} blockedReason={compileBlockReason} />
        </div>
        <div className="bg-gray-900 rounded-xl p-3 h-[260px] overflow-auto">
          <pre className="text-green-300 text-xs whitespace-pre-wrap">{overriddenSource}</pre>
        </div>
      </section>
    </div>
  );
}
