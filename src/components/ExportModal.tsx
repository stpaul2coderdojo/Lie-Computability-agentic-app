/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code, FileJson, BookOpen } from 'lucide-react';
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
  const [activeFormat, setActiveFormat] = useState<'latex' | 'python' | 'json' | 'bibtex'>('latex');

  if (!isOpen) return null;

  const bibtexCode = [
    '@article{bheemaiah2026lie,',
    '  author    = {Dr. Bheemaiah Anil Kumar},',
    '  title     = {Lie Computability of Lie Lattices of Tensor based topologies of networks},',
    '  journal   = {Zenodo},',
    '  month     = {September},',
    '  day       = {02},',
    '  year      = {2026},',
    '  publisher = {Zenodo},',
    '  doi       = {10.5281/zenodo.22249208},',
    '  url       = {https://doi.org/10.5281/zenodo.22249208}',
    '}'
  ].join('\n');

  const latexCode = [
    '% Tensor Reduction Topology & Lie Complexity Report',
    '% Research Authorship: Dr. Bheemaiah Anil Kumar, Synergy Robotics',
    "% Reference: [1] A. K. Dr Bheemaiah, 'Lie Computability of Lie Lattices of Tensor based topologies of networks.', Sep. 02, 2026, Zenodo. doi: 10.5281/zenodo.22249208.",
    '% Engine: Google Antigravity Tensor-Lie Agent',
    '\\documentclass{article}',
    '\\usepackage{amsmath,amssymb,amsthm}',
    '\\usepackage{tikz}',
    '',
    `\\title{Tensor Contraction Topology and Lie Complexity Analysis of ${modelName}}`,
    '\\author{Dr. Bheemaiah Anil Kumar \\\\ \\large Synergy Robotics}',
    '\\date{\\today}',
    '',
    '\\begin{document}',
    '\\maketitle',
    '',
    '\\begin{abstract}',
    `We present the formal Lie computability and tensor reduction analysis for ${modelName} following the theoretical framework established in \\cite{bheemaiah2026lie}. We compute topological homology Betti invariants, Lie group representations on $\\mathfrak{${lieData.lieAlgebraName}}$, and evaluate non-abelian commutator curvature metrics.`,
    '\\end{abstract}',
    '',
    '\\section{Topological Invariants}',
    `For the tensor reduction hypergraph $\\mathcal{T} = (V, E)$ with $|V| = ${topology.nodes.length}$ and $|E| = ${topology.edges.length}$:`,
    '\\begin{itemize}',
    `    \\item Zeroth Betti Number (Connected Components): $\\beta_0 = ${topology.bettiNumbers.b0}$`,
    `    \\item First Betti Number (Homology Cycles): $\\beta_1 = ${topology.bettiNumbers.b1}$`,
    `    \\item Euler Characteristic: $\\chi = |V| - |E| + |F| = ${topology.eulerCharacteristic}$`,
    `    \\item Maximum Contraction Bond Dimension: $\\chi_{\\max} = ${topology.maxBondDimension}$`,
    `    \\item Total Arithmetic Intensity: $I = ${topology.arithmeticIntensity} \\text{ FLOP/Byte}$`,
    '\\end{itemize}',
    '',
    `\\section{Lie Algebra Embedding (\\mathfrak{${lieData.lieAlgebraName}})}`,
    '\\begin{equation}',
    `\\dim(\\mathfrak{g}) = ${lieData.dimension}, \\quad \\operatorname{rank}(\\mathfrak{h}) = ${lieData.cartanSubalgebraDim}, \\quad C_2 = ${lieData.casimirInvariantValue}`,
    '\\end{equation}',
    '',
    '\\section{Lie Complexity Metric}',
    `The composite Lie Complexity Index is $\\Omega_{\\mathrm{Lie}} = ${complexity.compositeScore}/100$ (${complexity.complexityClass}):`,
    '\\begin{align}',
    `\\mathcal{C}_{\\mathrm{comm}} &= ${complexity.metrics.commutatorDivergence} \\\\`,
    `\\dim \\operatorname{Lie}(\\{W_l\\}) &= ${complexity.metrics.algebraicSpanRank} \\\\`,
    `\\mathcal{H}_{\\mathrm{loop}} &= ${complexity.metrics.gaugeHolonomyEnergy} \\text{ rad}`,
    '\\end{align}',
    '',
    '\\begin{thebibliography}{9}',
    '\\bibitem{bheemaiah2026lie}',
    'A.~K.~Dr.~Bheemaiah, ``Lie Computability of Lie Lattices of Tensor based topologies of networks,\'\' \\emph{Zenodo}, Sep. 02, 2026. \\texttt{doi: 10.5281/zenodo.22249208}.',
    '\\end{thebibliography}',
    '',
    '\\end{document}'
  ].join('\n');

  const pythonCode = [
    '# Tensor Reduction & Lie Contraction Optimizer',
    `# Model: ${modelName}`,
    '# Principal Author: Dr. Bheemaiah Anil Kumar, Synergy Robotics',
    "# Reference: [1] A. K. Dr Bheemaiah, 'Lie Computability of Lie Lattices of Tensor based topologies of networks.', Sep. 02, 2026, Zenodo. doi: 10.5281/zenodo.22249208.",
    '# Engine: Google Antigravity Tensor-Lie Agent',
    '',
    'import torch',
    'import numpy as np',
    '',
    'def compute_lie_brackets(W_matrices):',
    '    """Compute Frobenius commutator norm between layer weight tensors."""',
    '    commutators = []',
    '    n = len(W_matrices)',
    '    for i in range(n):',
    '        for j in range(i + 1, n):',
    '            A, B = W_matrices[i], W_matrices[j]',
    '            comm = torch.matmul(A, B) - torch.matmul(B, A)',
    '            norm = torch.norm(comm, p=\'fro\') / (torch.norm(A, p=\'fro\') * torch.norm(B, p=\'fro\') + 1e-8)',
    '            commutators.append(((i, j), norm.item()))',
    '    return commutators',
    '',
    '# Execute optimized tensor contraction:',
    `# Total FLOPs: ${topology.totalFlops}`,
    `# Lie Group: ${lieData.lieAlgebraName}`,
    `print("Initialized ${modelName} contraction hypergraph with Lie complexity: ${complexity.compositeScore}/100")`,
    'print("Research Authorship: Dr. Bheemaiah Anil Kumar | Synergy Robotics")',
    'print("Zenodo Citation DOI: 10.5281/zenodo.22249208")',
    ''
  ].join('\n');

  const jsonReport = JSON.stringify(
    {
      author: "Dr. Bheemaiah Anil Kumar",
      organization: "Synergy Robotics",
      citation: "[1] A. K. Dr Bheemaiah, 'Lie Computability of Lie Lattices of Tensor based topologies of networks.', Sep. 02, 2026, Zenodo. doi: 10.5281/zenodo.22249208.",
      doi: "10.5281/zenodo.22249208",
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
      case 'bibtex':
        return bibtexCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopiedTab(activeFormat);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownload = () => {
    const content = getActiveContent();
    const extension = activeFormat === 'latex' ? 'tex' : activeFormat === 'python' ? 'py' : activeFormat === 'bibtex' ? 'bib' : 'json';
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
              Export Analysis, Paper Proof &amp; Scripts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 p-3 bg-slate-950 border-b border-slate-800 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveFormat('latex')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeFormat === 'json'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON Report (.json)</span>
          </button>

          <button
            onClick={() => setActiveFormat('bibtex')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeFormat === 'bibtex'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>BibTeX Citation (.bib)</span>
          </button>
        </div>

        {/* Code View Area */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap leading-relaxed">{getActiveContent()}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {activeFormat === 'latex' ? 'Ready for Overleaf & arXiv' : activeFormat === 'python' ? 'Optimized torch.einsum' : activeFormat === 'bibtex' ? 'Zenodo: 10.5281/zenodo.22249208' : 'Full machine-readable state'}
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
