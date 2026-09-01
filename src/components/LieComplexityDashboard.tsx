/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  Award,
  Zap,
  TrendingUp,
  RotateCw,
  Compass,
  Layers,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LieComplexityReport, NetworkTopology } from '../types';

interface LieComplexityDashboardProps {
  complexity: LieComplexityReport;
  topology: NetworkTopology;
  modelName: string;
}

export const LieComplexityDashboard: React.FC<LieComplexityDashboardProps> = ({
  complexity,
  topology,
  modelName
}) => {
  // Benchmark reference models
  const benchmarks = [
    { name: 'Standard MLP (Linear Chain)', score: 28.4, class: 'Class I', color: 'text-slate-400', bg: 'bg-slate-800' },
    { name: 'Mamba-2 SSD (State-Space)', score: 62.1, class: 'Class III', color: 'text-cyan-400', bg: 'bg-cyan-950' },
    { name: 'FlashAttention-3 (Tiled QK^T)', score: 74.6, class: 'Class III', color: 'text-indigo-400', bg: 'bg-indigo-950' },
    { name: 'LLaMA-3.1 70B Decoder', score: 81.3, class: 'Class III', color: 'text-purple-400', bg: 'bg-purple-950' },
    { name: 'DeepSeek-V3 MoE (256 Exp)', score: 89.7, class: 'Class III', color: 'text-emerald-400', bg: 'bg-emerald-950' },
    { name: 'Symplectic Hamiltonian Attn', score: 94.2, class: 'Class IV', color: 'text-rose-400', bg: 'bg-rose-950' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Banner: Composite Lie Score Gauge */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Circular Gauge Display */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1e293b"
                strokeWidth="3.2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#score-gradient)"
                strokeWidth="3.2"
                strokeDasharray={`${complexity.compositeScore}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-bold font-mono text-slate-100">
                {complexity.compositeScore}
              </span>
              <span className="text-[8px] text-slate-400 font-mono">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                Lie Complexity Index (Ω_Lie)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                {complexity.complexityClass}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluated non-abelian commutator curvature and gauge holonomy for {modelName}
            </p>
          </div>
        </div>

        {/* Quick Invariant Tags */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500">Commutator ||[W,W]||: </span>
            <span className="text-cyan-400 font-bold">{(complexity.metrics.commutatorDivergence * 100).toFixed(1)}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500">Lie Span Rank: </span>
            <span className="text-purple-400 font-bold">{complexity.metrics.algebraicSpanRank}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500">Gauge Holonomy: </span>
            <span className="text-amber-400 font-bold">{complexity.metrics.gaugeHolonomyEnergy} rad</span>
          </div>
        </div>
      </div>

      {/* Main Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 flex-1 overflow-y-auto">
        {/* Left 7 Columns: Metric Breakdown Cards + Layer Commutators */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* 4 Multi-Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase font-mono">Non-Commutativity</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-lg font-bold text-slate-100 font-mono">
                {complexity.metrics.commutatorDivergence}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Avg ||[W_i, W_j]||_F
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase font-mono">Lie Algebra Dim</span>
                <Layers className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-purple-300 font-mono">
                {complexity.metrics.algebraicSpanRank}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {(complexity.metrics.algebraicExpansionRatio * 100).toFixed(0)}% Subspace Expansion
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase font-mono">Loop Holonomy</span>
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono">
                {complexity.metrics.gaugeHolonomyEnergy}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Tr(P exp ∮ A) Phase
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase font-mono">Casimir Disp</span>
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-emerald-300 font-mono">
                {complexity.metrics.casimirDispersion}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Var(C₂) Spectral Spread
              </div>
            </div>
          </div>

          {/* Layer-by-Layer Commutator Interaction Table */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Layer-Pair Commutator Spectrum [W_i, W_j]
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Subspace Generation</span>
            </div>

            <div className="space-y-2">
              {complexity.layerCommutators.map((comm, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/70 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40 text-[11px]">
                      [{comm.layerPair[0]} , {comm.layerPair[1]}]
                    </span>
                    <span className="text-slate-400 text-[11px] hidden md:inline">
                      {comm.interpretation}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                        style={{ width: `${Math.min(100, comm.commutatorNorm * 100)}%` }}
                      />
                    </div>
                    <span className="text-cyan-400 font-bold w-12 text-right">
                      {comm.commutatorNorm.toFixed(3)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Independent Homology Loops & Wilson Holonomy */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Contraction Homology Cycles (β₁ = {topology.bettiNumbers.b1})
                </h3>
              </div>
              <span className="text-[11px] text-amber-400/80 font-mono">Gauge Invariance &amp; Berry Phase</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {complexity.homologyLoops.map((loop, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-cyan-300">
                      <span className="text-slate-500">Loop γ_{idx + 1}:</span>
                      <span>{loop.loopPath.join(' ➔ ')}</span>
                    </div>
                    <span className="text-amber-300 font-bold">
                      Δθ = {loop.geometricPhase.toFixed(2)} rad
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{loop.description}</span>
                    <span>Holonomy Tr(P exp ∮ A) = {loop.holonomyTrace}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Benchmarks & Theoretical Proofs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Architecture Complexity Benchmark Leaderboard */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Comparative Lie Complexity Suite
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {benchmarks.map((bm) => {
                const isCurrent = bm.name.toLowerCase().includes(modelName.toLowerCase().slice(0, 5));
                return (
                  <div
                    key={bm.name}
                    className={`p-2.5 rounded-lg border flex items-center justify-between font-mono ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-sm'
                        : 'bg-slate-950 border-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCurrent && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                      <span className={isCurrent ? 'text-cyan-200 font-bold' : 'text-slate-300'}>
                        {bm.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400">
                        {bm.class}
                      </span>
                      <span className={`font-bold ${bm.color}`}>
                        {bm.score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theoretical Representation Theorems */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Representation Theorems &amp; Invariants
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              {complexity.theoreticalImplications.map((imp, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded bg-slate-950/60 border border-slate-800/50">
                  <span className="text-cyan-400 font-mono font-bold mt-0.5">{idx + 1}.</span>
                  <p className="leading-relaxed">{imp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
