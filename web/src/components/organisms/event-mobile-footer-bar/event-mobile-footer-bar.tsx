import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/button/button';

export interface EventMobileFooterBarProps {
  id: string;
  price: string;
}

export function EventMobileFooterBar({ id, price }: EventMobileFooterBarProps) {
  const displayPrice = price === 'Free' || price.toLowerCase() === 'free' ? 'Free' : `$${price}`;

  return (
    <div className="bg-card/95 border-border/80 fixed right-4 bottom-4 left-4 z-50 flex items-center justify-between rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-transform duration-300 lg:hidden">
      <div className="flex flex-col text-left">
        <span className="text-muted-foreground text-[9px] font-semibold tracking-wider uppercase">TICKET PRICE</span>
        <span className="text-foreground mt-1 text-xl leading-none font-extrabold">{displayPrice}</span>
      </div>
      <Link href={`/events/${id}/register`}>
        <Button size="sm" className="cursor-pointer rounded-lg bg-indigo-700 px-5 py-4.5 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-600 active:scale-95">
          Secure Spot
        </Button>
      </Link>
    </div>
  );
}
