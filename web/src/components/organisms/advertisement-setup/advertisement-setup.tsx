import React, { useState } from 'react';
import { Upload, ImageIcon, CalendarDays, Megaphone } from 'lucide-react';
import Image from 'next/image';

import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { 
  GetEventPromotionsDocument, 
  PromoteEventDocument,
  PromotionDuration,
  PromotionImageSource
} from '@/gql/graphql';

import { Button } from '@/components/atoms/button/button';
import { Label } from '@/components/atoms/label/label';
import { Input } from '@/components/atoms/input/input';
import { TypographyH3, TypographyMuted } from '@/components/atoms/typography/typography';
import { Card } from '@/components/atoms/card/card';

export const AdvertisementSetup = () => {
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('slug') || '';

  const [duration, setDuration] = useState<PromotionDuration>('ONE_DAY');
  const [imageSource, setImageSource] = useState<PromotionImageSource>('HEADER');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const computeEndDate = () => {
    if (!startDate) return '';
    const date = new Date(startDate);
    if (isNaN(date.getTime())) return '';
    
    if (duration === 'ONE_DAY') {
      date.setDate(date.getDate() + 1);
    } else {
      date.setDate(date.getDate() + 7);
    }
    return date.toISOString().split('T')[0];
  };

  const endDate = computeEndDate();

  const [promoteEvent, { loading: isSubmitting }] = useMutation(PromoteEventDocument, {
    refetchQueries: [
      { query: GetEventPromotionsDocument, variables: { eventSlug } }
    ]
  });

  const { data: promotionsData } = useQuery(GetEventPromotionsDocument, {
    variables: { eventSlug },
    skip: !eventSlug,
    fetchPolicy: 'cache-and-network',
  });

  const promotions = promotionsData?.getEventPromotions || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventSlug || !startDate) return;

    try {
      await promoteEvent({
        variables: {
          input: {
            eventSlug,
            duration,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            imageSource,
            ...(imageSource === 'UPLOAD' && imageUrl ? { imageUrl } : {}),
          }
        }
      });
      alert(`Advertisement campaign created successfully!`);
    } catch (error) {
      console.error(error);
      alert('Failed to create campaign. Please try again.');
    }
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
                      onClick={() => setDuration('ONE_DAY')}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        duration === 'ONE_DAY' 
                          ? 'border-indigo-600 bg-indigo-600/5' 
                          : 'border-border bg-background hover:border-indigo-600/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-foreground">1 Day Boost</div>
                          <div className="text-sm text-muted-foreground mt-1">Quick spike in visibility</div>
                        </div>
                        <div className="font-bold text-lg text-emerald-500">Free</div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-100 dark:bg-indigo-900/30 w-fit px-2 py-1 rounded">
                        <CalendarDays className="w-3 h-3 mr-1" /> 24 Hours
                      </div>
                    </div>

                    <div 
                      onClick={() => setDuration('ONE_WEEK')}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        duration === 'ONE_WEEK' 
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
                        <div className="font-bold text-lg text-emerald-500">Free</div>
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
                      onClick={() => setImageSource('HEADER')}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col items-center justify-center text-center h-32 ${
                        imageSource === 'HEADER' 
                          ? 'border-indigo-600 bg-indigo-600/5' 
                          : 'border-border bg-background hover:border-indigo-600/50'
                      }`}
                    >
                      <ImageIcon className={`w-8 h-8 mb-2 ${imageSource === 'HEADER' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                      <div className="font-semibold text-sm">Use Event Header</div>
                      <div className="text-xs text-muted-foreground mt-1">Automatically use your main banner</div>
                    </div>

                    <div 
                      onClick={() => setImageSource('UPLOAD')}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col items-center justify-center text-center h-32 ${
                        imageSource === 'UPLOAD' 
                          ? 'border-indigo-600 bg-indigo-600/5' 
                          : 'border-border bg-background hover:border-indigo-600/50'
                      }`}
                    >
                      <Upload className={`w-8 h-8 mb-2 ${imageSource === 'UPLOAD' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                      <div className="font-semibold text-sm">Upload Custom Poster</div>
                      <div className="text-xs text-muted-foreground mt-1">1080x1080px recommended</div>
                    </div>
                  </div>

                  {imageSource === 'UPLOAD' && (
                    <div className="mt-4 animate-in fade-in duration-300">
                      {imageUrl ? (
                        <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-xl border border-border shadow-sm group">
                          <Image
                            src={imageUrl}
                            alt="Custom Poster Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label htmlFor="customPoster" className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all">
                              Change Image
                            </label>
                          </div>
                          <input
                            id="customPoster"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      ) : (
                        <label 
                          htmlFor="customPoster" 
                          className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="font-medium text-sm">Click or drag image here</div>
                          <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</div>
                          <div className="mt-4 px-3 py-1.5 border border-input rounded-md text-sm font-medium shadow-sm bg-background">Select File</div>
                          <input
                            id="customPoster"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  )}
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !startDate} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px] font-semibold rounded-full shadow-md shadow-indigo-600/20">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                      </span>
                    ) : (
                      'Add Campaign'
                    )}
                  </Button>
                </div>
        </form>
      </div>

      {promotions.length > 0 && (
        <div className="mt-12">
          <TypographyH3 className="font-bold border-0 mb-4 text-lg">Active Campaigns</TypographyH3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <Card key={promo.id} className="p-4 border-border/80 shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{promo.duration === 'ONE_DAY' ? '1 Day Boost' : '1 Week Campaign'}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(promo.startDate as string).toLocaleDateString()} - {new Date(promo.endDate as string).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
