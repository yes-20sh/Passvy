import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type EventData } from '@/components/molecules/event-card/event-card';
import { Badge } from '@/components/atoms/badge/badge';
import { Calendar } from 'lucide-react';

export interface EventPassCardProps {
  event: EventData;
}

export interface BarcodeBar {
  width: number;
  gap: number;
}

const BARCODE_PATTERN: BarcodeBar[] = [
  { width: 1.5, gap: 1.2 },
  { width: 1.2, gap: 1.5 },
  { width: 2.0, gap: 1.0 },
  { width: 1.0, gap: 1.8 },
  { width: 1.7, gap: 1.3 },
  { width: 1.3, gap: 1.1 },
  { width: 1.9, gap: 1.6 },
  { width: 1.1, gap: 1.4 },
  { width: 1.6, gap: 1.2 },
  { width: 1.4, gap: 1.7 },
  { width: 2.0, gap: 1.0 },
  { width: 1.2, gap: 1.5 },
  { width: 1.8, gap: 1.3 },
  { width: 1.0, gap: 1.9 },
  { width: 1.5, gap: 1.1 },
  { width: 1.3, gap: 1.4 },
  { width: 1.7, gap: 1.6 },
  { width: 1.1, gap: 1.2 },
  { width: 1.9, gap: 1.8 },
  { width: 1.4, gap: 1.0 },
  { width: 1.6, gap: 1.5 },
  { width: 1.2, gap: 1.3 },
  { width: 2.0, gap: 1.7 },
  { width: 1.0, gap: 1.1 },
  { width: 1.8, gap: 1.9 },
  { width: 1.3, gap: 1.4 },
  { width: 1.5, gap: 1.6 },
  { width: 1.1, gap: 1.2 },
  { width: 1.7, gap: 2.0 },
  { width: 1.4, gap: 1.0 },
  { width: 1.9, gap: 1.8 },
  { width: 1.2, gap: 1.3 },
  { width: 1.6, gap: 1.5 },
  { width: 1.0, gap: 1.1 },
  { width: 1.0, gap: 1.1 },
];

export function EventPassCard({ event }: EventPassCardProps) {
  const { title, image, date, tag } = event;

  return (
    <Link href={`/events/${event.slug}/pass`} className="group block">
      <div className="bg-card/45 border-border/80 relative flex cursor-pointer flex-col gap-4 overflow-visible rounded-2xl border p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
        {/* Top Ticket Section */}
        <div className="flex gap-4">
          {/* Left Side: Square Image */}
          <div className="bg-muted relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow-inner sm:h-24 sm:w-24">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          {/* Right Side: Tag and Title & Details */}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            <div className="space-y-1.5">
              <div>
                <Badge
                  variant={null}
                  className="rounded-md border-0 bg-indigo-600/10 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                >
                  {tag}
                </Badge>
              </div>
              <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-bold tracking-tight sm:text-base">
                {title}
              </h3>
            </div>

            {/* Quick Date details */}
            <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[11px]">
              <Calendar className="size-3 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate">{date}</span>
            </div>
          </div>
        </div>

        {/* Ticket Tear-off Divider Line */}
        <div className="relative z-20 my-1 flex items-center justify-between">
          {/* Left Cut-out */}
          <div className="bg-background border-border/80 absolute left-[calc(-0.75rem-2px)] z-20 h-7 w-3.5 rounded-r-full border-y" />
          {/* Dashed Line */}
          <div className="border-border/80 mx-1 w-full border-t border-dashed" />
          {/* Right Cut-out */}
          <div className="bg-background border-border/80 absolute right-[calc(-0.75rem-2px)] z-20 h-7 w-3.5 rounded-l-full border-y" />
        </div>

        <div className="w-full pt-1">
          <svg
            className="h-12 w-full opacity-80"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            {(() => {
              const barcodeContentWidth = BARCODE_PATTERN.reduce(
                (sum, bar, idx) => {
                  if (idx === BARCODE_PATTERN.length - 1) {
                    return sum + bar.width;
                  }
                  return sum + bar.width + bar.gap;
                },
                0,
              );
              const startX = (100 - barcodeContentWidth) / 2;
              return BARCODE_PATTERN.map((bar, index) => {
                const xOffset = BARCODE_PATTERN.slice(0, index).reduce(
                  (sum, b) => sum + b.width + b.gap,
                  0,
                );
                const x = startX + xOffset;
                return (
                  <rect
                    key={index}
                    x={x}
                    y="0"
                    width={bar.width}
                    height="20"
                    fill="currentColor"
                    className="text-foreground animate-pulse"
                  />
                );
              });
            })()}
          </svg>
        </div>
      </div>
    </Link>
  );
}
