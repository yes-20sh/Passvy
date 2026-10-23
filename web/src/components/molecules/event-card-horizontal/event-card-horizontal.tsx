import * as React from "react";
import Image from "next/image";
import { Calendar, MapPin, ArrowUpRight, Bookmark } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/atoms/card/card";

import { Button } from "@/components/atoms/button/button";
import { Badge, BadgeVariant } from "@/components/atoms/badge/badge";
import { type EventData } from "@/components/molecules/event-card/event-card";

export interface EventCardHorizontalProps {
  event: EventData;
  onRegister?: (eventId: string) => void;
}

export function EventCardHorizontal({
  event,
  onRegister,
}: EventCardHorizontalProps) {
  const { id, title, image, date, tag, price, location } = event;

  const handleRegisterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onRegister) {
      onRegister(event.id);
    }
  };

  return (
    <Card className="flex flex-row h-[160px] sm:h-[180px] overflow-hidden bg-card/45 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group p-2 rounded-xl gap-3 sm:gap-4">
      {/* Event Image Container (Left) */}
      <Link href={`/events/${id}`} className="relative w-[110px] sm:w-[150px] h-full pb-2.5 shrink-0 block">
        <div className="relative w-full h-full overflow-hidden bg-muted rounded-xl">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
        </div>
      </Link>

      {/* Content Container (Right) */}
      <div className="flex flex-col flex-1 py-2 pr-1 overflow-hidden">
        <CardContent className="flex flex-col flex-1 px-0 pb-0 gap-1.5 sm:gap-2">
          {/* Tag & Title */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center justify-between w-full">
              <Badge
                variant={null}
                className="shrink-0 border-foreground bg-transparent text-foreground text-xs px-2.5 py-1 rounded-lg font-semibold select-none"
              >
                {tag}
              </Badge>
              <button
                type="button"
                className="text-indigo-600 dark:text-indigo-400 hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer pr-1"
                aria-label="Save event"
              >
                <Bookmark className="size-5 fill-indigo-600 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400" />
              </button>
            </div>
            <Link href={`/events/${id}`} className="w-full">
              <CardTitle className="text-sm sm:text-base font-bold leading-tight tracking-tight text-foreground line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {title}
              </CardTitle>
            </Link>
          </div>

          {/* Date & Location row */}
          <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-3">
            <div className="flex items-center gap-1.5 font-medium shrink-0">
              <Calendar className="size-3 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate">{date}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="size-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t-0 px-0 pb-0 mt-auto bg-transparent pt-2 gap-2">
          <Badge
            variant={BadgeVariant.Secondary}
            className="font-bold text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 ring ring-border rounded-full pointer-events-none select-none border-0"
          >
            {price === "Free" || price.toLowerCase() === "free"
              ? "Free"
              : `$${price}`}
          </Badge>
          <Button
            onClick={handleRegisterClick}
            size="sm"
            className="group/btn gap-1 bg-indigo-700 text-white hover:bg-indigo-600 active:translate-y-px transition-all rounded-full text-[11px] sm:text-xs px-2.5 sm:px-4 font-semibold shadow-sm h-7 sm:h-8"
          >
            <span>Register</span>
            <ArrowUpRight className="size-3 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

