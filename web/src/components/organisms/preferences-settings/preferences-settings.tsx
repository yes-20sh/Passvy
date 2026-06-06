"use client";

import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card/card";
import { TypographyMuted } from "@/components/atoms/typography/typography";
import { UpdateSettingsDocument, Theme } from "@/gql/graphql";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { useAppSelector } from "@/store/hooks/useAppSelector";
import { toggleThemeState } from "@/store/slices/themeSlice";

interface PreferencesSettingsProps {
  dbTheme?: string | null;
  onSuccess?: () => void;
}

const applyTheme = (targetTheme: Theme) => {
  if (typeof document !== "undefined") {
    if (targetTheme === "DARK") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }
};

export function PreferencesSettings({ onSuccess }: PreferencesSettingsProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const [updateSettings] = useMutation(UpdateSettingsDocument);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = async () => {
    const nextTheme: Theme = theme === "LIGHT" ? "DARK" : "LIGHT";
    dispatch(toggleThemeState());
    localStorage.setItem("theme", nextTheme.toLowerCase());

    try {
      const { data } = await updateSettings({
        variables: {
          input: { theme: nextTheme },
        },
      });

      if (data?.updateSettings?.success) {
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error("Failed to sync theme preference", {
        description: (err as Error).message || "Something went wrong syncing your theme.",
      });
    }
  };


  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your app preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-colors">
          <div className="space-y-0.5">
            <Label className="cursor-pointer" onClick={toggleTheme}>Theme</Label>
            <TypographyMuted className="text-xs">
              Toggle dark or light mode
            </TypographyMuted>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="rounded-full shadow-sm hover:scale-105 transition-transform"
          >
            {theme === "LIGHT" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
