import React, { memo } from 'react';

interface OdometerProps {
  value: number;
  label: string;
}

const Odometer: React.FC<OdometerProps> = ({ value, label }) => {
    return (
        <div className="bg-black/30 rounded-xl p-4 border border-[var(--cyber-gray)]/50 text-center">
            <h3 className="text-md text-[var(--cyber-blue)]/80 mb-1 font-orbitron">{label.toUpperCase()}</h3>
            <p className="text-3xl font-orbitron text-white">
                {value.toFixed(1)}
                <span className="text-lg text-slate-400 ml-1.5">km</span>
            </p>
        </div>
    );
};

export default memo(Odometer);
