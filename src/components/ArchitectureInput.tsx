/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Terminal,
  Layers,
  Sparkles,
  Sliders,
  Code2,
  Play,
  Check,
  FileCode,
  Box
} from 'lucide-react';
import { ModelArchitecturePreset, LieGroupType } from '../types';
import { ARCHITECTURE_PRESETS } from '../data/presets';

interface ArchitectureInputProps {
  currentPreset: ModelArchitecturePreset;
  onSelectPreset: (preset: ModelArchitecturePreset) => void;
  selectedLieGroup: LieGroupType;
  onChangeLieGroup: (group: LieGroupType) => void;
  onApplyCustomEinsum: (name: string, einsum: string, latex: string, lieGroup: LieGroupType) => void;
  onRunAgent: () => void;
  isAgentRunning: boolean;
}

export const ArchitectureInput: React.FC<ArchitectureInputProps> = ({
  currentPreset,
  onSelectPreset,
  selectedLieGroup,
  onChangeLieGroup,
  onApplyCustomEinsum,
  onRunAgent,
  isAgentRunning
}) => {
  const [customName, setCustomName] = useState<string>(currentPreset.name);
  const [customEinsum, setCustomEinsum] = useState<string>(currentPreset.einsumExpression);
  const [customLatex, setCustomLatex] = useState<string>(currentPreset.latexReduction);
  const [pytorchCode, setPytorchCode] = useState<string>(
`# PyTorch Tensor Reduction Definition
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model=4096, n_heads=32):
        super().__init__()
        self.d_k = d_model // n_heads
        self.W_q = nn.Linear(d_model, d_model, bias=False)
        self.W_k = nn.Linear(d_model, d_model, bias=False)
        self.W_v = nn.Linear(d_model, d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x):
        # b: batch, s: seq_len, d: d_model, h: heads, k: d_k
        q = self.W_q(x).view(b, s, h, k)
        k = self.W_k(x).view(b, s, h, k)
        v = self.W_v(x).view(b, s, h, k)
        
        # Tensor Contraction: Q K^T -> Attention Scores
        attn = torch.einsum('b s h k, b S h k -> b h s S', q, k) / (self.d_k ** 0.5)
        attn_weights = torch.softmax(attn, dim=-1)
        
        # Output Context Contraction: Attn * V -> O
        out = torch.einsum('b h s S, b S h k -> b s h k', attn_weights, v)
        return self.W_o(out.reshape(b, s, d))`
  );

  const handleApply = () => {
    onApplyCustomEinsum(customName, customEinsum, customLatex, selectedLieGroup);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono">
              Tensor Reduction &amp; Architecture Studio
            </h2>
            <p className="text-xs text-slate-400">
              Formulate network architectures as algebraic tensor contraction hypergraphs
            </p>
          </div>
        </div>

        <button
          id="btn-apply-einsum"
          onClick={handleApply}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Apply Expression</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 flex-1 overflow-y-auto">
        {/* Left Column: Preset Architecture Catalog (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono px-1">
            Curated Deep Learning Models
          </h3>

          <div className="space-y-2">
            {ARCHITECTURE_PRESETS.map((preset) => {
              const isSelected = preset.id === currentPreset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    setCustomName(preset.name);
                    setCustomEinsum(preset.einsumExpression);
                    setCustomLatex(preset.latexReduction);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{preset.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-cyan-400 border border-cyan-800/40">
                      {preset.family}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                    {preset.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{preset.nodes.length} Tensor Nodes</span>
                    <span className="text-purple-400">Lie: {preset.lieGroup}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Einsum & LaTeX Editor (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Einsum Equation Formulation */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 uppercase font-mono">
                Algebraic Einsum Expression
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">Einstein summation notation</span>
            </div>
            <textarea
              id="input-einsum-expr"
              rows={2}
              value={customEinsum}
              onChange={(e) => setCustomEinsum(e.target.value)}
              className="w-full bg-slate-950 text-cyan-300 font-mono text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>

          {/* LaTeX Tensor Network Reduction */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200 uppercase font-mono">
                LaTeX Tensor Network Contraction Formula
              </label>
              <span className="text-[11px] text-purple-400 font-mono">Formal mathematical representation</span>
            </div>
            <textarea
              id="input-latex-formula"
              rows={3}
              value={customLatex}
              onChange={(e) => setCustomLatex(e.target.value)}
              className="w-full bg-slate-950 text-purple-300 font-mono text-xs rounded-lg p-3 border border-slate-800 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* PyTorch / Tensor Code Snippet Extractor */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <label className="text-xs font-semibold text-slate-200 uppercase font-mono">
                  PyTorch Layer / ONNX Definition
                </label>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Auto-extracted tensor contraction paths</span>
            </div>
            <textarea
              id="input-pytorch-code"
              rows={8}
              value={pytorchCode}
              onChange={(e) => setPytorchCode(e.target.value)}
              className="w-full bg-slate-950 text-slate-300 font-mono text-xs rounded-lg p-3 border border-slate-800 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
