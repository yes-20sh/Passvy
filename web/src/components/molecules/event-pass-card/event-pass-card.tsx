import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { type EventData } from "@/components/molecules/event-card/event-card";
import { Badge } from "@/components/atoms/badge/badge";
import { Calendar } from "lucide-react";

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
    <Link href={`/events/${event.id}/pass`} className="block group">
      <div className="relative overflow-visible bg-card/45 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 p-3 rounded-2xl flex flex-col gap-4 border border-border/80 cursor-pointer">
        {/* Top Ticket Section */}
        <div className="flex gap-4">
          {/* Left Side: Square Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-xl overflow-hidden bg-muted shrink-0 shadow-inner">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent z-10 pointer-events-none" />
          </div>

          {/* Right Side: Tag and Title & Details */}
          <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
            <div className="space-y-1.5">
              <div>
                <Badge
                  variant={null}
                  className="bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-0 font-bold text-[10px] px-2 py-0.5 rounded-md"
                >
                  {tag}
                </Badge>
              </div>
              <h3 className="text-sm sm:text-base font-bold leading-snug text-foreground tracking-tight line-clamp-2">
                {title}
              </h3>
            </div>

            {/* Quick Date details */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
              <Calendar className="size-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{date}</span>
            </div>
          </div>
        </div>

        {/* Ticket Tear-off Divider Line */}
        <div className="relative flex items-center justify-between my-1 z-20">
          {/* Left Cut-out */}
          <div className="absolute left-[calc(-0.75rem-2px)] w-3.5 h-7 rounded-r-full bg-background border-y border-border/80 z-20" />
          {/* Dashed Line */}
          <div className="w-full border-t border-dashed border-border/80 mx-1" />
          {/* Right Cut-out */}
          <div className="absolute right-[calc(-0.75rem-2px)] w-3.5 h-7 rounded-l-full bg-background border-y border-border/80 z-20" />
        </div>

        <div className="w-full pt-1">
          <svg
            className="w-full h-12 opacity-80"
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
              let currentX = (100 - barcodeContentWidth) / 2;
              return BARCODE_PATTERN.map((bar, index) => {
                const x = currentX;
                currentX += bar.width + bar.gap;
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
