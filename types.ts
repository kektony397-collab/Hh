export interface ItineraryItem {
  time: string; // e.g., "9:00 AM"
  activity: string; // e.g., "Visit the Eiffel Tower"
  description: string;
  category: 'Food' | 'Activity' | 'Sightseeing' | 'Travel';
}

export interface DailyPlan {
  day: number;
  theme: string; // e.g., "Historical Exploration"
  items: ItineraryItem[];
}

export interface Itinerary {
  destination: string;
  duration: number;
  itinerary: DailyPlan[];
}