import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { Badge } from "@/components/atoms/badge/badge";
import {
  EventCard,
  type EventData,
} from "@/components/molecules/event-card/event-card";
import { EventCardHorizontal } from "@/components/molecules/event-card-horizontal/event-card-horizontal";
import { EventPassCard } from "@/components/molecules/event-pass-card/event-pass-card";

export interface FeaturedEventsProps {
  activeFeaturedTab: "feature" | "wishlist" | "pass";
  setActiveFeaturedTab: (tab: "feature" | "wishlist" | "pass") => void;
  featuredEvents: EventData[];
  mockEvents: EventData[];
  registeredIds: string[];
  setRegisteredIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FeaturedEvents = ({
  activeFeaturedTab,
  setActiveFeaturedTab,
  featuredEvents,
  mockEvents,
  registeredIds,
  setRegisteredIds,
}: FeaturedEventsProps) => {
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const wishlistScrollRef = useRef<HTMLDivElement>(null);
  const passScrollRef = useRef<HTMLDivElement>(null);

  const scrollFeatured = (direction: "left" | "right") => {
    if (featuredScrollRef.current) {
      const { scrollLeft, clientWidth } = featuredScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      featuredScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollWishlist = (direction: "left" | "right") => {
    if (wishlistScrollRef.current) {
      const { scrollLeft, clientWidth } = wishlistScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      wishlistScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollPass = (direction: "left" | "right") => {
    if (passScrollRef.current) {
      const { scrollLeft, clientWidth } = passScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      passScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-left">
          Featured Events
        </h2>

        {/* Right side: Simple Tabs (Pass, Wishlist, Feature) */}
        <div className="flex items-center gap-6 self-start sm:self-auto">
          {(["pass", "wishlist", "feature"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFeaturedTab(tab)}
              className={`pb-1 text-sm font-bold transition-all duration-300 capitalize cursor-pointer select-none border-b-2 ${
                activeFeaturedTab === tab
                  ? "border-indigo-600 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "feature" ? "Featured" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content 1: Feature Carousel */}
      {activeFeaturedTab === "feature" && (
        <div className="relative group/feat-carousel">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollFeatured("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/feat-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={featuredScrollRef}
            className="flex items-center gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
          >
            {featuredEvents.map((event) => (
              <Link
                key={`featured-${event.id}`}
                href={`/events/${event.id}`}
                className="group/feat relative w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 shrink-0 cursor-pointer block"
              >
                {/* Background Image */}
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/feat:scale-105"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col gap-2 text-left">
                  {/* Category Tag */}
                  <div>
                    <Badge
                      variant={null}
                      className="bg-indigo-600/90 text-white border-0 font-semibold text-[10px] px-2 py-0.5 rounded"
                    >
                      {event.tag}
                    </Badge>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-white text-base md:text-lg font-bold tracking-tight line-clamp-2 leading-snug">
                    {event.title}
                  </h3>

                  {/* Date & Location */}
                  <div className="flex items-center gap-3 text-white/70 text-xs font-medium">
                    <span className="shrink-0">{event.date}</span>
                    <span className="text-white/30">•</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollFeatured("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/feat-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {/* Tab Content 2: Wishlist Carousel */}
      {activeFeaturedTab === "wishlist" && (
        <div className="relative group/wishlist-carousel">
          {/* Left Scroll Button */}
          <button
            onClick={() => scrollWishlist("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/wishlist-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={wishlistScrollRef}
            className="flex items-center gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
          >
            {mockEvents.slice(1, 6).map((event) => (
              <div
                key={`wishlist-${event.id}`}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
              >
                <EventCardHorizontal
                  event={event}
                  onRegister={(id) => {
                    setRegisteredIds((prev) =>
                      prev.includes(id) ? prev : [...prev, id]
                    );
                    alert(
                      `Successfully registered for event: ${event.title} (ID: ${id})!`
                    );
                  }}
                />
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scrollWishlist("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/wishlist-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {/* Tab Content 3: Passes Carousel */}
      {activeFeaturedTab === "pass" && (
        <div>
          {registeredIds.length > 0 ? (
            <div className="relative group/pass-carousel">
              {/* Left Scroll Button */}
              <button
                onClick={() => scrollPass("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/pass-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="size-5" />
              </button>

              {/* Carousel Track */}
              <div
                ref={passScrollRef}
                className="flex items-center gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
              >
                {mockEvents
                  .filter((event) => registeredIds.includes(event.id))
                  .map((event) => (
                    <div
                      key={`pass-${event.id}`}
                      className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
                    >
                      <EventPassCard event={event} />
                    </div>
                  ))}
              </div>

              {/* Right Scroll Button */}
              <button
                onClick={() => scrollPass("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/pass-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-border rounded-2xl bg-card/25 backdrop-blur-sm shadow-inner">
              <Ticket className="size-9 text-muted-foreground/60 mb-2 mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-foreground">
                No active passes
              </h4>
              <p className="text-muted-foreground text-xs max-w-xs mx-auto mt-1">
                You haven't registered for any events yet. Click "Register Now"
                on any card to secure your pass!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
