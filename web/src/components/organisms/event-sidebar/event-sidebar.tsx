import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Card } from '@/components/atoms/card/card';
import { Button } from '@/components/atoms/button/button';
import { Badge, BadgeVariant } from '@/components/atoms/badge/badge';

export interface EventSidebarProps {
  id: string;
  price: string;
  tag: string;
  location?: string;
  date: string;
  time: string;
}

export function EventSidebar({ id, price, tag, location, date, time }: EventSidebarProps) {
  const displayPrice = price === 'Free' || price.toLowerCase() === 'free' ? 'Free' : `$${price}`;

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Desktop Widget */}
      <Card className="bg-card/65 border-border/80 hidden flex-col gap-4 rounded-xl p-4 text-left shadow-lg backdrop-blur-md lg:flex">
        <div className="space-y-0.5">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">TICKET PRICE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-foreground text-2xl font-extrabold">{displayPrice}</span>
            {displayPrice !== 'Free' && <span className="text-muted-foreground text-[11px] font-medium">/ person</span>}
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="border-border/40 flex items-center justify-between border-b py-1.5">
            <span className="text-muted-foreground">Category</span>
            <Badge variant={BadgeVariant.Secondary} className="px-2 py-0.5 text-[10px] font-bold">{tag}</Badge>
          </div>
          <div className="border-border/40 flex items-center justify-between border-b py-1.5">
            <span className="text-muted-foreground">Location type</span>
            <span className="text-foreground font-semibold">{location ? 'In-Person' : 'Online'}</span>
          </div>
          {location && (
            <div className="border-border/40 flex items-start justify-between gap-4 border-b py-1.5">
              <span className="text-muted-foreground shrink-0">Venue</span>
              <span className="text-foreground text-right font-semibold break-words">{location}</span>
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
            <span className="font-bold text-amber-600 dark:text-amber-400">Limited Spots Left!</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Refund Policy</span>
            <span className="text-muted-foreground text-[11px]">Flexible (24h notice)</span>
          </div>
        </div>

        <Link href={`/events/${id}/register`} className="w-full">
          <Button size="sm" className="w-full cursor-pointer rounded-lg bg-indigo-700 py-5 font-bold text-white shadow-sm transition-all hover:bg-indigo-600 active:scale-[0.98]">
            Secure Spot Now
          </Button>
        </Link>
        <span className="text-muted-foreground block text-center text-[10px]">Instant checkout & confirmation • No hidden fees</span>
      </Card>

      {/* Trust Badge */}
      <div className="space-y-2 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4 text-left dark:bg-indigo-500/5">
        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
          <Shield className="size-4 shrink-0" />
          <h3 className="text-xs font-bold">Passvy Verified Event</h3>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          This event is verified by Passvy. You will receive an encrypted digital entry pass containing a scanable barcode as soon as registration is complete.
        </p>
      </div>

      {/* Mobile Details Card */}
      <Card className="bg-card/65 border-border/80 flex flex-col gap-3 rounded-xl p-4 text-left shadow-md backdrop-blur-md lg:hidden">
        <h4 className="text-foreground border-border/40 border-b pb-2 text-xs font-bold tracking-wider uppercase">Event Information</h4>
        <div className="space-y-2.5 text-xs">
          <div className="border-border/40 flex items-center justify-between border-b py-1">
            <span className="text-muted-foreground">Category</span>
            <Badge variant={BadgeVariant.Secondary} className="px-2 py-0.5 text-[10px] font-bold">{tag}</Badge>
          </div>
          <div className="border-border/40 flex items-center justify-between border-b py-1">
            <span className="text-muted-foreground">Location type</span>
            <span className="text-foreground font-semibold">{location ? 'In-Person' : 'Online'}</span>
          </div>
          {location && (
            <div className="border-border/40 flex items-start justify-between gap-4 border-b py-1">
              <span className="text-muted-foreground shrink-0">Venue</span>
              <span className="text-foreground text-right font-semibold break-words">{location}</span>
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
            <span className="font-bold text-amber-600 dark:text-amber-400">Limited Spots Left!</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Refund Policy</span>
            <span className="text-muted-foreground text-[11px]">Flexible (24h notice)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
