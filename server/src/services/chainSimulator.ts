import { WebSocketService } from './websocket';
import { Validator, NetworkMetric, ValidatorEvent } from '../types';

export class ChainSimulator {
  private wsService: WebSocketService;
  private validators: Validator[] = [];
  private isRunning: boolean = false;
  private currentBlockHeight: number = 1000000;
  private metricsHistory: NetworkMetric[] = [];

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    this.initializeValidators(250);
  }

  private initializeValidators(count: number) {
    for (let i = 0; i < count; i++) {
      this.validators.push({
        id: `val-${i}`,
        name: `Validator ${i}`,
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        stake: Math.floor(Math.random() * 1000000) + 10000,
        uptime: 90 + Math.random() * 10,
        commission: Math.floor(Math.random() * 20),
        status: 'active',
        region: ['NA', 'EU', 'AS', 'SA'][Math.floor(Math.random() * 4)],
        peers: []
      });
    }

    
    this.validators.forEach(val => {
      const numPeers = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < numPeers; i++) {
        const peer = this.validators[Math.floor(Math.random() * this.validators.length)];
        if (peer.id !== val.id && !val.peers.includes(peer.id)) {
          val.peers.push(peer.id);
        }
      }
    });
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.broadcastValidators();

    setInterval(() => this.generateBlock(), 1000);
    setInterval(() => this.updateValidators(), 5000);
    setInterval(() => this.generateRandomEvent(), 15000);
  }

  public getValidators() {
    return this.validators;
  }

  public getMetrics() {
    return this.metricsHistory;
  }

  private broadcastValidators() {
     this.wsService.broadcast('validators:update', this.validators);
  }

  private generateBlock() {
    this.currentBlockHeight++;
    
    
    const tps = 2000 + Math.floor(Math.sin(Date.now() / 10000) * 1000) + Math.random() * 500;
    
    const metric: NetworkMetric = {
      timestamp: Date.now(),
      tps,
      gasPrice: 20 + Math.random() * 10,
      blockTime: 1.0 + (Math.random() * 0.2 - 0.1),
      finality: 2.0
    };

    this.metricsHistory.push(metric);
    if (this.metricsHistory.length > 1000) {
        this.metricsHistory.shift();
    }

    this.wsService.broadcast('metrics:update', metric);
  }

  private updateValidators() {

    const numUpdates = Math.floor(Math.random() * 5);
    for (let i=0; i<numUpdates; i++) {
       const idx = Math.floor(Math.random() * this.validators.length);
       const rand = Math.random();
       if (rand > 0.95) this.validators[idx].status = 'jailed';
       else if (rand > 0.9) this.validators[idx].status = 'offline';
       else this.validators[idx].status = 'active';
       

       if (this.validators[idx].status === 'active') {
         this.validators[idx].uptime = Math.min(100, this.validators[idx].uptime + 0.1);
       } else {
         this.validators[idx].uptime = Math.max(0, this.validators[idx].uptime - 0.5);
       }
    }
    this.broadcastValidators();
  }

  private generateRandomEvent() {
    if (Math.random() > 0.7) return; 

    const types: ValidatorEvent['type'][] = ['slash', 'downtime', 'reward', 'warning'];
    const type = types[Math.floor(Math.random() * types.length)];
    const val = this.validators[Math.floor(Math.random() * this.validators.length)];

    const event: ValidatorEvent = {
      id: Math.random().toString(36).substr(2, 9),
      validatorId: val.id,
      type,
      message: `Validator ${val.name} ${type} event`,
      timestamp: Date.now()
    };

    this.wsService.broadcast('events:new', event);
  }
}
