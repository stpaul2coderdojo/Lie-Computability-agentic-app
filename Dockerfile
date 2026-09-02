# Multi-stage Dockerfile for Antigravity Tensor-Lie Complexity Agent
# Authorship: Dr. Bheemaiah Anil Kumar, Synergy Robotics
# Zenodo DOI: 10.5281/zenodo.22249208

# ---- Stage 1: Build & Bundle ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies (including devDependencies for esbuild & vite)
RUN npm ci

# Copy source files
COPY . .

# Build Vite frontend and bundle Express server into dist/server.cjs
RUN npm run build

# ---- Stage 2: Lean Production Runtime ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled distribution bundle from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose production port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.cjs"]
