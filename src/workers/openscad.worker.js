import { createOpenSCAD } from 'openscad-wasm';

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

function compileEntry(instance, entryPath) {
    try {
        instance.callMain([entryPath, '-o', 'output.stl']);
    } catch (e) {
        if (e.message !== 'unwind' && !String(e.message || '').includes('exit')) {
            throw e;
        }
    }

    try {
        return instance.FS.readFile('/output.stl');
    } catch {
        throw new Error('Compilation failed: Output file not created. Check SCAD syntax errors in console.');
    }
}

self.onmessage = async (e) => {
    const { type, code, entryFile, sourceFiles } = e.data;

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
        self.postMessage({ type: type === 'compile-v2' ? 'error-v2' : 'error', error: 'OpenSCAD not initialized' });
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
            self.postMessage({ type: 'success', stlData }, [stlData.buffer]);
        } catch (err) {
            console.error('OpenSCAD compile error:', err);
            self.postMessage({ type: 'error', error: err.message || 'Unknown compilation error' });
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

            self.postMessage({ type: 'success-v2', stlData }, [stlData.buffer]);
        } catch (err) {
            console.error('OpenSCAD compile-v2 error:', err);
            self.postMessage({ type: 'error-v2', error: err.message || 'Unknown compilation error', diagnostics: [] });
        }
    }
};
