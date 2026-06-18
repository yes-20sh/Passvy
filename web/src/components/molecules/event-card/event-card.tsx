import * as React from "react";
import Image from "next/image";
import { Calendar, MapPin, ArrowUpRight, Globe } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/atoms/card/card";

import { Button } from "@/components/atoms/button/button";
import { Badge, BadgeVariant } from "@/components/atoms/badge/badge";

export interface EventData {
  id: string;
  slug?: string | null;
  title: string;
  image: string;
  date: string;
  time: string;
  tag: string;
  price: string;
  location?: string;
  isOnline?: boolean;
  passCount?: number;
}

export interface EventCardProps {
  event: EventData;
  onRegister?: (eventId: string) => void;
  priority?: boolean;
  buttonText?: string;
  passLabel?: string;
}

export function EventCard({ event, onRegister, priority = false, buttonText = "Register Now", passLabel = "Passes" }: EventCardProps) {
  const { id, slug, title, image, date, time, tag, price, location, passCount, isOnline } = event;

  const handleRegisterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onRegister) {
      onRegister(event.id);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden bg-card/45 backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group p-2 rounded-xl gap-2">
      {/* Event Image Container */}
      <Link
        href={`/events/${slug || id}`}
        className="relative aspect-video w-full overflow-hidden bg-muted rounded-xl block"
      >
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 768px)  100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500"
        />
        {/* Subtle top overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />

        {/* Pass Count Badge */}
        <Badge className="absolute top-2 right-2 z-20 bg-background/80 text-foreground backdrop-blur-md border-0 pointer-events-none px-2 py-0.5 text-xs font-semibold">
          {passCount ?? 0} {passLabel}
        </Badge>
      </Link>

      <CardContent className="flex flex-col flex-1 px-0 pb-0 gap-3">
        {/* Title & Tag */}
        <div className="flex items-start justify-between gap-6">
          <Link href={`/events/${slug || id}`} className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-2 min-h-[2.75rem]">
              {title}
            </CardTitle>
          </Link>
          <Badge
            variant={null}
            className="shrink-0 border-foreground bg-transparent text-foreground text-xs px-2.5 py-1 rounded-lg font-semibold select-none"
          >
            {tag}
          </Badge>
        </div>

        {/* Date & Location row */}
        <div className="mt-auto text-[13px] text-muted-foreground flex flex-wrap items-center gap-y-1 gap-x-3">
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <Calendar className="size-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{date} • {time}</span>
          </div>
          {isOnline ? (
            <div className="flex items-center gap-1.5 truncate">
              <Globe className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">Online</span>
            </div>
          ) : location ? (
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex items-center mb-2 justify-between border-t-0 px-0 pb-0 mt-auto bg-transparent">
        <div className="flex flex-col">
          <Badge
            variant={BadgeVariant.Secondary}
            className="font-bold text-sm px-3 py-1 ring ring-border rounded-full pointer-events-none select-none border-0"
          >
            {price === "Free" || price.toLowerCase() === "free"
              ? "Free"
              : `$${price}`}
          </Badge>
        </div>
        <Button
          onClick={handleRegisterClick}
          size="sm"
          className="group/btn gap-1.5 bg-indigo-700 text-white hover:bg-indigo-600 active:translate-y-px transition-all rounded-full text-[13px] px-4 font-semibold shadow-sm"
        >
          <span>{buttonText}</span>
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
