/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Layers,
  Sparkles,
  Sliders,
  Code2,
  Play,
  Check,
  FileCode,
  Box,
  Search,
  Cpu,
  Eye,
  Camera,
  Trees,
  FileText
} from 'lucide-react';
import { ModelArchitecturePreset, LieGroupType } from '../types';
import { ARCHITECTURE_PRESETS } from '../data/presets';
import { MathView, FormattedMath } from './MathView';

interface ArchitectureInputProps {
  currentPreset: ModelArchitecturePreset;
  onSelectPreset: (preset: ModelArchitecturePreset) => void;
  selectedLieGroup: LieGroupType;
  onChangeLieGroup: (group: LieGroupType) => void;
  onApplyCustomEinsum: (name: string, einsum: string, latex: string, lieGroup: LieGroupType) => void;
  onRunAgent: () => void;
  isAgentRunning: boolean;
}

type ModelCategoryFilter = 'all' | 'megadetector' | 'wildlife' | 'sparrow' | 'llm' | 'ssm_diff';

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
  const [activeCategory, setActiveCategory] = useState<ModelCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLiveMathPreview, setShowLiveMathPreview] = useState<boolean>(true);

  const [pytorchCode, setPytorchCode] = useState<string>(
`# PyTorch / ONNX Tensor Reduction Definition
import torch
import torch.nn as nn

class WildlifeTensorReduction(nn.Module):
    def __init__(self, channels=1024, num_classes=3):
        super().__init__()
        self.conv_p3 = nn.Conv2d(256, channels, kernel_size=3, padding=1)
        self.conv_p4 = nn.Conv2d(512, channels, kernel_size=3, padding=1)
        self.head_box = nn.Conv2d(channels, 4, kernel_size=1)
        self.head_cls = nn.Conv2d(channels, num_classes, kernel_size=1)

    def forward(self, features):
        # Tensor Contraction across PANet pyramid manifold
        p3, p4 = features['p3'], features['p4']
        fused = torch.einsum('b c h w, b c H W -> b c h w', p3, torch.nn.functional.interpolate(p4, size=p3.shape[-2:]))
        boxes = self.head_box(fused)
        scores = torch.sigmoid(self.head_cls(fused))
        return torch.cat([boxes, scores], dim=1)`
  );

  const handleApply = () => {
    onApplyCustomEinsum(customName, customEinsum, customLatex, selectedLieGroup);
  };

  // Filtered preset list
  const filteredPresets = useMemo(() => {
    return ARCHITECTURE_PRESETS.filter((preset) => {
      // Category match
      let matchesCat = true;
      if (activeCategory === 'megadetector') {
        matchesCat = preset.family === 'MegaDetector';
      } else if (activeCategory === 'wildlife') {
        matchesCat = preset.family === 'ONNX-Wildlife';
      } else if (activeCategory === 'sparrow') {
        matchesCat = preset.family === 'Microsoft-Sparrow';
      } else if (activeCategory === 'llm') {
        matchesCat = preset.family === 'LLM' || preset.family === 'MoE' || preset.family === 'Transformer';
      } else if (activeCategory === 'ssm_diff') {
        matchesCat = preset.family === 'State-Space' || preset.family === 'Diffusion';
      }

      // Search match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          preset.name.toLowerCase().includes(q) ||
          preset.id.toLowerCase().includes(q) ||
          preset.description.toLowerCase().includes(q) ||
          preset.parameters.toLowerCase().includes(q);
      }

      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 font-mono">
                Tensor Reduction &amp; ONNX Architecture Studio
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                KaTeX Math Rendering Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Decompose Microsoft Sparrow, MegaDetector, PyTorch-Wildlife, and LLM networks as Lie algebraic contraction hypergraphs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setShowLiveMathPreview(!showLiveMathPreview)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              showLiveMathPreview
                ? 'bg-purple-950/60 text-purple-300 border-purple-700/60'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showLiveMathPreview ? 'Hide LaTeX Preview' : 'Show LaTeX Preview'}</span>
          </button>

          <button
            id="btn-apply-einsum"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Expression</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 flex-1 overflow-y-auto">
        {/* Left Column: Preset Architecture Catalog (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({ARCHITECTURE_PRESETS.length})
            </button>
            <button
              onClick={() => setActiveCategory('megadetector')}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'megadetector'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>MegaDetector</span>
            </button>
            <button
              onClick={() => setActiveCategory('wildlife')}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'wildlife'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trees className="w-3 h-3" />
              <span>Wildlife ONNX</span>
            </button>
            <button
              onClick={() => setActiveCategory('sparrow')}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'sparrow'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Sparrow</span>
            </button>
            <button
              onClick={() => setActiveCategory('llm')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                activeCategory === 'llm'
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LLMs
            </button>
            <button
              onClick={() => setActiveCategory('ssm_diff')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                activeCategory === 'ssm_diff'
                  ? 'bg-rose-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SSM/Diff
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ONNX models, YOLO, BioCLIP, Sparrow, MoE..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Preset Scroll List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredPresets.map((preset) => {
              const isSelected = preset.id === currentPreset.id;
              const familyColor =
                preset.family === 'MegaDetector'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                  : preset.family === 'ONNX-Wildlife'
                  ? 'bg-amber-950 text-amber-300 border-amber-800/60'
                  : preset.family === 'Microsoft-Sparrow'
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-800/60'
                  : 'bg-slate-950 text-cyan-400 border-cyan-800/40';

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
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">{preset.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border whitespace-nowrap ${familyColor}`}>
                      {preset.family}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                    {preset.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-slate-400">{preset.nodes.length} Nodes</span>
                    <span className="text-purple-400 font-semibold">Lie: {preset.lieGroup}</span>
                  </div>
                </div>
              );
            })}

            {filteredPresets.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                No ONNX models match your filter query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Einsum & LaTeX Editor + Pretty Math View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Active Model Name Header */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-100 focus:outline-none focus:underline font-mono w-full"
              />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/50">
              {currentPreset.parameters}
            </span>
          </div>

          {/* Einsum Equation Formulation */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
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

            {showLiveMathPreview && customEinsum && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                  Pretty-Printed Einsum Math:
                </div>
                <MathView math={customEinsum} block={true} className="text-cyan-300 text-sm" />
              </div>
            )}
          </div>

          {/* LaTeX Tensor Network Reduction */}
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
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

            {showLiveMathPreview && customLatex && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                  Pretty-Printed LaTeX Reduction:
                </div>
                <MathView math={customLatex} block={true} className="text-purple-300 text-sm" />
              </div>
            )}
          </div>

          {/* PyTorch / ONNX Layer Definition */}
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
              rows={6}
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
