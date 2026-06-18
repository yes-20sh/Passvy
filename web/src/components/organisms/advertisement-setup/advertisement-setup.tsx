import React, { useState } from 'react';
import { Upload, ImageIcon, CalendarDays, Megaphone } from 'lucide-react';

import { Button } from '@/components/atoms/button/button';
import { Label } from '@/components/atoms/label/label';
import { Input } from '@/components/atoms/input/input';
import { TypographyH3, TypographyMuted } from '@/components/atoms/typography/typography';

type AdDuration = '1-day' | '1-week';
type ImageSource = 'header' | 'upload';

export const AdvertisementSetup = () => {
  const [duration, setDuration] = useState<AdDuration>('1-day');
  const [imageSource, setImageSource] = useState<ImageSource>('header');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const computeEndDate = () => {
    if (!startDate) return '';
    const date = new Date(startDate);
    if (isNaN(date.getTime())) return '';
    
    if (duration === '1-day') {
      date.setDate(date.getDate() + 1);
    } else {
      date.setDate(date.getDate() + 7);
    }
    return date.toISOString().split('T')[0];
  };

  const endDate = computeEndDate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Advertisement campaign for ${duration} created successfully!`);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <TypographyH3 className="font-bold border-0 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-500" /> Promote Event
        </TypographyH3>
        <TypographyMuted>Run targeted advertisements to boost your ticket sales.</TypographyMuted>
      </div>

      <div className="w-full mt-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Duration Selection */}
            <div className="space-y-4 pb-8 lg:pb-0 lg:pr-10 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-border">
                  <Label className="text-base font-semibold">Campaign Duration</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setDuration('1-day')}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        duration === '1-day' 
                          ? 'border-indigo-600 bg-indigo-600/5' 
                          : 'border-border bg-background hover:border-indigo-600/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-foreground">1 Day Boost</div>
                          <div className="text-sm text-muted-foreground mt-1">Quick spike in visibility</div>
                        </div>
                        <div className="font-bold text-lg">$19</div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-100 dark:bg-indigo-900/30 w-fit px-2 py-1 rounded">
                        <CalendarDays className="w-3 h-3 mr-1" /> 24 Hours
                      </div>
                    </div>

                    <div 
                      onClick={() => setDuration('1-week')}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        duration === '1-week' 
                          ? 'border-indigo-600 bg-indigo-600/5' 
                          : 'border-border bg-background hover:border-indigo-600/50'
                      }`}
                    >
                      {/* Popular Badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        MOST POPULAR
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-foreground">1 Week Campaign</div>
                          <div className="text-sm text-muted-foreground mt-1">Sustained reach & conversions</div>
                        </div>
                        <div className="font-bold text-lg">$99</div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-100 dark:bg-indigo-900/30 w-fit px-2 py-1 rounded">
                        <CalendarDays className="w-3 h-3 mr-1" /> 7 Days
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-foreground font-semibold">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="bg-background" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-foreground font-semibold">End Date (Auto-calculated)</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={endDate} 
                        className="bg-secondary/30 text-muted-foreground" 
                        readOnly 
                        disabled
                      />
                    </div>
                  </div>
            </div>

            {/* Creative Selection */}
            <div className="space-y-4 pt-8 lg:pt-0 lg:pl-10">
                  <Label className="text-base font-semibold">Ad Creative</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setImageSource('header')}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col items-center justify-center text-center h-32 ${
                        imageSource === 'header' 
                          ? 'border-indigo-600 bg-indigo-600/5' 
                          : 'border-border bg-background hover:border-indigo-600/50'
                      }`}
                    >
                      <ImageIcon className={`w-8 h-8 mb-2 ${imageSource === 'header' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                      <div className="font-semibold text-sm">Use Event Header</div>
                      <div className="text-xs text-muted-foreground mt-1">Automatically use your main banner</div>
                    </div>

                    <div 
                      onClick={() => setImageSource('upload')}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col items-center justify-center text-center h-32 ${
                        imageSource === 'upload' 
                          ? 'border-indigo-600 bg-indigo-600/5' 
                          : 'border-border bg-background hover:border-indigo-600/50'
                      }`}
                    >
                      <Upload className={`w-8 h-8 mb-2 ${imageSource === 'upload' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                      <div className="font-semibold text-sm">Upload Custom Poster</div>
                      <div className="text-xs text-muted-foreground mt-1">1080x1080px recommended</div>
                    </div>
                  </div>

                  {imageSource === 'upload' && (
                    <div className="mt-4 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-secondary/10 animate-in fade-in duration-300">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="font-medium text-sm">Click or drag image here</div>
                      <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</div>
                      <Button type="button" variant="outline" size="sm" className="mt-4">Select File</Button>
                    </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px] font-semibold rounded-full shadow-md shadow-indigo-600/20">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                      </span>
                    ) : (
                      `Add Campaign • ${duration === '1-day' ? '$19' : '$99'}`
                    )}
                  </Button>
                </div>
        </form>
      </div>
    </div>
  );
};
