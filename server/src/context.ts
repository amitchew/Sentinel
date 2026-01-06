import { WebSocketService } from './services/websocket';
import { ChainSimulator } from './services/chainSimulator';
import { NetworkMonitor } from './services/networkMonitor';
import dotenv from 'dotenv';
import { Validator, NetworkMetric } from './types';

dotenv.config();

// Common Interface
export interface INetworkService {
  start(): void;
  getValidators(): Validator[];
  getMetrics(): NetworkMetric[];
}

// Instantiate singletons
export const wsService = new WebSocketService();

const useRealData = process.env.DATA_SOURCE === 'REAL';
console.log(`Initializing Service Mode: ${useRealData ? 'REAL NETWORK MONITOR' : 'CHAIN SIMULATOR'}`);

export const chainSimulator = new ChainSimulator(wsService); // Keep for legacy ref if needed, but ideally unused if real
export const networkMonitor = new NetworkMonitor(wsService);

export const activeNetworkService: INetworkService = useRealData ? networkMonitor : chainSimulator;
