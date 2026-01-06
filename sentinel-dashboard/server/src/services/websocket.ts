import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

export class WebSocketService {
  private wss: WebSocketServer | null = null;

  constructor() {
  }

  public attach(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');

      ws.on('message', (message: string) => {
        console.log('Received:', message);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  public broadcast(type: string, data: any) {
    if (!this.wss) return;
    
    const message = JSON.stringify({ type, data });
    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
