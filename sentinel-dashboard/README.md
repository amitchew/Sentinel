# Sentinel Dashboard

**Decentralized Blockchain Network Monitoring Dashboard**

Sentinel is designed to visualize high-frequency blockchain network metrics and topology in real-time. It features a "Cyber/Neon" aesthetic and high-performance visualizations capable of simulating and rendering complex network states.

## 🚀 Key Features

- **Real-Time Visualization**: 3D interactive network topology using raw Three.js with `InstancedMesh` for high performance (up to 10k+ nodes).
- **Live Metrics**: D3.js powered charts with 60-second sliding windows for TPS, Gas Price, and Validator Uptime, providing a "heartbeat" view of the network.
- **Synthetic Chain Simulator**: A robust backend simulator that generates realistic block data, validator churn, and network events (slashes, downtime, rewards), persisting history for instant data hydration.
- **Reactive UI**: Global state management via Zustand, with GSAP-powered transitions and animations.
- **Comprehensive Views**:
  - **Overview**: 3D Topology + Vital Metrics.
  - **Validators**: Detailed list and search functionality.
  - **Events**: Real-time log of network events.
  - **Settings**: Node configuration interface.

## 🏗 Architecture Overview

- **Frontend**: React, Vite, TypeScript, Three.js (Raw), D3.js, Zustand, Tailwind CSS, GSAP.
- **Backend**: Node.js, Express, WebSocket, TypeScript.

### Data Flow

1.  **Simulation & Persistence**:
    - The `ChainSimulator` (`server/src/services/chainSimulator.ts`) acts as the source of truth, generating blocks and events.
    - It maintains an in-memory history of metrics, acting as a high-speed database for the prototype.
2.  **Service Layer**:
    - Services are instantiated via a Singleton Context (`server/src/context.ts`) to resolve circular dependencies and ensure a clean dependency injection graph.
3.  **Transport**:
    - **REST**: `/network/metrics` provides initial data hydration (history) on page load.
    - **WebSocket**: Broadcasts real-time updates (`metrics:update`, `validators:update`, `events:new`) to connected clients.
4.  **Frontend State**:
    - `useNetworkStore` and `useValidatorStore` (Zustand) manage application state.
    - Components subscribe to these stores. `NetworkScene` (Three.js) and Charts (D3.js) react to state changes efficiently, minimizing React reconciliations.

## 🛠 Running the Project

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
# Install dependencies for root, frontend, and server
npm install
```

### Development Using Turbo/Concurrent

Start both frontend and backend in development mode with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Server**: [http://localhost:3001](http://localhost:3001)

### Building for Production

```bash
# Build both packages
npm run build
```

## 📂 Project Structure

```
sentinel-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/       # D3.js Implementation
│   │   │   ├── three/        # Raw Three.js Logic
│   │   │   └── ui/           # Shared UI Components
│   │   ├── features/         # Page-specific Logic (Overview, Analytics, etc.)
│   │   ├── store/            # Zustand Stores
│   │   └── services/         # API & WebSocket Clients
│   └── ...
├── server/
│   ├── src/
│   │   ├── services/         # Simulator & Socket Logic
│   │   ├── routes/           # REST API
│   │   └── context.ts        # Dependency Injection
│   └── ...
└── package.json              # Workspace Configuration
```
