import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Heart } from 'lucide-react';

export function EventDetailHeader() {
  return (
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
  );
}
