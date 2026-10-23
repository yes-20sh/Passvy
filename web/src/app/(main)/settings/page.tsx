"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/organisms/header/header";
import { AvatarSettings } from "@/components/organisms/avatar-settings/avatar-settings";
import { PreferencesSettings } from "@/components/organisms/preferences-settings/preferences-settings";
import { EventPreferencesSettings } from "@/components/organisms/event-preferences-settings/event-preferences-settings";
import { PersonalInfoSettings } from "@/components/organisms/personal-info-settings/personal-info-settings";
import { SecuritySettings } from "@/components/organisms/security-settings/security-settings";
import { SettingsTemplate } from "@/components/template/settings-template/settings-template";
import { GetSettingsDocument, Theme } from "@/gql/graphql";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAppSelector } from "@/store/hooks/useAppSelector";
import { setThemeState, toggleThemeState } from "@/store/slices/themeSlice";
import { useQuery } from "@apollo/client/react";

import { ProtectedRoute } from "@/components/template/protected-route/protected-route";

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, loading, error } = useQuery(GetSettingsDocument);
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "LIGHT" ? "DARK" : "LIGHT";
    dispatch(toggleThemeState());
    localStorage.setItem("theme", nextTheme.toLowerCase());
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")?.toUpperCase() as Theme | null;
    const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "DARK"
      : "LIGHT";
    const dbTheme = data?.getSettings?.data?.theme as Theme | null;
    const initialTheme = dbTheme || savedTheme || systemTheme;
    dispatch(setThemeState(initialTheme));
  }, [data, dispatch]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "DARK") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);


  return (
    <ProtectedRoute>
      <SettingsTemplate
        title="Settings"
        description="Manage your account settings and preferences."
        loading={loading}
        error={error ? `Failed to load settings: ${error.message}` : null}
        header={
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            theme={theme.toLowerCase() as "light" | "dark"}
            toggleTheme={toggleTheme}
          />
        }
        sidebar={
          <>
            <AvatarSettings
              avatarUrl={data?.getSettings?.data?.avatar}
            />
            <PreferencesSettings
              key={data?.getSettings?.data?.theme || "theme"}
              dbTheme={data?.getSettings?.data?.theme}
            />
          </>
        }
        content={
          <>
            <EventPreferencesSettings
              key={data?.getSettings?.data?.eventPreferences?.join(",") || "event-preferences"}
              dbEventPreferences={data?.getSettings?.data?.eventPreferences}
            />
            <PersonalInfoSettings
              key={`${data?.getSettings?.data?.fullName || "name"}-${data?.getSettings?.data?.mobileNumber || "mobile"}`}
              email={data?.getSettings?.data?.email}
              fullName={data?.getSettings?.data?.fullName}
              mobileNumber={data?.getSettings?.data?.mobileNumber}
            />
            <SecuritySettings />
          </>
        }
      />
    </ProtectedRoute>
  );
}
