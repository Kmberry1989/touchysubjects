import { useEffect, useRef, useState, useCallback } from 'react';
import { normalizeCompilePayload } from '../scad/compilerAdapter';

const COMPILE_TIMEOUT_MS = 45000;

export function useScadCompiler() {
  const [compiling, setCompiling] = useState(false);
  const [error, setError] = useState(null);
  const [stlData, setStlData] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [progressMessage, setProgressMessage] = useState('');
  const workerRef = useRef(null);
  const isInitialized = useRef(false);
  const pendingCompileRef = useRef(null);
  const requestIdRef = useRef(0);
  const latestRequestRef = useRef(0);
  const compileTimeoutRef = useRef(null);

  const clearCompileTimeout = useCallback(() => {
    if (compileTimeoutRef.current) {
      clearTimeout(compileTimeoutRef.current);
      compileTimeoutRef.current = null;
    }
  }, []);

  const resetWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    isInitialized.current = false;
    workerRef.current = new Worker(new URL('../workers/scadCompiler.worker.js', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (event) => {
      const { type, stlData: resultData, error: errorMsg, requestId, phase: nextPhase, message } = event.data;

      if (type === 'init-success') {
        isInitialized.current = true;
        if (pendingCompileRef.current) {
          workerRef.current.postMessage(pendingCompileRef.current);
          pendingCompileRef.current = null;
        }
        return;
      }

      if (requestId !== undefined && requestId !== latestRequestRef.current) {
        return;
      }

      if (type === 'phase') {
        setPhase(nextPhase ?? 'working');
        setProgressMessage(message ?? '');
        return;
      }

      if (type === 'success') {
        clearCompileTimeout();
        setStlData(resultData);
        setCompiling(false);
        setError(null);
        setPhase('done');
        setProgressMessage('Compile complete.');
        return;
      }

      if (type === 'error') {
        clearCompileTimeout();
        setError(errorMsg);
        setCompiling(false);
        setPhase('error');
        setProgressMessage('');
      }
    };

    workerRef.current.postMessage({ type: 'init' });
  }, [clearCompileTimeout]);

  useEffect(() => {
    resetWorker();

    return () => {
      clearCompileTimeout();
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [clearCompileTimeout, resetWorker]);

  const compile = useCallback(
    (payload) => {
      if (!workerRef.current) return;

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      latestRequestRef.current = requestId;
      setCompiling(true);
      setStlData(null);
      setError(null);
      setPhase('queued');
      setProgressMessage('Queueing compile request…');
      clearCompileTimeout();

      setTimeout(() => {
        let request;
        try {
          request = normalizeCompilePayload(payload);
        } catch (err) {
          setError(err.message || 'Invalid compile payload');
          setCompiling(false);
          setPhase('error');
          setProgressMessage('');
          return;
        }

        const message = { type: 'compile-request', request, requestId };
        const postOrQueue = () => {
          if (!isInitialized.current) {
            pendingCompileRef.current = message;
            return;
          }
          workerRef.current.postMessage(message);
        };

        compileTimeoutRef.current = setTimeout(() => {
          if (latestRequestRef.current !== requestId) return;
          pendingCompileRef.current = null;
          setCompiling(false);
          setError(
            `Compilation timed out after ${Math.round(COMPILE_TIMEOUT_MS / 1000)} seconds. Try a simpler model or smaller parameter values.`
          );
          setPhase('error');
          setProgressMessage('');
          resetWorker();
        }, COMPILE_TIMEOUT_MS);

        postOrQueue();
      }, 10);
    },
    [clearCompileTimeout, resetWorker]
  );

  return {
    compile,
    compiling,
    error,
    phase,
    progressMessage,
    stlData
  };
}
