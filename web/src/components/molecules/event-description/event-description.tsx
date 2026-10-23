import React from 'react';

export interface EventDescriptionProps {
  description: string;
}

export function EventDescription({ description }: EventDescriptionProps) {
  return (
    <div className="space-y-4 text-left">
      <h2 className="text-foreground text-xl font-bold">About the Event</h2>
      <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
