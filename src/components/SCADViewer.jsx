import React, { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import { useOpenSCAD } from '../hooks/useOpenSCAD';
import { Loader2, AlertCircle } from 'lucide-react';

function Model({ stlData }) {
    const geometry = useMemo(() => {
        if (!stlData) return null;
        try {
            const loader = new STLLoader();
            // stlData from worker is Uint8Array, accessing .buffer gives the ArrayBuffer
            return loader.parse(stlData.buffer);
        } catch (e) {
            console.error("Failed to parse STL:", e);
            return null;
        }
    }, [stlData]);

    if (!geometry) return null;

    return (
        <mesh geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial color="#3b82f6" roughness={0.5} metalness={0.1} />
        </mesh>
    );
}

export default function SCADViewer({ code, className = "" }) {
    const { compile, compiling, error, stlData } = useOpenSCAD();

    // Debounce compilation
    useEffect(() => {
        if (!code) return;
        const timer = setTimeout(() => {
            compile(code);
        }, 800); // 800ms delay to avoid freezing during typing if valid
        return () => clearTimeout(timer);
    }, [code, compile]);

    return (
        <div className={`relative w-full h-full min-h-[300px] bg-slate-50 border border-gray-200 rounded-xl overflow-hidden ${className}`}>

            {/* Loading State */}
            {compiling && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm z-10 border border-gray-100">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">Building 3D Model...</span>
                </div>
            )}

            {/* Error State */}
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

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [50, 50, 50], fov: 45 }} dpr={[1, 2]}>
                <color attach="background" args={['#f8fafc']} />
                <Stage environment="city" intensity={0.5} adjustCamera>
                    <Model stlData={stlData} />
                </Stage>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            {!stlData && !compiling && !error && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                    Waiting for code...
                </div>
            )}
        </div>
    );
}
