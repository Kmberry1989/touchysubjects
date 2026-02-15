import { useEffect, useRef, useState, useCallback } from 'react';

export function useOpenSCAD() {
    const [compiling, setCompiling] = useState(false);
    const [error, setError] = useState(null);
    const [stlData, setStlData] = useState(null);
    const workerRef = useRef(null);
    const isInitialized = useRef(false);
    const pendingCompileRef = useRef(null);
    const requestIdRef = useRef(0);
    const latestRequestRef = useRef(0);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/openscad.worker.js', import.meta.url), {
            type: 'module',
        });

        workerRef.current.onmessage = (e) => {
            const { type, stlData: resultData, error: errorMsg, requestId } = e.data;

            if (type === 'init-success') {
                isInitialized.current = true;
                console.log('OpenSCAD Worker initialized');
                if (pendingCompileRef.current) {
                    workerRef.current.postMessage(pendingCompileRef.current);
                    pendingCompileRef.current = null;
                }
            } else if (type === 'success' || type === 'success-v2') {
                if (requestId !== undefined && requestId !== latestRequestRef.current) {
                    return;
                }
                setStlData(resultData);
                setCompiling(false);
                setError(null);
            } else if (type === 'error' || type === 'error-v2') {
                if (requestId !== undefined && requestId !== latestRequestRef.current) {
                    return;
                }
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

        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;
        latestRequestRef.current = requestId;
        setCompiling(true);
        setStlData(null);
        setError(null);

        setTimeout(() => {
            const postOrQueue = (message) => {
                if (!isInitialized.current) {
                    pendingCompileRef.current = message;
                    return;
                }
                workerRef.current.postMessage(message);
            };

            if (typeof payload === 'string') {
                postOrQueue({ type: 'compile', code: payload, requestId });
                return;
            }

            if (payload && payload.type === 'compile-v2') {
                postOrQueue({ ...payload, requestId });
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
