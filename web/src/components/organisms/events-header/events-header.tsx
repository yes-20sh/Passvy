import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Ticket, Sun, Moon, Menu, Calendar } from "lucide-react";
import { Input } from "@/components/atoms/input/input";
import { TypographySpan } from "@/components/atoms/typography/typography";
import AVTAR from "@/assets/image/avtar";

export interface EventsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const EventsHeader = ({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
}: EventsHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-indigo-700 flex items-center justify-center text-white">
              <Ticket className="size-5" />
            </div>
            <TypographySpan>Passvy</TypographySpan>
          </div>
        </div>

        {/* Center Section: Search Bar with Account Avatar inside on the right */}
        <div className="flex-1 max-w-xl relative flex items-center">
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

        {/* Right Section: Theme Toggle & Menu Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </button>

          {/* Menu & Pass Icon Group */}
          <div className="flex items-center gap-5 p-1 pl-3 border border-border hover:shadow-sm rounded-full transition-all bg-secondary/10 hover:bg-secondary/20 relative" ref={menuRef}>
            <button 
              aria-label="User menu" 
              className="cursor-pointer outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-[120%] left-0 w-48 bg-background border border-border rounded-xl shadow-lg p-1 z-50 flex flex-col">
                <Link href="/profile" className="px-3 py-1.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-primary transition-colors rounded-md">
                  My Profile
                </Link>
                <Link href="/settings" className="px-3 py-1.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-primary transition-colors rounded-md">
                  Settings
                </Link>
                <Link href="/my-passes" className="px-3 py-1.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-primary transition-colors rounded-md">
                  My Passes
                </Link>
                <div className="h-px bg-border my-1 mx-1"></div>
                <button className="text-left px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full rounded-md">
                  Logout
                </button>
              </div>
            )}

            <Link href="/host/events">
              <div className="cursor-pointer h-7 px-3 gap-1.5 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center text-white font-semibold shadow-sm">
                <Calendar className="size-3.5" />
                <TypographySpan className="text-[11px] leading-none">Host Event</TypographySpan>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

