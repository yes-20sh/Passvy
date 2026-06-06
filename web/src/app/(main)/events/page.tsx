"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/template/protected-route/protected-route";
import { Header } from "@/components/organisms/header/header";
import { FeaturedEvents } from "@/components/organisms/featured-events/featured-events";
import { CategoryFilter } from "@/components/organisms/category-filter/category-filter";
import { EventsGrid } from "@/components/organisms/events-grid/events-grid";
import { MOCK_EVENTS, CATEGORIES } from "./data";

const EventsPage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFeaturedTab, setActiveFeaturedTab] = useState<
    "feature" | "wishlist" | "pass"
  >("feature");
  const [registeredIds, setRegisteredIds] = useState<string[]>(["1", "3", "5"]);

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

  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesCategory = selectedCategory
      ? event.tag.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    const matchesSearch = searchQuery
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.location &&
          event.location.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  const featuredEvents = MOCK_EVENTS.slice(0, 5);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="space-y-8">
            {!selectedCategory && !searchQuery && featuredEvents.length > 0 && (
              <FeaturedEvents
                activeFeaturedTab={activeFeaturedTab}
                setActiveFeaturedTab={setActiveFeaturedTab}
                featuredEvents={featuredEvents}
                mockEvents={MOCK_EVENTS}
                registeredIds={registeredIds}
                setRegisteredIds={setRegisteredIds}
              />
            )}

            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <EventsGrid
              filteredEvents={filteredEvents}
              setRegisteredIds={setRegisteredIds}
              setSearchQuery={setSearchQuery}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default EventsPage;
