/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TopologyGraph } from './components/TopologyGraph';
import { LieEmbeddingView } from './components/LieEmbeddingView';
import { LieComplexityDashboard } from './components/LieComplexityDashboard';
import { ArchitectureInput } from './components/ArchitectureInput';
import { AgentDrawer } from './components/AgentDrawer';
import { ExportModal } from './components/ExportModal';
import { CitationModal } from './components/CitationModal';
import { WebAPKModal } from './components/WebAPKModal';

import { ARCHITECTURE_PRESETS } from './data/presets';
import {
  ModelArchitecturePreset,
  LieGroupType,
  NetworkTopology,
  LieEmbeddingData,
  LieComplexityReport,
  TensorNode,
  TensorContractionEdge,
  AgentAnalysisResponse
} from './types';
import {
  calculateNetworkTopology,
  generateLieEmbeddingData,
  evaluateLieComplexity
} from './utils/lieAlgebra';
import { BookOpen, ExternalLink, Smartphone, Copy, Check } from 'lucide-react';

export function App() {
  const [currentPreset, setCurrentPreset] = useState<ModelArchitecturePreset>(ARCHITECTURE_PRESETS[0]);
  const [selectedLieGroup, setSelectedLieGroup] = useState<LieGroupType>(currentPreset.lieGroup);
  const [activeTab, setActiveTab] = useState<'topology' | 'lie-embedding' | 'complexity' | 'editor'>('topology');

  // Interactive node/edge selections
  const [selectedNode, setSelectedNode] = useState<TensorNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<TensorContractionEdge | null>(null);

  // Computed analytical data
  const [topology, setTopology] = useState<NetworkTopology>(() =>
    calculateNetworkTopology(currentPreset.nodes, currentPreset.edges)
  );
  const [lieData, setLieData] = useState<LieEmbeddingData>(() =>
    generateLieEmbeddingData(currentPreset.lieGroup, currentPreset.nodes)
  );
  const [complexity, setComplexity] = useState<LieComplexityReport>(() =>
    evaluateLieComplexity(currentPreset.nodes, currentPreset.edges, currentPreset.lieGroup)
  );

  // Agent State
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [agentResponse, setAgentResponse] = useState<AgentAnalysisResponse | null>(null);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState<boolean>(false);
  const [isWebAPKModalOpen, setIsWebAPKModalOpen] = useState<boolean>(false);
  const [hasCopiedCitation, setHasCopiedCitation] = useState<boolean>(false);

  const mainCitationText = `[1] A. K. Dr Bheemaiah, 'Lie Computability of Lie Lattices of Tensor based topologies of networks.', Sep. 02, 2026, Zenodo. doi: 10.5281/zenodo.22249208.`;

  const handleCopyCitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mainCitationText);
    setHasCopiedCitation(true);
    setTimeout(() => setHasCopiedCitation(false), 2000);
  };

  // Synchronize when preset changes
  const handleSelectPreset = (preset: ModelArchitecturePreset) => {
    setCurrentPreset(preset);
    setSelectedLieGroup(preset.lieGroup);
    setSelectedNode(null);
    setSelectedEdge(null);

    const newTopology = calculateNetworkTopology(preset.nodes, preset.edges);
    const newLie = generateLieEmbeddingData(preset.lieGroup, preset.nodes);
    const newComp = evaluateLieComplexity(preset.nodes, preset.edges, preset.lieGroup);

    setTopology(newTopology);
    setLieData(newLie);
    setComplexity(newComp);
  };

  // Synchronize when Lie group changes
  const handleChangeLieGroup = (group: LieGroupType) => {
    setSelectedLieGroup(group);
    const newLie = generateLieEmbeddingData(group, currentPreset.nodes);
    const newComp = evaluateLieComplexity(currentPreset.nodes, currentPreset.edges, group);
    setLieData(newLie);
    setComplexity(newComp);
  };

  // Custom Einsum Applier
  const handleApplyCustomEinsum = (
    name: string,
    einsum: string,
    latex: string,
    lieGroup: LieGroupType
  ) => {
    const updatedPreset: ModelArchitecturePreset = {
      ...currentPreset,
      name,
      einsumExpression: einsum,
      latexReduction: latex,
      lieGroup
    };
    setCurrentPreset(updatedPreset);
    setSelectedLieGroup(lieGroup);

    const newTopology = calculateNetworkTopology(updatedPreset.nodes, updatedPreset.edges);
    const newLie = generateLieEmbeddingData(lieGroup, updatedPreset.nodes);
    const newComp = evaluateLieComplexity(updatedPreset.nodes, updatedPreset.edges, lieGroup);

    setTopology(newTopology);
    setLieData(newLie);
    setComplexity(newComp);
    setActiveTab('topology');
  };

  // Run Antigravity Agent Analysis
  const handleRunAgentAnalysis = async () => {
    setIsAgentRunning(true);
    setIsAgentDrawerOpen(true);

    try {
      const res = await fetch('/api/agent/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: currentPreset.name,
          einsumExpr: currentPreset.einsumExpression,
          tensorDescription: currentPreset.description,
          lieGroup: selectedLieGroup
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAgentResponse({
          ...data.data,
          modelUsed: data.modelUsed || (data.aiGenerated ? 'Gemini 3.7 Flash' : 'Antigravity Lie Engine'),
          aiGenerated: data.aiGenerated
        });
        if (data.data.lieComplexityScore) {
          setComplexity((prev) => ({
            ...prev,
            compositeScore: data.data.lieComplexityScore,
            complexityClass: data.data.complexityClass || prev.complexityClass,
            metrics: {
              ...prev.metrics,
              commutatorDivergence: data.data.commutatorDivergence || prev.metrics.commutatorDivergence,
              algebraicSpanRank: data.data.algebraicSpanDim || prev.metrics.algebraicSpanRank,
              gaugeHolonomyEnergy: data.data.gaugeHolonomy || prev.metrics.gaugeHolonomyEnergy,
              casimirDispersion: data.data.casimirValue || prev.metrics.casimirDispersion
            },
            theoreticalImplications: data.data.theoreticalInsights || prev.theoreticalImplications
          }));
        }
      }
    } catch (err) {
      console.error('Agent analysis error:', err);
    } finally {
      setIsAgentRunning(false);
    }
  };

  // Interactive Agent Chat Handler
  const handleSendChatMessage = async (msg: string): Promise<string> => {
    const res = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        modelContext: {
          name: currentPreset.name,
          einsum: currentPreset.einsumExpression,
          lieGroup: selectedLieGroup,
          score: complexity.compositeScore,
          betti: topology.bettiNumbers.b1
        }
      })
    });
    const data = await res.json();
    return data.reply || 'No response from Antigravity agent.';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        selectedLieGroup={selectedLieGroup}
        onChangeLieGroup={handleChangeLieGroup}
        onRunAgentAnalysis={handleRunAgentAnalysis}
        isAgentRunning={isAgentRunning}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenCitation={() => setIsCitationModalOpen(true)}
        onOpenWebAPK={() => setIsWebAPKModalOpen(true)}
        onToggleAgentChat={() => setIsAgentDrawerOpen(!isAgentDrawerOpen)}
        isChatOpen={isAgentDrawerOpen}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        complexityScore={complexity.compositeScore}
      />

      {/* Persistent Academic Citation Banner */}
      <div className="bg-slate-950/95 border-b border-purple-900/30 px-3 sm:px-4 py-1.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div
            onClick={() => setIsCitationModalOpen(true)}
            className="flex items-center gap-2 text-slate-300 hover:text-purple-300 transition-colors cursor-pointer min-w-0"
          >
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700/50 shrink-0">
              Reference [1]
            </span>
            <p className="truncate text-xs">
              <span className="text-slate-400 font-medium">A. K. Dr Bheemaiah</span>, ‘Lie Computability of Lie Lattices of Tensor based topologies of networks.’ (2026, Zenodo).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCitation}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
              title="Copy citation string"
            >
              {hasCopiedCitation ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{hasCopiedCitation ? 'Copied' : 'Cite'}</span>
            </button>

            <a
              href="https://doi.org/10.5281/zenodo.22249208"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 text-[11px] border border-purple-800/60 transition-colors"
            >
              <span>doi: 10.5281/zenodo.22249208</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col">
        {activeTab === 'topology' && (
          <TopologyGraph
            topology={topology}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            selectedEdge={selectedEdge}
            onSelectEdge={setSelectedEdge}
            modelName={currentPreset.name}
          />
        )}

        {activeTab === 'lie-embedding' && (
          <LieEmbeddingView
            lieData={lieData}
            selectedLieGroup={selectedLieGroup}
            onChangeLieGroup={handleChangeLieGroup}
            modelName={currentPreset.name}
          />
        )}

        {activeTab === 'complexity' && (
          <LieComplexityDashboard
            complexity={complexity}
            topology={topology}
            modelName={currentPreset.name}
          />
        )}

        {activeTab === 'editor' && (
          <ArchitectureInput
            currentPreset={currentPreset}
            onSelectPreset={handleSelectPreset}
            selectedLieGroup={selectedLieGroup}
            onChangeLieGroup={handleChangeLieGroup}
            onApplyCustomEinsum={handleApplyCustomEinsum}
            onRunAgent={handleRunAgentAnalysis}
            isAgentRunning={isAgentRunning}
          />
        )}
      </main>

      {/* Research Authorship & Institutional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-slate-400">Principal Author:</span>
            <span className="text-cyan-300 font-semibold">Dr. Bheemaiah Anil Kumar</span>
            <span className="text-slate-700">•</span>
            <span className="text-purple-300 font-medium">Synergy Robotics</span>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setIsCitationModalOpen(true)}
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors cursor-pointer"
            >
              [1] Zenodo doi: 10.5281/zenodo.22249208
            </button>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <button
              onClick={() => setIsWebAPKModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-[11px] transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>WebAPK / Install</span>
            </button>

            <button
              onClick={() => setIsCitationModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 text-[11px] transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Citations</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Antigravity CoT & Chat Drawer */}
      <AgentDrawer
        isOpen={isAgentDrawerOpen}
        onClose={() => setIsAgentDrawerOpen(false)}
        agentResponse={agentResponse}
        isAgentRunning={isAgentRunning}
        onSendChatMessage={handleSendChatMessage}
        modelName={currentPreset.name}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        topology={topology}
        lieData={lieData}
        complexity={complexity}
        modelName={currentPreset.name}
      />

      {/* Academic Citation Modal */}
      <CitationModal
        isOpen={isCitationModalOpen}
        onClose={() => setIsCitationModalOpen(false)}
      />

      {/* WebAPK & PWA Installation Modal */}
      <WebAPKModal
        isOpen={isWebAPKModalOpen}
        onClose={() => setIsWebAPKModalOpen(false)}
      />
    </div>
  );
}
export default App;
