import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/atoms/badge/badge';

export interface EventHeroProps {
  image: string;
  title: string;
  tag: string;
}

export function EventHero({ image, title, tag }: EventHeroProps) {
  return (
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
          variant={null as any} // Keeping the same variant logic from original
          className="rounded-lg border-0 bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md"
        >
          {tag}
        </Badge>
      </div>
    </div>
  );
}
