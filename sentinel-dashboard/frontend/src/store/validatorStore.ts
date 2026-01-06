import { create } from 'zustand';
import { Validator, ValidatorEvent } from '../types';

interface ValidatorStore {
  validators: Validator[];
  events: ValidatorEvent[];
  setValidators: (validators: Validator[]) => void;
  updateValidator: (id: string, updates: Partial<Validator>) => void;
  addEvent: (event: ValidatorEvent) => void;
}

export const useValidatorStore = create<ValidatorStore>((set) => ({
  validators: [],
  events: [],
  setValidators: (validators) => set({ validators }),
  updateValidator: (id, updates) => set((state) => ({
    validators: state.validators.map((v) => 
      v.id === id ? { ...v, ...updates } : v
    ),
  })),
  addEvent: (event) => set((state) => {
    const newEvents = [event, ...state.events];
    if (newEvents.length > 100) newEvents.pop(); // Keep last 100 events
    return { events: newEvents };
  }),
}));
