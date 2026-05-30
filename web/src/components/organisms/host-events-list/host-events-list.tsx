"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlusCircle, CalendarX, Clock, CalendarDays, History } from "lucide-react";
import {
  EventCard,
  type EventData,
} from "@/components/molecules/event-card/event-card";
import { Button } from "@/components/atoms/button/button";

export enum HostEventTab {
  ONGOING = "ongoing",
  UPCOMING = "upcoming",
  PAST = "past",
}

export interface HostEventsListProps {
  events: EventData[];
  searchQuery?: string;
}

export const HostEventsList = ({ events, searchQuery = "" }: HostEventsListProps) => {
  const [activeTab, setActiveTab] = useState<HostEventTab>(
    HostEventTab.ONGOING
  );

  // Mock filtering logic based on tabs and search query
  const filteredEvents = events.filter((event, index) => {
    let matchesTab = false;
    if (activeTab === HostEventTab.ONGOING) matchesTab = index % 3 === 0;
    if (activeTab === HostEventTab.UPCOMING) matchesTab = index % 3 === 1;
    if (activeTab === HostEventTab.PAST) matchesTab = index % 3 === 2;

    const matchesSearch = searchQuery
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.location &&
          event.location.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: HostEventTab.ONGOING, name: "Ongoing", icon: Clock },
    { id: HostEventTab.UPCOMING, name: "Upcoming", icon: CalendarDays },
    { id: HostEventTab.PAST, name: "Past", icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs & Create Event Button */}
      <div className="flex items-center justify-between gap-4 py-2">
        {/* Left side: Pill Tabs similar to CategoryFilter */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none scroll-smooth flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 p-3 px-4 rounded-xl cursor-pointer select-none shrink-0 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 border ${
                  isSelected
                    ? "bg-indigo-700 border-indigo-700 text-white shadow-sm shadow-indigo-700/20"
                    : "bg-secondary/15 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-indigo-500/20"
                }`}
              >
                <Icon
                  className={`size-4.5 ${
                    isSelected
                      ? "text-white"
                      : "text-indigo-600 dark:text-indigo-400"
                  }`}
                />
                <span className="text-[13px] font-semibold tracking-wide">
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Create Event Button */}
        <Link href="/host/events/create">
          <button
            className="flex items-center gap-2 p-3 px-4 rounded-xl cursor-pointer select-none shrink-0 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 border bg-indigo-700 border-indigo-700 text-white hover:bg-indigo-600 shadow-sm shadow-indigo-700/20 font-semibold text-[13px] group"
          >
            <PlusCircle className="size-4.5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Event</span>
          </button>
        </Link>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={() => {
                alert(`Managing event: ${event.title}`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-card/25 backdrop-blur-sm shadow-inner">
          <CalendarX className="size-12 text-muted-foreground/60 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-foreground">No events found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {searchQuery 
              ? `We couldn't find any ${activeTab} events matching "${searchQuery}".`
              : `You don't have any ${activeTab} events right now. Ready to host something amazing?`}
          </p>
          {!searchQuery && (
            <Link href="/host/events/create">
              <Button
                className="mt-6 px-6 shadow-sm group/btn"
              >
                <PlusCircle className="mr-2 size-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                Create Event
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

