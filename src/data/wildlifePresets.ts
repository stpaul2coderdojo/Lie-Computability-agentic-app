/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelArchitecturePreset } from '../types';

export const WILDLIFE_PRESETS: ModelArchitecturePreset[] = [
  {
    id: 'megadetector-v5a-onnx',
    name: 'MegaDetector v5a ONNX (YOLOv5x6 Camera Trap Detector)',
    family: 'MegaDetector',
    einsumExpression: 'P_{b,anc,x,y,k} = \\text{DetectHead}\\left( \\text{PANet}\\left( \\text{CSPDarknet53}_{x6}(I_{b,3,1280,1280}) \\right) \\right)',
    latexReduction: '\\mathbf{B}_{b,k,4}, \\mathbf{S}_{b,k,3} = \\sigma\\left( \\sum_{l=3}^6 \\text{Conv}_{1\\times 1}\\left( \\mathcal{C}_l(I) \\right) \\right)',
    description: 'Gold standard camera trap wildlife detector developed by Microsoft AI for Earth and PyTorch-Wildlife. Employs a YOLOv5x6 backbone (1280x1280 input) with 4-level feature pyramid (P3-P6) detecting Animals, People, and Vehicles.',
    parameters: '140.7M parameters | 1280x1280 input resolution | 3 Classes: [Animal, Person, Vehicle]',
    defaultConfig: {
      batch: 1,
      image_size: 1280,
      channels_csp: 1024,
      num_anchors_per_level: 3,
      num_classes: 3
    },
    lieGroup: 'SE(3)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch images' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB Channels' },
      spatial_1280: { name: 'spatial_1280', dimension: 1638400, type: 'spatial', description: '1280x1280 pixel field' },
      c_p3_p6: { name: 'c_p3_p6', dimension: 1024, type: 'hidden', description: 'CSPDarknet multi-scale channel depth' },
      anchors: { name: 'anchors', dimension: 102000, type: 'spatial', description: 'Combined multi-scale P3..P6 anchor grid cells' },
      box_cls: { name: 'box_cls', dimension: 8, type: 'feature', description: '[x, y, w, h, obj_conf, animal, person, vehicle]' }
    },
    nodes: [
      {
        id: 'md_v5a_img_in',
        name: 'Camera Trap Image (1280x1280)',
        label: 'I_{b, 3, 1280, 1280}',
        category: 'input',
        indices: ['b', 'c', 'spatial_1280'],
        shape: [1, 3, 1280, 1280],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 200,
        description: 'Raw uncropped camera trap sensor image'
      },
      {
        id: 'md_v5a_csp_backbone',
        name: 'CSPDarknet53-x6 Backbone',
        label: '\\text{CSP}_{x6}(\\mathbf{F}_{P3..P6})',
        category: 'weight',
        indices: ['b', 'c_p3_p6', 'anchors'],
        shape: [1, 1024, 102000],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 48,
        x: 340,
        y: 120,
        description: 'Cross-Stage Partial deep residual blocks extracting fine-grained fur, limb, and camouflage features'
      },
      {
        id: 'md_v5a_panet_neck',
        name: 'PANet Neck Feature Fusion',
        label: '\\text{PANet}(\\mathbf{P}_3, \\mathbf{P}_4, \\mathbf{P}_5, \\mathbf{P}_6)',
        category: 'reduction',
        indices: ['b', 'c_p3_p6', 'anchors'],
        shape: [1, 1024, 102000],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 40,
        x: 620,
        y: 120,
        description: 'Top-down and bottom-up bidirectional feature pyramid aggregation'
      },
      {
        id: 'md_v5a_detect_head',
        name: 'MegaDetector 3-Class Output Head',
        label: '\\mathbf{Y}_{b, anc, 8}',
        category: 'output',
        indices: ['b', 'anchors', 'box_cls'],
        shape: [1, 102000, 8],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 32,
        x: 900,
        y: 200,
        description: 'Outputs bounding box geometry [x,y,w,h], objectness, and Animal/Person/Vehicle probabilities'
      }
    ],
    edges: [
      {
        id: 'e_md5a_enc',
        source: 'md_v5a_img_in',
        target: 'md_v5a_csp_backbone',
        contractedIndices: ['c'],
        bondDimension: 1024,
        contractionCostFLOPs: 180000000000,
        nonCommutativityFactor: 0.78,
        gaugeCurvature: 0.52,
        description: 'Multi-scale CSP convolution tensor reduction'
      },
      {
        id: 'e_md5a_pan',
        source: 'md_v5a_csp_backbone',
        target: 'md_v5a_panet_neck',
        contractedIndices: ['c_p3_p6'],
        bondDimension: 1024,
        contractionCostFLOPs: 42000000000,
        nonCommutativityFactor: 0.84,
        gaugeCurvature: 0.65,
        description: 'Bidirectional path aggregation'
      },
      {
        id: 'e_md5a_head',
        source: 'md_v5a_panet_neck',
        target: 'md_v5a_detect_head',
        contractedIndices: ['c_p3_p6'],
        bondDimension: 1024,
        contractionCostFLOPs: 14000000000,
        nonCommutativityFactor: 0.68,
        gaugeCurvature: 0.40,
        description: 'Bounding box coordinate and 3-class logit reduction'
      },
      {
        id: 'e_md5a_skip',
        source: 'md_v5a_csp_backbone',
        target: 'md_v5a_detect_head',
        contractedIndices: ['b', 'anchors'],
        bondDimension: 1024,
        contractionCostFLOPs: 1024000,
        nonCommutativityFactor: 0.05,
        gaugeCurvature: 0.10,
        description: 'High-resolution P3 skip connection for small animal detection'
      }
    ]
  },
  {
    id: 'megadetector-v5b-onnx',
    name: 'MegaDetector v5b ONNX (Edge-Optimized Compact / Quantized YOLOv5x6)',
    family: 'MegaDetector',
    einsumExpression: 'P_{b,anc,k} = \\text{Int8-Detect}\\left( \\text{QuantCSPDarknet}(I_{b,3,1280,1280}) \\right)',
    latexReduction: '\\mathbf{Y}_{int8} = \\text{Dequant}\\left( \\sigma\\left( \\mathbf{W}_{q} \\star \\mathbf{X}_{q} + \\mathbf{b}_q \\right) \\right)',
    description: 'Edge-optimized variant of MegaDetector v5 with calibrated INT8/FP16 quantization designed for low-power edge camera traps, Raspberry Pi, Jetson Nano, and handheld field devices in PyTorch-Wildlife.',
    parameters: '72.3M params (INT8 quantized) | 1280x1280 | 3.2x faster edge inference',
    defaultConfig: {
      batch: 1,
      image_size: 1280,
      quant_bits: 8,
      channels_csp: 768
    },
    lieGroup: 'SE(3)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB' },
      anchors: { name: 'anchors', dimension: 102000, type: 'spatial', description: 'Anchor grid' },
      box_cls: { name: 'box_cls', dimension: 8, type: 'feature', description: 'Box + Class' }
    },
    nodes: [
      {
        id: 'md_v5b_img_in',
        name: 'Camera Trap Image (INT8)',
        label: 'I_{b, 3, 1280, 1280}',
        category: 'input',
        indices: ['b', 'c', 'anchors'],
        shape: [1, 3, 1280, 1280],
        dataType: 'int8',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 100,
        y: 180,
        description: 'Quantized input buffer'
      },
      {
        id: 'md_v5b_quant_csp',
        name: 'Quantized CSPDarknet Backbone',
        label: '\\text{QuantCSP}(I)',
        category: 'weight',
        indices: ['b', 'channels', 'anchors'],
        shape: [1, 768, 102000],
        dataType: 'int8',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 36,
        x: 420,
        y: 180,
        description: 'INT8 SIMD matrix multiply optimized for edge NPU / ONNX Runtime'
      },
      {
        id: 'md_v5b_out',
        name: 'MegaDetector v5b Predictions',
        label: '\\mathbf{Y}_{b, anc, 8}',
        category: 'output',
        indices: ['b', 'anchors', 'box_cls'],
        shape: [1, 102000, 8],
        dataType: 'float16',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 24,
        x: 780,
        y: 180,
        description: 'Animal/Person/Vehicle bounding boxes with calibrated confidence thresholds'
      }
    ],
    edges: [
      {
        id: 'e_md5b_conv',
        source: 'md_v5b_img_in',
        target: 'md_v5b_quant_csp',
        contractedIndices: ['c'],
        bondDimension: 768,
        contractionCostFLOPs: 64000000000,
        nonCommutativityFactor: 0.65,
        gaugeCurvature: 0.38,
        description: 'Quantized integer tensor contraction'
      },
      {
        id: 'e_md5b_head',
        source: 'md_v5b_quant_csp',
        target: 'md_v5b_out',
        contractedIndices: ['channels'],
        bondDimension: 768,
        contractionCostFLOPs: 8200000000,
        nonCommutativityFactor: 0.70,
        gaugeCurvature: 0.42,
        description: 'Dequantization and bounding box regression'
      }
    ]
  },
  {
    id: 'megadetector-v6-yolov9-onnx',
    name: 'MegaDetector v6 ONNX (YOLOv9-PGI / GELAN Architecture)',
    family: 'MegaDetector',
    einsumExpression: 'O_{b,anc,c} = \\text{PGI-GELAN}\\left( \\text{DualBranchEncoder}(I_{b,3,1280,1280}) \\right)',
    latexReduction: '\\mathcal{L}_{PGI} = \\mathcal{L}_{main}(\\mathbf{Y}_{lead}) + \\lambda \\mathcal{L}_{aux}(\\text{RevBranch}(\\mathbf{F}_{aux}))',
    description: 'Next-generation MegaDetector v6 model leveraging YOLOv9 Programmable Gradient Information (PGI) and Generalized Efficient Layer Aggregation Network (GELAN). Solves information bottleneck in dense foliage camera traps.',
    parameters: '58.2M params | Programmable Gradient Info (PGI) + Auxiliary Reversible Branch',
    defaultConfig: {
      batch: 1,
      image_size: 1280,
      gelan_channels: 512,
      num_classes: 3
    },
    lieGroup: 'GL(n)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB Channels' },
      h_w: { name: 'h_w', dimension: 102000, type: 'spatial', description: 'GELAN multi-scale grids' },
      d: { name: 'd', dimension: 512, type: 'hidden', description: 'GELAN layer aggregation width' }
    },
    nodes: [
      {
        id: 'md_v6_in',
        name: 'Camera Trap Input (v6)',
        label: 'I_{b, 3, 1280, 1280}',
        category: 'input',
        indices: ['b', 'c', 'h_w'],
        shape: [1, 3, 1280, 1280],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 200,
        description: 'Raw camera trap frame'
      },
      {
        id: 'md_v6_gelan',
        name: 'GELAN Layer Aggregation',
        label: '\\text{GELAN}(\\mathbf{F}_l)',
        category: 'weight',
        indices: ['b', 'd', 'h_w'],
        shape: [1, 512, 102000],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 44,
        x: 360,
        y: 120,
        description: 'Generalized efficient aggregation maintaining gradient paths without degradation'
      },
      {
        id: 'md_v6_pgi_aux',
        name: 'PGI Auxiliary Reversible Branch',
        label: '\\text{PGI}_{rev}(\\mathbf{F}_{aux})',
        category: 'reduction',
        indices: ['b', 'd', 'h_w'],
        shape: [1, 512, 102000],
        dataType: 'float32',
        lieGroup: 'SL(n)',
        algebraGeneratorRank: 36,
        x: 360,
        y: 300,
        description: 'Auxiliary reversible connection providing uncompressed gradient signals'
      },
      {
        id: 'md_v6_head',
        name: 'MegaDetector v6 Lead Head',
        label: '\\mathbf{Y}_{b, anc, 8}',
        category: 'output',
        indices: ['b', 'h_w', 'd'],
        shape: [1, 102000, 8],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 32,
        x: 780,
        y: 200,
        description: 'Final detected wildlife bounding boxes and class probabilities'
      }
    ],
    edges: [
      {
        id: 'e_v6_gelan',
        source: 'md_v6_in',
        target: 'md_v6_gelan',
        contractedIndices: ['c'],
        bondDimension: 512,
        contractionCostFLOPs: 92000000000,
        nonCommutativityFactor: 0.74,
        gaugeCurvature: 0.46,
        description: 'GELAN spatial convolution'
      },
      {
        id: 'e_v6_pgi',
        source: 'md_v6_in',
        target: 'md_v6_pgi_aux',
        contractedIndices: ['c'],
        bondDimension: 512,
        contractionCostFLOPs: 24000000000,
        nonCommutativityFactor: 0.82,
        gaugeCurvature: 0.60,
        description: 'Reversible auxiliary branch contraction'
      },
      {
        id: 'e_v6_fuse',
        source: 'md_v6_gelan',
        target: 'md_v6_head',
        contractedIndices: ['d'],
        bondDimension: 512,
        contractionCostFLOPs: 12000000000,
        nonCommutativityFactor: 0.65,
        gaugeCurvature: 0.35,
        description: 'Lead detection head contraction'
      },
      {
        id: 'e_v6_aux_fuse',
        source: 'md_v6_pgi_aux',
        target: 'md_v6_head',
        contractedIndices: ['d'],
        bondDimension: 512,
        contractionCostFLOPs: 6000000000,
        nonCommutativityFactor: 0.58,
        gaugeCurvature: 0.30,
        description: 'Gradient alignment fusion'
      }
    ]
  },
  {
    id: 'megadetector-v6-rtdetr-onnx',
    name: 'MegaDetector v6 ONNX (RT-DETR Real-Time Detection Transformer)',
    family: 'MegaDetector',
    einsumExpression: 'O_{b,q,d} = \\text{CrossAttn}\\left( \\mathbf{Q}_{object}, \\text{CCFM}\\left( \\text{AIFI}(\\mathbf{S}_5), \\mathbf{S}_4, \\mathbf{S}_3 \\right) \\right)',
    latexReduction: '\\hat{\\mathbf{Y}} = \\arg\\min_{\\sigma} \\sum_{i=1}^N \\mathcal{L}_{match}(y_i, \\hat{y}_{\\sigma(i)}), \\quad \\mathbf{Q}_{dec} \\in \\mathbb{R}^{300 \\times 256}',
    description: 'Transformer-based MegaDetector v6 architecture featuring an efficient Hybrid Encoder with Intra-scale Interaction (AIFI), Cross-scale Feature Fusion (CCFM), and end-to-end Bipartite Hungarian matching eliminating NMS.',
    parameters: '42.8M params | 300 Object Queries | Real-Time Detection Transformer | Zero NMS',
    defaultConfig: {
      batch: 1,
      image_size: 640,
      d_model: 256,
      num_queries: 300,
      decoder_layers: 6
    },
    lieGroup: 'SU(n)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB Channels' },
      hw_feat: { name: 'hw_feat', dimension: 5355, type: 'spatial', description: 'Multi-scale flattened visual tokens' },
      q: { name: 'q', dimension: 300, type: 'sequence', description: 'Learnable object queries' },
      d: { name: 'd', dimension: 256, type: 'hidden', description: 'Transformer latent channel dimension' }
    },
    nodes: [
      {
        id: 'rtdetr_in',
        name: 'Camera Trap Image (640x640)',
        label: 'I_{b, 3, 640, 640}',
        category: 'input',
        indices: ['b', 'c', 'hw_feat'],
        shape: [1, 3, 640, 640],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'Input camera trap raster'
      },
      {
        id: 'rtdetr_aifi_ccfm',
        name: 'AIFI + CCFM Hybrid Encoder',
        label: '\\text{AIFI}(\\mathbf{S}_5) + \\text{CCFM}(\\mathbf{S}_{3..5})',
        category: 'reduction',
        indices: ['b', 'hw_feat', 'd'],
        shape: [1, 5355, 256],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 56,
        x: 360,
        y: 180,
        description: 'Intra-scale interaction self-attention + cross-scale fusion module'
      },
      {
        id: 'rtdetr_queries',
        name: '300 Learnable Object Queries',
        label: '\\mathbf{Q}_{300}^{256}',
        category: 'input',
        indices: ['b', 'q', 'd'],
        shape: [1, 300, 256],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 24,
        x: 360,
        y: 320,
        description: 'Positional query embeddings probing for animal candidates'
      },
      {
        id: 'rtdetr_decoder',
        name: 'Deformable Cross-Attention Decoder',
        label: '\\text{CrossAttn}(\\mathbf{Q}, \\text{CCFM})',
        category: 'weight',
        indices: ['b', 'q', 'd'],
        shape: [1, 300, 256],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 48,
        x: 640,
        y: 180,
        description: 'Multi-layer transformer decoder with Hungarian bipartite matching'
      },
      {
        id: 'rtdetr_out',
        name: 'MegaDetector RT-DETR Output',
        label: '\\mathbf{Y}_{b, 300, 8}',
        category: 'output',
        indices: ['b', 'q', 'd'],
        shape: [1, 300, 8],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 24,
        x: 900,
        y: 180,
        description: 'Direct bounding boxes without Non-Maximum Suppression (NMS)'
      }
    ],
    edges: [
      {
        id: 'e_rtdetr_enc',
        source: 'rtdetr_in',
        target: 'rtdetr_aifi_ccfm',
        contractedIndices: ['c'],
        bondDimension: 256,
        contractionCostFLOPs: 48000000000,
        nonCommutativityFactor: 0.86,
        gaugeCurvature: 0.72,
        description: 'Hybrid encoder spatial self-attention'
      },
      {
        id: 'e_rtdetr_cross',
        source: 'rtdetr_aifi_ccfm',
        target: 'rtdetr_decoder',
        contractedIndices: ['hw_feat', 'd'],
        bondDimension: 256,
        contractionCostFLOPs: 8200000000,
        nonCommutativityFactor: 0.92,
        gaugeCurvature: 0.85,
        description: 'Bipartite cross-attention contraction'
      },
      {
        id: 'e_rtdetr_q_cross',
        source: 'rtdetr_queries',
        target: 'rtdetr_decoder',
        contractedIndices: ['d'],
        bondDimension: 256,
        contractionCostFLOPs: 420000000,
        nonCommutativityFactor: 0.70,
        gaugeCurvature: 0.40,
        description: 'Query embedding interaction'
      },
      {
        id: 'e_rtdetr_out',
        source: 'rtdetr_decoder',
        target: 'rtdetr_out',
        contractedIndices: ['d'],
        bondDimension: 256,
        contractionCostFLOPs: 614400,
        nonCommutativityFactor: 0.45,
        gaugeCurvature: 0.20,
        description: 'Bounding box & class projection'
      }
    ]
  },
  {
    id: 'megadetector-v4-fasterrcnn-onnx',
    name: 'MegaDetector v4 ONNX (Faster R-CNN ResNet-50 FPN Legacy Baseline)',
    family: 'MegaDetector',
    einsumExpression: 'O_{b,k,c} = \\text{RoIAlign}\\left( \\text{ResNet50-FPN}(I_{b,3,H,W}), \\text{RPN}(I) \\right)',
    latexReduction: '\\mathbf{Y}_{roi} = \\operatorname{FC}\\left( \\operatorname{RoIAlign}\\left( \\mathbf{P}_2, \\dots, \\mathbf{P}_5, \\text{BBox}_{rpn} \\right) \\right)',
    description: 'Original legacy two-stage MegaDetector v4 model used in global camera trap repositories. Utilizes ResNet-50 with Feature Pyramid Networks (FPN) and Region Proposal Networks (RPN).',
    parameters: '41.5M params | ResNet-50 Backbone + FPN + 2-Stage RPN',
    defaultConfig: {
      batch: 1,
      image_size: 1024,
      d_fpn: 256,
      num_proposals: 1000
    },
    lieGroup: 'GL(n)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB Channels' },
      hw: { name: 'hw', dimension: 1048576, type: 'spatial', description: 'Pixel grid' },
      d_fpn: { name: 'd_fpn', dimension: 256, type: 'hidden', description: 'FPN channel dimension' },
      rois: { name: 'rois', dimension: 1000, type: 'sequence', description: 'Candidate proposals' }
    },
    nodes: [
      {
        id: 'md_v4_img_in',
        name: 'Camera Trap Image (1024x1024)',
        label: 'I_{b, 3, 1024, 1024}',
        category: 'input',
        indices: ['b', 'c', 'hw'],
        shape: [1, 3, 1024, 1024],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'Input frame'
      },
      {
        id: 'md_v4_resnet_fpn',
        name: 'ResNet-50 + FPN Backbone',
        label: '\\text{ResNet50-FPN}(I)',
        category: 'weight',
        indices: ['b', 'd_fpn', 'hw'],
        shape: [1, 256, 1048576],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 40,
        x: 340,
        y: 180,
        description: '50-layer deep residual network with top-down feature pyramids'
      },
      {
        id: 'md_v4_rpn_roi',
        name: 'RPN & RoIAlign Pooling',
        label: '\\text{RoIAlign}(\\mathbf{P}_{2..5}, \\text{RPN})',
        category: 'reduction',
        indices: ['b', 'rois', 'd_fpn'],
        shape: [1, 1000, 256],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 32,
        x: 620,
        y: 180,
        description: 'Continuous bilinear interpolation pooling bounding box features'
      },
      {
        id: 'md_v4_out',
        name: 'Two-Stage Classification Head',
        label: '\\mathbf{Y}_{b, rois, 8}',
        category: 'output',
        indices: ['b', 'rois', 'd_fpn'],
        shape: [1, 1000, 8],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 24,
        x: 900,
        y: 180,
        description: 'Final Animal / Person / Vehicle detection boxes'
      }
    ],
    edges: [
      {
        id: 'e_md4_conv',
        source: 'md_v4_img_in',
        target: 'md_v4_resnet_fpn',
        contractedIndices: ['c'],
        bondDimension: 256,
        contractionCostFLOPs: 134000000000,
        nonCommutativityFactor: 0.72,
        gaugeCurvature: 0.44,
        description: 'ResNet residual blocks contraction'
      },
      {
        id: 'e_md4_roi',
        source: 'md_v4_resnet_fpn',
        target: 'md_v4_rpn_roi',
        contractedIndices: ['hw'],
        bondDimension: 256,
        contractionCostFLOPs: 16000000000,
        nonCommutativityFactor: 0.68,
        gaugeCurvature: 0.38,
        description: 'RoI bilinear sampling'
      },
      {
        id: 'e_md4_head',
        source: 'md_v4_rpn_roi',
        target: 'md_v4_out',
        contractedIndices: ['d_fpn'],
        bondDimension: 256,
        contractionCostFLOPs: 2048000,
        nonCommutativityFactor: 0.50,
        gaugeCurvature: 0.22,
        description: 'Fully connected classifier'
      }
    ]
  },
  {
    id: 'pytorch-wildlife-bioclip-onnx',
    name: 'PyTorch-Wildlife BioCLIP ONNX (Tree of Life Vision-Language Foundation Model)',
    family: 'ONNX-Wildlife',
    einsumExpression: 'S_{img,txt} = \\frac{\\text{ViT}_{img}(I) \\cdot \\text{BioCLIP}_{txt}(T)^T}{\\tau}',
    latexReduction: '\\mathcal{S}(I, \\text{Taxon}) = \\frac{\\mathbf{z}_{img} \\cdot \\left[ \\sum_{k=1}^K w_k \\mathbf{t}_{rank_k}(\\text{Kingdom}, \\dots, \\text{Species}) \\right]^T}{\\|\\mathbf{z}_{img}\\| \\|\\mathbf{t}\\| \\cdot \\tau}',
    description: 'Foundation model for organismal biology in PyTorch-Wildlife. Trained on 10M+ biological images (TreeOfLife-10M) covering 450,000+ species with hierarchical taxonomic rank embedding vectors.',
    parameters: '149.6M params | ViT-B/16 Visual Backbone (d=512) + Taxonomic Text Encoder',
    defaultConfig: {
      batch: 1,
      image_size: 224,
      patch_size: 16,
      d_embed: 512,
      num_taxa: 454038
    },
    lieGroup: 'SU(n)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch organism images' },
      patches: { name: 'patches', dimension: 196, type: 'spatial', description: '14x14 ViT image patches (16x16 px)' },
      d_vit: { name: 'd_vit', dimension: 768, type: 'hidden', description: 'ViT-B hidden channel width' },
      d_proj: { name: 'd_proj', dimension: 512, type: 'feature', description: 'Normalized metric embedding space' },
      taxa: { name: 'taxa', dimension: 454038, type: 'feature', description: 'Total Tree of Life organism species' }
    },
    nodes: [
      {
        id: 'bioclip_patch_in',
        name: 'Organism Crop (224x224)',
        label: 'I_{b, 3, 224, 224}',
        category: 'input',
        indices: ['b', 'patches', 'd_vit'],
        shape: [1, 196, 768],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'Linear projection of 16x16 image patches'
      },
      {
        id: 'bioclip_vit_encoder',
        name: 'ViT-B/16 Visual Encoder (12L)',
        label: '\\text{ViT}_{12L}(I)',
        category: 'reduction',
        indices: ['b', 'patches', 'd_vit'],
        shape: [1, 196, 768],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 56,
        x: 360,
        y: 180,
        description: '12 layers of multi-head self-attention extracting morphological species traits'
      },
      {
        id: 'bioclip_visual_proj',
        name: 'Visual Metric Projection W_img',
        label: 'W_{img}^{768, 512}',
        category: 'weight',
        indices: ['b', 'd_proj'],
        shape: [1, 512],
        dataType: 'float32',
        lieGroup: 'SO(n)',
        algebraGeneratorRank: 32,
        x: 640,
        y: 180,
        description: 'L2-normalized continuous spherical Riemannian manifold embedding'
      },
      {
        id: 'bioclip_taxa_head',
        name: 'Tree of Life 450k Taxonomic Sim',
        label: '\\mathbf{S}_{b, 454038}',
        category: 'output',
        indices: ['b', 'taxa'],
        shape: [1, 454038],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 48,
        x: 900,
        y: 180,
        description: 'Cosine similarity against 454,038 biological taxa (Kingdom, Phylum, Class, Order, Family, Genus, Species)'
      }
    ],
    edges: [
      {
        id: 'e_bioclip_vit',
        source: 'bioclip_patch_in',
        target: 'bioclip_vit_encoder',
        contractedIndices: ['d_vit'],
        bondDimension: 768,
        contractionCostFLOPs: 17580000000,
        nonCommutativityFactor: 0.88,
        gaugeCurvature: 0.74,
        description: 'Vision Transformer self-attention contraction'
      },
      {
        id: 'e_bioclip_proj',
        source: 'bioclip_vit_encoder',
        target: 'bioclip_visual_proj',
        contractedIndices: ['patches', 'd_vit'],
        bondDimension: 768,
        contractionCostFLOPs: 786432,
        nonCommutativityFactor: 0.65,
        gaugeCurvature: 0.38,
        description: '[CLS] token projection to 512-D unit hypersphere'
      },
      {
        id: 'e_bioclip_taxa',
        source: 'bioclip_visual_proj',
        target: 'bioclip_taxa_head',
        contractedIndices: ['d_proj'],
        bondDimension: 512,
        contractionCostFLOPs: 464934912,
        nonCommutativityFactor: 0.92,
        gaugeCurvature: 0.80,
        description: 'Hierarchical Tree of Life taxonomy metric contraction'
      }
    ]
  },
  {
    id: 'pytorch-wildlife-herdnet-onnx',
    name: 'PyTorch-Wildlife HerdNet ONNX (Dense Multi-Animal Density & Counting Model)',
    family: 'ONNX-Wildlife',
    einsumExpression: 'D_{b,1,h,w} = \\text{DensityHead}\\left( \\text{FeaturePyramid}(I_{b,3,H,W}) \\right)',
    latexReduction: '\\hat{N} = \\iint_{\\Omega} \\mathbf{D}(x, y) \\, dx dy, \\quad \\mathcal{L}_{count} = \\|\\mathbf{D} - \\sum_{i=1}^N \\mathcal{G}_{\\sigma}(x - x_i, y - y_i)\\|^2',
    description: 'Specialized PyTorch-Wildlife network for dense animal aggregations, aerial wildlife surveys, and herd counting (e.g. wildebeest migrations, seabird colonies) using continuous Gaussian kernel density estimation.',
    parameters: '28.4M params | Density Map Regressor + Peak Centroid Localizer',
    defaultConfig: {
      batch: 1,
      image_size: 1024,
      d_fpn: 256,
      gaussian_sigma: 4.0
    },
    lieGroup: 'SE(3)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Aerial / Herd survey image' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB' },
      hw_field: { name: 'hw_field', dimension: 65536, type: 'spatial', description: '256x256 density regression map' },
      d: { name: 'd', dimension: 256, type: 'hidden', description: 'Feature channels' }
    },
    nodes: [
      {
        id: 'herdnet_img_in',
        name: 'Aerial Survey Herd Image',
        label: 'I_{b, 3, 1024, 1024}',
        category: 'input',
        indices: ['b', 'c', 'hw_field'],
        shape: [1, 3, 1024, 1024],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'High-resolution aerial or camera trap survey'
      },
      {
        id: 'herdnet_fpn',
        name: 'Multi-Scale Dilated FPN',
        label: '\\text{DilatedFPN}(I)',
        category: 'weight',
        indices: ['b', 'd', 'hw_field'],
        shape: [1, 256, 65536],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 36,
        x: 380,
        y: 180,
        description: 'Dilated convolutions resolving overlapping animal bodies without occlusion collapse'
      },
      {
        id: 'herdnet_density_map',
        name: 'Continuous Density Integral Map',
        label: '\\mathbf{D}_{b, 1, 256, 256}',
        category: 'output',
        indices: ['b', 'hw_field'],
        shape: [1, 65536],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 24,
        x: 740,
        y: 180,
        description: '2D continuous density field whose integral yields exact animal counts and centroid peaks'
      }
    ],
    edges: [
      {
        id: 'e_herd_fpn',
        source: 'herdnet_img_in',
        target: 'herdnet_fpn',
        contractedIndices: ['c'],
        bondDimension: 256,
        contractionCostFLOPs: 44000000000,
        nonCommutativityFactor: 0.70,
        gaugeCurvature: 0.42,
        description: 'Dilated feature pyramid extraction'
      },
      {
        id: 'e_herd_map',
        source: 'herdnet_fpn',
        target: 'herdnet_density_map',
        contractedIndices: ['d'],
        bondDimension: 256,
        contractionCostFLOPs: 33554432,
        nonCommutativityFactor: 0.48,
        gaugeCurvature: 0.20,
        description: 'Density kernel surface contraction'
      }
    ]
  },
  {
    id: 'pytorch-wildlife-deepfaune-onnx',
    name: 'PyTorch-Wildlife DeepFaune ONNX (ConvNeXt-Large European Wildlife Classifier)',
    family: 'ONNX-Wildlife',
    einsumExpression: 'P_{b,species} = \\text{Softmax}\\left( W_{cls} \\cdot \\text{ConvNeXt-L}(I_{b,3,224,224}) \\right)',
    latexReduction: '\\mathbf{y} = \\sigma\\left( \\mathbf{W}_{cls} \\cdot \\text{LayerNorm}\\left( \\frac{1}{HW} \\sum_{x,y} \\text{ConvNeXtBlock}(I)_{b,c,x,y} \\right) \\right)',
    description: 'High-precision European and temperate wildlife species classifier incorporated into PyTorch-Wildlife. Employs modern ConvNeXt-L 7x7 depthwise inverted bottleneck convolutions.',
    parameters: '198.2M params | ConvNeXt-Large Backbone | 30+ European Wildlife Species',
    defaultConfig: {
      batch: 1,
      image_size: 224,
      d_convnext: 1536,
      num_species: 32
    },
    lieGroup: 'GL(n)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch cropped animal images' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB' },
      spatial_7x7: { name: 'spatial_7x7', dimension: 49, type: 'spatial', description: '7x7 final spatial feature map' },
      d: { name: 'd', dimension: 1536, type: 'hidden', description: 'ConvNeXt-L channel depth' },
      species: { name: 'species', dimension: 32, type: 'feature', description: 'Species logits (badger, roe deer, wolf, etc.)' }
    },
    nodes: [
      {
        id: 'deepfaune_in',
        name: 'Cropped Animal Image',
        label: 'I_{b, 3, 224, 224}',
        category: 'input',
        indices: ['b', 'c', 'spatial_7x7'],
        shape: [1, 3, 224, 224],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'MegaDetector-cropped bounding box patch'
      },
      {
        id: 'deepfaune_convnext',
        name: 'ConvNeXt-Large 7x7 Depthwise Blocks',
        label: '\\text{ConvNeXt-L}(I)',
        category: 'weight',
        indices: ['b', 'd', 'spatial_7x7'],
        shape: [1, 1536, 49],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 52,
        x: 420,
        y: 180,
        description: '7x7 depthwise convolutions with inverted bottleneck 4x channel expansion'
      },
      {
        id: 'deepfaune_species_out',
        name: 'DeepFaune Species Logits',
        label: '\\mathbf{P}_{b, 32}',
        category: 'output',
        indices: ['b', 'species'],
        shape: [1, 32],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 24,
        x: 780,
        y: 180,
        description: 'Species classification probabilities'
      }
    ],
    edges: [
      {
        id: 'e_df_conv',
        source: 'deepfaune_in',
        target: 'deepfaune_convnext',
        contractedIndices: ['c'],
        bondDimension: 1536,
        contractionCostFLOPs: 34400000000,
        nonCommutativityFactor: 0.76,
        gaugeCurvature: 0.48,
        description: 'Inverted bottleneck 7x7 depthwise contraction'
      },
      {
        id: 'e_df_head',
        source: 'deepfaune_convnext',
        target: 'deepfaune_species_out',
        contractedIndices: ['spatial_7x7', 'd'],
        bondDimension: 1536,
        contractionCostFLOPs: 98304,
        nonCommutativityFactor: 0.42,
        gaugeCurvature: 0.18,
        description: 'Global average pooling + linear species classifier'
      }
    ]
  },
  {
    id: 'pytorch-wildlife-animal-pose-onnx',
    name: 'PyTorch-Wildlife Animal-Pose ONNX (HRNet-W48 20-Keypoint Quadruped Gait Model)',
    family: 'ONNX-Wildlife',
    einsumExpression: 'H_{b,kp,h,w} = \\text{HRNet-W48}\\left( I_{b,3,256,256} \\right)',
    latexReduction: '\\mathbf{k}_i = \\arg\\max_{(x,y)} \\mathbf{H}_{b, i, x, y}, \\quad i \\in \\{1, \\dots, 20 \\text{ joints}\\}',
    description: 'PyTorch-Wildlife anatomical keypoint estimator utilizing High-Resolution Network (HRNet-W48). Tracks 20 anatomical quadruped joints (eyes, nose, withers, hocks, paws, tail-base) for gait and behavioral ecology analysis.',
    parameters: '63.6M params | 20 Keypoint Heatmap Heads | Multi-Resolution Parallel Streams',
    defaultConfig: {
      batch: 1,
      image_size: 256,
      num_keypoints: 20,
      hrnet_width: 48
    },
    lieGroup: 'SE(3)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Animal crop' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB' },
      hw_heat: { name: 'hw_heat', dimension: 4096, type: 'spatial', description: '64x64 keypoint heatmaps' },
      d_hrnet: { name: 'd_hrnet', dimension: 384, type: 'hidden', description: 'HRNet-W48 fused multi-resolution channels' },
      kp: { name: 'kp', dimension: 20, type: 'feature', description: '20 Anatomical Keypoints' }
    },
    nodes: [
      {
        id: 'pose_img_in',
        name: 'Animal Bounding Crop (256x256)',
        label: 'I_{b, 3, 256, 256}',
        category: 'input',
        indices: ['b', 'c', 'hw_heat'],
        shape: [1, 3, 256, 256],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'Normalized cropped animal bounding box'
      },
      {
        id: 'pose_hrnet_streams',
        name: 'HRNet Parallel High-Res Fusion',
        label: '\\text{HRNet}_{\\parallel}(I)',
        category: 'weight',
        indices: ['b', 'd_hrnet', 'hw_heat'],
        shape: [1, 384, 4096],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 48,
        x: 400,
        y: 180,
        description: 'Multi-resolution parallel streams exchanging continuous information across 4 resolution branches'
      },
      {
        id: 'pose_heatmaps_out',
        name: '20 Anatomical Joint Heatmaps',
        label: '\\mathbf{H}_{b, 20, 64, 64}',
        category: 'output',
        indices: ['b', 'kp', 'hw_heat'],
        shape: [1, 20, 4096],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 28,
        x: 760,
        y: 180,
        description: 'Continuous 2D Gaussian heatmaps locating quadruped joints and spine vectors'
      }
    ],
    edges: [
      {
        id: 'e_pose_hrnet',
        source: 'pose_img_in',
        target: 'pose_hrnet_streams',
        contractedIndices: ['c'],
        bondDimension: 384,
        contractionCostFLOPs: 32900000000,
        nonCommutativityFactor: 0.82,
        gaugeCurvature: 0.62,
        description: 'Multi-resolution parallel stream contraction'
      },
      {
        id: 'e_pose_head',
        source: 'pose_hrnet_streams',
        target: 'pose_heatmaps_out',
        contractedIndices: ['d_hrnet'],
        bondDimension: 384,
        contractionCostFLOPs: 31457280,
        nonCommutativityFactor: 0.52,
        gaugeCurvature: 0.25,
        description: '1x1 convolution mapping high-res features to 20 keypoint joint heatmaps'
      }
    ]
  },
  {
    id: 'pytorch-wildlife-swin-wildnet-onnx',
    name: 'PyTorch-Wildlife WildNet ONNX (Swin Transformer Hierarchical Species Classifier)',
    family: 'ONNX-Wildlife',
    einsumExpression: 'O_{b,cls} = \\text{LinearHead}\\left( \\text{ShiftedWindowAttn}\\left( I_{b,3,384,384} \\right) \\right)',
    latexReduction: '\\mathbf{z}_{l+1} = \\operatorname{W-MSA}\\left( \\operatorname{LN}(\\mathbf{z}_l) \\right) + \\mathbf{z}_l, \\quad \\operatorname{Attn}(Q,K,V) = \\operatorname{Softmax}\\left( \\frac{QK^T}{\\sqrt{d}} + B \\right) V',
    description: 'Hierarchical Shifted Window (Swin-Base) self-attention classifier for fine-grained mammalian taxonomy in PyTorch-Wildlife, classifying cryptic and nocturnal camera trap captures.',
    parameters: '87.8M params | 384x384 input | Swin-Base Backbone with Shifted Windows',
    defaultConfig: {
      batch: 1,
      image_size: 384,
      window_size: 12,
      embed_dim: 128,
      num_classes: 120
    },
    lieGroup: 'SU(n)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB' },
      hw_patches: { name: 'hw_patches', dimension: 9216, type: 'spatial', description: 'Patch tokens' },
      d: { name: 'd', dimension: 1024, type: 'hidden', description: 'Swin-Base Stage-4 channel dimension' },
      classes: { name: 'classes', dimension: 120, type: 'feature', description: 'Global camera trap wildlife classes' }
    },
    nodes: [
      {
        id: 'wildnet_img_in',
        name: 'Animal Crop (384x384)',
        label: 'I_{b, 3, 384, 384}',
        category: 'input',
        indices: ['b', 'c', 'hw_patches'],
        shape: [1, 3, 384, 384],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'High-resolution animal patch crop'
      },
      {
        id: 'wildnet_swin_stages',
        name: 'Shifted Window Attention (Stages 1-4)',
        label: '\\text{Swin-B}_{4-Stages}(I)',
        category: 'reduction',
        indices: ['b', 'hw_patches', 'd'],
        shape: [1, 9216, 1024],
        dataType: 'float32',
        lieGroup: 'SU(n)',
        algebraGeneratorRank: 60,
        x: 420,
        y: 180,
        description: 'Hierarchical self-attention with shifted window partitioning'
      },
      {
        id: 'wildnet_species_logits',
        name: '120-Class Wildlife Taxonomy Output',
        label: '\\mathbf{Y}_{b, 120}',
        category: 'output',
        indices: ['b', 'classes'],
        shape: [1, 120],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 24,
        x: 780,
        y: 180,
        description: 'Class logit distribution over 120 mammalian and avian species'
      }
    ],
    edges: [
      {
        id: 'e_wn_swin',
        source: 'wildnet_img_in',
        target: 'wildnet_swin_stages',
        contractedIndices: ['c'],
        bondDimension: 1024,
        contractionCostFLOPs: 47000000000,
        nonCommutativityFactor: 0.85,
        gaugeCurvature: 0.72,
        description: 'Shifted-window multi-head self-attention'
      },
      {
        id: 'e_wn_head',
        source: 'wildnet_swin_stages',
        target: 'wildnet_species_logits',
        contractedIndices: ['hw_patches', 'd'],
        bondDimension: 1024,
        contractionCostFLOPs: 245760,
        nonCommutativityFactor: 0.40,
        gaugeCurvature: 0.16,
        description: 'Global average pooling + linear classification projection'
      }
    ]
  },
  {
    id: 'pytorch-wildlife-yolov8-onnx',
    name: 'PyTorch-Wildlife YOLOv8-Wildlife ONNX (Camera Trap Edge & Anti-Poaching Detector)',
    family: 'ONNX-Wildlife',
    einsumExpression: 'B_{b,anc,c} = \\text{DecoupledHead}\\left( \\text{PANet}\\left( \\text{CSPDarknet}(I_{b,3,640,640}) \\right) \\right)',
    latexReduction: '\\mathbf{B}_{reg} = \\text{DFL}\\left( \\mathbf{P}_{reg}^{4 \\times 16} \\right), \\quad \\mathbf{S}_{cls} = \\sigma\\left( \\mathbf{P}_{cls} \\right)',
    description: 'Fast edge-ready Ultralytics YOLOv8-X camera trap ONNX model optimized for anti-poaching camera traps and rapid wildlife screening in the PyTorch-Wildlife ecosystem.',
    parameters: '68.2M params | Distribution Focal Loss (DFL) | Anchor-free decoupled heads',
    defaultConfig: {
      batch: 1,
      image_size: 640,
      dfl_reg: 16,
      num_classes: 80
    },
    lieGroup: 'SE(3)',
    allIndices: {
      b: { name: 'b', dimension: 1, type: 'batch', description: 'Batch' },
      c: { name: 'c', dimension: 3, type: 'feature', description: 'RGB' },
      h_w: { name: 'h_w', dimension: 8400, type: 'spatial', description: 'Anchor-free candidate grid points' },
      d: { name: 'd', dimension: 512, type: 'hidden', description: 'C2f feature channels' }
    },
    nodes: [
      {
        id: 'pw_yolo_in',
        name: 'Field Camera Trap Frame',
        label: 'I_{b, 3, 640, 640}',
        category: 'input',
        indices: ['b', 'c', 'h_w'],
        shape: [1, 3, 640, 640],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 16,
        x: 80,
        y: 180,
        description: 'Live camera trap stream'
      },
      {
        id: 'pw_yolo_c2f',
        name: 'C2f Backbone & PANet Neck',
        label: '\\text{C2f}(\\mathbf{F}_{3..5})',
        category: 'weight',
        indices: ['b', 'd', 'h_w'],
        shape: [1, 512, 8400],
        dataType: 'float32',
        lieGroup: 'GL(n)',
        algebraGeneratorRank: 44,
        x: 400,
        y: 180,
        description: 'Cross-stage partial bottleneck with high gradient flow'
      },
      {
        id: 'pw_yolo_out',
        name: 'Decoupled DFL Output Head',
        label: '\\mathbf{Y}_{b, 8400, 84}',
        category: 'output',
        indices: ['b', 'h_w', 'd'],
        shape: [1, 8400, 84],
        dataType: 'float32',
        lieGroup: 'SE(3)',
        algebraGeneratorRank: 32,
        x: 760,
        y: 180,
        description: 'Decoupled classification and Distribution Focal Loss box coordinates'
      }
    ],
    edges: [
      {
        id: 'e_pwy_conv',
        source: 'pw_yolo_in',
        target: 'pw_yolo_c2f',
        contractedIndices: ['c'],
        bondDimension: 512,
        contractionCostFLOPs: 258000000000,
        nonCommutativityFactor: 0.72,
        gaugeCurvature: 0.44,
        description: 'C2f spatial convolution'
      },
      {
        id: 'e_pwy_head',
        source: 'pw_yolo_c2f',
        target: 'pw_yolo_out',
        contractedIndices: ['d'],
        bondDimension: 512,
        contractionCostFLOPs: 24000000000,
        nonCommutativityFactor: 0.65,
        gaugeCurvature: 0.36,
        description: 'Decoupled detection head contraction'
      }
    ]
  }
];
