/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Award,
  Layers,
  Sparkles,
  X,
  FileText,
  Share2,
  Atom
} from 'lucide-react';
import { MathView } from './MathView';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose }) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const ieeeCitation = `[1] A. K. Dr Bheemaiah, 'Lie Computability of Lie Lattices of Tensor based topologies of networks.', Sep. 02, 2026, Zenodo. doi: 10.5281/zenodo.22249208.`;
  const apaCitation = `Dr Bheemaiah, A. K. (2026). Lie Computability of Lie Lattices of Tensor based topologies of networks. Zenodo. https://doi.org/10.5281/zenodo.22249208`;
  const bibtexCitation = `@article{bheemaiah2026lie,
  author    = {Dr. Bheemaiah Anil Kumar},
  title     = {Lie Computability of Lie Lattices of Tensor based topologies of networks},
  journal   = {Zenodo},
  month     = {September},
  day       = {02},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.22249208},
  url       = {https://doi.org/10.5281/zenodo.22249208}
}`;

  const copyToClipboard = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-950/40">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 font-mono">
                  Academic Reference &amp; Publication
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/50">
                  Zenodo Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Foundational theory for tensor contraction lattices &amp; Lie manifold embeddings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Main Citation Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider font-mono">
                  Primary Publication [1]
                </span>
              </div>
              <a
                href="https://doi.org/10.5281/zenodo.22249208"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-medium shadow transition-colors"
              >
                <span>DOI: 10.5281/zenodo.22249208</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="font-serif italic text-slate-100 text-base leading-relaxed mb-3">
              “Lie Computability of Lie Lattices of Tensor based topologies of networks.”
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500">Author:</span>{' '}
                <span className="text-cyan-300 font-semibold">Dr. Bheemaiah Anil Kumar</span>
              </div>
              <div>
                <span className="text-slate-500">Institution:</span>{' '}
                <span className="text-purple-300 font-semibold">Synergy Robotics</span>
              </div>
              <div>
                <span className="text-slate-500">Publication Date:</span>{' '}
                <span className="text-slate-300">September 02, 2026</span>
              </div>
              <div>
                <span className="text-slate-500">Repository:</span>{' '}
                <span className="text-amber-300">Zenodo Open Science</span>
              </div>
            </div>
          </div>

          {/* Mathematical Theorem Highlight */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
                Lie Computability Lattice Principle
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Establishes the computability bound on non-abelian tensor networks through continuous Lie algebra embeddings in SO(n), SU(n), and Sp(2n). Contraction hypergraph reducibility is governed by the structural Casimir invariant C₂ and Lie lattice closed commutators:
            </p>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-xs text-cyan-300">
              <MathView math="\mathcal{L}(\mathcal{T}) = \inf_{\pi \in S_N} \operatorname{Tr}\left(\prod_{k=1}^{N} \operatorname{ad}_{T_{\pi(k)}}\right) + \sum_{e \in E} \oint_{\gamma_e} \mathcal{A}" />
            </div>
          </div>

          {/* Copyable Citation Formats */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">
              Citation Formats
            </h4>

            {/* IEEE Format */}
            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-mono text-slate-500 block mb-1">IEEE Format</span>
                <p className="text-xs font-mono text-slate-200 truncate">{ieeeCitation}</p>
              </div>
              <button
                onClick={() => copyToClipboard(ieeeCitation, 'ieee')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors shrink-0"
              >
                {copiedFormat === 'ieee' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'ieee' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* APA Format */}
            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-mono text-slate-500 block mb-1">APA Format</span>
                <p className="text-xs font-mono text-slate-200 truncate">{apaCitation}</p>
              </div>
              <button
                onClick={() => copyToClipboard(apaCitation, 'apa')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors shrink-0"
              >
                {copiedFormat === 'apa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'apa' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* BibTeX Format */}
            <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-500">BibTeX Format</span>
                <button
                  onClick={() => copyToClipboard(bibtexCitation, 'bibtex')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
                >
                  {copiedFormat === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormat === 'bibtex' ? 'Copied' : 'Copy BibTeX'}</span>
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 rounded border border-slate-800/80 font-mono text-[11px] text-purple-300 overflow-x-auto">
                {bibtexCitation}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Zenodo Record ID: <code className="text-slate-300 font-bold">22249208</code>
          </span>
          <div className="flex gap-2">
            <a
              href="https://zenodo.org/records/22249208"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <span>Zenodo Record</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
