import { createOpenSCAD } from 'openscad-wasm';
import { compileEntry, normalizeError } from './compileRuntime.js';

let generator = null;

function ensureDir(instance, filePath) {
    const parts = filePath.split('/').filter(Boolean);
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

self.onmessage = async (e) => {
    const { type, code, entryFile, sourceFiles, requestId } = e.data;

    if (type === 'init') {
        try {
            if (!generator) {
                generator = await createOpenSCAD({
                    print: (text) => console.log('OpenSCAD stdout:', text),
                    printErr: (text) => console.error('OpenSCAD stderr:', text),
                });
            }
            self.postMessage({ type: 'init-success' });
        } catch (err) {
            console.error('OpenSCAD init error:', err);
            self.postMessage({ type: 'error', error: err.message || 'Initialization failed' });
        }
        return;
    }

    if (!generator) {
        self.postMessage({ type: type === 'compile-v2' ? 'error-v2' : 'error', error: 'OpenSCAD not initialized', requestId });
        return;
    }

    if (type === 'compile') {
        try {
            const instance = generator.getInstance();
            instance.FS.writeFile('/input.scad', code);
            const stlData = compileEntry(instance, '/input.scad');
            try {
                instance.FS.unlink('/input.scad');
                instance.FS.unlink('/output.stl');
            } catch {
                // ignore cleanup failures
            }
            self.postMessage({ type: 'success', stlData, requestId }, [stlData.buffer]);
        } catch (err) {
            console.error('OpenSCAD compile error:', err);
            self.postMessage({ type: 'error', error: normalizeError(err), requestId });
        }
        return;
    }

    if (type === 'compile-v2') {
        try {
            const instance = generator.getInstance();
            for (const file of sourceFiles || []) {
                ensureDir(instance, file.path);
                instance.FS.writeFile(file.path, file.content);
            }

            const stlData = compileEntry(instance, entryFile);
            try {
                instance.FS.unlink('/output.stl');
            } catch {
                // ignore cleanup failures
            }

            self.postMessage({ type: 'success-v2', stlData, requestId }, [stlData.buffer]);
        } catch (err) {
            console.error('OpenSCAD compile-v2 error:', err);
            self.postMessage({ type: 'error-v2', error: normalizeError(err), diagnostics: [], requestId });
        }
    }
};
