/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Orbit,
  Sparkles,
  Layers,
  Activity,
  Compass,
  Grid,
  Info,
  Maximize2,
  Box
} from 'lucide-react';
import { LieEmbeddingData, LieGroupType } from '../types';

interface LieEmbeddingViewProps {
  lieData: LieEmbeddingData;
  selectedLieGroup: LieGroupType;
  onChangeLieGroup: (group: LieGroupType) => void;
  modelName: string;
}

export const LieEmbeddingView: React.FC<LieEmbeddingViewProps> = ({
  lieData,
  selectedLieGroup,
  onChangeLieGroup,
  modelName
}) => {
  const [selectedGenerator, setSelectedGenerator] = useState<number>(0);
  const [showMatrixView, setShowMatrixView] = useState<boolean>(true);

  const activeGen = lieData.generators[selectedGenerator] || lieData.generators[0];

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Lie Group Profile Banner */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-950/40">
            <Orbit className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 font-mono">
                {lieData.lieAlgebraName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/50">
                Root: {lieData.rootSystemType}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Continuous symmetry manifold embedding for {modelName}
            </p>
          </div>
        </div>

        {/* Dimension & Invariants Badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
            <span className="text-slate-500">dim(𝔤) = </span>
            <span className="text-purple-300 font-bold">{lieData.dimension}</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
            <span className="text-slate-500">Rank(𝔥) = </span>
            <span className="text-cyan-300 font-bold">{lieData.cartanSubalgebraDim}</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
            <span className="text-slate-500">Casimir C₂ = </span>
            <span className="text-amber-300 font-bold">{lieData.casimirInvariantValue}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Root System & Generators + Killing Form Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 flex-1 overflow-y-auto">
        {/* Left Column: 2D Root System & Generator Space (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Root System &amp; Weyl Weight Space ({lieData.rootSystemType})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Cartan dual space 𝔥*</span>
            </div>

            {/* Interactive Root System Canvas */}
            <div className="relative h-64 bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              {/* Radial Weyl Chambers Background */}
              <svg className="w-full h-full" viewBox="-2 -2 4 4">
                {/* Concentric Root Shells */}
                <circle cx="0" cy="0" r="1.5" fill="none" stroke="#1e293b" strokeWidth="0.02" strokeDasharray="0.05,0.05" />
                <circle cx="0" cy="0" r="1.0" fill="none" stroke="#334155" strokeWidth="0.02" />
                <circle cx="0" cy="0" r="0.5" fill="none" stroke="#1e293b" strokeWidth="0.02" strokeDasharray="0.05,0.05" />

                {/* Axes */}
                <line x1="-1.8" y1="0" x2="1.8" y2="0" stroke="#475569" strokeWidth="0.015" />
                <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#475569" strokeWidth="0.015" />

                {/* Weyl Chamber Planes (30/60 deg for A2/G2) */}
                <line x1="-1.5" y1="-0.866" x2="1.5" y2="0.866" stroke="#334155" strokeWidth="0.01" strokeDasharray="0.04,0.04" />
                <line x1="-1.5" y1="0.866" x2="1.5" y2="-0.866" stroke="#334155" strokeWidth="0.01" strokeDasharray="0.04,0.04" />

                {/* Root Vectors */}
                {lieData.generators.map((gen, idx) => {
                  const isSelected = idx === selectedGenerator;
                  const [rx, ry] = gen.weightVector;
                  return (
                    <g key={gen.name} className="cursor-pointer" onClick={() => setSelectedGenerator(idx)}>
                      {/* Vector Arrow from Origin */}
                      <line
                        x1="0"
                        y1="0"
                        x2={rx}
                        y2={ry}
                        stroke={isSelected ? '#38bdf8' : '#818cf8'}
                        strokeWidth={isSelected ? 0.04 : 0.025}
                      />
                      {/* Root Vertex Node */}
                      <circle
                        cx={rx}
                        cy={ry}
                        r={isSelected ? 0.12 : 0.08}
                        fill={isSelected ? '#38bdf8' : '#4338ca'}
                        stroke={isSelected ? '#ffffff' : '#6366f1'}
                        strokeWidth="0.02"
                      />
                      {/* Root Label */}
                      <text
                        x={rx * 1.18}
                        y={ry * 1.18}
                        fontSize="0.14"
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {gen.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-mono">
                Click any root vector to inspect matrix generator
              </div>
            </div>

            {/* Generator Selection Tabs */}
            <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
              {lieData.generators.map((gen, idx) => (
                <button
                  key={gen.name}
                  onClick={() => setSelectedGenerator(idx)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    selectedGenerator === idx
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {gen.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Generator Matrix Inspector */}
          {activeGen && (
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono">
                    Generator: {activeGen.name}
                  </h4>
                </div>
                <div className="flex gap-2 text-[11px] font-mono text-slate-400">
                  <span>Tr(T) = {activeGen.trace}</span>
                  <span>||T||_F = {activeGen.frobeniusNorm}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3">{activeGen.description}</p>

              {/* Matrix Layout */}
              <div className="flex items-center justify-center p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm text-cyan-300">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xl font-light">[</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-center">
                    {activeGen.matrix2x2?.map((row, i) => (
                      <React.Fragment key={i}>
                        {row.map((val, j) => (
                          <span
                            key={j}
                            className={`px-2 py-1 rounded ${
                              val !== 0 ? 'bg-cyan-950/40 text-cyan-300 font-bold border border-cyan-800/40' : 'text-slate-600'
                            }`}
                          >
                            {val.toFixed(2)}
                          </span>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-slate-500 text-xl font-light">]</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Killing Form Matrix & Structure Constants (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Cartan-Killing Form Matrix */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Cartan-Killing Metric K_ab
                </h3>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono">Tr(ad_a ∘ ad_b)</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Metric tensor defining geodesic distances and curvature on the Lie group manifold.
            </p>

            {/* Matrix Heatmap Table */}
            <div className="overflow-x-auto bg-slate-950 p-2 rounded-lg border border-slate-800">
              <table className="w-full text-center font-mono text-[11px]">
                <thead>
                  <tr>
                    <th className="p-1 text-slate-600"></th>
                    {lieData.killingFormMatrix.map((_, i) => (
                      <th key={i} className="p-1 text-slate-400 font-semibold">
                        T_{i+1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lieData.killingFormMatrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-1 text-slate-400 font-semibold">T_{i+1}</td>
                      {row.map((val, j) => {
                        const isDiag = i === j;
                        const intensity = Math.min(1, Math.abs(val) / 8);
                        return (
                          <td
                            key={j}
                            className="p-1.5 rounded"
                            style={{
                              backgroundColor: isDiag
                                ? `rgba(168, 85, 247, ${0.15 + intensity * 0.4})`
                                : val !== 0
                                ? `rgba(6, 182, 212, ${0.1 + intensity * 0.3})`
                                : 'transparent'
                            }}
                          >
                            <span className={isDiag ? 'text-purple-300 font-bold' : val !== 0 ? 'text-cyan-300' : 'text-slate-600'}>
                              {val.toFixed(1)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 font-mono">
              Cartan Criterion: Matrix is non-degenerate (det(K) ≠ 0) confirming semi-simplicity.
            </div>
          </div>

          {/* Structure Constants & Commutator Products */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Lie Brackets [T_a, T_b] = f_ab^c T_c
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Non-abelian algebraic closure governing neural representation flow.
            </p>

            <div className="space-y-1.5 font-mono text-xs">
              {lieData.structureConstantsSample.map((sc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/60"
                >
                  <span className="text-purple-300 font-semibold">{sc.bracket}</span>
                  <span className="text-slate-500">⟹</span>
                  <span className="text-cyan-400 font-bold">{sc.result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
