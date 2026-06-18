import React, { useState } from 'react';
import { Camera, QrCode } from 'lucide-react';
import { Button } from '@/components/atoms/button/button';
import {
  TypographyH3,
  TypographyMuted,
} from '@/components/atoms/typography/typography';
import { Input } from '@/components/atoms/input/input';

export const EventScanner = () => {
  const [ticketId, setTicketId] = useState('');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 w-full space-y-6 duration-500">
      <div>
        <TypographyH3 className="flex items-center gap-2 border-0 font-bold">
          <QrCode className="h-5 w-5 text-indigo-500" /> Pass Scanner
        </TypographyH3>
        <TypographyMuted>
          Scan attendee QR codes or enter ticket IDs manually to check them in.
        </TypographyMuted>
      </div>

      <div className="mt-4 w-full space-y-8">
        {/* Camera Viewfinder UI */}
        <div className="ring-border relative mx-auto aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-2xl bg-[#0f1115] shadow-2xl ring-1 sm:aspect-video">
          {/* Camera overlay status */}
          <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/90 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Camera Active
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <Camera className="h-4.5 w-4.5" />
            </Button>
          </div>

          {/* Scanner Target Frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-56 w-56 sm:h-72 sm:w-72">
              {/* 4 Corner Brackets */}
              <div className="absolute top-0 left-0 h-10 w-10 rounded-tl-xl border-t-4 border-l-4 border-white/90" />
              <div className="absolute top-0 right-0 h-10 w-10 rounded-tr-xl border-t-4 border-r-4 border-white/90" />
              <div className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-white/90" />
              <div className="absolute right-0 bottom-0 h-10 w-10 rounded-br-xl border-r-4 border-b-4 border-white/90" />

              {/* Animated Laser Line */}
              <div className="absolute top-0 left-0 h-0.5 w-full animate-[scan_2.5s_ease-in-out_infinite] bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]" />

              {/* Subtle targeting tint */}
              <div className="absolute inset-0 animate-pulse rounded-lg bg-emerald-500/5" />
            </div>
          </div>

          {/* Instruction Tooltip */}
          <div className="pointer-events-none absolute right-0 bottom-6 left-0 z-10 text-center">
            <div className="inline-block rounded-xl border border-white/10 bg-black/50 px-5 py-2.5 text-sm font-semibold tracking-wide text-white/90 shadow-lg backdrop-blur-md">
              Align QR code within frame to scan
            </div>
          </div>
        </div>

        {/* Manual Entry Section */}
        <div className="mx-auto max-w-2xl space-y-4 pt-8">
          <div className="flex items-center gap-4">
            <hr className="border-border flex-1" />
            <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              Or Manual Entry
            </span>
            <hr className="border-border flex-1" />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Input
              placeholder="Enter Ticket ID (e.g. TKT-9021)"
              className="bg-background h-12 flex-1 rounded-xl text-base font-medium"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            />
            <Button
              className="h-12 rounded-xl bg-indigo-600 px-8 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98]"
              disabled={!ticketId}
              onClick={() => setTicketId('')}
            >
              Check In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
