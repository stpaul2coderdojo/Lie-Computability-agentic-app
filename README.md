# Antigravity Tensor-Lie Complexity Agent

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22249208.svg)](https://doi.org/10.5281/zenodo.22249208)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![WebAPK](https://img.shields.io/badge/WebAPK%20%2F%20PWA-Installable-34A853?logo=googleplay&logoColor=white)](public/manifest.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](package.json)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](vite.config.ts)

> **Agentic engine to decompose deep neural network architectures & LLMs into tensor reduction expressions, analyze contraction topology, continuous Lie group embeddings, and compute Lie algebraic complexity metrics on non-abelian representation manifolds.**

---

## 📜 Academic Reference & Citation

If you use this software, theory, or Lie reduction frameworks in your research, please cite:

```text
[1] A. K. Dr Bheemaiah, ‘Lie Computability of Lie Lattices of Tensor based topologies of networks.’, Sep. 02, 2026, Zenodo. doi: 10.5281/zenodo.22249208.
```

### BibTeX
```bibtex
@article{bheemaiah2026lie,
  author    = {Dr. Bheemaiah Anil Kumar},
  title     = {Lie Computability of Lie Lattices of Tensor based topologies of networks},
  journal   = {Zenodo},
  month     = {September},
  day       = {02},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.22249208},
  url       = {https://doi.org/10.5281/zenodo.22249208}
}
```

### Direct DOI Links
- **Zenodo DOI**: [https://doi.org/10.5281/zenodo.22249208](https://doi.org/10.5281/zenodo.22249208)
- **Zenodo Record**: [https://zenodo.org/records/22249208](https://zenodo.org/records/22249208)
- **Principal Author**: Dr. Bheemaiah Anil Kumar
- **Institutional Affiliation**: Synergy Robotics

---

## 🚀 Key Features

1. **Automatic Tensor Network Decomposition**:
   - Converts standard deep learning operations (Attention, MLP, Convolutions, State Space Models, MoE routing) into Einstein summation (`einsum`) tensor contraction hypergraphs.
   - Decomposes models into Tensor Contraction Nodes ($T_{ijk}$) and Contraction Hyperedges ($e_{ab}$).

2. **Continuous Lie Group & Manifold Embedding**:
   - Embeds neural layer transformations into classical Lie groups:
     - $\mathfrak{so}(n)$ / $\mathrm{SO}(n)$: Orthogonal & rotational symmetries (LayerNorm, RMSNorm, RoPE).
     - $\mathfrak{su}(n)$ / $\mathrm{SU}(n)$: Special unitary quantum state-space preservation & unitary gating.
     - $\mathfrak{sp}(2n)$ / $\mathrm{Sp}(2n)$: Symplectic geometry & Hamiltonian phase-space dynamics.
     - $\mathrm{GL}(n, \mathbb{R})$ / $\mathrm{SL}(n, \mathbb{R})$: General and volume-preserving linear projections.
     - $\mathrm{Heis}_3(\mathbb{R})$: Heisenberg-Weyl non-commutative positional algebras.
     - $\mathrm{Diff}(M)$: Infinite-dimensional continuous geometric manifold diffeomorphisms.
   - Interactive 2D Root System visualization (Weyl chambers, Cartan dual $\mathfrak{h}^*$, weight vectors).
   - Cartan-Killing Metric heatmap ($K_{ab} = \operatorname{Tr}(\operatorname{ad}_a \circ \operatorname{ad}_b)$).
   - Non-abelian Lie bracket commutators ($[T_a, T_b] = f_{ab}^c T_c$).

3. **Lie Algebraic Complexity Engine**:
   - **Composite Lie Complexity Score** ($0 - 100$ scale).
   - **Commutator Divergence Metric**: $\|[W_i, W_j]\|_F$.
   - **Betti Numbers**: $\beta_0$ (connected components), $\beta_1$ (contraction 1-cycles / loops).
   - **Euler Characteristic**: $\chi = V - E + F$.
   - **Gauge Holonomy / Wilson Loop**: $\oint_{\gamma} \mathcal{A} \cdot dx$.
   - **Quadratic Casimir Invariant**: $C_2(\mathfrak{g})$.
   - **Algebraic Span Dimension**: $\dim(\operatorname{Lie}(\mathcal{W}))$.

4. **Extensive Pre-Configured ONNX Model Architectures**:
   - **LLM & Foundational Models**: Transformer Multi-Head Attention, FlashAttention-2, LLaMA-3 GQA, Mamba Selective SSM, Mixtral 8x7B Sparse MoE, ViT-H/14 Patch Attention, Stable Diffusion UNet Cross-Attention.
   - **MegaDetector ONNX Suite**: MegaDetector v5a (YOLOv5x6), MegaDetector v5b (INT8 Edge), MegaDetector v6 (YOLOv9 GELAN), MegaDetector v6 (RT-DETR), MegaDetector v4 (Faster R-CNN FPN).
   - **PyTorch-Wildlife ONNX Suite**: BioCLIP (ViT-B/16 Foundation), HerdNet (Gaussian Density Estimator), DeepFaune (ConvNeXt-Large), Animal-Pose (HRNet-W48), WildNet (Swin-Base Transformer), YOLOv8-Wildlife.
   - **Microsoft Sparrow ONNX Suite**: Sparrow LayoutLMv3 (2D Spatial Multimodal), Sparrow Donut (OCR-Free Document Transformer), Sparrow YOLOv8-Doc (Document Region Bounding Box), Sparrow ViT-OCR (Patch Sequence Recognizer).

5. **Agentic CoT Reasoning & LaTeX Math Markup**:
   - Step-by-step Chain-of-Thought derivation by Google Antigravity Agent.
   - Interactive KaTeX mathematical proof generator.
   - Code export to **LaTeX paper templates**, **PyTorch contraction scripts**, and **JSON topology specifications**.

---

## 📱 WebAPK & Progressive Web App (PWA)

This application is built with complete Progressive Web App compliance (W3C PWA & WebAPK specification):

### 1. Instant Android WebAPK / Desktop Install
- Open the application in Google Chrome, Edge, Brave, or Safari.
- Click **"WebAPK / Install"** in the top navigation bar, or use the browser's install badge.
- On Android, Chrome mints a native **WebAPK package** that registers in the Android application manager with full app launcher integration and hardware acceleration.

### 2. Google Bubblewrap CLI (TWA APK / Google Play)
To generate an Android `.apk` or `.aab` (Android App Bundle) for direct distribution or Google Play Store publication:
```bash
# 1. Install Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize from your live WebAPK manifest
bubblewrap init --manifest="https://<your-app-domain>/manifest.json"

# 3. Build signed Android APK and AAB
bubblewrap build
```

---

## 🐳 Docker Deployment

The application includes a production-ready multi-stage `Dockerfile` and `docker-compose.yml`.

### Quickstart with Docker Compose
```bash
# Clone the repository
git clone https://github.com/synergy-robotics/antigravity-tensor-lie.git
cd antigravity-tensor-lie

# Build and start container on port 3000
docker compose up -d --build
```

### Manual Docker Build & Run
```bash
# Build Docker image
docker build -t antigravity-tensor-lie:latest .

# Run container (Optionally provide GEMINI_API_KEY for online LLM synthesis)
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY="your_api_key_here" \
  --name antigravity_agent \
  antigravity-tensor-lie:latest
```

Access the application in your browser at `http://localhost:3000`.

---

## ☁️ Google Cloud Run Deployment

To deploy directly to Google Cloud Run:

```bash
# Build and deploy with Google Cloud SDK
gcloud run deploy antigravity-tensor-lie \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 3000
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

### Installation
```bash
# 1. Clone repository
git clone https://github.com/synergy-robotics/antigravity-tensor-lie.git
cd antigravity-tensor-lie

# 2. Install dependencies
npm install

# 3. Start development server with live reload & backend API
npm run dev
```

The dev server will boot on `http://localhost:3000`.

### Production Build Verification
```bash
# Compile Vite frontend and bundle server with esbuild
npm run build

# Start production server
npm start
```

---

## 📐 Mathematical Formulation

### 1. Tensor Contraction & Einsum Decomposition
Any neural representation layer $F_\theta(X)$ is decomposed as an indexed contraction of parameter tensors $\mathcal{W}$ and activation tensors $\mathcal{X}$:
$$Y_{i_1 \dots i_m} = \sum_{j_1 \dots j_k} \mathcal{W}_{i_1 \dots i_m j_1 \dots j_k} \mathcal{X}_{j_1 \dots j_k}$$

### 2. Lie Algebra Commutator Curvature
The non-abelian curvature of weight matrices $W_1, W_2 \in \mathfrak{g}$ is quantified via the normalized Frobenius norm of the Lie bracket:
$$\mathcal{C}_{\text{Lie}}(W_1, W_2) = \frac{\|[W_1, W_2]\|_F}{\|W_1\|_F \|W_2\|_F} = \frac{\|W_1 W_2 - W_2 W_1\|_F}{\|W_1\|_F \|W_2\|_F}$$

### 3. Gauge Holonomy (Wilson Loop)
For cyclic contraction paths $\gamma \subset \mathcal{G}_{\text{topology}}$, the holonomy around 1-cycles ($\beta_1 > 0$) is:
$$\mathcal{H}(\gamma) = \operatorname{Tr}\left(\mathcal{P} \exp\left(\oint_{\gamma} \mathcal{A}\right)\right)$$

---

## 👥 Authorship & Research Citation

- **Principal Author**: Dr. Bheemaiah Anil Kumar
- **Organization**: Synergy Robotics
- **Publication**: *Lie Computability of Lie Lattices of Tensor based topologies of networks.*
- **Zenodo DOI**: [10.5281/zenodo.22249208](https://doi.org/10.5281/zenodo.22249208)
- **License**: Apache-2.0
