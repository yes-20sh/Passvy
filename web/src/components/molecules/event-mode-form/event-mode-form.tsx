import React from "react";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Globe, MapPin, Users, Link as LinkIcon, Map, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventModeFormProps {
  eventMode: "ONLINE" | "OFFLINE";
  setEventMode: (mode: "ONLINE" | "OFFLINE") => void;
  onlineLink: string;
  setOnlineLink: (link: string) => void;
  offlineAddress: string;
  setOfflineAddress: (address: string) => void;
  offlineMapLink: string;
  setOfflineMapLink: (link: string) => void;
  offlineLandmark: string;
  setOfflineLandmark: (landmark: string) => void;
  capacity: string;
  setCapacity: (capacity: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const EventModeForm = ({
  eventMode,
  setEventMode,
  onlineLink,
  setOnlineLink,
  offlineAddress,
  setOfflineAddress,
  offlineMapLink,
  setOfflineMapLink,
  offlineLandmark,
  setOfflineLandmark,
  capacity,
  setCapacity,
  onNext,
  onBack
}: EventModeFormProps) => {

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* HEADER */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 3
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Event Mode & Location
          </h2>
          <p className="text-xs text-muted-foreground">
            Where will your event take place?
          </p>
        </div>

        {/* MODE SELECTOR */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setEventMode("ONLINE")}
            className={cn(
              "flex flex-row items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer",
              eventMode === "ONLINE"
                ? "border-indigo-600 bg-indigo-600/5 text-indigo-700 dark:text-indigo-400"
                : "border-border/60 bg-card hover:bg-secondary/40 text-muted-foreground"
            )}
          >
            <Globe className={cn("size-5", eventMode === "ONLINE" ? "opacity-100" : "opacity-50")} />
            <span className="font-bold text-sm">Online Event</span>
          </button>
          
          <button
            type="button"
            onClick={() => setEventMode("OFFLINE")}
            className={cn(
              "flex flex-row items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer",
              eventMode === "OFFLINE"
                ? "border-emerald-600 bg-emerald-600/5 text-emerald-700 dark:text-emerald-500"
                : "border-border/60 bg-card hover:bg-secondary/40 text-muted-foreground"
            )}
          >
            <MapPin className={cn("size-5", eventMode === "OFFLINE" ? "opacity-100" : "opacity-50")} />
            <span className="font-bold text-sm">In-Person Event</span>
          </button>
        </div>

        <div className="space-y-6 pt-4 border-t border-border/40 mt-4">
          {eventMode === "ONLINE" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-3">
                <Label htmlFor="onlineLink">Meeting Link (Google Meet, Zoom, etc.)</Label>
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-3 size-4 text-muted-foreground" />
                  <Input
                    id="onlineLink"
                    placeholder="https://meet.google.com/..."
                    value={onlineLink}
                    onChange={(e) => setOnlineLink(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {eventMode === "OFFLINE" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-3">
                <Label htmlFor="offlineAddress">Venue Address</Label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 size-4 text-muted-foreground" />
                  <Input
                    id="offlineAddress"
                    placeholder="123 Event Street, City..."
                    value={offlineAddress}
                    onChange={(e) => setOfflineAddress(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="offlineMapLink">Google Maps Link</Label>
                  <div className="relative flex items-center">
                    <Map className="absolute left-3 size-4 text-muted-foreground" />
                    <Input
                      id="offlineMapLink"
                      placeholder="https://maps.google.com/..."
                      value={offlineMapLink}
                      onChange={(e) => setOfflineMapLink(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="offlineLandmark">Landmark (Optional)</Label>
                  <div className="relative flex items-center">
                    <Navigation className="absolute left-3 size-4 text-muted-foreground" />
                    <Input
                      id="offlineLandmark"
                      placeholder="Near Central Park..."
                      value={offlineLandmark}
                      onChange={(e) => setOfflineLandmark(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SHARED FIELDS */}
          <div className="space-y-3">
            <Label htmlFor="capacity">Total Capacity / Seats</Label>
            <div className="relative flex items-center">
              <Users className="absolute left-3 size-4 text-muted-foreground" />
              <Input
                id="capacity"
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="pl-10 w-[200px]"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Leave empty for unlimited capacity.</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
