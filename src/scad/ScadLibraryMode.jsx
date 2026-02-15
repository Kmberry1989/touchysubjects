import React from 'react';
import { Download, Upload, Save, RefreshCw } from 'lucide-react';
import SCADViewer from '../components/SCADViewer';
import ScadControls from './controls';
import { applyParamOverrides } from './override';
import { getCatalog, getCompileBundleForModel, getModelSource } from './sourceRegistry';

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
  const params = new URLSearchParams(window.location.search);
  params.set('mode', 'library');
  params.set('model', modelId);
  if (presetName) params.set('preset', presetName);
  else params.delete('preset');
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', next);
}

function statusForModel(entry) {
  const hasMissingDeps = entry.includeDeps.some(
    (dep) => !dep.includes('utils/') && !dep.includes('write/') && !dep.includes('MCAD/') && !dep.includes('threads.scad') && !dep.includes('text_on.scad') && !dep.endsWith('.scad')
  );
  const imageParam = entry.params.some((p) => p.type === 'image_surface' || p.type === 'image_array');
  if (hasMissingDeps) return 'Missing lib';
  if (imageParam) return 'Needs image input';
  return 'Ready';
}

export default function ScadLibraryMode() {
  const catalog = React.useMemo(() => getCatalog(), []);
  const categoryTree = React.useMemo(() => buildCategoryTree(catalog.entries), [catalog.entries]);

  const initialModel = getInitialModeModel() ?? catalog.entries[0]?.id;
  const [selectedModelId, setSelectedModelId] = React.useState(initialModel);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [presets, setPresets] = React.useState(() => safeJsonParse(localStorage.getItem(PRESET_KEY), {}));

  const selectedEntry = React.useMemo(
    () => catalog.entries.find((entry) => entry.id === selectedModelId) ?? catalog.entries[0],
    [catalog.entries, selectedModelId]
  );

  const [values, setValues] = React.useState({});

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

  const overriddenSource = React.useMemo(() => {
    if (!selectedEntry) return '';
    const source = getModelSource(selectedEntry.id) ?? '';
    return applyParamOverrides(source, selectedEntry.params, values);
  }, [selectedEntry, values]);

  const compileRequest = React.useMemo(() => {
    if (!selectedEntry) return null;
    return {
      type: 'compile-v2',
      ...getCompileBundleForModel(selectedEntry.id, overriddenSource),
    };
  }, [selectedEntry, overriddenSource]);

  const onChangeParam = React.useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const savePreset = React.useCallback(() => {
    if (!selectedEntry) return;
    const name = window.prompt('Preset name');
    if (!name) return;
    const next = {
      ...presets,
      [selectedEntry.id]: {
        ...(presets[selectedEntry.id] ?? {}),
        [name]: values,
      },
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
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selectedEntry.fileName}.preset.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [selectedEntry, values]);

  const importPreset = React.useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const parsed = safeJsonParse(text, null);
      if (!parsed?.values) return;
      setValues((prev) => ({ ...prev, ...parsed.values }));
    });
    event.target.value = '';
  }, []);

  if (!selectedEntry) {
    return <div className="text-gray-600">No SCAD entries available.</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 min-h-[720px]">
      <aside className="col-span-3 bg-white border border-gray-200 rounded-xl p-3 overflow-auto max-h-[80vh]">
        <h2 className="text-lg font-bold mb-3">SCAD Library ({catalog.count})</h2>
        {[...categoryTree.entries()].map(([category, subMap]) => (
          <div key={category} className="mb-3">
            <h3 className="font-semibold text-gray-900 mb-1">{category}</h3>
            {[...subMap.entries()].map(([sub, entries]) => (
              <details key={`${category}-${sub}`} open className="mb-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">{sub}</summary>
                <div className="mt-2 space-y-1 pl-2">
                  {entries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedModelId(entry.id)}
                      className={`w-full text-left text-xs px-2 py-1 rounded border ${selectedModelId === entry.id ? 'bg-blue-50 border-blue-300 text-blue-900' : 'border-transparent hover:bg-gray-50'}`}
                    >
                      <div className="font-semibold">{entry.displayName}</div>
                      {entry.duplicateOf && <div className="text-[11px] text-orange-700">Exact duplicate of {entry.duplicateOf}</div>}
                      <div className="text-[11px] text-gray-500">{statusForModel(entry)}</div>
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
          {selectedEntry.duplicateOf && (
            <p className="text-sm text-orange-700">Exact duplicate of `{selectedEntry.duplicateOf}`.</p>
          )}
          <div className="text-xs text-gray-600">Dependency status: {statusForModel(selectedEntry)}</div>
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <button onClick={savePreset} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-semibold inline-flex items-center gap-1"><Save size={14} /> Save</button>
            <button onClick={exportPreset} className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 text-sm font-semibold inline-flex items-center gap-1"><Download size={14} /> Export</button>
            <label className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 text-sm font-semibold inline-flex items-center gap-1 cursor-pointer"><Upload size={14} /> Import
              <input type="file" accept="application/json" className="hidden" onChange={importPreset} />
            </label>
            <select
              className="px-2 py-1.5 rounded border border-gray-300 text-sm"
              onChange={(e) => loadPreset(e.target.value)}
              defaultValue=""
            >
              <option value="">Load preset...</option>
              {Object.keys(presets[selectedEntry.id] ?? {}).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <ScadControls title="Basic Parameters" params={basicParams} values={values} onChange={onChangeParam} />

        <div className="space-y-2">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="px-3 py-2 rounded bg-amber-100 border border-amber-300 text-amber-900 text-sm font-semibold inline-flex items-center gap-1"
          >
            <RefreshCw size={14} /> {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          {showAdvanced && (
            <ScadControls title="Advanced Parameters" params={advancedParams} values={values} onChange={onChangeParam} />
          )}
        </div>
      </section>

      <section className="col-span-5 space-y-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 h-[500px]">
          <SCADViewer compileRequest={compileRequest} />
        </div>
        <div className="bg-gray-900 rounded-xl p-3 h-[260px] overflow-auto">
          <pre className="text-green-300 text-xs whitespace-pre-wrap">{overriddenSource}</pre>
        </div>
      </section>
    </div>
  );
}
