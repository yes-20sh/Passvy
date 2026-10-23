"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks/useAppSelector";
import { useQuery } from "@apollo/client/react";
import { GetEventsListDocument } from "@/gql/graphql";

import { Header } from "@/components/organisms/header/header";
import { FeaturedEvents } from "@/components/organisms/featured-events/featured-events";
import { CategoryFilter } from "@/components/organisms/category-filter/category-filter";
import { EventsGrid } from "@/components/organisms/events-grid/events-grid";
import { EventsTemplate } from "@/components/template/events-template/events-template";
import { CATEGORIES } from "./data";
import { Loader2 } from "lucide-react";

const EventsPage = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFeaturedTab, setActiveFeaturedTab] = useState<
    "feature" | "wishlist" | "pass"
  >("feature");
  const [registeredIds, setRegisteredIds] = useState<string[]>(["1", "3", "5"]);

  const { data, loading, error } = useQuery(GetEventsListDocument, {
    variables: {
      input: {
        limit: 50,
      },
    },
  });

  const apiEvents = React.useMemo(() => {
    const formatTime12hr = (timeStr?: string | null) => {
      if (!timeStr) return "TBA";
      const parts = timeStr.split(":");
      if (parts.length >= 2) {
        const h = parseInt(parts[0], 10);
        const m = parts[1];
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${m} ${ampm}`;
      }
      return timeStr;
    };

    return (
      data?.getEventsList?.events?.map((event) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        image:
          event.headerImage ||
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
        date: event.startDate
          ? new Date(event.startDate as string).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "TBA",
        time: formatTime12hr(event.startTime),
        tag: event.category || "General",
        price: event.passes?.[0]?.price?.toString() || "Free",
        location: event.mode?.city
          ? `${event.mode.city}${event.mode.state ? `, ${event.mode.state}` : ""}`
          : "TBD",
        isOnline: event.mode?.eventMode === "ONLINE",
      })) || []
    );
  }, [data]);

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

  const filteredEvents = apiEvents.filter((event) => {
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

  const featuredEvents = apiEvents.slice(0, 5);

  if (error) {
    console.error("Failed to load events:", error);
  }

  return (
    <EventsTemplate
      header={
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      }
      content={
        loading ? (
          <div className="flex w-full items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : undefined
      }
      featuredEvents={
        !selectedCategory && !searchQuery && featuredEvents.length > 0 && !loading ? (
          <FeaturedEvents
            activeFeaturedTab={activeFeaturedTab}
            setActiveFeaturedTab={setActiveFeaturedTab}
            featuredEvents={featuredEvents}
            mockEvents={apiEvents}
            registeredIds={registeredIds}
            setRegisteredIds={setRegisteredIds}
            isAuthenticated={isAuthenticated}
          />
        ) : undefined
      }
      categoryFilter={
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      }
      eventsGrid={
        !loading ? (
          <EventsGrid
            filteredEvents={filteredEvents}
            setRegisteredIds={setRegisteredIds}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
          />
        ) : undefined
      }
    />
  );
};

export default EventsPage;
