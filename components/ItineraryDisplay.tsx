import React from 'react';
import type { Itinerary, ItineraryItem, DailyPlan } from '../types';
import { CategoryBadge } from './CategoryBadge';

const ItineraryItemCard: React.FC<{ item: ItineraryItem, isLast: boolean }> = ({ item, isLast }) => (
    <div className="relative pl-14 pb-8">
        {!isLast && <div className="absolute left-[23px] top-5 h-full w-0.5 bg-slate-700"></div>}
        
        <div className="absolute left-0 top-0 flex items-center justify-center h-12 w-12 rounded-full bg-slate-800 border-2 border-slate-700 text-blue-300 font-semibold text-sm">
            {item.time}
        </div>

        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors duration-300">
            <div className="flex justify-between items-start gap-4">
                <h4 className="font-semibold text-lg text-slate-100">{item.activity}</h4>
                <div className="flex-shrink-0">
                    <CategoryBadge category={item.category} />
                </div>
            </div>
            <p className="mt-2 text-slate-400 text-sm leading-6">{item.description}</p>
            <img 
                src={`https://picsum.photos/seed/${item.activity.replace(/\s/g, '')}/400/200`} 
                alt={item.activity} 
                className="mt-4 rounded-md object-cover w-full h-32 opacity-80 group-hover:opacity-100 transition-opacity"
                loading="lazy"
            />
        </div>
    </div>
);

const DailyPlanCard: React.FC<{ plan: DailyPlan }> = ({ plan }) => (
    <div className="bg-slate-800/30 p-6 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700/50">
        <h3 className="text-2xl font-bold text-blue-300 mb-1">Day {plan.day}</h3>
        <p className="text-slate-400 mb-6 italic">Theme: {plan.theme}</p>
        <div>
             {plan.items.map((item, index) => (
                <ItineraryItemCard key={index} item={item} isLast={index === plan.items.length - 1} />
             ))}
        </div>
    </div>
);

interface ItineraryDisplayProps {
    itinerary: Itinerary;
}

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
    return (
        <div className="mt-10">
            <h2 className="text-4xl font-bold text-center mb-2">Your Trip to {itinerary.destination}</h2>
            <p className="text-center text-slate-400 mb-8">An AI-crafted {itinerary.duration}-day adventure awaits.</p>
            <div className="space-y-8">
                {itinerary.itinerary.map((plan) => (
                    <DailyPlanCard key={plan.day} plan={plan} />
                ))}
            </div>
        </div>
    );
};