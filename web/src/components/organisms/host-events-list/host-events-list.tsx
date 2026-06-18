'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  CalendarX,
  Clock,
  CalendarDays,
  History,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { GetHostEventsDocument, HostEventFilter } from '@/gql/graphql';
import {
  EventCard,
  type EventData,
} from '@/components/molecules/event-card/event-card';
import { Button } from '@/components/atoms/button/button';

export enum HostEventTab {
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
  PAST = 'past',
}

export interface HostEventsListProps {
  searchQuery?: string;
}

export const HostEventsList = ({ searchQuery = '' }: HostEventsListProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HostEventTab>(
    HostEventTab.ONGOING,
  );

  const getFilterEnum = (tab: HostEventTab): HostEventFilter => {
    switch (tab) {
      case HostEventTab.ONGOING:
        return 'ONGOING';
      case HostEventTab.UPCOMING:
        return 'UPCOMING';
      case HostEventTab.PAST:
        return 'PAST';
      default:
        return 'ONGOING';
    }
  };

  const { data, loading, error } = useQuery(GetHostEventsDocument, {
    variables: {
      input: {
        filter: getFilterEnum(activeTab),
        search: searchQuery || '',
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const rawEvents = data?.getHostEvents?.events || [];

  const mappedEvents: EventData[] = rawEvents.map((ev) => {
    const start = ev.startDate ? new Date(ev.startDate as string).toLocaleDateString() : 'TBD';
    const end = ev.endDate ? new Date(ev.endDate as string).toLocaleDateString() : '';
    const dateStr = start === end || !end ? start : `${start} - ${end}`;

    const startTime = ev.startTime || 'TBD';
    const endTime = ev.endTime || '';
    const timeStr = startTime === endTime || !endTime ? startTime : `${startTime} - ${endTime}`;

    return {
      id: ev.id,
      slug: ev.slug,
      title: ev.title,
      image:
        ev.headerImage ||
        'https://res.cloudinary.com/dc7sugsyq/image/upload/v1731169563/passvy/events/headers/ydap24aww8pjmg2s73jv.webp',
      date: dateStr,
      time: timeStr,
      tag: ev.category || 'Event',
      price: 'Free', // Removed isFree so we can default to Free or calculate locally
      passCount: ev.registeredCount,
      location: ev.location || undefined,
      isOnline: ev.isOnline ?? false,
    };
  });

  const tabs = [
    { id: HostEventTab.ONGOING, name: 'Ongoing', icon: Clock },
    { id: HostEventTab.UPCOMING, name: 'Upcoming', icon: CalendarDays },
    { id: HostEventTab.PAST, name: 'Past', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs & Create Event Button */}
      <div className="flex items-center justify-between gap-4 py-2">
        {/* Left side: Pill Tabs similar to CategoryFilter */}
        <div className="flex flex-1 scrollbar-none items-center gap-3 overflow-x-auto scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border p-3 px-4 transition-all duration-300 select-none hover:-translate-y-0.5 active:scale-95 ${
                  isSelected
                    ? 'border-indigo-700 bg-indigo-700 text-white shadow-sm shadow-indigo-700/20'
                    : 'bg-secondary/15 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-indigo-500/20'
                }`}
              >
                <Icon
                  className={`size-4.5 ${
                    isSelected
                      ? 'text-white'
                      : 'text-indigo-600 dark:text-indigo-400'
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
          <button className="group flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-indigo-700 bg-indigo-700 p-3 px-4 text-[13px] font-semibold text-white shadow-sm shadow-indigo-700/20 transition-all duration-300 select-none hover:-translate-y-0.5 hover:bg-indigo-600 active:scale-95">
            <PlusCircle className="size-4.5 transition-transform duration-300 group-hover:rotate-90" />
            <span>Create Event</span>
          </button>
        </Link>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-muted-foreground flex animate-pulse justify-center py-20">
          Loading events...
        </div>
      ) : error ? (
        <div className="flex justify-center py-20 text-red-500">
          Error loading events: {error.message}
        </div>
      ) : mappedEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mappedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              buttonText="Manage Event"
              passLabel="Registered"
              onRegister={() => {
                router.push(`/host/manage-event?slug=${event.slug}`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card/25 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center shadow-inner backdrop-blur-sm">
          <CalendarX className="text-muted-foreground/60 mb-4 size-12 animate-pulse" />
          <h3 className="text-foreground text-xl font-bold">No events found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {searchQuery
              ? `We couldn't find any ${activeTab} events matching "${searchQuery}".`
              : `You don't have any ${activeTab} events right now. Ready to host something amazing?`}
          </p>
          {!searchQuery && (
            <Link href="/host/events/create">
              <Button className="group/btn mt-6 px-6 shadow-sm">
                <PlusCircle className="mr-2 size-4 transition-transform duration-300 group-hover/btn:rotate-90" />
                Create Event
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
