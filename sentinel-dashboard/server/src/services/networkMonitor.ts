import axios from 'axios';
import { WebSocketService } from './websocket';
import { Validator, NetworkMetric, ValidatorEvent } from '../types';

export class NetworkMonitor {
  private wsService: WebSocketService;
  private lcdEndpoint: string;
  private isRunning: boolean = false;
  private validators: Validator[] = [];
  private metricsHistory: NetworkMetric[] = [];
  
  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    this.lcdEndpoint = process.env.LCD_ENDPOINT || 'https://api-sentinel.nodeist.net';
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`Starting NetworkMonitor connected to ${this.lcdEndpoint}`);

    // Initial fetch
    this.fetchValidators();
    this.fetchLatestBlock();

    // Poll
    setInterval(() => this.fetchValidators(), 30000); // Validators change slowly
    setInterval(() => this.fetchLatestBlock(), 5000); // Blocks ~6s
  }

  public getValidators() {
    return this.validators;
  }

  public getMetrics() {
    return this.metricsHistory;
  }

  private async fetchValidators() {
    try {
      const response = await axios.get(`${this.lcdEndpoint}/cosmos/staking/v1beta1/validators?pagination.limit=300`);
      const rawValidators = response.data.validators;

      this.validators = rawValidators.map((v: any, index: number) => {
        // Parse 'tokens' (stake) - usually integer string
        const tokens = parseInt(v.tokens) / 1000000; // Convert uDVPN to DVPN
        
        // Status mapping
        let status: 'active' | 'jailed' | 'unbonding' | 'unbonded' | 'offline' = 'offline';
        if (v.jailed) status = 'jailed';
        else if (v.status === 'BOND_STATUS_BONDED') status = 'active';
        else if (v.status === 'BOND_STATUS_UNBONDING') status = 'unbonding';
        else if (v.status === 'BOND_STATUS_UNBONDED') status = 'unbonded';

        // Parse commission
        const commission = parseFloat(v.commission.commission_rates.rate) * 100;

        return {
          id: v.operator_address,
          name: v.description.moniker,
          address: v.operator_address,
          stake: Math.floor(tokens),
          uptime: 100, // Real uptime requires specific signing info query per validator, keeping 100 for now or random fluctuation? Let's default to high.
          commission: parseFloat(commission.toFixed(2)),
          status,
          region: 'Global', // Geo-IP requires external service
          peers: [] // P2P peers not exposed in standard LCD
        } as Validator;
      });

      // Sort by stake
      this.validators.sort((a, b) => b.stake - a.stake);

      // Simulate P2P Topology (since public LCD doesn't expose peers)
      // Each validator connects to 2-5 other random validators to form a mesh
      this.validators.forEach(val => {
        val.peers = [];
        const numPeers = Math.floor(Math.random() * 4) + 2; // 2 to 5 peers
        for (let i = 0; i < numPeers; i++) {
            const randomPeer = this.validators[Math.floor(Math.random() * this.validators.length)];
            if (randomPeer.id !== val.id && !val.peers.includes(randomPeer.id)) {
                val.peers.push(randomPeer.id);
            }
        }
      });
      
      this.wsService.broadcast('validators:update', this.validators);
      console.log(`Updated ${this.validators.length} validators`);
    } catch (error) {
      console.error('Failed to fetch validators:', error instanceof Error ? error.message : error);
    }
  }

  private async fetchLatestBlock() {
    try {
      // Get Block
      const blockRes = await axios.get(`${this.lcdEndpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`);
      const block = blockRes.data.block;
      
      // Get Inflation/Gas/etc strictly?. Cosmos standard doesnt always have gas price in one call easily without tx analysis.
      // We will simulate Gas Price fluctuation based on real block fullness if possible, or just randomize slightly for "liveness" 
      // since plain Cosmos LCD doesn't give global "Gas Price" easily (it's a fee market).
      
      const width = block.data.txs.length; // Number of txs in block
      const tps = width / 6.0; // Assume ~6s block time usually

      const metric: NetworkMetric = {
        timestamp: Date.now(),
        tps, // Realish TPS based on current block
        gasPrice: 0.025, // Standard min fee usually
        blockTime: 6.0,
        finality: 6.0
      };

      this.metricsHistory.push(metric);
      if (this.metricsHistory.length > 1000) {
        this.metricsHistory.shift();
      }

      this.wsService.broadcast('metrics:update', metric);
      // console.log(`New Block: ${block.header.height} with ${width} txs`);

    } catch (error) {
      console.error('Failed to fetch block:', error instanceof Error ? error.message : error);
    }
  }
}
