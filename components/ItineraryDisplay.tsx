import React, { memo } from 'react';

interface SpeedometerProps {
  speed: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  const rotation = Math.min(speed, 200) / 200 * 270 - 135; // Map 0-200km/h to -135deg to +135deg

  return (
    <div className="bg-black/30 rounded-xl p-6 border border-[var(--cyber-blue)]/30 animate-pulse-glow aspect-square flex flex-col justify-between">
      <h2 className="text-xl font-orbitron text-[var(--cyber-blue)]/80 text-center">SPEED</h2>
      <div className="relative w-full flex-1 flex items-center justify-center">
        <div className="absolute text-center">
            <span className="text-8xl font-orbitron font-black text-white tracking-tighter">
                {Math.round(speed)}
            </span>
            <span className="block text-2xl text-slate-400 font-orbitron -mt-2">km/h</span>
        </div>
        {/* Gauge background */}
        <svg viewBox="0 0 100 100" className="w-full h-full absolute">
            <path d="M 10 70 A 40 40 0 1 1 90 70" fill="none" stroke="var(--cyber-gray)" strokeWidth="6" strokeLinecap="round" />
        </svg>
        {/* Gauge needle */}
        <div 
          className="absolute w-1 h-1/2 origin-bottom transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-full h-2/3 bg-[var(--cyber-pink)] rounded-full" />
        </div>
        <div className="w-4 h-4 bg-[var(--cyber-pink)] rounded-full absolute border-2 border-black" />
      </div>
    </div>
  );
};

export default memo(Speedometer);
