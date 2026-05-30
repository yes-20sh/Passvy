import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Share2,
  Shield,
  Heart,
} from "lucide-react";
import { MOCK_EVENTS } from "../data";
import { Badge, BadgeVariant } from "@/components/atoms/badge/badge";
import { Button } from "@/components/atoms/button/button";
import { Card } from "@/components/atoms/card/card";

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
  const event = MOCK_EVENTS.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const { title, image, date, time, tag, price, location } = event;

  // Mock description for beautiful UI presentation
  const mockDescription = `Join us for the highly anticipated ${title}! This premium event brings together industry experts, enthusiasts, and innovators for an unforgettable experience. Over the course of the session, you will gain access to deep-dive workshops, keynotes, live Q&A panel discussions, and unmatched networking opportunities. Whether you are looking to build your professional network, learn new techniques, or simply enjoy a world-class gathering, this is the event for you.`;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Events</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-secondary border border-border/60 transition-all active:scale-95 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Share event"
            >
              <Share2 className="size-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-secondary border border-border/60 transition-all active:scale-95 text-muted-foreground hover:text-rose-500 cursor-pointer"
              aria-label="Add to favorites"
            >
              <Heart className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-28 lg:pb-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Details & Media */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Block */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4">
                <Badge
                  variant={null}
                  className="bg-indigo-600 text-white border-0 font-bold px-3 py-1 text-xs shadow-md rounded-lg"
                >
                  {tag}
                </Badge>
              </div>
            </div>

            {/* Title & Headline Info */}
            <div className="space-y-4 text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {title}
              </h1>

              {/* Badges and tags */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 text-sm font-medium">
                  <Calendar className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 text-sm font-medium">
                  <Clock className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>{time}</span>
                </div>
                {location && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 text-sm font-medium">
                    <MapPin className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-border/40" />

            {/* Event Description */}
            <div className="space-y-4 text-left">
              <h2 className="text-xl font-bold text-foreground">
                About the Event
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
                {mockDescription}
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Sticky Booking Widget */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card className="hidden lg:flex p-4 bg-card/65 backdrop-blur-md border-border/80 shadow-lg rounded-xl flex-col gap-4 text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                  TICKET PRICE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-foreground">
                    {price === "Free" || price.toLowerCase() === "free"
                      ? "Free"
                      : `$${price}`}
                  </span>
                  {price !== "Free" && (
                    <span className="text-[11px] font-medium text-muted-foreground">
                      / person
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Detailed Information inside Card */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Category</span>
                  <Badge
                    variant={BadgeVariant.Secondary}
                    className="font-bold text-[10px] px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Location type</span>
                  <span className="font-semibold text-foreground">
                    {location ? "In-Person" : "Online"}
                  </span>
                </div>
                {location && (
                  <div className="flex items-start justify-between py-1.5 border-b border-border/40 gap-4">
                    <span className="text-muted-foreground shrink-0">
                      Venue
                    </span>
                    <span className="font-semibold text-foreground text-right break-words">
                      {location}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-foreground">{date}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold text-foreground">{time}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Limited Spots Left!
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground">Refund Policy</span>
                  <span className="text-[11px] text-muted-foreground">
                    Flexible (24h notice)
                  </span>
                </div>
              </div>

              <Link href={`/events/${id}/register`} className="w-full">
                <Button
                  size="sm"
                  className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg py-5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  Secure Spot Now
                </Button>
              </Link>

              <span className="text-[10px] text-muted-foreground text-center block">
                Instant checkout & confirmation • No hidden fees
              </span>
            </Card>

            {/* Event Guidelines / FAQ section moved under the booking widget for trust validation */}
            <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 dark:bg-indigo-500/5 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Shield className="size-4 shrink-0" />
                <h3 className="font-bold text-xs">Passvy Verified Event</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This event is verified by Passvy. You will receive an encrypted
                digital entry pass containing a scanable barcode as soon as
                registration is complete.
              </p>
            </div>

            {/* Mobile Detailed Information Card - Shown only on Mobile, below Passvy Verification box */}
            <Card className="lg:hidden p-4 bg-card/65 backdrop-blur-md border-border/80 shadow-md rounded-xl flex flex-col gap-3 text-left">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-2">
                Event Information
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Category</span>
                  <Badge
                    variant={BadgeVariant.Secondary}
                    className="font-bold text-[10px] px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Location type</span>
                  <span className="font-semibold text-foreground">
                    {location ? "In-Person" : "Online"}
                  </span>
                </div>
                {location && (
                  <div className="flex items-start justify-between py-1 border-b border-border/40 gap-4">
                    <span className="text-muted-foreground shrink-0">
                      Venue
                    </span>
                    <span className="font-semibold text-foreground text-right break-words">
                      {location}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold text-foreground">{date}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold text-foreground">{time}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Limited Spots Left!
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Refund Policy</span>
                  <span className="text-[11px] text-muted-foreground">
                    Flexible (24h notice)
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Floating Booking Footer Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-card/95 backdrop-blur-md border border-border/80 p-3.5 shadow-2xl rounded-xl flex items-center justify-between lg:hidden transition-transform duration-300">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-semibold text-muted-foreground tracking-wider uppercase">
            TICKET PRICE
          </span>
          <span className="text-xl font-extrabold text-foreground leading-none mt-1">
            {price === "Free" || price.toLowerCase() === "free"
              ? "Free"
              : `$${price}`}
          </span>
        </div>
        <Link href={`/events/${id}/register`}>
          <Button
            size="sm"
            className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg px-5 py-4.5 shadow-md active:scale-95 transition-all text-xs cursor-pointer"
          >
            Secure Spot
          </Button>
        </Link>
      </div>
    </div>
  );
}
