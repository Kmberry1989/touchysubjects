export function isExpectedMainExit(err) {
  if (typeof err === 'number') return true;
  const message = String(err?.message ?? err ?? '').toLowerCase();
  return message === 'unwind' || message.includes('exit');
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
