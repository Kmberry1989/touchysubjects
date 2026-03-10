function toScadLiteral(value, fallbackRaw = '""') {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'string') {
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  return fallbackRaw;
}

export function applyParamOverrides(source, params, values) {
  const lines = source.split(/\r?\n/);
  const byKey = new Map(params.map((p) => [p.key, p]));

  Object.entries(values).forEach(([key, value]) => {
    const def = byKey.get(key);
    if (!def || !def.editable || !def.sourceSpan?.lineStart) return;

    const lineIndex = def.sourceSpan.lineStart - 1;
    const original = lines[lineIndex];
    if (!original) return;

    const replacement = toScadLiteral(value, def.rawValue);
    lines[lineIndex] = original.replace(
      /^\s*(\$?[A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);/,
      (full, lhs) => `${lhs} = ${replacement};`
    );
  });

  return lines.join('\n');
}
