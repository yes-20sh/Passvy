import React from "react";
import { Search } from "lucide-react";
import {
  EventCard,
  type EventData,
} from "@/components/molecules/event-card/event-card";
import {
  TypographyH3,
  TypographyMuted,
} from "@/components/atoms/typography/typography";

export interface EventsGridProps {
  filteredEvents: EventData[];
  setRegisteredIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const EventsGrid = ({
  filteredEvents,
  setRegisteredIds,
  setSearchQuery,
  setSelectedCategory,
}: EventsGridProps) => {
  return (
    <>
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={(id) => {
                setRegisteredIds((prev) =>
                  prev.includes(id) ? prev : [...prev, id],
                );
                alert(
                  `Successfully registered for event: ${event.title} (ID: ${id})!`,
                );
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/25 backdrop-blur-sm shadow-inner">
          <Search className="size-10 text-muted-foreground/60 mb-3 animate-pulse" />
          <TypographyH3 className="text-lg font-bold text-foreground border-0">
            No events found
          </TypographyH3>
          <TypographyMuted className="text-sm max-w-xs mt-1">
            We couldn't find any events matching your search or category filter.
            Try checking other categories or keywords!
          </TypographyMuted>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-lg shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
};
