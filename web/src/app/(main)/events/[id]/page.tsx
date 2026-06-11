import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Share2,
  Shield,
  Heart,
} from 'lucide-react';

import { Badge, BadgeVariant } from '@/components/atoms/badge/badge';
import { Button } from '@/components/atoms/button/button';
import { Card } from '@/components/atoms/card/card';
import { MOCK_EVENTS } from '../../data';

// Dynamic route parameters type for Next.js 16
export interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  let event = MOCK_EVENTS.find((e) => e.id === id || e.slug === id);
  
  // Fallback to dummy data if it's an API event we haven't implemented the fetch for yet
  if (!event) {
    event = MOCK_EVENTS[0];
  }

  const { title, image, date, time, tag, price, location } = event;

  // Mock description for beautiful UI presentation
  const mockDescription = `Join us for the highly anticipated ${title}! This premium event brings together industry experts, enthusiasts, and innovators for an unforgettable experience. Over the course of the session, you will gain access to deep-dive workshops, keynotes, live Q&A panel discussions, and unmatched networking opportunities. Whether you are looking to build your professional network, learn new techniques, or simply enjoy a world-class gathering, this is the event for you.`;

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors duration-200">
      {/* Navigation Header */}
      <header className="border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/events"
            className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Events</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground cursor-pointer rounded-full border p-2 transition-all active:scale-95"
              aria-label="Share event"
            >
              <Share2 className="size-4" />
            </button>
            <button
              type="button"
              className="hover:bg-secondary border-border/60 text-muted-foreground cursor-pointer rounded-full border p-2 transition-all hover:text-rose-500 active:scale-95"
              aria-label="Add to favorites"
            >
              <Heart className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left Column: Details & Media */}
          <div className="space-y-8 lg:col-span-2">
            {/* Hero Image Block */}
            <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-2xl border shadow-lg">
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge
                  variant={null}
                  className="rounded-lg border-0 bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md"
                >
                  {tag}
                </Badge>
              </div>
            </div>

            {/* Title & Headline Info */}
            <div className="space-y-4 text-left">
              <h1 className="text-foreground text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
                {title}
              </h1>

              {/* Badges and tags */}
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

            <hr className="border-border/40" />

            {/* Event Description */}
            <div className="space-y-4 text-left">
              <h2 className="text-foreground text-xl font-bold">
                About the Event
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
                {mockDescription}
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Sticky Booking Widget */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="bg-card/65 border-border/80 hidden flex-col gap-4 rounded-xl p-4 text-left shadow-lg backdrop-blur-md lg:flex">
              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  TICKET PRICE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-foreground text-2xl font-extrabold">
                    {price === 'Free' || price.toLowerCase() === 'free'
                      ? 'Free'
                      : `$${price}`}
                  </span>
                  {price !== 'Free' && (
                    <span className="text-muted-foreground text-[11px] font-medium">
                      / person
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Detailed Information inside Card */}
              <div className="space-y-2.5 text-xs">
                <div className="border-border/40 flex items-center justify-between border-b py-1.5">
                  <span className="text-muted-foreground">Category</span>
                  <Badge
                    variant={BadgeVariant.Secondary}
                    className="px-2 py-0.5 text-[10px] font-bold"
                  >
                    {tag}
                  </Badge>
                </div>
                <div className="border-border/40 flex items-center justify-between border-b py-1.5">
                  <span className="text-muted-foreground">Location type</span>
                  <span className="text-foreground font-semibold">
                    {location ? 'In-Person' : 'Online'}
                  </span>
                </div>
                {location && (
                  <div className="border-border/40 flex items-start justify-between gap-4 border-b py-1.5">
                    <span className="text-muted-foreground shrink-0">
                      Venue
                    </span>
                    <span className="text-foreground text-right font-semibold break-words">
                      {location}
                    </span>
                  </div>
                )}
                <div className="border-border/40 flex items-center justify-between border-b py-1.5">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground font-semibold">{date}</span>
                </div>
                <div className="border-border/40 flex items-center justify-between border-b py-1.5">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground font-semibold">{time}</span>
                </div>
                <div className="border-border/40 flex items-center justify-between border-b py-1.5">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Limited Spots Left!
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground">Refund Policy</span>
                  <span className="text-muted-foreground text-[11px]">
                    Flexible (24h notice)
                  </span>
                </div>
              </div>

              <Link href={`/events/${id}/register`} className="w-full">
                <Button
                  size="sm"
                  className="w-full cursor-pointer rounded-lg bg-indigo-700 py-5 font-bold text-white shadow-sm transition-all hover:bg-indigo-600 active:scale-[0.98]"
                >
                  Secure Spot Now
                </Button>
              </Link>

              <span className="text-muted-foreground block text-center text-[10px]">
                Instant checkout & confirmation • No hidden fees
              </span>
            </Card>

            {/* Event Guidelines / FAQ section moved under the booking widget for trust validation */}
            <div className="space-y-2 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4 text-left dark:bg-indigo-500/5">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Shield className="size-4 shrink-0" />
                <h3 className="text-xs font-bold">Passvy Verified Event</h3>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                This event is verified by Passvy. You will receive an encrypted
                digital entry pass containing a scanable barcode as soon as
                registration is complete.
              </p>
            </div>

            {/* Mobile Detailed Information Card - Shown only on Mobile, below Passvy Verification box */}
            <Card className="bg-card/65 border-border/80 flex flex-col gap-3 rounded-xl p-4 text-left shadow-md backdrop-blur-md lg:hidden">
              <h4 className="text-foreground border-border/40 border-b pb-2 text-xs font-bold tracking-wider uppercase">
                Event Information
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="border-border/40 flex items-center justify-between border-b py-1">
                  <span className="text-muted-foreground">Category</span>
                  <Badge
                    variant={BadgeVariant.Secondary}
                    className="px-2 py-0.5 text-[10px] font-bold"
                  >
                    {tag}
                  </Badge>
                </div>
                <div className="border-border/40 flex items-center justify-between border-b py-1">
                  <span className="text-muted-foreground">Location type</span>
                  <span className="text-foreground font-semibold">
                    {location ? 'In-Person' : 'Online'}
                  </span>
                </div>
                {location && (
                  <div className="border-border/40 flex items-start justify-between gap-4 border-b py-1">
                    <span className="text-muted-foreground shrink-0">
                      Venue
                    </span>
                    <span className="text-foreground text-right font-semibold break-words">
                      {location}
                    </span>
                  </div>
                )}
                <div className="border-border/40 flex items-center justify-between border-b py-1">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground font-semibold">{date}</span>
                </div>
                <div className="border-border/40 flex items-center justify-between border-b py-1">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground font-semibold">{time}</span>
                </div>
                <div className="border-border/40 flex items-center justify-between border-b py-1">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Limited Spots Left!
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Refund Policy</span>
                  <span className="text-muted-foreground text-[11px]">
                    Flexible (24h notice)
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Floating Booking Footer Bar */}
      <div className="bg-card/95 border-border/80 fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-transform duration-300 lg:hidden">
        <div className="flex flex-col text-left">
          <span className="text-muted-foreground text-[9px] font-semibold tracking-wider uppercase">
            TICKET PRICE
          </span>
          <span className="text-foreground mt-1 text-xl leading-none font-extrabold">
            {price === 'Free' || price.toLowerCase() === 'free'
              ? 'Free'
              : `$${price}`}
          </span>
        </div>
        <Link href={`/events/${id}/register`}>
          <Button
            size="sm"
            className="cursor-pointer rounded-lg bg-indigo-700 px-5 py-4.5 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-600 active:scale-95"
          >
            Secure Spot
          </Button>
        </Link>
      </div>
    </div>
  );
}
