import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export interface EventHeadlineInfoProps {
  title: string;
  date: string;
  time: string;
  location?: string;
}

export function EventHeadlineInfo({ title, date, time, location }: EventHeadlineInfoProps) {
  return (
    <div className="space-y-4 text-left">
      <h1 className="text-foreground text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <div className="flex flex-wrap gap-3 pt-2">
        <div className="bg-card border-border/60 flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium">
          <Calendar className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>{date}</span>
        </div>
        <div className="bg-card border-border/60 flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium">
          <Clock className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>{time}</span>
        </div>
        {location && (
          <div className="bg-card border-border/60 flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium">
            <MapPin className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
