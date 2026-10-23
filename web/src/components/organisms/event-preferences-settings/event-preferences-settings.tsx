"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/atoms/card/card";
import { Badge, BadgeVariant } from "@/components/atoms/badge/badge";
import { UpdateSettingsDocument } from "@/gql/graphql";

const EVENT_CATEGORIES = [
  "Music",
  "Technology",
  "Sports",
  "Arts & Culture",
  "Business",
  "Food & Drink",
  "Networking",
  "Education",
  "Health & Wellness",
];

interface EventPreferencesSettingsProps {
  dbEventPreferences?: string[] | null;
  onSuccess?: () => void;
}

export function EventPreferencesSettings({
  dbEventPreferences,
  onSuccess,
}: EventPreferencesSettingsProps) {
  const [eventPreferences, setEventPreferences] = useState<string[]>(
    dbEventPreferences || []
  );
  const [updateSettings, { loading }] = useMutation(UpdateSettingsDocument);


  const toggleEventPreference = (category: string) => {
    setEventPreferences((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    try {
      const { data } = await updateSettings({
        variables: {
          input: { eventPreferences },
        },
      });

      if (data?.updateSettings?.success) {
        toast.success("Success", {
          description: "Event preferences updated successfully.",
        });
        if (onSuccess) onSuccess();
      } else {
        toast.error("Update failed", {
          description: data?.updateSettings?.message || "Could not save preferences.",
        });
      }
    } catch (err) {
      toast.error("Save failed", {
        description: (err as Error).message || "Something went wrong saving preferences.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Preferences</CardTitle>
        <CardDescription>
          Select the types of events you are interested in attending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {EVENT_CATEGORIES.map((category) => {
            const isSelected = eventPreferences.includes(category);
            return (
              <Badge
                key={category}
                variant={isSelected ? BadgeVariant.Default : BadgeVariant.Outline}
                className="cursor-pointer text-sm py-1.5 px-4 transition-all hover:ring-2 hover:ring-indigo-500"
                onClick={() => toggleEventPreference(category)}
              >
                {category}
              </Badge>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-border/50 pt-5 pb-5 px-6 bg-muted/20">
        <Button
          onClick={handleSave}
          loading={loading}
          className="shadow-sm hover:shadow transition-all"
        >
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
