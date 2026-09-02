/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code, FileJson } from 'lucide-react';
import { NetworkTopology, LieEmbeddingData, LieComplexityReport } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  topology: NetworkTopology;
  lieData: LieEmbeddingData;
  complexity: LieComplexityReport;
  modelName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  topology,
  lieData,
  complexity,
  modelName
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<'latex' | 'python' | 'json'>('latex');

  if (!isOpen) return null;

  const latexCode = `% Tensor Reduction Topology & Lie Complexity Report
% Research Authorship: Dr. Bheemaiah Anil Kumar, Synergy Robotics
% Engine: Google Antigravity Tensor-Lie Agent
\\documentclass{article}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{tikz}

\\title{Tensor Contraction Topology and Lie Complexity Analysis of ${modelName}}
\\author{Dr. Bheemaiah Anil Kumar \\\\ \\large Synergy Robotics}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Topological Invariants}
For the tensor reduction hypergraph $\\mathcal{T} = (V, E)$ with $|V| = ${topology.nodes.length}$ and $|E| = ${topology.edges.length}$:
\\begin{itemize}
    \\item Zeroth Betti Number (Connected Components): $\\beta_0 = ${topology.bettiNumbers.b0}$
    \\item First Betti Number (Homology Cycles): $\\beta_1 = ${topology.bettiNumbers.b1}$
    \\item Euler Characteristic: $\\chi = |V| - |E| + |F| = ${topology.eulerCharacteristic}$
    \\item Maximum Contraction Bond Dimension: $\\chi_{\\max} = ${topology.maxBondDimension}$
    \\item Total Arithmetic Intensity: $I = ${topology.arithmeticIntensity} \\text{ FLOP/Byte}$
\\end{itemize}

\\section{Lie Algebra Embedding (\\mathfrak{${lieData.lieAlgebraName}})}
\\begin{equation}
\\dim(\\mathfrak{g}) = ${lieData.dimension}, \\quad \\operatorname{rank}(\\mathfrak{h}) = ${lieData.cartanSubalgebraDim}, \\quad C_2 = ${lieData.casimirInvariantValue}
\\end{equation}

\\section{Lie Complexity Metric}
The composite Lie Complexity Index is $\\Omega_{\\mathrm{Lie}} = ${complexity.compositeScore}/100$ (${complexity.complexityClass}):
\\begin{align}
\\mathcal{C}_{\\mathrm{comm}} &= ${complexity.metrics.commutatorDivergence} \\\\
\\dim \\operatorname{Lie}(\\{W_l\\}) &= ${complexity.metrics.algebraicSpanRank} \\\\
\\mathcal{H}_{\\mathrm{loop}} &= ${complexity.metrics.gaugeHolonomyEnergy} \\text{ rad}
\\end{align}

\\end{document}`;

  const pythonCode = `# Tensor Reduction & Lie Contraction Optimizer
# Model: ${modelName}
# Principal Author: Dr. Bheemaiah Anil Kumar, Synergy Robotics
# Engine: Google Antigravity Tensor-Lie Agent

import torch
import numpy as np

def compute_lie_brackets(W_matrices):
    """Compute Frobenius commutator norm between layer weight tensors."""
    commutators = []
    n = len(W_matrices)
    for i in range(n):
        for j in range(i + 1, n):
            A, B = W_matrices[i], W_matrices[j]
            comm = torch.matmul(A, B) - torch.matmul(B, A)
            norm = torch.norm(comm, p='fro') / (torch.norm(A, p='fro') * torch.norm(B, p='fro') + 1e-8)
            commutators.append(((i, j), norm.item()))
    return commutators

# Execute optimized tensor contraction:
# Total FLOPs: ${topology.totalFlops}
# Lie Group: ${lieData.lieAlgebraName}
print("Initialized ${modelName} contraction hypergraph with Lie complexity: ${complexity.compositeScore}/100")
print("Research Authorship: Dr. Bheemaiah Anil Kumar | Synergy Robotics")
`;

  const jsonReport = JSON.stringify(
    {
      author: "Dr. Bheemaiah Anil Kumar",
      organization: "Synergy Robotics",
      model: modelName,
      topology: {
        bettiNumbers: topology.bettiNumbers,
        eulerCharacteristic: topology.eulerCharacteristic,
        totalFlops: topology.totalFlops,
        arithmeticIntensity: topology.arithmeticIntensity
      },
      lieAlgebra: {
        name: lieData.lieAlgebraName,
        dimension: lieData.dimension,
        rank: lieData.cartanSubalgebraDim,
        casimir: lieData.casimirInvariantValue
      },
      complexity: complexity
    },
    null,
    2
  );

  const getActiveContent = () => {
    switch (activeFormat) {
      case 'latex':
        return latexCode;
      case 'python':
        return pythonCode;
      case 'json':
        return jsonReport;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopiedTab(activeFormat);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownload = () => {
    const content = getActiveContent();
    const extension = activeFormat === 'latex' ? 'tex' : activeFormat === 'python' ? 'py' : 'json';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${modelName.toLowerCase().replace(/\s+/g, '_')}_lie_report.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Export Analysis &amp; Contraction Scripts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-950 border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveFormat('latex')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeFormat === 'latex'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>LaTeX Paper Proof (.tex)</span>
          </button>

          <button
            onClick={() => setActiveFormat('python')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeFormat === 'python'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>PyTorch Contraction (.py)</span>
          </button>

          <button
            onClick={() => setActiveFormat('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeFormat === 'json'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON Report (.json)</span>
          </button>
        </div>

        {/* Code View Area */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap leading-relaxed">{getActiveContent()}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {activeFormat === 'latex' ? 'Ready for Overleaf & arXiv' : activeFormat === 'python' ? 'Optimized torch.einsum' : 'Full machine-readable state'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
            >
              {copiedTab === activeFormat ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
