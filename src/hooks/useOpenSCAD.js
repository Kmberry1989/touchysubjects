import { useEffect, useRef, useState, useCallback } from 'react';

export function useOpenSCAD() {
    const [compiling, setCompiling] = useState(false);
    const [error, setError] = useState(null);
    const [stlData, setStlData] = useState(null);
    const workerRef = useRef(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Initialize worker
        workerRef.current = new Worker(new URL('../workers/openscad.worker.js', import.meta.url), {
            type: 'module',
        });

        workerRef.current.onmessage = (e) => {
            const { type, stlData: resultData, error: errorMsg } = e.data;

            if (type === 'init-success') {
                isInitialized.current = true;
                console.log('OpenSCAD Worker initialized');
            } else if (type === 'success') {
                setStlData(resultData);
                setCompiling(false);
                setError(null);
            } else if (type === 'error') {
                setError(errorMsg);
                setCompiling(false);
                console.error('OpenSCAD Worker Error:', errorMsg);
            }
        };

        // Send init command
        workerRef.current.postMessage({ type: 'init' });

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const compile = useCallback((code) => {
        if (!workerRef.current) return;

        setCompiling(true);
        setStlData(null);
        setError(null);

        // Tiny delay to allow UI to update to "compiling" state before sending message
        setTimeout(() => {
            workerRef.current.postMessage({ type: 'compile', code });
        }, 10);
    }, []);

    return {
        compile,
        compiling,
        error,
        stlData,
    };
}
