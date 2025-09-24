import React, { memo } from 'react';

interface FuelGaugeProps {
  currentFuel: number;
  tankCapacity: number;
  reserveLevel: number;
}

const FuelGauge: React.FC<FuelGaugeProps> = ({ currentFuel, tankCapacity, reserveLevel }) => {
    const fuelPercentage = tankCapacity > 0 ? (currentFuel / tankCapacity) * 100 : 0;
    const isReserve = currentFuel <= reserveLevel;

    return (
        <div className={`bg-black/30 rounded-xl p-6 border border-[var(--cyber-gray)]/50 text-center transition-colors ${isReserve ? 'border-amber-500' : ''}`}>
            <h2 className={`text-xl font-orbitron mb-2 transition-colors ${isReserve ? 'text-amber-400 animate-pulse' : 'text-[var(--cyber-blue)]/80'}`}>FUEL LEVEL</h2>
            <div className="w-full bg-[var(--cyber-gray)] rounded-full h-4 my-4 overflow-hidden border border-slate-600">
                 <div
                    className={`h-full rounded-full transition-all duration-500 ${isReserve ? 'bg-amber-500' : 'bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--cyber-blue)]'}`}
                    style={{ width: `${fuelPercentage}%` }}
                ></div>
            </div>
            <p className="text-5xl font-orbitron text-white">
                {currentFuel.toFixed(1)}
                <span className="text-2xl text-slate-400 ml-2">L</span>
            </p>
        </div>
    );
};

export default memo(FuelGauge);
