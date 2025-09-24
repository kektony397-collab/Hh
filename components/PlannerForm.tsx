import React, { memo } from 'react';
import { useBikeStateStore, useSettingsStore } from '../services/geminiService';
import Speedometer from './ItineraryDisplay'; // Remapped
import FuelGauge from './CategoryBadge';    // Remapped
import Odometer from './LoadingSpinner';     // Remapped

// Range Indicator Component (inlined due to file constraints)
const RangeIndicator: React.FC<{ range: number }> = memo(({ range }) => (
    <div className="bg-black/30 rounded-xl p-6 border border-[var(--cyber-gray)]/50 text-center">
        <h2 className="text-xl font-orbitron text-[var(--cyber-blue)]/80 mb-2">EST. RANGE</h2>
        <p className="text-5xl font-orbitron text-white">
            {range < 0 ? 0 : Math.round(range)}
            <span className="text-2xl text-slate-400 ml-2">km</span>
        </p>
    </div>
));
RangeIndicator.displayName = 'RangeIndicator';

const DashboardPage: React.FC<{gpsError: string | null}> = memo(({ gpsError }) => {
    const { currentSpeedKph, currentFuelL, tripKm, totalOdometerKm, isGpsAvailable } = useBikeStateStore();
    const { tankCapacityL, reserveLiters, fuelEconomyKmPerL, _hasHydrated } = useSettingsStore();
    
    // Wait until settings are hydrated from DB to prevent flicker
    if (!_hasHydrated) {
        return <div className="text-center p-10">Initializing Dashboard...</div>;
    }

    const range = currentFuelL * fuelEconomyKmPerL;

    return (
        <div className="space-y-8">
            <div className="text-center h-6">
                {gpsError && (
                    <p className="text-[var(--cyber-pink)]">GPS Error: {gpsError}</p>
                )}
                {!isGpsAvailable && !gpsError && (
                    <p className="text-yellow-400 font-bold animate-pulse">
                        ● WAITING FOR GPS SIGNAL...
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Speedometer speed={currentSpeedKph} />
                    <div className="grid grid-cols-2 gap-4">
                        <Odometer value={tripKm} label="Trip Distance" />
                        <Odometer value={totalOdometerKm} label="Total Odometer" />
                    </div>
                </div>

                <div className="space-y-6">
                    <FuelGauge
                        currentFuel={currentFuelL}
                        tankCapacity={tankCapacityL}
                        reserveLevel={reserveLiters}
                    />
                    <RangeIndicator range={range} />
                </div>
            </div>
        </div>
    );
});

DashboardPage.displayName = 'DashboardPage';
export default DashboardPage;
