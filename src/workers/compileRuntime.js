export function isExpectedMainExit(err) {
  if (typeof err === 'number') return true;
  const message = String(err?.message ?? err ?? '').toLowerCase();
  return message === 'unwind' || message.includes('exit');
}

export function ensureDir(instance, filePath) {
  const parts = String(filePath || '')
    .split('/')
    .filter(Boolean);
  let current = '';

  for (let i = 0; i < parts.length - 1; i += 1) {
    current += `/${parts[i]}`;
    try {
      instance.FS.mkdir(current);
    } catch {
      // directory already exists
    }
  }
}

export function applyCompatibilityPatches(source) {
  let patched = String(source ?? '');
  const applied = [];

  if (patched.includes('version()') && patched.includes('assert')) {
    patched = patched.replace(/assert\s*\(\s*(?=.*version\()/g, 'echo("PATCHED_ASSERT", ');
    applied.push('assert->echo');
  }

  if (patched.includes('assign(')) {
    patched = patched.replace(/assign\s*\(/g, 'let(');
    applied.push('assign->let');
  }

  return {
    source: patched,
    applied
  };
}

export async function ensureDefaultFont(instance, fetchImpl = fetch) {
  const fontPath = '/fonts/LiberationSans-Regular.ttf';
  if (instance.FS.analyzePath(fontPath).exists) return;

  if (!instance.FS.analyzePath('/fonts').exists) {
    instance.FS.mkdir('/fonts');
  }

  let response = await fetchImpl('https://raw.githubusercontent.com/openscad/openscad/master/fonts/Liberation-2.00.1/ttf/LiberationSans-Regular.ttf');
  if (!response.ok) {
    response = await fetchImpl('https://cdn.jsdelivr.net/gh/openscad/openscad@master/fonts/Liberation-2.00.1/ttf/LiberationSans-Regular.ttf');
  }

  if (!response.ok) {
    throw new Error('Unable to load default Liberation Sans font for OpenSCAD text rendering.');
  }

  const fontData = await response.arrayBuffer();
  instance.FS.writeFile(fontPath, new Uint8Array(fontData));
  instance.FS.writeFile(
    '/fonts/fonts.conf',
    `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>/fonts</dir><cachedir>/fonts/cache</cachedir></fontconfig>`
  );
}

export function compileEntry(instance, entryPath) {
  try {
    instance.callMain([entryPath, '-o', 'output.stl']);
  } catch (err) {
    if (!isExpectedMainExit(err)) {
      throw err;
    }
  }

  try {
    // Copy out of Emscripten FS buffer before postMessage transfer.
    // Transferring the original underlying buffer can detach WASM memory.
    const raw = instance.FS.readFile('/output.stl');
    return new Uint8Array(raw);
  } catch {
    throw new Error(
      'Compilation failed: Output file not created. Check SCAD syntax errors in console.'
    );
  }
}

export function normalizeError(err) {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'number') return `OpenSCAD runtime error code: ${err}`;
  if (typeof err === 'string') return err;
  return 'Unknown compilation error';
}
