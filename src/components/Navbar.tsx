/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  Download,
  Terminal,
  Cpu,
  Orbit,
  Zap,
  BookOpen,
  Smartphone
} from 'lucide-react';
import { LieGroupType, ModelArchitecturePreset } from '../types';
import { ARCHITECTURE_PRESETS } from '../data/presets';

interface NavbarProps {
  currentPreset: ModelArchitecturePreset;
  onSelectPreset: (preset: ModelArchitecturePreset) => void;
  selectedLieGroup: LieGroupType;
  onChangeLieGroup: (group: LieGroupType) => void;
  onRunAgentAnalysis: () => void;
  isAgentRunning: boolean;
  onOpenExport: () => void;
  onOpenCitation: () => void;
  onOpenWebAPK: () => void;
  onToggleAgentChat: () => void;
  isChatOpen: boolean;
  activeTab: 'topology' | 'lie-embedding' | 'complexity' | 'editor';
  onChangeTab: (tab: 'topology' | 'lie-embedding' | 'complexity' | 'editor') => void;
  complexityScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPreset,
  onSelectPreset,
  selectedLieGroup,
  onChangeLieGroup,
  onRunAgentAnalysis,
  isAgentRunning,
  onOpenExport,
  onOpenCitation,
  onOpenWebAPK,
  onToggleAgentChat,
  isChatOpen,
  activeTab,
  onChangeTab,
  complexityScore
}) => {
  const lieGroups: LieGroupType[] = ['SO(n)', 'SU(n)', 'SL(n)', 'GL(n)', 'Sp(2n)', 'Heisenberg-Weyl', 'SE(3)'];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-950/30">
              <Orbit className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-slate-100 font-mono">
                  ANTIGRAVITY
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Tensor-Lie Agent
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-cyan-400 font-medium">Synergy Robotics</span>
                <span className="text-slate-600">•</span>
                <span className="truncate max-w-[200px] sm:max-w-none text-slate-300">Dr. Bheemaiah Anil Kumar</span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges on mobile */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={onOpenCitation}
              className="p-1.5 rounded bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs flex items-center gap-1"
              title="Zenodo Publication Reference"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenWebAPK}
              className="p-1.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs flex items-center gap-1"
              title="WebAPK / Install App"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400">Ω</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{complexityScore}</span>
            </div>
          </div>
        </div>

        {/* Center: View Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-lg border border-slate-800 w-full md:w-auto overflow-x-auto">
          <button
            id="tab-topology"
            onClick={() => onChangeTab('topology')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'topology'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Topology &amp; Contraction</span>
          </button>

          <button
            id="tab-lie-embedding"
            onClick={() => onChangeTab('lie-embedding')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'lie-embedding'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Lie Embeddings</span>
          </button>

          <button
            id="tab-complexity"
            onClick={() => onChangeTab('complexity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'complexity'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Lie Complexity</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-700/50">
              {complexityScore}
            </span>
          </button>

          <button
            id="tab-editor"
            onClick={() => onChangeTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Architecture &amp; Einsum</span>
          </button>
        </div>

        {/* Right: Architecture & Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {/* Preset Selector */}
          <div className="relative">
            <select
              id="model-preset-selector"
              value={currentPreset.id}
              onChange={(e) => {
                const found = ARCHITECTURE_PRESETS.find(p => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700/80 focus:border-cyan-500 focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              {ARCHITECTURE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Lie Group Badge/Selector */}
          <div className="relative">
            <select
              id="lie-group-selector"
              value={selectedLieGroup}
              onChange={(e) => onChangeLieGroup(e.target.value as LieGroupType)}
              className="bg-purple-950/40 text-purple-300 text-xs font-mono rounded-lg px-2 py-1.5 border border-purple-700/50 focus:border-purple-400 focus:outline-none cursor-pointer"
            >
              {lieGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Citation Button */}
          <button
            id="btn-open-citation"
            onClick={onOpenCitation}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-700/40 text-xs font-mono transition-all cursor-pointer shadow-sm"
            title="View Zenodo Paper Citation [1]"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold">DOI: 10.5281</span>
          </button>

          {/* WebAPK Button */}
          <button
            id="btn-open-webapk"
            onClick={onOpenWebAPK}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/40 text-xs font-mono transition-all cursor-pointer shadow-sm"
            title="Install WebAPK / PWA"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>WebAPK</span>
          </button>

          {/* Agent Trigger Button */}
          <button
            id="btn-run-agent"
            onClick={onRunAgentAnalysis}
            disabled={isAgentRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-950/40 transition-all border border-cyan-400/30 disabled:opacity-50 cursor-pointer"
          >
            {isAgentRunning ? (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>Agent Reasoning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Antigravity Agent</span>
              </>
            )}
          </button>

          {/* Chat Toggle Button */}
          <button
            id="btn-toggle-chat"
            onClick={onToggleAgentChat}
            className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
              isChatOpen
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
            title="Toggle Agent CoT Assistant"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Export Button */}
          <button
            id="btn-open-export"
            onClick={onOpenExport}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-all cursor-pointer"
            title="Export LaTeX Proof & Python Scripts"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
