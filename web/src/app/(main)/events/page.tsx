"use client";

import React, { useState, useEffect } from "react";
import { Search, Ticket, User, Sun, Moon, Menu } from "lucide-react";
import { Input } from "@/components/atoms/input";

const EventsPage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = (savedTheme as "light" | "dark") || systemTheme;

    setTimeout(() => {
      setTheme(initialTheme);
    }, 0);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
          {/* Left Section: Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
              <div className="h-8 w-8 rounded-lg bg-indigo-700 flex items-center justify-center text-white">
                <Ticket className="size-5" />
              </div>
              <span>Passvy</span>
            </div>
          </div>

          {/* Center Section: Search Bar with Account Avatar inside on the right */}
          <div className="flex-1 max-w-xl relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
              <Search className="size-5" />
            </div>
            <Input
              type="search"
              placeholder="Search passes, events, or hosts..."
              className="pl-12 pr-14 h-12 w-full bg-secondary/15 border-border/80 focus-visible:ring-primary/45 focus-visible:border-primary/45 rounded-full text-base"
            />
            {/* Account Avatar inside search on the right */}
            <div className="absolute right-2 cursor-pointer">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-secondary/30 border border-border overflow-hidden flex items-center justify-center hover:border-primary/50 transition-colors">
                  <User className="size-4.5 text-muted-foreground" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-background bg-emerald-500" />
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
            <button
              className="flex items-center gap-5 p-1 pl-3 border border-border hover:shadow-sm rounded-full transition-all cursor-pointer bg-secondary/10 hover:bg-secondary/20"
              aria-label="User menu"
            >
              <Menu className="size-5 text-muted-foreground" />
              <div className="h-7 w-7 rounded-full bg-indigo-700 flex items-center justify-center text-white">
                <Ticket className="size-4" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Active Events</h2>
          <p className="text-muted-foreground">
            Manage your hosts, active digital passes, and event entry
            validations.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;
