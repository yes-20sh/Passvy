'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/organisms/header/header';
import { HostEventsList } from '@/components/organisms/host-events-list/host-events-list';

const HostEventsPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const initialTheme = (savedTheme as 'light' | 'dark') || systemTheme;

    setTimeout(() => {
      setTheme(initialTheme);
    }, 0);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors duration-200">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Your Hosted Events
            </h2>
            <p className="text-muted-foreground">
              Manage your past, upcoming, and ongoing events from one place.
            </p>
          </div>

          <HostEventsList searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
};

export default HostEventsPage;
