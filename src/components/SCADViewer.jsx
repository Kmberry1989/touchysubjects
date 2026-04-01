/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useScadCompiler } from '../hooks/useScadCompiler';
import { Loader2, AlertCircle } from 'lucide-react';

function Model({ stlData }) {
  const geometry = useMemo(() => {
    if (!stlData) return null;
    try {
      const loader = new STLLoader();
      return loader.parse(stlData.buffer);
    } catch (e) {
      console.error('Failed to parse STL:', e);
      return null;
    }
  }, [stlData]);

  useEffect(() => {
    return () => {
      geometry?.dispose();
    };
  }, [geometry]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#3b82f6" roughness={0.5} metalness={0.1} />
    </mesh>
  );
}

export default function SCADViewer({ code, compileRequest, blockedReason = null, className = '' }) {
  const { compile, compiling, error, phase, progressMessage, stlData } = useScadCompiler();
  const supportsWebGL = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (blockedReason) return;
    const payload = compileRequest ?? code;
    if (!payload) return;

    compile(payload);
  }, [blockedReason, code, compileRequest, compile]);

  return (
    <div
      className={`relative w-full h-full min-h-[300px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden ${className}`}
    >
      {compiling && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm z-10 border border-gray-100">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">
            {progressMessage || `Building 3D Model (${phase})...`}
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-8 bg-white/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
              <AlertCircle size={20} />
              <span>Render Failed</span>
            </div>
            <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap break-all max-h-[200px] overflow-auto">
              {error}
            </pre>
          </div>
        </div>
      )}

      {blockedReason && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-8 bg-white/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-bold mb-2">
              <AlertCircle size={20} />
              <span>Render Blocked</span>
            </div>
            <p className="text-xs text-amber-900 whitespace-pre-wrap">{blockedReason}</p>
          </div>
        </div>
      )}

      {supportsWebGL ? (
        <Canvas shadows camera={{ position: [50, 50, 50], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={['#f8fafc']} />
          <Stage environment="city" intensity={0.5} adjustCamera>
            <Model stlData={stlData} />
          </Stage>
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 bg-slate-50">
          WebGL unavailable in this environment.
        </div>
      )}

      {!stlData && !compiling && !error && !blockedReason && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
          Waiting for code...
        </div>
      )}
    </div>
  );
}
