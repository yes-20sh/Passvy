import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/card/card';
import { Input } from '@/components/atoms/input/input';
import { Button } from '@/components/atoms/button/button';
import { Label } from '@/components/atoms/label/label';
import { Textarea } from '@/components/atoms/textarea/textarea';
import { TypographyH3, TypographyMuted } from '@/components/atoms/typography/typography';

export const EditEventForm = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Add success toast here
      alert('Event details updated successfully!');
    }, 1500);
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <TypographyH3 className="font-bold border-0">Edit Event Details</TypographyH3>
        <TypographyMuted>Update the core information about your event.</TypographyMuted>
      </div>

      <Card className="border-border bg-card/50 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground font-semibold">Event Title</Label>
              <Input id="title" defaultValue="HTML5 Workshop" className="bg-background max-w-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground font-semibold">Date</Label>
                <Input id="date" type="date" defaultValue="2026-10-15" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-foreground font-semibold">Time</Label>
                <Input id="time" type="time" defaultValue="14:00" className="bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground font-semibold">Location / Link</Label>
              <Input id="location" defaultValue="San Francisco, CA" className="bg-background max-w-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-semibold">Short Description</Label>
              <Textarea 
                id="description" 
                defaultValue="Join us for the highly anticipated HTML5 workshop! This premium event brings together industry experts..."
                className="bg-background min-h-[120px] resize-y" 
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-4">
              <Button type="button" variant="ghost">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
