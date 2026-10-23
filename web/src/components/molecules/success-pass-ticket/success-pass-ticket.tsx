import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, QrCode } from "lucide-react";
import { Badge } from "@/components/atoms/badge/badge";
import { Button } from "@/components/atoms/button/button";
import { type EventDetailState } from "@/store/slices/event-detail.slice";
import { type Attendee } from "@/app/(main)/events/[id]/register/page";

export interface SuccessPassTicketProps {
  event: EventDetailState;
  userName: string;
  passTierName: string;
  passCategoryName: string;
  totalTickets: number;
  ticketCode: string;
  calculatedTotal: string;
  attendees: Attendee[];
  onPrint: () => void;
  // Optional registration details to show below the card
  userEmail?: string;
  userPhone?: string;
  paymentMethod?: string;
  couponCode?: string;
  isCheckout?: boolean;
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
];

export function SuccessPassTicket({
  event,
  userName,
  passTierName,
  passCategoryName,
  totalTickets,
  ticketCode,
  calculatedTotal,
  attendees,
  onPrint,
  userEmail,
  userPhone,
  paymentMethod,
  couponCode,
  isCheckout = false,
}: SuccessPassTicketProps) {
  const { title, image, date, tag } = event;

  const isVip = passTierName.toLowerCase().includes('vip');
  const isVvip = passTierName.toLowerCase().includes('vvip') || passTierName.toLowerCase().includes('premium');

  return (
    <div className="flex flex-col items-center w-full max-w-md gap-6 text-center">
      {isCheckout && (
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Checkout Completed!
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Congratulations, your Passes are secured and encrypted. Access your
            Passvy tickets below.
          </p>
        </div>
      )}

      {/* Digital Ticket Pass Card */}
      <div className="w-full relative overflow-visible bg-card/45 backdrop-blur-sm p-5 rounded-2xl flex flex-col gap-4 border border-border/80 shadow-2xl text-left">
        {/* Top Section */}
        <div className="flex gap-4">
          <div className="relative w-24 h-24 aspect-square rounded-xl overflow-hidden bg-muted shrink-0 shadow-inner">
            <Image
              src={image || "/placeholder.svg"}
              alt={title || "Event Image"}
              fill
              sizes="96px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent z-10 pointer-events-none" />
          </div>

          <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant={null}
                  className="bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-0 font-bold text-[10px] px-2 py-0.5 rounded"
                >
                  {tag || "EVENT"}
                </Badge>
                <Badge
                  variant={null}
                  className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0 font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded"
                >
                  {passTierName}
                </Badge>
                <Badge
                  variant={null}
                  className="bg-indigo-500/20 text-indigo-700 dark:bg-indigo-500/30 border-0 font-extrabold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded"
                >
                  {passCategoryName}
                </Badge>
              </div>
              <h3 className="text-base font-bold leading-snug text-foreground line-clamp-2">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Calendar className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{date}</span>
            </div>
          </div>
        </div>

        {/* Attendee Details Grid - ONLY shows Name and Order ID */}
        <div className="grid grid-cols-2 gap-4 py-4 px-4 rounded-xl bg-secondary/20 border border-border/40 text-xs text-muted-foreground">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-0.5">
              PRIMARY HOLDER
            </span>
            <span className="font-bold text-foreground truncate block text-sm">
              {userName}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mb-0.5">
              ORDER ID
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block text-sm">
              {ticketCode}
            </span>
          </div>
        </div>

        {/* Free Complimentary Items / Gifts Received section */}
        <div className="py-3 px-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-muted-foreground space-y-1.5">
          <span className="block text-[9px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-extrabold tracking-widest">
            FREE GIFTS INCLUDED
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-foreground">
            {!isVip && !isVvip && (
              <>
                <div className="p-2.5 bg-secondary/35 border border-border/80 rounded-lg flex items-center gap-2 text-xs font-bold text-foreground">
                  <span className="text-base shrink-0 select-none">🎨</span>
                  <span className="truncate">Passvy Sticker Pack</span>
                </div>
                <div className="p-2.5 bg-secondary/35 border border-border/80 rounded-lg flex items-center gap-2 text-xs font-bold text-foreground">
                  <span className="text-base shrink-0 select-none">🏅</span>
                  <span className="truncate">Digital Badge</span>
                </div>
              </>
            )}
            {isVip && !isVvip && (
              <>
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                  <span className="text-base shrink-0 select-none">🎫</span>
                  <span className="truncate">Fast-Track Access</span>
                </div>
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                  <span className="text-base shrink-0 select-none">🍹</span>
                  <span className="truncate">2x Drink Vouchers</span>
                </div>
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 col-span-1 sm:col-span-2 justify-center">
                  <span className="text-base shrink-0 select-none">🛋️</span>
                  <span className="truncate">VIP Lounge Exclusive Pass</span>
                </div>
              </>
            )}
            {isVvip && (
              <>
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <span className="text-base shrink-0 select-none">🤝</span>
                  <span className="truncate">VVIP Meet & Greet</span>
                </div>
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <span className="text-base shrink-0 select-none">👕</span>
                  <span className="truncate">Official VVIP T-Shirt</span>
                </div>
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 col-span-1 sm:col-span-2 justify-center">
                  <span className="text-base shrink-0 select-none">🛎️</span>
                  <span className="truncate">Dedicated Concierge Coupon</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dotted Tear-off Divider Line */}
        <div className="relative flex items-center justify-between my-1.5 z-20">
          <div className="absolute left-[calc(-1.25rem-2px)] w-4 h-8 rounded-r-full bg-background border-y border-border/80 z-20" />
          <div className="w-full border-t border-dashed border-border/80 mx-1" />
          <div className="absolute right-[calc(-1.25rem-2px)] w-4 h-8 rounded-l-full bg-background border-y border-border/80 z-20" />
        </div>

        {/* Bottom Scannable Barcode Section */}
        <div className="w-full flex flex-col items-center gap-2.5 pt-1">
          <svg
            className="w-full h-14 opacity-85 text-foreground"
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
              
              const { elements } = BARCODE_PATTERN.reduce(
                (acc, bar, index) => {
                  acc.elements.push(
                    <rect
                      key={index}
                      x={acc.currentX}
                      y="0"
                      width={bar.width}
                      height="20"
                      fill="currentColor"
                    />
                  );
                  acc.currentX += bar.width + bar.gap;
                  return acc;
                },
                { currentX: startX, elements: [] as React.ReactNode[] }
              );
              
              return elements;
            })()}
          </svg>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground tracking-widest font-semibold uppercase">
            <QrCode className="size-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>PASSVY ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* Conditional Details Section */}
      {isCheckout ? (
        /* Registration & Order Details Section - only shown during fresh checkout success */
        <div className="w-full bg-card/45 backdrop-blur-sm p-5 rounded-2xl border border-border/85 shadow-xl text-left space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-border/40 pb-2">
            Registration & Order Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-muted-foreground/60 uppercase tracking-wide text-[9px] font-semibold mb-0.5">
                Primary Contact
              </span>
              <span className="font-bold text-foreground text-sm block">
                {userName}
              </span>
              {userEmail && (
                <span className="text-muted-foreground block">{userEmail}</span>
              )}
              {userPhone && (
                <span className="text-muted-foreground block">{userPhone}</span>
              )}
            </div>
            <div>
              <span className="block text-muted-foreground/60 uppercase tracking-wide text-[9px] font-semibold mb-0.5">
                Ticket Info
              </span>
              <span className="font-bold text-foreground text-sm block">
                {passTierName} Pass
              </span>
              <span className="text-muted-foreground block">
                {passCategoryName} Category
              </span>
              <span className="text-muted-foreground block">
                {totalTickets} Ticket(s)
              </span>
            </div>
            <div>
              <span className="block text-muted-foreground/60 uppercase tracking-wide text-[9px] font-semibold mb-0.5">
                Payment Method
              </span>
              <span className="font-semibold text-foreground capitalize block">
                {paymentMethod || "Credit Card"}
              </span>
              {couponCode && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold block">
                  Coupon: {couponCode}
                </span>
              )}
            </div>
            <div>
              <span className="block text-muted-foreground/60 uppercase tracking-wide text-[9px] font-semibold mb-0.5">
                Total Paid
              </span>
              <span className="font-extrabold text-foreground text-base block">
                {calculatedTotal}
              </span>
            </div>
          </div>

          {/* Invited Attendees list */}
          {attendees.length > 0 && (
            <div className="border-t border-border/40 pt-3 mt-1">
              <span className="block text-muted-foreground/60 uppercase tracking-wide text-[9px] font-semibold mb-2">
                Attendee List
              </span>
              <div className="space-y-1.5">
                {attendees.map((attendee, index) => (
                  <div
                    key={attendee.id || index}
                    className="flex justify-between items-center bg-secondary/20 p-2.5 rounded-lg border border-border/30"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-foreground text-xs block truncate">
                        {attendee.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate block">
                        {attendee.email}
                      </span>
                    </div>
                    <Badge
                      variant={null}
                      className="bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-extrabold text-[9px] uppercase tracking-wide py-0.5 px-2 rounded"
                    >
                      {index === 0
                        ? "Primary"
                        : attendee.isInvite
                          ? "Invitee"
                          : "Attendee"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Simplified Registrant Card - only shown when viewing ticket from featured events */
        <div className="w-full bg-card/45 backdrop-blur-sm p-4 rounded-xl border border-border/80 shadow-md text-left grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-muted-foreground/60 uppercase tracking-wider text-[9px] font-semibold">Name</span>
            <span className="font-bold text-foreground text-[11px] sm:text-xs truncate">{userName}</span>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-border/40 pl-3 min-w-0">
            <span className="text-muted-foreground/60 uppercase tracking-wider text-[9px] font-semibold">Pass</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] sm:text-xs truncate">{passTierName} Pass</span>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-border/40 pl-3 min-w-0">
            <span className="text-muted-foreground/60 uppercase tracking-wider text-[9px] font-semibold">Register ID</span>
            <span className="font-mono font-bold text-foreground text-[11px] sm:text-xs truncate">{ticketCode}</span>
          </div>
        </div>
      )}

      {/* Actions Block */}
      <div className="w-full space-y-3">
        <Button
          onClick={onPrint}
          size="lg"
          className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-xl py-6 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Download / Print Tickets
        </Button>
        <Link
          href="/events"
          className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Return to Events Directory
        </Link>
      </div>
    </div>
  );
}
