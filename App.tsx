import React, { useState } from 'react';
import type { Itinerary } from './types';
import { generateItinerary } from './services/geminiService';
import { PlannerForm } from './components/PlannerForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState('');

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
        setError("Please enter a valid number of days.");
        setIsLoading(false);
        return;
    }

    try {
      const result = await generateItinerary(destination, durationNum, interests);
      if (result) {
        setItinerary(result);
      } else {
        setError("Sorry, we couldn't create an itinerary. The AI might be busy. Please try again.");
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please check the console and try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const backgroundStyle = {
    backgroundImage: `radial-gradient(circle at top left, rgba(14, 165, 233, 0.15), transparent 40%),
                       radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.15), transparent 40%)`,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30" style={backgroundStyle}>
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent pb-2">
                Gemini Itinerary Planner
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 mt-2">
                Craft your perfect journey. Tell our AI your destination, duration, and interests, and get a personalized, day-by-day travel plan in seconds.
            </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <PlannerForm
            destination={destination}
            setDestination={setDestination}
            duration={duration}
            setDuration={setDuration}
            interests={interests}
            setInterests={setInterests}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-md text-center">
              {error}
            </div>
          )}
          
          <div className="mt-10">
            {isLoading && <LoadingSpinner />}
            {itinerary && <ItineraryDisplay itinerary={itinerary} />}
          </div>
        </div>
      </main>
       <footer className="text-center py-6 text-sm text-slate-500">
            <p>Powered by Google Gemini. UI crafted with passion.</p>
        </footer>
    </div>
  );
}

export default App;