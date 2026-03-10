export function resolveNumberValue(value, fallback = 0) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;

  const fallbackParsed = Number(fallback);
  if (Number.isFinite(fallbackParsed)) return fallbackParsed;

  return 0;
}

export function coerceNumberChange(rawValue, currentValue) {
  const parsed = Number(rawValue);
  if (Number.isFinite(parsed)) return parsed;
  return resolveNumberValue(currentValue, 0);
}
