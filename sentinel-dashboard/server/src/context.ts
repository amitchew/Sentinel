import { WebSocketService } from './services/websocket';
import { ChainSimulator } from './services/chainSimulator';

// Instantiate singletons
export const wsService = new WebSocketService();
export const chainSimulator = new ChainSimulator(wsService);
