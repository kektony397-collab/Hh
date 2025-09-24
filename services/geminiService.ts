import { GoogleGenAI, Type } from "@google/genai";
import type { Itinerary } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Please ensure it is configured.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING, description: "The destination city and country." },
    duration: { type: Type.INTEGER, description: "The total number of days for the trip." },
    itinerary: {
      type: Type.ARRAY,
      description: "A list of daily plans.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number, starting from 1." },
          theme: { type: Type.STRING, description: "A creative theme for the day's activities, e.g., 'Historical Exploration' or 'Culinary Adventure'." },
          items: {
            type: Type.ARRAY,
            description: "A list of activities for the day.",
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Suggested time for the activity, e.g., '9:00 AM'." },
                activity: { type: Type.STRING, description: "A short, catchy name for the activity." },
                description: { type: Type.STRING, description: "A detailed description of the activity (2-3 sentences)." },
                category: { 
                  type: Type.STRING,
                  description: "The category of the activity.",
                  enum: ['Food', 'Activity', 'Sightseeing', 'Travel']
                },
              },
              required: ['time', 'activity', 'description', 'category'],
            },
          },
        },
        required: ['day', 'theme', 'items'],
      },
    },
  },
  required: ['destination', 'duration', 'itinerary'],
};

export const generateItinerary = async (destination: string, duration: number, interests: string): Promise<Itinerary | null> => {
  const prompt = `
    Create a detailed travel itinerary for a trip to ${destination} for ${duration} days.
    The traveler's interests include: ${interests}.
    
    For each day, provide a creative theme and a schedule of activities from morning to evening. 
    Each activity must have a suggested time, a short name, a detailed description, and a category ('Food', 'Activity', 'Sightseeing', 'Travel').
    Ensure the plan is logical, well-paced, and reflects the specified interests.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    try {
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Itinerary;
    } catch (e) {
        console.error("Failed to parse Gemini's JSON response:", e);
        console.error("Raw response text:", jsonText);
        return null;
    }
    
  } catch (error) {
    console.error("Error generating itinerary from Gemini API:", error);
    return null;
  }
};