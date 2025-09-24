import type { EntityTable } from 'dexie';

// Dexie Types
export interface Settings {
  id?: number;
  key: string;
  value: any;
}

export interface RefuelRecord {
  id?: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometerReading: number;
  timestamp: Date;
  needsSync?: boolean;
}

export interface TripLog {
  id?: number;
  startTimestamp: Date;
  endTimestamp: Date;
  distanceKm: number;
  fuelConsumedL: number;
  averageSpeedKph: number;
  needsSync?: boolean;
}

export interface DBTables {
    settings: EntityTable<Settings, 'id'>;
    refuelRecords: EntityTable<RefuelRecord, 'id'>;
    tripLogs: EntityTable<TripLog, 'id'>;
}

// Zustand Types
export interface BikeState {
  currentFuelL: number;
  tripKm: number;
  totalOdometerKm: number;
  currentSpeedKph: number;
  isGpsAvailable: boolean;
  lastPosition: { lat: number; lng: number; timestamp: number } | null;

  // Actions
  updateFromGps: (data: {
    speedKph: number;
    distanceDeltaKm: number;
    isGpsAvailable: boolean;
    newPosition: { lat: number; lng: number; timestamp: number };
  }) => void;
  consumeFuel: (liters: number) => void;
  setGpsStatus: (available: boolean) => void;
  resetTrip: () => void;
}

export interface SettingsState {
  bikeModel: string;
  tankCapacityL: number;
  fuelEconomyKmPerL: number;
  reserveLiters: number;
  theme: 'dark';

  // Actions
  setFuelEconomy: (economy: number) => void;
  _hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}
