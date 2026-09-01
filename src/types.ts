/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LieGroupType = 'GL(n)' | 'SL(n)' | 'SO(n)' | 'SU(n)' | 'SE(3)' | 'Sp(2n)' | 'Heisenberg-Weyl' | 'Diff(M)';

export interface TensorIndex {
  name: string;
  dimension: number;
  type: 'batch' | 'sequence' | 'feature' | 'head' | 'hidden' | 'spatial' | 'reduction' | 'expert';
  description?: string;
}

export interface TensorNode {
  id: string;
  name: string;
  label: string;
  category: 'input' | 'weight' | 'activation' | 'reduction' | 'output' | 'norm' | 'routing';
  indices: string[]; // index names
  shape: number[];
  dataType: string;
  lieGroup: LieGroupType;
  algebraGeneratorRank: number;
  x?: number;
  y?: number;
  description?: string;
}

export interface TensorContractionEdge {
  id: string;
  source: string;
  target: string;
  contractedIndices: string[];
  bondDimension: number;
  contractionCostFLOPs: number;
  nonCommutativityFactor: number;
  gaugeCurvature: number;
  description?: string;
}

export interface NetworkTopology {
  nodes: TensorNode[];
  edges: TensorContractionEdge[];
  allIndices: Record<string, TensorIndex>;
  contractionOrder: string[]; // Sequence of contraction steps
  bettiNumbers: {
    b0: number; // Connected components
    b1: number; // 1D homology cycles / contraction loops
  };
  eulerCharacteristic: number;
  graphDiameter: number;
  arithmeticIntensity: number; // FLOPs / byte
  maxBondDimension: number;
  totalFlops: number;
}

export interface LieEmbeddingData {
  targetLieGroup: LieGroupType;
  lieAlgebraName: string;
  dimension: number;
  cartanSubalgebraDim: number;
  rootSystemType: 'A_n' | 'B_n' | 'C_n' | 'D_n' | 'G_2' | 'F_4' | 'E_6' | 'E_7' | 'E_8' | 'Heisenberg';
  generators: {
    name: string;
    description: string;
    matrix2x2?: number[][];
    trace: number;
    frobeniusNorm: number;
    weightVector: [number, number];
  }[];
  killingFormMatrix: number[][];
  structureConstantsSample: {
    bracket: string;
    result: string;
    value: number;
  }[];
  casimirInvariantValue: number;
  curvatureSpectrum: number[];
}

export interface LieComplexityReport {
  compositeScore: number; // 0 - 100
  complexityClass: 'Class I: Abelian / Solvable' | 'Class II: Nilpotent Dominated' | 'Class III: Semi-Simple / High Expressivity' | 'Class IV: Symplectic / Hyper-Curved';
  metrics: {
    commutatorDivergence: number; // [0, 1] average ||[W_i, W_j]||_F / (||W_i||*||W_j||)
    algebraicSpanRank: number;    // Dim of generated Lie algebra
    maxPossibleRank: number;
    algebraicExpansionRatio: number; // rank / maxRank
    gaugeHolonomyEnergy: number;  // Curvature along residual & contraction loops
    casimirDispersion: number;    // Variance of Casimir eigenvalue spectrum
    spectralGap: number;          // Adjoint representation Laplacian spectral gap
    nilpotencyDegree: number;     // Step at which iterated commutator vanishes (or inf)
    reversibilityGaugeIndex: number; // Gauge invariance degree
  };
  layerCommutators: {
    layerPair: [string, string];
    commutatorNorm: number;
    killingProduct: number;
    interpretation: string;
  }[];
  homologyLoops: {
    loopPath: string[];
    holonomyTrace: number;
    geometricPhase: number;
    description: string;
  }[];
  theoreticalImplications: string[];
}

export interface ModelArchitecturePreset {
  id: string;
  name: string;
  family: 'Transformer' | 'LLM' | 'MoE' | 'State-Space' | 'Diffusion' | 'CNN' | 'Custom';
  einsumExpression: string;
  latexReduction: string;
  description: string;
  parameters: string;
  defaultConfig: Record<string, number>;
  nodes: TensorNode[];
  edges: TensorContractionEdge[];
  allIndices: Record<string, TensorIndex>;
  lieGroup: LieGroupType;
}

export interface AgentReasoningStep {
  id: string;
  timestamp: string;
  title: string;
  thought: string;
  action?: string;
  result?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export interface AgentAnalysisResponse {
  architectureName: string;
  einsumEquation: string;
  latexEquation: string;
  topology: NetworkTopology;
  lieEmbedding: LieEmbeddingData;
  lieComplexity: LieComplexityReport;
  agentChainOfThought: string;
  mathematicalProof: string;
  recommendations: string[];
}
