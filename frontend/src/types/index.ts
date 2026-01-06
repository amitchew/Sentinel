export interface Validator {
  id: string;
  name: string;
  address: string;
  stake: number;
  uptime: number;
  commission: number;
  status: 'active' | 'jailed' | 'unbonding' | 'unbonded' | 'offline';
  region: string;
  peers: string[];
}

export interface NetworkMetric {
  timestamp: number;
  tps: number;
  gasPrice: number;
  blockTime: number;
  finality: number;
}

export interface ValidatorEvent {
  id: string;
  validatorId: string;
  type: 'slash' | 'downtime' | 'reward' | 'warning';
  message: string;
  timestamp: number;
}
