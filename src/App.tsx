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
        setAgentResponse(data.data);
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
        onToggleAgentChat={() => setIsAgentDrawerOpen(!isAgentDrawerOpen)}
        isChatOpen={isAgentDrawerOpen}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        complexityScore={complexity.compositeScore}
      />

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
    </div>
  );
}
export default App;
