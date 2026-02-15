/* eslint-disable react/prop-types */
import React from 'react';

function SearchableSelect({ value, options, onChange }) {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    if (!query.trim()) return options;
    const lower = query.toLowerCase();
    return options.filter((opt) => String(opt.label).toLowerCase().includes(lower));
  }, [options, query]);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter options..."
        className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
      />
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white"
      >
        {filtered.map((opt) => (
          <option key={`${opt.value}-${opt.label}`} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function coerceEnumValue(raw, template) {
  if (typeof template === 'number') {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : template;
  }
  if (typeof template === 'boolean') {
    return raw === 'true';
  }
  return raw;
}

function ParamControl({ param, value, onChange }) {
  if (param.type === 'enum' && Array.isArray(param.options)) {
    const huge = param.options.length > 25;
    if (huge) {
      return (
        <SearchableSelect
          value={value}
          options={param.options}
          onChange={(next) => onChange(coerceEnumValue(next, param.defaultValue))}
        />
      );
    }

    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(coerceEnumValue(e.target.value, param.defaultValue))}
        className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white"
      >
        {param.options.map((opt) => (
          <option key={`${opt.value}-${opt.label}`} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (param.type === 'boolean') {
    return (
      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        Enabled
      </label>
    );
  }

  if (param.type === 'number') {
    const hasRange = Number.isFinite(param.min) && Number.isFinite(param.max);
    if (hasRange) {
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={param.min}
            max={param.max}
            step={param.step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
          />
          <input
            type="number"
            value={Number(value)}
            min={param.min}
            max={param.max}
            step={param.step ?? 1}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
          />
        </div>
      );
    }

    return (
      <input
        type="number"
        value={Number(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
      />
    );
  }

  if (param.type === 'image_array') {
    return (
      <textarea
        rows={4}
        value={typeof value === 'string' ? value : JSON.stringify(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded border border-gray-300 text-xs font-mono"
      />
    );
  }

  return (
    <input
      type="text"
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
    />
  );
}

export default function ScadControls({ params, values, onChange, title }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
      <h3 className="font-bold text-gray-900">{title}</h3>
      {params.length === 0 && <p className="text-sm text-gray-500">No editable parameters in this section.</p>}
      {params.map((param) => (
        <div key={param.key} className="space-y-1 border-b border-gray-100 pb-3 last:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-gray-900">{param.key}</label>
            <span className="text-xs text-gray-500">{param.section}</span>
          </div>
          <ParamControl param={param} value={values[param.key]} onChange={(v) => onChange(param.key, v)} />
          {param.rawHint && <p className="text-xs text-gray-500">Hint: [{param.rawHint}]</p>}
        </div>
      ))}
    </div>
  );
}
