import { Validator } from '../types';

const API_URL = 'http://localhost:3001';

export const api = {
  fetchValidators: async (): Promise<Validator[]> => {
    const res = await fetch(`${API_URL}/validators`);
    if (!res.ok) throw new Error('Failed to fetch validators');
    return res.json();
  },

  fetchValidator: async (id: string): Promise<Validator> => {
    const res = await fetch(`${API_URL}/validators/${id}`);
    if (!res.ok) throw new Error('Failed to fetch validator');
    return res.json();
  },

  fetchMetrics: async (): Promise<any[]> => {
      const res = await fetch(`${API_URL}/network/metrics`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
  }
};
