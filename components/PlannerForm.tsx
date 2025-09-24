import React from 'react';

interface PlannerFormProps {
    destination: string;
    setDestination: (value: string) => void;
    duration: string;
    setDuration: (value: string) => void;
    interests: string;
    setInterests: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export const PlannerForm: React.FC<PlannerFormProps> = ({
    destination,
    setDestination,
    duration,
    setDuration,
    interests,
    setInterests,
    onSubmit,
    isLoading
}) => {
    return (
        <form onSubmit={onSubmit} className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg space-y-4 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-slate-300">Destination</label>
                    <input
                        type="text"
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g., Tokyo, Japan"
                        className="mt-1 block w-full bg-slate-800/50 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-slate-300">Trip Duration (days)</label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 7"
                        min="1"
                        max="14"
                        className="mt-1 block w-full bg-slate-800/50 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="interests" className="block text-sm font-medium text-slate-300">Interests & Preferences</label>
                <textarea
                    id="interests"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g., interested in history, anime, sushi, and nightlife"
                    rows={3}
                    className="mt-1 block w-full bg-slate-800/50 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Generating...' : 'Create Itinerary'}
                </button>
            </div>
        </form>
    );
};