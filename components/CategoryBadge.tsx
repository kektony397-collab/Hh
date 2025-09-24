import React from 'react';
import type { ItineraryItem } from '../types';

const icons: Record<ItineraryItem['category'], JSX.Element> = {
  Food: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
  Activity: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18.259 3l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  ),
  Sightseeing: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.164-.755.35-1.124.562A2.31 2.31 0 0 0 3.25 10.72v7.542a2.31 2.31 0 0 0 2.01 2.296A2.31 2.31 0 0 0 7.25 21v-1.35a2.31 2.31 0 0 1 2.22-2.071c.54.025 1.06.096 1.53.192A2.31 2.31 0 0 0 13.25 19.5v1.5a2.31 2.31 0 0 0 2.28 2.043A2.31 2.31 0 0 0 17.75 21v-4.212a2.31 2.31 0 0 0-1.026-1.928 2.31 2.31 0 0 1-.868-2.035V9.75a2.31 2.31 0 0 0-2.31-2.31h-.52a2.31 2.31 0 0 0-2.31 2.31V12M6.827 6.175L3.25 3.25m.041 2.925a2.31 2.31 0 0 1 3.496 0l.041.041M17.173 6.175l3.576-3.576m-2.925.041a2.31 2.31 0 0 1 0 3.496l.041.041" />
    </svg>
  ),
  Travel: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  )
};

const categoryColors: Record<ItineraryItem['category'], string> = {
    Food: 'bg-emerald-500/10 text-emerald-400',
    Activity: 'bg-blue-500/10 text-blue-400',
    Sightseeing: 'bg-purple-500/10 text-purple-400',
    Travel: 'bg-amber-500/10 text-amber-400',
};

interface CategoryBadgeProps {
    category: ItineraryItem['category'];
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${categoryColors[category]}`}>
            {icons[category]}
            {category}
        </span>
    );
};