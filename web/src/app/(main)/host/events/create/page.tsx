"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/organisms/header/header";
import { CreateEventForm } from "@/components/organisms/create-event-form/create-event-form";

export default function CreateEventPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
          <CreateEventForm />
        </div>
      </main>
    </div>
  );
}
