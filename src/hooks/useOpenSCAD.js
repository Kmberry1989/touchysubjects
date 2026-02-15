import { useEffect, useRef, useState, useCallback } from 'react';

export function useOpenSCAD() {
    const [compiling, setCompiling] = useState(false);
    const [error, setError] = useState(null);
    const [stlData, setStlData] = useState(null);
    const workerRef = useRef(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/openscad.worker.js', import.meta.url), {
            type: 'module',
        });

        workerRef.current.onmessage = (e) => {
            const { type, stlData: resultData, error: errorMsg } = e.data;

            if (type === 'init-success') {
                isInitialized.current = true;
                console.log('OpenSCAD Worker initialized');
            } else if (type === 'success' || type === 'success-v2') {
                setStlData(resultData);
                setCompiling(false);
                setError(null);
            } else if (type === 'error' || type === 'error-v2') {
                setError(errorMsg);
                setCompiling(false);
                console.error('OpenSCAD Worker Error:', errorMsg);
            }
        };

        workerRef.current.postMessage({ type: 'init' });

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const compile = useCallback((payload) => {
        if (!workerRef.current) return;

        setCompiling(true);
        setStlData(null);
        setError(null);

        setTimeout(() => {
            if (typeof payload === 'string') {
                workerRef.current.postMessage({ type: 'compile', code: payload });
                return;
            }

            if (payload && payload.type === 'compile-v2') {
                workerRef.current.postMessage(payload);
                return;
            }

            setError('Invalid compile payload');
            setCompiling(false);
        }, 10);
    }, []);

    return {
        compile,
        compiling,
        error,
        stlData,
    };
}
