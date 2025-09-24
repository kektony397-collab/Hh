import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { KalmanFilter } from 'kalman-filter';

import { useBikeStateStore, useSettingsStore } from './services/geminiService';
import DashboardPage from './components/PlannerForm'; // Remapped to DashboardPage

// --- GLOBAL HOOKS (defined here due to file constraints) ---

// Haversine formula for distance calculation
const calculateDistanceKm = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// useGeolocation Hook
const useGeolocation = () => {
    const { updateFromGps, setGpsStatus, lastPosition } = useBikeStateStore();
    const [error, setError] = useState<string | null>(null);

    const kalmanFilter = useMemo(() => new KalmanFilter({ R: 0.01, Q: 3 }), []);

    const onSuccess = useCallback((pos: GeolocationPosition) => {
        setError(null);

        const smoothed = kalmanFilter.filter([pos.coords.latitude, pos.coords.longitude]);
        const newPosition = { lat: smoothed[0], lng: smoothed[1], timestamp: pos.timestamp };

        let distanceDeltaKm = 0;
        if (lastPosition && lastPosition.lat && lastPosition.lng) {
            distanceDeltaKm = calculateDistanceKm(
                lastPosition.lat, lastPosition.lng,
                newPosition.lat, newPosition.lng
            );
        }
        
        const speedKph = pos.coords.speed ? pos.coords.speed * 3.6 : 0; // m/s to km/h

        updateFromGps({ speedKph, distanceDeltaKm, isGpsAvailable: true, newPosition });

    }, [updateFromGps, lastPosition, kalmanFilter]);

    const onError = useCallback((err: GeolocationPositionError) => {
        setError(err.message);
        setGpsStatus(false);
    }, [setGpsStatus]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            setGpsStatus(false);
            return;
        }

        const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, [onSuccess, onError, setGpsStatus]);

    return { error };
};

// useFuelCalculator Hook
const useFuelCalculator = () => {
    const { totalOdometerKm } = useBikeStateStore.getState();
    const consumeFuel = useBikeStateStore((state) => state.consumeFuel);
    const { fuelEconomyKmPerL } = useSettingsStore.getState();
    const [lastOdometer, setLastOdometer] = useState(totalOdometerKm);

    useEffect(() => {
        return useBikeStateStore.subscribe(
            (state) => state.totalOdometerKm,
            (currentOdometer) => {
                const distanceTraveled = currentOdometer - lastOdometer;
                if (distanceTraveled > 0) {
                    const fuelConsumed = distanceTraveled / useSettingsStore.getState().fuelEconomyKmPerL;
                    consumeFuel(fuelConsumed);
                    setLastOdometer(currentOdometer);
                }
            }
        );
    }, [lastOdometer, consumeFuel]);
};

// useNetworkStatus Hook
const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    return isOnline;
};


// --- LAYOUT COMPONENTS (defined here due to file constraints) ---
const Navigation: React.FC<{ activePage: string; setActivePage: (page: string) => void; }> = ({ activePage, setActivePage }) => {
    const navItems = ['Dashboard', 'History', 'Settings'];
    return (
        <nav className="p-4 bg-black/20 backdrop-blur-sm border-b border-[var(--cyber-gray)] sticky top-0 z-10">
            <div className="container mx-auto flex justify-center items-center gap-8">
                {navItems.map(item => (
                    <button
                        key={item}
                        onClick={() => setActivePage(item)}
                        className={`font-orbitron text-lg transition-colors duration-300 ${activePage === item ? 'text-[var(--cyber-blue)]' : 'text-slate-400 hover:text-white'}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </nav>
    );
};

// --- PLACEHOLDER PAGES ---
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="text-center p-10 border-2 border-dashed border-[var(--cyber-gray)] rounded-lg">
        <h2 className="text-3xl font-orbitron">{title}</h2>
        <p className="text-slate-400 mt-2">This feature is under construction.</p>
    </div>
);


// --- MAIN APP COMPONENT ---
function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const isOnline = useNetworkStatus();
  
  // Initialize global hooks
  const { error: gpsError } = useGeolocation();
  useFuelCalculator();
  
  // Initialize settings hydration
  useEffect(() => {
    useSettingsStore.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-screen bg-cyber-gradient text-white font-exo">
        <Navigation activePage={activePage} setActivePage={setActivePage} />
        <main className="container mx-auto px-4 py-8">
            {!isOnline && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-6 text-center text-amber-300">
                    <span className="font-bold">●</span> You are currently offline.
                </div>
            )}
            {activePage === 'Dashboard' && <DashboardPage gpsError={gpsError} />}
            {activePage === 'History' && <PlaceholderPage title="Refuel History" />}
            {activePage === 'Settings' && <PlaceholderPage title="Settings" />}
        </main>
    </div>
  );
}

export default App;
