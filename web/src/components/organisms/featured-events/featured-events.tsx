import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
import { Badge } from '@/components/atoms/badge/badge';
import { type EventData } from '@/components/molecules/event-card/event-card';
import { EventCardHorizontal } from '@/components/molecules/event-card-horizontal/event-card-horizontal';
import { EventPassCard } from '@/components/molecules/event-pass-card/event-pass-card';
import {
  TypographyH3,
  TypographyH4,
  TypographyMuted,
  TypographySpan,
} from '@/components/atoms/typography/typography';
import { useQuery } from '@apollo/client/react';
import { GetSavedEventsDocument, GetPassesDocument } from '@/gql/graphql';

export interface FeaturedEventsProps {
  activeFeaturedTab: 'feature' | 'wishlist' | 'pass';
  setActiveFeaturedTab: (tab: 'feature' | 'wishlist' | 'pass') => void;
  featuredEvents: EventData[];
  mockEvents: EventData[];
  registeredIds: string[];
  setRegisteredIds: React.Dispatch<React.SetStateAction<string[]>>;
  isAuthenticated: boolean;
}

export const FeaturedEvents = ({
  activeFeaturedTab,
  setActiveFeaturedTab,
  featuredEvents,
  mockEvents,
  registeredIds,
  setRegisteredIds,
  isAuthenticated,
}: FeaturedEventsProps) => {
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const wishlistScrollRef = useRef<HTMLDivElement>(null);
  const passScrollRef = useRef<HTMLDivElement>(null);

  const { data: savedEventsData, loading: savedEventsLoading } = useQuery(
    GetSavedEventsDocument,
    {
      skip: !isAuthenticated || activeFeaturedTab !== 'wishlist',
      variables: { input: { limit: 10 } },
    },
  );

  const { data: passData, loading: passLoading } = useQuery(
    GetPassesDocument,
    {
      skip: !isAuthenticated || activeFeaturedTab !== 'pass',
    },
  );

  const wishlistEvents = React.useMemo(() => {
    const formatTime12hr = (timeStr?: string | null) => {
      if (!timeStr) return 'TBA';
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        const h = parseInt(parts[0], 10);
        const m = parts[1];
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m} ${ampm}`;
      }
      return timeStr;
    };

    return (
      savedEventsData?.getSavedEvents?.events?.map((event) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        image:
          event.headerImage ||
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        date: event.startDate
          ? new Date(event.startDate as string).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : 'TBA',
        time: formatTime12hr(event.startTime),
        tag: event.category || 'General',
        price: event.passes?.[0]?.price?.toString() || 'Free',
        location: event.mode?.city
          ? `${event.mode.city}${event.mode.state ? `, ${event.mode.state}` : ''}`
          : 'TBD',
        isOnline: event.mode?.eventMode === 'ONLINE',
        isSaved: event.isSaved,
      })) || []
    );
  }, [savedEventsData]);

  const passEvents = React.useMemo(() => {
    const formatTime12hr = (timeStr?: string | null) => {
      if (!timeStr) return 'TBA';
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        const h = parseInt(parts[0], 10);
        const m = parts[1];
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m} ${ampm}`;
      }
      return timeStr;
    };

    return (
      passData?.getPasses?.map((pass) => ({
        id: pass.event.id,
        slug: pass.event.slug,
        title: pass.event.title,
        image:
          pass.event.headerImage ||
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        date: pass.event.startDate
          ? new Date(pass.event.startDate as string).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : 'TBA',
        time: formatTime12hr(pass.event.startTime),
        tag: pass.event.category || 'General',
        price: pass.event.passes?.[0]?.price?.toString() || 'Free',
        location: pass.event.mode?.city
          ? `${pass.event.mode.city}${pass.event.mode.state ? `, ${pass.event.mode.state}` : ''}`
          : 'TBD',
        isOnline: pass.event.mode?.eventMode === 'ONLINE',
      })) || []
    );
  }, [passData]);

  const scrollFeatured = (direction: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const { scrollLeft, clientWidth } = featuredScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      featuredScrollRef.current.scrollTo({
        left:
          direction === 'left'
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollWishlist = (direction: 'left' | 'right') => {
    if (wishlistScrollRef.current) {
      const { scrollLeft, clientWidth } = wishlistScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      wishlistScrollRef.current.scrollTo({
        left:
          direction === 'left'
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollPass = (direction: 'left' | 'right') => {
    if (passScrollRef.current) {
      const { scrollLeft, clientWidth } = passScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      passScrollRef.current.scrollTo({
        left:
          direction === 'left'
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const tabs = isAuthenticated
    ? (['pass', 'wishlist', 'feature'] as const)
    : (['feature'] as const);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <TypographyH3 className="border-0 text-left font-bold">
          Featured Events
        </TypographyH3>

        {/* Right side: Simple Tabs (Pass, Wishlist, Feature) */}
        {isAuthenticated && (
          <div className="flex items-center gap-6 self-start sm:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFeaturedTab(tab)}
                className={`cursor-pointer border-b-2 pb-1 text-sm font-bold capitalize transition-all duration-300 select-none ${
                  activeFeaturedTab === tab
                    ? 'text-foreground border-indigo-600'
                    : 'text-muted-foreground hover:text-foreground border-transparent'
                }`}
              >
                {tab === 'feature' ? 'Featured' : tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content 1: Feature Carousel */}
      {activeFeaturedTab === 'feature' && (
        <div className="group/feat-carousel relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollFeatured('left')}
            className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 left-0 z-30 hidden size-9 -translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/feat-carousel:opacity-100 active:scale-95 md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={featuredScrollRef}
            className="flex scrollbar-none items-center gap-6 overflow-x-auto scroll-smooth px-1 py-2"
          >
            {featuredEvents.map((event) => (
              <Link
                key={`featured-${event.id}`}
                href={`/events/${event.id}`}
                className="group/feat relative block h-64 w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover/feat:scale-105"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                {/* Content overlay */}
                <div className="absolute right-0 bottom-0 left-0 z-20 flex flex-col gap-2 p-5 text-left">
                  {/* Category Tag */}
                  <div>
                    <Badge
                      variant={null}
                      className="rounded border-0 bg-indigo-600/90 px-2 py-0.5 text-[10px] font-semibold text-white"
                    >
                      {event.tag}
                    </Badge>
                  </div>

                  {/* Event Title */}
                  <TypographyH4 className="line-clamp-2 border-0 text-base leading-snug font-bold tracking-tight text-white md:text-lg">
                    {event.title}
                  </TypographyH4>

                  {/* Date & Location */}
                  <div className="flex items-center gap-3 text-xs font-medium text-white/70">
                    <TypographySpan className="shrink-0">
                      {event.date}
                    </TypographySpan>
                    <TypographySpan className="text-white/30">•</TypographySpan>
                    <TypographySpan className="truncate">
                      {event.location}
                    </TypographySpan>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollFeatured('right')}
            className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 right-0 z-30 hidden size-9 translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/feat-carousel:opacity-100 active:scale-95 md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {/* Tab Content 2: Wishlist Carousel */}
      {activeFeaturedTab === 'wishlist' && (
        <div className="group/wishlist-carousel relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollWishlist('left')}
            className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 left-0 z-30 hidden size-9 -translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/wishlist-carousel:opacity-100 active:scale-95 md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={wishlistScrollRef}
            className="flex scrollbar-none items-center gap-6 overflow-x-auto scroll-smooth px-1 py-2"
          >
            {savedEventsLoading && wishlistEvents.length === 0 ? (
              <div className="flex h-64 w-full items-center justify-center">
                <span className="text-muted-foreground">
                  Loading wishlist...
                </span>
              </div>
            ) : wishlistEvents.length > 0 ? (
              wishlistEvents.map((event) => (
                <div
                  key={`wishlist-${event.id}`}
                  className="w-full shrink-0 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <EventCardHorizontal
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
                </div>
              ))
            ) : (
              <div className="border-border bg-card/25 w-full rounded-2xl border border-dashed py-12 text-center shadow-inner backdrop-blur-sm">
                <TypographyH4 className="text-foreground border-0 text-sm font-bold">
                  No saved events
                </TypographyH4>
                <TypographyMuted className="mx-auto mt-1 max-w-xs text-xs">
                  Save some events to see them here!
                </TypographyMuted>
              </div>
            )}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollWishlist('right')}
            className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 right-0 z-30 hidden size-9 translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/wishlist-carousel:opacity-100 active:scale-95 md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {/* Tab Content 3: Passes Carousel */}
      {activeFeaturedTab === 'pass' && (
        <div className="group/pass-carousel relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollPass('left')}
            className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 left-0 z-30 hidden size-9 -translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/pass-carousel:opacity-100 active:scale-95 md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={passScrollRef}
            className="flex scrollbar-none items-center gap-6 overflow-x-auto scroll-smooth px-1 py-2"
          >
            {passLoading && passEvents.length === 0 ? (
              <div className="flex h-64 w-full items-center justify-center">
                <span className="text-muted-foreground">Loading passes...</span>
              </div>
            ) : passEvents.length > 0 ? (
              passEvents.map((event) => (
                <div
                  key={`pass-${event.id}`}
                  className="w-full shrink-0 md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <EventPassCard event={event} />
                </div>
              ))
            ) : (
              <div className="border-border bg-card/25 w-full rounded-2xl border border-dashed py-12 text-center shadow-inner backdrop-blur-sm">
                <Ticket className="text-muted-foreground/60 mx-auto mb-2 size-9 animate-pulse" />
                <TypographyH4 className="text-foreground border-0 text-sm font-bold">
                  No active passes
                </TypographyH4>
                <TypographyMuted className="mx-auto mt-1 max-w-xs text-xs">
                  {
                    'You haven\'t registered for any events yet. Click "Register Now" on any card to secure your pass!'
                  }
                </TypographyMuted>
              </div>
            )}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollPass('right')}
            className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 right-0 z-30 hidden size-9 translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/pass-carousel:opacity-100 active:scale-95 md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
};
