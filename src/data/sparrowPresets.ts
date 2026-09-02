/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelArchitecturePreset } from '../types';

export const SPARROW_PRESETS: ModelArchitecturePreset[] = [
  {
    id: 'microsoft-sparrow-layoutlmv3',
    name: 'Microsoft Sparrow LayoutLMv3 ONNX (Spatial 2D Multimodal Transformer)',
    family: 'Microsoft-Sparrow',
    einsumExpression: 'O_{b,s,d} = \\text{Softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} + \\mathbf{R}_{1D}(s_i, s_j) + \\mathbf{R}_{2D}(\\text{bbox}_i, \\text{bbox}_j) \\right) V W_O',
    latexReduction: '\\mathbf{Y}_{b,s,d} = \\sum_{s\', k} \\left[ \\sigma\\left( \\frac{X W_Q (X W_K)^T}{\\sqrt{d_k}} + \\sum_{\\mu \\in \\{x,y,w,h\\}} \\mathcal{E}_{\\mu}(\\mathbf{B}_s, \\mathbf{B}_{s\'}) \\right) (X W_V)_{b,s\',k} \\right] W_O^{k,d}',
    description: 'Microsoft Sparrow document processing pipeline ONNX engine with 2D spatial coordinate layout embeddings, text tokens, and visual patch representations embedded in unified continuous SE(2) Euclidean manifolds.',
    parameters: '125M - 368M params | Max Seq=512 tokens | 2D Bounding Bins=1000 | Hidden=768 / 1024',
    defaultConfig: {
      batch: 1,
      seq_len: 512,
      d_model: 768,
      n_heads: 12,
      d_head: 64,
      coord_bins: 1000
    },
    lieGroup: 'SE(3)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Document batch size' },
      s: { name: 's', dimension: 512, type: 'sequence', description: 'Multimodal token sequence (Text + Visual Patches)' },
      d: { name: 'd', dimension: 768, type: 'feature', description: 'Hidden representation width' },
      h: { name: 'h', dimension: 12, type: 'head', description: 'Spatial multi-head attention' },
      k: { name: 'k', dimension: 64, type: 'hidden', description: 'Per-head key/query dimension' },
      bbox: { name: 'bbox', dimension: 4, type: 'spatial', description: '2D coordinates [x0, y0, x1, y1]' }
    },
    nodes: [
      {
        id: 'sparrow_text_patch_in',
        name: 'Multimodal Input (Text + Visual Patches)',
        label: 'X_{b, s, d}',
        category: 'input',
        indices: ['b', 's', 'd'],
        shape: [1, 512, 768],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 24,
        x: 80,
        y: 140,
        description: 'Combined RoBERTa text token embeddings and linear visual patch projection'
      },
      {
        id: 'sparrow_2d_bbox_embed',
        name: '2D Spatial BBox Embedding',
        label: '\\mathbf{E}_{2D}(\\text{bbox})',
        category: 'input',
        indices: ['b', 's', 'd'],
        shape: [1, 512, 768],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 32,
        x: 80,
        y: 280,
        description: 'Continuous 2D Euclidean coordinate embeddings normalized to [0, 1000]'
      },
      {
        id: 'sparrow_spatial_qkv',
        name: 'Spatial Linear Projections (Q, K, V)',
        label: 'W_{Q,K,V}^{d, h, k}',
        category: 'weight',
        indices: ['d', 'h', 'k'],
        shape: [768, 12, 64],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 36,
        x: 320,
        y: 190,
        description: 'Multi-head spatial transformer projection weights'
      },
      {
        id: 'sparrow_spatial_attn_matrix',
        name: 'Spatial 2D-Aware Attention Matrix',
        label: 'A_{b, h, s, s\'}^{2D}',
        category: 'reduction',
        indices: ['b', 'h', 's', 's'],
        shape: [1, 12, 512, 512],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 48,
        x: 560,
        y: 190,
        description: 'Einsum QK^T with 1D relative position and 2D bounding box coordinate bias'
      },
      {
        id: 'sparrow_ffn_gelu',
        name: 'Sparrow FFN Layer (GELU)',
        label: 'W_{ffn1}^{d, 3072} \\odot W_{ffn2}^{3072, d}',
        category: 'weight',
        indices: ['d', 'hidden'],
        shape: [768, 3072],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 32,
        x: 780,
        y: 190,
        description: 'Feed-forward feature expansion and non-linear contraction'
      },
      {
        id: 'sparrow_doc_out',
        name: 'Layout Entity Token Output',
        label: 'Y_{b, s, d}',
        category: 'output',
        indices: ['b', 's', 'd'],
        shape: [1, 512, 768],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 24,
        x: 980,
        y: 190,
        description: 'Extracted semantic key-value entity & token relationship representation'
      }
    ],
    edges: [
      {
        id: 'e_sparrow_fuse',
        source: 'sparrow_text_patch_in',
        target: 'sparrow_spatial_qkv',
        contractedIndices: ['d'],
        bondDimension: 768,
        contractionCostFLOPs: 3623878656,
        nonCommutativityFactor: 0.76,
        gaugeCurvature: 0.48,
        description: 'Multimodal input projection'
      },
      {
        id: 'e_sparrow_bbox_fuse',
        source: 'sparrow_2d_bbox_embed',
        target: 'sparrow_spatial_qkv',
        contractedIndices: ['d'],
        bondDimension: 768,
        contractionCostFLOPs: 3623878656,
        nonCommutativityFactor: 0.72,
        gaugeCurvature: 0.52,
        description: '2D spatial coordinate bias injection'
      },
      {
        id: 'e_sparrow_attn',
        source: 'sparrow_spatial_qkv',
        target: 'sparrow_spatial_attn_matrix',
        contractedIndices: ['k'],
        bondDimension: 64,
        contractionCostFLOPs: 402653184,
        nonCommutativityFactor: 0.88,
        gaugeCurvature: 0.74,
        description: 'Pairwise token-coordinate dot product'
      },
      {
        id: 'e_sparrow_ffn',
        source: 'sparrow_spatial_attn_matrix',
        target: 'sparrow_ffn_gelu',
        contractedIndices: ['s'],
        bondDimension: 512,
        contractionCostFLOPs: 4831838208,
        nonCommutativityFactor: 0.79,
        gaugeCurvature: 0.58,
        description: 'Context aggregation along document tokens'
      },
      {
        id: 'e_sparrow_out',
        source: 'sparrow_ffn_gelu',
        target: 'sparrow_doc_out',
        contractedIndices: ['d'],
        bondDimension: 768,
        contractionCostFLOPs: 393216,
        nonCommutativityFactor: 0.32,
        gaugeCurvature: 0.18,
        description: 'Residual accumulated document representation'
      },
      {
        id: 'e_sparrow_skip',
        source: 'sparrow_text_patch_in',
        target: 'sparrow_doc_out',
        contractedIndices: ['b', 's', 'd'],
        bondDimension: 768,
        contractionCostFLOPs: 393216,
        nonCommutativityFactor: 0.04,
        gaugeCurvature: 0.12,
        description: 'Direct identity holonomy skip loop'
      }
    ]
  },
  {
    id: 'microsoft-sparrow-donut',
    name: 'Microsoft Sparrow Donut ONNX (OCR-Free Visual Document Transformer)',
    family: 'Microsoft-Sparrow',
    einsumExpression: 'O_{b,s,d} = \\text{mBART-Decoder}\\left( \\text{Swin-Encoder}(I_{b,3,H,W}) \\right)',
    latexReduction: '\\mathbf{Y}_{b,L,v} = \\operatorname{Softmax}\\left( \\operatorname{CrossAttn}\\left( \\mathbf{Q}_{dec}(T_{<l}), \\mathbf{K}_{enc}(\\text{Swin}(I)), \\mathbf{V}_{enc}(\\text{Swin}(I)) \\right) W_{vocab}^{d,v} \\right)',
    description: 'End-to-end OCR-free document understanding model used in Microsoft Sparrow pipelines. Directly maps raw high-resolution document image pixels into structured JSON tokens without external OCR engines.',
    parameters: '140M params | Swin-B Visual Encoder + mBART-400 Dec | Input: 2560x1920',
    defaultConfig: {
      batch: 1,
      image_height: 2560,
      image_width: 1920,
      encoder_dim: 1024,
      decoder_dim: 1024,
      vocab_size: 57525
    },
    lieGroup: 'SU(n)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Document image batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB Image Channels' },
      hw_patches: { name: 'hw_patches', dimension: 4800, type: 'spatial', description: 'Visual patch tokens' },
      d_enc: { name: 'd_enc', dimension: 1024, type: 'hidden', description: 'Swin visual encoder dimension' },
      seq_dec: { name: 'seq_dec', dimension: 512, type: 'sequence', description: 'Decoded structured JSON tokens' },
      vocab: { name: 'vocab', dimension: 57525, type: 'feature', description: 'Vocabulary classification dimension' }
    },
    nodes: [
      {
        id: 'donut_raw_img',
        name: 'Document Image RGB',
        label: 'I_{b, 3, H, W}',
        category: 'input',
        indices: ['b', 'c', 'hw_patches'],
        shape: [1, 3, 4800],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'High-resolution raw document page raster'
      },
      {
        id: 'donut_swin_encoder',
        name: 'Swin-Transformer Visual Encoder',
        label: '\\text{SwinB}(I)',
        category: 'reduction',
        indices: ['b', 'hw_patches', 'd_enc'],
        shape: [1, 4800, 1024],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 56,
        x: 340,
        y: 180,
        description: 'Hierarchical shifted window self-attention multi-scale visual representation'
      },
      {
        id: 'donut_cross_decoder',
        name: 'mBART Cross-Attention Decoder',
        label: '\\text{CrossAttn}(T, \\text{Swin})',
        category: 'weight',
        indices: ['b', 'seq_dec', 'd_enc'],
        shape: [1, 512, 1024],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 48,
        x: 620,
        y: 180,
        description: 'Autoregressive cross-attention projecting visual memory into language tokens'
      },
      {
        id: 'donut_json_lm_head',
        name: 'Structured JSON Prediction Head',
        label: 'W_{vocab}^{1024, 57525}',
        category: 'output',
        indices: ['b', 'seq_dec', 'vocab'],
        shape: [1, 512, 57525],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 32,
        x: 900,
        y: 180,
        description: 'Emits structured parsed JSON tokens representing table/form values'
      }
    ],
    edges: [
      {
        id: 'e_donut_enc',
        source: 'donut_raw_img',
        target: 'donut_swin_encoder',
        contractedIndices: ['c', 'hw_patches'],
        bondDimension: 4800,
        contractionCostFLOPs: 48318382080,
        nonCommutativityFactor: 0.84,
        gaugeCurvature: 0.70,
        description: 'Shifted-window multi-scale image contraction'
      },
      {
        id: 'e_donut_cross',
        source: 'donut_swin_encoder',
        target: 'donut_cross_decoder',
        contractedIndices: ['hw_patches', 'd_enc'],
        bondDimension: 1024,
        contractionCostFLOPs: 10066329600,
        nonCommutativityFactor: 0.91,
        gaugeCurvature: 0.82,
        description: 'Cross-modal visual-to-linguistic manifold contraction'
      },
      {
        id: 'e_donut_out',
        source: 'donut_cross_decoder',
        target: 'donut_json_lm_head',
        contractedIndices: ['d_enc'],
        bondDimension: 1024,
        contractionCostFLOPs: 60317696000,
        nonCommutativityFactor: 0.65,
        gaugeCurvature: 0.38,
        description: 'Language model head contraction to JSON vocabulary'
      }
    ]
  },
  {
    id: 'microsoft-sparrow-yolov8-doc',
    name: 'Microsoft Sparrow YOLOv8-Doc ONNX (Document Element Detector)',
    family: 'Microsoft-Sparrow',
    einsumExpression: 'B_{b,anc,x,y,c} = \\text{PANet-Dec}\\left( \\text{CSPDarknet-Enc}(I_{b,3,640,640}) \\right)',
    latexReduction: '\\mathbf{P}_{b,a,x,y,k} = \\sigma\\left( \\text{Conv}_{1\\times 1}\\left( \\text{Cat}(\\mathbf{F}_3, \\mathbf{F}_4, \\mathbf{F}_5) \\right) \\right)',
    description: 'Fast edge-device anchor-free bounding box detector utilized in Microsoft Sparrow pipelines for layout segmentation, detecting text paragraphs, tables, stamps, figures, and signatures in real-time ONNX runtimes.',
    parameters: '11.2M params | 640x640 input | 16 classes (table, cell, header, signature, etc.)',
    defaultConfig: {
      batch: 1,
      image_size: 640,
      channels_csp: 512,
      num_classes: 16
    },
    lieGroup: 'SE(3)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB Channels' },
      h_w: { name: 'h_w', dimension: 8400, type: 'spatial', description: 'Total anchor candidate cells' },
      cls_reg: { name: 'cls_reg', dimension: 20, type: 'feature', description: 'Class scores + 4 box offsets' }
    },
    nodes: [
      {
        id: 'sparrow_yolo_in',
        name: 'Document Page Image',
        label: 'I_{b, 3, 640, 640}',
        category: 'input',
        indices: ['b', 'c', 'h_w'],
        shape: [1, 3, 640, 640],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 100,
        y: 180,
        description: 'Input page raster'
      },
      {
        id: 'sparrow_csp_backbone',
        name: 'CSPDarknet Backbone',
        label: '\\text{C3k2}(\\mathbf{F}_l)',
        category: 'weight',
        indices: ['b', 'channels', 'h_w'],
        shape: [1, 512, 8400],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 40,
        x: 380,
        y: 180,
        description: 'Cross Stage Partial multi-scale hierarchical feature extractor'
      },
      {
        id: 'sparrow_panet_head',
        name: 'PANet Neck & Decoupled Heads',
        label: '\\text{Head}(\\mathbf{F}_{3,4,5})',
        category: 'output',
        indices: ['b', 'h_w', 'cls_reg'],
        shape: [1, 8400, 20],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 32,
        x: 740,
        y: 180,
        description: 'Anchor-free bounding boxes and class logits for document components'
      }
    ],
    edges: [
      {
        id: 'e_sparrow_yolo_enc',
        source: 'sparrow_yolo_in',
        target: 'sparrow_csp_backbone',
        contractedIndices: ['c'],
        bondDimension: 512,
        contractionCostFLOPs: 28500000000,
        nonCommutativityFactor: 0.72,
        gaugeCurvature: 0.44,
        description: 'CSP spatial convolution contraction'
      },
      {
        id: 'e_sparrow_yolo_head',
        source: 'sparrow_csp_backbone',
        target: 'sparrow_panet_head',
        contractedIndices: ['channels'],
        bondDimension: 512,
        contractionCostFLOPs: 3400000000,
        nonCommutativityFactor: 0.81,
        gaugeCurvature: 0.58,
        description: 'Multi-scale feature pyramid aggregation'
      }
    ]
  },
  {
    id: 'microsoft-sparrow-vit-ocr',
    name: 'Microsoft Sparrow ViT-OCR ONNX (Vision-Language Character Recognizer)',
    family: 'Microsoft-Sparrow',
    einsumExpression: 'T_{b,l,c} = \\text{BiGRU-CTC}\\left( \\text{ViT-PatchEncoder}(I_{b,1,32,128}) \\right)',
    latexReduction: '\\mathbf{P}(w|I) = \\sum_{\\pi \\in \\mathcal{B}^{-1}(w)} \\prod_{t=1}^T y_{\\pi_t}^t, \\quad y^t = \\operatorname{Softmax}\\left( W_{ctc} \\cdot \\text{ViT}(I) \\right)',
    description: 'High-accuracy character and token recognition ONNX model used in Microsoft Sparrow OCR pipelines for multilingual cropped word recognition and handwritten text transcription.',
    parameters: '24.5M params | ViT-Tiny Patch Encoder (16x16) + CTC Sequence Loss',
    defaultConfig: {
      batch: 8,
      char_seq: 64,
      hidden_dim: 384,
      char_classes: 6800
    },
    lieGroup: 'SL(n)',
    allIndices: {
      b: { name: 'b', dimension: 8, type: 'batch', description: 'Batch cropped words' },
      l: { name: 'l', dimension: 64, type: 'sequence', description: 'Character sequence length' },
      d: { name: 'd', dimension: 384, type: 'hidden', description: 'ViT token dimension' },
      vocab: { name: 'vocab', dimension: 6800, type: 'feature', description: 'Multilingual character set' }
    },
    nodes: [
      {
        id: 'sparrow_vit_in',
        name: 'Cropped Text Patch',
        label: 'I_{b, 1, 32, 128}',
        category: 'input',
        indices: ['b', 'l', 'd'],
        shape: [8, 64, 384],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 16,
        x: 100,
        y: 180,
        description: 'Normalized cropped text image line'
      },
      {
        id: 'sparrow_vit_transformer',
        name: 'ViT Patch Transformer',
        label: '\\text{ViT}_{12L}(I)',
        category: 'reduction',
        indices: ['b', 'l', 'd'],
        shape: [8, 64, 384],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 40,
        x: 420,
        y: 180,
        description: 'Self-attention across 1D text horizontal patch sequence'
      },
      {
        id: 'sparrow_vit_ctc',
        name: 'CTC Character Classifier',
        label: 'W_{ctc}^{384, 6800}',
        category: 'output',
        indices: ['b', 'l', 'vocab'],
        shape: [8, 64, 6800],
        dataType: 'float32',
        lieGroup: 'SL(n)',
        algebraGeneratorRank: 32,
        x: 760,
        y: 180,
        description: 'Continuous character probability distribution over alphabet'
      }
    ],
    edges: [
      {
        id: 'e_sparrow_vit_tr',
        source: 'sparrow_vit_in',
        target: 'sparrow_vit_transformer',
        contractedIndices: ['d'],
        bondDimension: 384,
        contractionCostFLOPs: 1887436800,
        nonCommutativityFactor: 0.75,
        gaugeCurvature: 0.50,
        description: 'ViT self-attention contraction'
      },
      {
        id: 'e_sparrow_vit_out',
        source: 'sparrow_vit_transformer',
        target: 'sparrow_vit_ctc',
        contractedIndices: ['d'],
        bondDimension: 384,
        contractionCostFLOPs: 1338245120,
        nonCommutativityFactor: 0.62,
        gaugeCurvature: 0.35,
        description: 'CTC vocabulary projection'
      }
    ]
  }
];
