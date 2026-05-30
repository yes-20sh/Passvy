import React from "react";
import Image from "next/image";
import { Badge } from "@/components/atoms/badge/badge";
import { type EventData } from "@/components/molecules/event-card/event-card";

export interface EventSummaryCardProps {
  event: EventData;
  passTierName: string;
  passCategoryName: string;
  singlePassPrice: number;
  totalTickets: number;
  rawSubtotal: number;
  discountPercentage: number;
  discountAmount: number;
  calculatedTotal: string;
  invitedBuddies: string[];
}

export function EventSummaryCard({
  event,
  passTierName,
  passCategoryName,
  singlePassPrice,
  totalTickets,
  rawSubtotal,
  discountPercentage,
  discountAmount,
  calculatedTotal,
  invitedBuddies,
}: EventSummaryCardProps) {
  const { title, image, date, time, tag, location } = event;

  return (
    <div className="col-span-1 lg:col-span-2 flex flex-col gap-4 text-left border-l border-border/40 pl-6 lg:sticky lg:top-24 w-full">
      <h3 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Checkout Summary</h3>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border shadow-sm">
        <Image
          src={image}
          alt={title}
          fill
          sizes="400px"
          className="object-cover"
        />
      </div>
      <div className="space-y-1">
        <Badge variant={null} className="bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-0 text-[10px] font-bold py-0.5 px-2 rounded-md">
          {tag}
        </Badge>
        <h4 className="text-sm sm:text-base font-bold text-foreground leading-tight line-clamp-2">{title}</h4>
      </div>

      {/* Package pricing breakdowns */}
      <div className="space-y-2.5 text-xs border-t border-border/40 pt-3 text-muted-foreground">
        <div className="flex justify-between items-center text-foreground py-0.5">
          <span className="font-semibold text-muted-foreground">Pass Tier</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{passTierName}</span>
        </div>
        <div className="flex justify-between items-center text-foreground py-0.5">
          <span className="font-semibold text-muted-foreground">Pass Category</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{passCategoryName}</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span>Price per ticket</span>
          <span className="font-medium text-foreground">{singlePassPrice === 0 ? "Free" : `$${singlePassPrice}`}</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span>Attendee Tickets</span>
          <span className="font-medium text-foreground">{totalTickets} ticket(s)</span>
        </div>
        {discountPercentage > 0 && (
          <>
            <div className="flex justify-between items-center py-0.5 border-t border-border/10 pt-2">
              <span>Package Subtotal</span>
              <span className="font-medium text-foreground">${rawSubtotal}</span>
            </div>
            <div className="flex justify-between items-center py-0.5 text-emerald-600 dark:text-emerald-400">
              <span className="font-semibold">Package Discount ({discountPercentage}%)</span>
              <span className="font-bold">-${discountAmount}</span>
            </div>
          </>
        )}
        
        {invitedBuddies.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-border/20 pt-2 text-[10px]">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground/60">Registered Buddies</span>
            <ul className="list-disc list-inside space-y-0.5 max-h-24 overflow-y-auto pl-1">
              {invitedBuddies.map((buddy, index) => (
                <li key={index} className="truncate text-foreground font-medium">{buddy}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-border/40 pt-3 flex justify-between items-center text-sm sm:text-base">
        <span className="font-extrabold text-muted-foreground">Subtotal</span>
        <span className="font-black text-foreground">{calculatedTotal}</span>
      </div>
    </div>
  );
}
