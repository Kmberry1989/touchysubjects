const SECTION_BLOCK_RE = /^\s*\/\*\s*\[([^\]]+)\]\s*\*\//;
const SECTION_LINE_RE = /^\s*\/\/\s*\[([^\]]+)\]\s*$/;
const ASSIGN_RE = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?);\s*(?:\/\/\s*(.*))?$/;

export function parseScadSource(source) {
  const lines = source.split(/\r?\n/);
  const sections = [];
  const params = [];

  let currentSection = 'General';
  let firstBraceSeen = false;

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx];

    if (!firstBraceSeen && line.includes('{')) {
      firstBraceSeen = true;
    }

    const blockSection = line.match(SECTION_BLOCK_RE);
    if (blockSection) {
      currentSection = normalizeSection(blockSection[1]);
      sections.push(currentSection);
      continue;
    }

    const lineSection = line.match(SECTION_LINE_RE);
    if (lineSection) {
      currentSection = normalizeSection(lineSection[1]);
      sections.push(currentSection);
      continue;
    }

    if (firstBraceSeen) {
      continue;
    }

    const match = line.match(ASSIGN_RE);
    if (!match) continue;

    const [, key, rawValue, comment = ''] = match;
    const parsedValue = parseLiteralValue(rawValue.trim());
    const hint = parseHint(comment);
    const visibility = getVisibility(currentSection, key);

    const type = detectType(parsedValue, hint, comment);
    const editable = parsedValue.isLiteral || type === 'image_surface' || type === 'image_array';

    params.push({
      key,
      type,
      section: currentSection,
      visibility,
      editable,
      defaultValue: parsedValue.value,
      rawValue: rawValue.trim(),
      rawHint: hint?.raw ?? null,
      options: hint?.options ?? null,
      min: hint?.min ?? null,
      max: hint?.max ?? null,
      step: hint?.step ?? null,
      sourceSpan: {
        lineStart: idx + 1,
        lineEnd: idx + 1,
      },
    });
  }

  return {
    sections: Array.from(new Set(sections)),
    params,
  };
}

function normalizeSection(value) {
  return String(value || '').trim() || 'General';
}

function getVisibility(section, key) {
  if (/hidden/i.test(section) || key.startsWith('$')) return 'advanced';
  return 'basic';
}

function detectType(parsedValue, hint, comment) {
  const c = comment.toLowerCase();
  if (c.includes('image_surface')) return 'image_surface';
  if (c.includes('image_array')) return 'image_array';
  if (hint?.kind === 'enum') return 'enum';
  if (hint?.kind === 'range') return 'number';
  if (Array.isArray(parsedValue.value)) return 'array';
  if (typeof parsedValue.value === 'number') return 'number';
  if (typeof parsedValue.value === 'boolean') return 'boolean';
  return 'text';
}

function parseLiteralValue(raw) {
  const trimmed = raw.trim();

  if (/^"(?:[^"\\]|\\.)*"$/.test(trimmed)) {
    return { isLiteral: true, value: unescapeQuoted(trimmed.slice(1, -1)) };
  }

  if (/^(true|false)$/i.test(trimmed)) {
    return { isLiteral: true, value: /^true$/i.test(trimmed) };
  }

  if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) {
    return { isLiteral: true, value: Number(trimmed) };
  }

  if (/^\[(.|\s)*\]$/.test(trimmed)) {
    try {
      const jsonLike = trimmed
        .replace(/([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '"$1":')
        .replace(/'/g, '"');
      const parsed = JSON.parse(jsonLike);
      return { isLiteral: true, value: parsed };
    } catch {
      return { isLiteral: false, value: trimmed };
    }
  }

  return { isLiteral: false, value: trimmed };
}

function unescapeQuoted(value) {
  return value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function parseHint(comment) {
  const bracketMatch = comment.match(/\[([^\]]+)\]/);
  if (!bracketMatch) return null;

  const raw = bracketMatch[1].trim();
  if (!raw) return null;

  const isRange = /^\s*[+-]?(?:\d+\.?\d*|\.\d+)\s*:\s*[+-]?(?:\d+\.?\d*|\.\d+)(?:\s*:\s*[+-]?(?:\d+\.?\d*|\.\d+))?\s*$/.test(raw);
  if (isRange) {
    const parts = raw.split(':').map((p) => Number(p.trim()));
    if (parts.length === 2) {
      return { raw, kind: 'range', min: parts[0], max: parts[1], step: null };
    }
    return { raw, kind: 'range', min: parts[0], step: parts[1], max: parts[2] };
  }

  const tokens = splitTopLevel(raw, ',');
  if (tokens.length <= 1) return { raw, kind: 'hint' };

  const options = tokens.map((token) => {
    const trimmed = token.trim();
    const labelSplit = splitTopLevel(trimmed, ':');
    if (labelSplit.length > 1) {
      const [valuePart, ...labelParts] = labelSplit;
      return {
        value: parseOptionValue(valuePart.trim()),
        label: labelParts.join(':').trim(),
      };
    }
    const value = parseOptionValue(trimmed);
    return { value, label: String(value) };
  });

  return { raw, kind: 'enum', options };
}

function parseOptionValue(value) {
  if (/^"(?:[^"\\]|\\.)*"$/.test(value)) return unescapeQuoted(value.slice(1, -1));
  if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value)) return Number(value);
  if (/^(true|false)$/i.test(value)) return /^true$/i.test(value);
  return value;
}

function splitTopLevel(value, separator) {
  const out = [];
  let current = '';
  let quote = null;
  let depth = 0;

  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];

    if (quote) {
      current += ch;
      if (ch === quote && value[i - 1] !== '\\') quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === '[' || ch === '(' || ch === '{') depth += 1;
    if (ch === ']' || ch === ')' || ch === '}') depth -= 1;

    if (ch === separator && depth === 0) {
      out.push(current);
      current = '';
      continue;
    }

    current += ch;
  }

  if (current) out.push(current);
  return out;
}

export function parseIncludeDependencies(source) {
  const deps = [];
  const includeRe = /^\s*(?:use|include)\s*<([^>]+)>/gm;
  let m;
  while ((m = includeRe.exec(source)) !== null) {
    deps.push(m[1].trim());
  }
  return deps;
}
