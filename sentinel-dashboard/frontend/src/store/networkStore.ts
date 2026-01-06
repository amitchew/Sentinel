import { create } from 'zustand';
import { NetworkMetric } from '../types';

interface NetworkStore {
  metrics: NetworkMetric[];
  latestMetric: NetworkMetric | null;
  addMetric: (metric: NetworkMetric) => void;
  setMetrics: (metrics: NetworkMetric[]) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  metrics: [],
  latestMetric: null,
  setMetrics: (metrics) => set({ metrics, latestMetric: metrics[metrics.length - 1] || null }),
  addMetric: (metric) => set((state) => {

    const newMetrics = [...state.metrics, metric];
    if (newMetrics.length > 1000) newMetrics.shift();
    return { metrics: newMetrics, latestMetric: metric };
  }),
}));
