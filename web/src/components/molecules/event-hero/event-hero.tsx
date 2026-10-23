import React, { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/atoms/badge/badge';
import { Button } from '@/components/atoms/button/button';
import { Bookmark } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { SaveEventDocument } from '@/gql/graphql';

export interface EventHeroProps {
  image: string;
  title: string;
  tag: string;
  eventSlug: string;
  initialIsSaved?: boolean;
}

export function EventHero({ image, title, tag, eventSlug, initialIsSaved = false }: EventHeroProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [saveEvent] = useMutation(SaveEventDocument);
  const [prevInitial, setPrevInitial] = useState(initialIsSaved);

  if (initialIsSaved !== prevInitial) {
    setPrevInitial(initialIsSaved);
    setIsSaved(initialIsSaved);
  }

  const handleSaveToggle = async () => {
    setIsSaved(!isSaved); // Optimistic UI update
    try {
      await saveEvent({
        variables: {
          input: {
            eventSlug
          }
        }
      });
    } catch (error) {
      setIsSaved(isSaved); // Revert on failure
      console.error("Failed to save event", error);
    }
  };

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
          variant={null} // Keeping the same variant logic from original
          className="rounded-lg border-0 bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md"
        >
          {tag}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          className={`h-10 w-10 rounded-full border-0 bg-white shadow-md backdrop-blur-md transition-all hover:bg-gray-100 dark:bg-black/60 dark:hover:bg-black/80 z-10 ${isSaved ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-900 dark:text-zinc-100'}`}
          onClick={handleSaveToggle}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
