import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/atoms/input/input";
import { TypographySpan } from "@/components/atoms/typography/typography";
import AVTAR from "@/assets/image/avtar";

export interface HeaderSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeaderSearch = ({ searchQuery, setSearchQuery }: HeaderSearchProps) => {
  return (
    <div className="hidden md:flex flex-1 max-w-xl relative items-center">
      <Input
        type="search"
        placeholder="Search passes, events, or hosts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-12 pr-14 h-12 w-full bg-secondary/15 border-border/80 focus-visible:ring-primary/45 focus-visible:border-primary/45 rounded-full text-base"
      />
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-foreground/55 z-10">
        <Search className="size-5" />
      </div>
      {/* Account Avatar inside search on the right */}
      <div className="absolute right-2 cursor-pointer">
        <div className="relative">
          <div className="h-8 w-8 rounded-full bg-secondary/30 border border-border overflow-hidden flex items-center justify-center hover:border-primary/50 transition-colors relative">
            <Image
              src={AVTAR.avtar}
              alt="Account Avatar"
              fill
              className="object-cover"
            />
          </div>
          <TypographySpan className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-background bg-emerald-500" />
        </div>
      </div>
    </div>
  );
};
