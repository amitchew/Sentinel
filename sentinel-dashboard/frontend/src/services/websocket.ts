import { useNetworkStore } from '../store/networkStore';
import { useValidatorStore } from '../store/validatorStore';

const WS_URL = 'ws://localhost:3001';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: any;

  connect() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    this.ws.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        this.handleMessage(type, data);
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    this.ws.onclose = () => {
      console.log('Disconnected from WebSocket, retrying in 3s...');
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error', err);
      if (this.ws) this.ws.close();
    };
  }

  handleMessage(type: string, data: any) {
    switch (type) {
      case 'metrics:update':
        useNetworkStore.getState().addMetric(data);
        break;
      case 'validators:update':
        useValidatorStore.getState().setValidators(data);
        break;
      case 'events:new':
        useValidatorStore.getState().addEvent(data);
        break;
    }
  }

  disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) this.ws.close();
  }
}

export const wsClient = new WebSocketClient();
