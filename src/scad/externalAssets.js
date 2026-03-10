function unescapeQuoted(value) {
  return value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeExternalAssetPath(value) {
  const normalized = String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');
  return normalized || null;
}

function readStringAssignment(source, varName) {
  const safeName = escapeRegExp(varName);
  const re = new RegExp(`^\\s*\\$?${safeName}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)";`, 'm');
  const m = String(source || '').match(re);
  if (!m) return null;
  return unescapeQuoted(m[1]);
}

export function resolveExternalAssetPaths(source, values = {}) {
  const out = new Set();
  const importRe = /\bimport\s*\(\s*([^,)]+)\s*(?:,|[)])/g;
  let m;

  while ((m = importRe.exec(String(source || ''))) !== null) {
    const arg = m[1].trim();
    let resolved = null;

    if (/^"(?:[^"\\]|\\.)*"$/.test(arg)) {
      resolved = unescapeQuoted(arg.slice(1, -1));
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(arg)) {
      const fromValues = values?.[arg];
      if (typeof fromValues === 'string' && fromValues.trim()) {
        resolved = fromValues.trim();
      } else {
        resolved = readStringAssignment(source, arg);
      }
    }

    const normalized = normalizeExternalAssetPath(resolved);
    if (normalized) out.add(normalized);
  }

  return Array.from(out);
}
