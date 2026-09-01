/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Activity,
  Compass,
  Cpu
} from 'lucide-react';
import { NetworkTopology, TensorNode, TensorContractionEdge } from '../types';

interface TopologyGraphProps {
  topology: NetworkTopology;
  selectedNode: TensorNode | null;
  onSelectNode: (node: TensorNode | null) => void;
  selectedEdge: TensorContractionEdge | null;
  onSelectEdge: (edge: TensorContractionEdge | null) => void;
  modelName: string;
}

export const TopologyGraph: React.FC<TopologyGraphProps> = ({
  topology,
  selectedNode,
  onSelectNode,
  selectedEdge,
  onSelectEdge,
  modelName
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHomologyLoops, setShowHomologyLoops] = useState<boolean>(true);
  const [showIndices, setShowIndices] = useState<boolean>(true);

  // Playback timer for contraction sequence
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= topology.edges.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, topology.edges.length]);

  // Compute node category styling
  const getNodeColor = (category: TensorNode['category'], isCurrent: boolean) => {
    if (isCurrent) return { bg: '#06b6d4', border: '#22d3ee', text: '#ffffff', glow: 'rgba(6,182,212,0.4)' };
    switch (category) {
      case 'input':
        return { bg: '#0f766e', border: '#14b8a6', text: '#ccfbf1', glow: 'rgba(20,184,166,0.2)' };
      case 'weight':
        return { bg: '#4338ca', border: '#6366f1', text: '#e0e7ff', glow: 'rgba(99,102,241,0.2)' };
      case 'reduction':
        return { bg: '#7e22ce', border: '#a855f7', text: '#f3e8ff', glow: 'rgba(168,85,247,0.2)' };
      case 'routing':
        return { bg: '#c2410c', border: '#f97316', text: '#ffedd5', glow: 'rgba(249,115,22,0.2)' };
      case 'norm':
        return { bg: '#1e293b', border: '#64748b', text: '#f1f5f9', glow: 'rgba(100,116,139,0.2)' };
      case 'output':
        return { bg: '#047857', border: '#10b981', text: '#d1fae5', glow: 'rgba(16,185,129,0.2)' };
      default:
        return { bg: '#1e293b', border: '#475569', text: '#e2e8f0', glow: 'rgba(71,85,105,0.2)' };
    }
  };

  // Format FLOPs into human readable
  const formatFLOPs = (flops: number) => {
    if (!flops) return '0 FLOPs';
    if (flops >= 1e12) return `${(flops / 1e12).toFixed(2)} TFLOPs`;
    if (flops >= 1e9) return `${(flops / 1e9).toFixed(2)} GFLOPs`;
    if (flops >= 1e6) return `${(flops / 1e6).toFixed(2)} MFLOPs`;
    return `${flops} FLOPs`;
  };

  // Node position map
  const nodeMap = new Map<string, TensorNode>();
  topology.nodes.forEach(n => nodeMap.set(n.id, n));

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Invariant Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 bg-slate-900/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <Layers className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Betti Homology</div>
            <div className="font-bold text-slate-100 font-mono">
              β₀ = {topology.bettiNumbers.b0}, β₁ = <span className="text-cyan-400">{topology.bettiNumbers.b1}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <Compass className="w-4 h-4 text-purple-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Euler Char (χ)</div>
            <div className="font-bold text-purple-300 font-mono">
              χ = {topology.eulerCharacteristic}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <Activity className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Max Bond (χ_max)</div>
            <div className="font-bold text-amber-300 font-mono">
              {topology.maxBondDimension.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Reduction FLOPs</div>
            <div className="font-bold text-emerald-300 font-mono truncate">
              {formatFLOPs(topology.totalFlops)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <Activity className="w-4 h-4 text-indigo-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Arithmetic Intensity</div>
            <div className="font-bold text-indigo-300 font-mono">
              {topology.arithmeticIntensity} FLOP/B
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
          <Layers className="w-4 h-4 text-rose-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Graph Diameter</div>
            <div className="font-bold text-rose-300 font-mono">
              D = {topology.graphDiameter} hops
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative flex-1 min-h-[440px] bg-radial from-slate-900/40 via-slate-950 to-slate-950 overflow-hidden select-none">
        {/* Subtle Grid Background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* SVG Network Graph */}
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing"
          viewBox={`0 0 ${1160 / zoomLevel} ${520 / zoomLevel}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Edge Gradients */}
            <linearGradient id="edge-active" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="edge-default" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            {/* Arrow Marker */}
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="18"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="8"
              markerHeight="6"
              refX="18"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Render Contraction Edges */}
          {topology.edges.map((edge, index) => {
            const src = nodeMap.get(edge.source);
            const tgt = nodeMap.get(edge.target);
            if (!src || !tgt) return null;

            const isStepActive = index <= currentStep;
            const isSelected = selectedEdge?.id === edge.id;
            const x1 = src.x || 100;
            const y1 = src.y || 200;
            const x2 = tgt.x || 400;
            const y2 = tgt.y || 200;

            // Curve calculation
            const dx = x2 - x1;
            const dy = y2 - y1;
            const isSkip = Math.abs(dx) > 300;
            const cx = (x1 + x2) / 2;
            const cy = isSkip ? (y1 + y2) / 2 - 80 : (y1 + y2) / 2;
            const pathData = isSkip 
              ? `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
              : `M ${x1} ${y1} L ${x2} ${y2}`;

            return (
              <g 
                key={edge.id}
                onClick={() => onSelectEdge(edge)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Edge Glow */}
                {(isStepActive || isSelected) && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isSelected ? '#f43f5e' : '#06b6d4'}
                    strokeWidth={isSelected ? 6 : 4}
                    strokeOpacity={0.4}
                    className="filter blur-[2px]"
                  />
                )}

                {/* Primary Edge Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isSelected ? '#f43f5e' : isStepActive ? '#06b6d4' : '#334155'}
                  strokeWidth={isSelected ? 3 : isStepActive ? 2.5 : 1.5}
                  strokeDasharray={isSkip ? '5,5' : 'none'}
                  markerEnd={isStepActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                />

                {/* Animated Contraction Energy Pulse */}
                {isStepActive && (
                  <circle r="3" fill="#38bdf8">
                    <animateMotion
                      path={pathData}
                      dur={`${Math.max(1.2, 3 - edge.nonCommutativityFactor * 1.5)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Midpoint Bond Dimension Label */}
                {showIndices && (
                  <g transform={`translate(${cx}, ${cy})`}>
                    <rect
                      x="-28"
                      y="-10"
                      width="56"
                      height="20"
                      rx="5"
                      fill="#090d16"
                      stroke={isStepActive ? '#0e7490' : '#1e293b'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="9"
                      fill={isStepActive ? '#67e8f9' : '#64748b'}
                      fontFamily="monospace"
                    >
                      χ={edge.bondDimension >= 1000 ? `${(edge.bondDimension / 1000).toFixed(0)}k` : edge.bondDimension}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Tensor Nodes */}
          {topology.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const colors = getNodeColor(node.category, isSelected);
            const x = node.x || 100;
            const y = node.y || 200;

            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => onSelectNode(node)}
                className="cursor-pointer group transition-all"
              >
                {/* Node Outer Selection Glow */}
                <circle
                  r={isSelected ? 36 : 28}
                  fill="transparent"
                  stroke={colors.glow}
                  strokeWidth={isSelected ? 10 : 6}
                />

                {/* Node Background */}
                <circle
                  r={isSelected ? 26 : 22}
                  fill={colors.bg}
                  stroke={isSelected ? '#ffffff' : colors.border}
                  strokeWidth={isSelected ? 2.5 : 1.8}
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* Category Indicator Mini-Ring */}
                <circle
                  r="6"
                  cx="16"
                  cy="-16"
                  fill="#0f172a"
                  stroke={colors.border}
                  strokeWidth="1.5"
                />
                <text
                  x="16"
                  y="-14"
                  fontSize="7"
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.lieGroup.slice(0, 2)}
                </text>

                {/* Node Label (TeX Representation) */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fontSize="10"
                  fontWeight="600"
                  fill={colors.text}
                  fontFamily="monospace"
                  pointerEvents="none"
                >
                  {node.name.length > 12 ? node.name.slice(0, 10) + '..' : node.name}
                </text>

                {/* Dimension Shape Subtitle */}
                <text
                  textAnchor="middle"
                  dy="38"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                  className="group-hover:fill-cyan-300 transition-colors"
                >
                  [{node.indices.join('×')}]
                </text>
              </g>
            );
          })}
        </svg>

        {/* Contraction Timeline Player Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              id="btn-play-pause-sequence"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all cursor-pointer"
              title={isPlaying ? 'Pause reduction steps' : 'Play contraction sequence'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              id="btn-reset-sequence"
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Reset contraction timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-step-forward"
              onClick={() => setCurrentStep((prev) => Math.min(topology.edges.length - 1, prev + 1))}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Step to next contraction bond"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <div className="text-xs text-slate-300 font-mono ml-2">
              Step <span className="text-cyan-400 font-bold">{currentStep + 1}</span> / {topology.edges.length}
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="flex-1 max-w-md hidden sm:block">
            <input
              id="timeline-slider"
              type="range"
              min="0"
              max={topology.edges.length - 1}
              value={currentStep}
              onChange={(e) => setCurrentStep(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* View Toggles & Zoom */}
          <div className="flex items-center gap-2 text-xs">
            <button
              id="toggle-bond-indices"
              onClick={() => setShowIndices(!showIndices)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                showIndices ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Bond χ
            </button>

            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              <button
                id="btn-zoom-out"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1 text-slate-400 hover:text-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
              <button
                id="btn-zoom-in"
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                className="p-1 text-slate-400 hover:text-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node or Edge Inspector Footer */}
      {(selectedNode || selectedEdge) && (
        <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          {selectedNode ? (
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <div>
                <span className="font-semibold text-slate-200">{selectedNode.name}</span>
                <span className="text-slate-400 ml-2 font-mono">({selectedNode.label})</span>
                <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50 font-mono text-[10px]">
                  Lie: {selectedNode.lieGroup}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] hidden md:block">{selectedNode.description}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div>
                <span className="font-semibold text-slate-200">Contraction Bond:</span>
                <span className="text-cyan-300 ml-1 font-mono">{selectedEdge?.source} → {selectedEdge?.target}</span>
                <span className="ml-2 text-slate-400 font-mono">Bond Dim χ = {selectedEdge?.bondDimension}</span>
                <span className="ml-2 text-amber-400 font-mono">FLOPs = {formatFLOPs(selectedEdge?.contractionCostFLOPs || 0)}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              onSelectNode(null);
              onSelectEdge(null);
            }}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};
