import { createOpenSCAD } from 'openscad-wasm';

let generator = null;

self.onmessage = async (e) => {
    const { type, code } = e.data;

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
    } else if (type === 'compile') {
        if (!generator) {
            self.postMessage({ type: 'error', error: 'OpenSCAD not initialized' });
            return;
        }

        try {
            const instance = generator.getInstance();

            // Write input file
            instance.FS.writeFile('/input.scad', code);

            // Execute OpenSCAD
            // -o output.stl means export to STL
            // --export-format stl is implicit with .stl extension
            try {
                instance.callMain(['/input.scad', '-o', 'output.stl']);
            } catch (e) {
                // catch exit exceptions if any, though openscad-wasm usually catches them
                if (e.message !== 'unwind' && !e.message.includes('exit')) {
                    throw e;
                }
            }

            // Check if output file exists
            // Emscripten FS usually throws if file doesn't exist
            let stlData;
            try {
                stlData = instance.FS.readFile('/output.stl');
            } catch (fsErr) {
                throw new Error('Compilation failed: Output file not created. Check SCAD syntax errors in console.');
            }

            // Cleanup
            try { instance.FS.unlink('/input.scad'); } catch (e) { }
            try { instance.FS.unlink('/output.stl'); } catch (e) { }

            // Send back buffer
            // stlData is a Uint8Array. We transfer its buffer for performance.
            self.postMessage({ type: 'success', stlData }, [stlData.buffer]);

        } catch (err) {
            console.error('OpenSCAD compile error:', err);
            self.postMessage({ type: 'error', error: err.message || 'Unknown compilation error' });
        }
    }
};
