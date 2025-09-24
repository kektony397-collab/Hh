// Fix: Use named import for Dexie to align with modern Dexie v4+ API and correct type inference.
import { Dexie } from 'dexie';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DBTables, BikeState, SettingsState } from '../types';

// 1. DEXIE DATABASE SETUP
class BikeDashboardDB extends Dexie {
  settings!: DBTables['settings'];
  refuelRecords!: DBTables['refuelRecords'];
  tripLogs!: DBTables['tripLogs'];

  constructor() {
    super('BikeDashboardDB');
    this.version(1).stores({
      settings: '++id, &key',
      refuelRecords: '++id, timestamp, needsSync',
      tripLogs: '++id, startTimestamp, needsSync'
    });
  }
}

export const db = new BikeDashboardDB();


// 2. ZUSTAND STATE MANAGEMENT

// == Bike State Slice (Real-time, not persisted) ==
export const useBikeStateStore = create<BikeState>((set) => ({
  currentFuelL: 15,
  tripKm: 0,
  totalOdometerKm: 1250,
  currentSpeedKph: 0,
  isGpsAvailable: true,
  lastPosition: null,

  updateFromGps: ({ speedKph, distanceDeltaKm, isGpsAvailable, newPosition }) => {
    set((state) => ({
        currentSpeedKph: speedKph,
        tripKm: state.tripKm + distanceDeltaKm,
        totalOdometerKm: state.totalOdometerKm + distanceDeltaKm,
        isGpsAvailable,
        lastPosition: newPosition,
    }));
  },

  consumeFuel: (liters) => {
    set((state) => ({
        currentFuelL: Math.max(0, state.currentFuelL - liters)
    }));
  },

  setGpsStatus: (available) => set({ isGpsAvailable: available }),
  resetTrip: () => set({ tripKm: 0 }),
}));


// == Settings Slice (Persisted to IndexedDB) ==
const dexieStorage = {
    getItem: async (name: string): Promise<string | null> => {
        const setting = await db.settings.get({ key: name });
        return setting ? (setting.value as string) : null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await db.settings.put({ key: name, value: value });
    },
    removeItem: async (name: string): Promise<void> => {
        await db.settings.where('key').equals(name).delete();
    },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default settings
      bikeModel: 'Urban Commuter 5000',
      tankCapacityL: 15,
      fuelEconomyKmPerL: 25,
      reserveLiters: 2,
      theme: 'dark',
      _hasHydrated: false,
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),

      // Actions
      setFuelEconomy: (economy) => set({ fuelEconomyKmPerL: economy }),
    }),
    {
      name: 'bike-settings-storage',
      storage: createJSONStorage(() => dexieStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);