import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/button/button";
import { Badge, BadgeVariant } from "@/components/atoms/badge/badge";
import { Image as ImageIcon, Percent, CalendarIcon, MapPin, Globe, Users, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { DescriptionBlock, EventPass, EventCoupon } from "@/interfaces/events/event.interface";

interface EventLivePreviewProps {
  title: string;
  headerImage: string;
  blocks: DescriptionBlock[];
  passes: EventPass[];
  coupons: EventCoupon[];
  startDate?: Date;
  startTime?: string;
  endDate?: Date;
  endTime?: string;
  category?: string;
  eventMode?: "ONLINE" | "OFFLINE";
  onlineLink?: string;
  offlineAddress?: string;
  capacity?: string;
  currentStep?: number;
}

export const EventLivePreview = ({
  title, headerImage, blocks, passes, coupons, startDate, startTime, endDate, endTime, category, eventMode, onlineLink, offlineAddress, capacity, currentStep = 1
}: EventLivePreviewProps) => {
  const hasEssentials = !!(title || startDate || endDate || category);
  const hasDescription = !!(headerImage || blocks.some(b => b.content?.trim()));
  const hasMode = !!(onlineLink || offlineAddress || capacity);
  const hasPasses = passes.length > 0 || coupons.length > 0;

  const showEssentials = currentStep >= 1 && hasEssentials;
  const showDescription = currentStep >= 2 && hasDescription;
  const showMode = currentStep >= 3 && hasMode;
  const showPasses = currentStep >= 4 && hasPasses;
  
  const showEmptyState = !showEssentials && !showDescription && !showMode && !showPasses;

  return (
    <div className="md:col-span-2 relative hidden md:block">
      <div className="sticky top-24 space-y-4 max-h-[85vh] overflow-y-auto pb-8 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Live Preview
            </h2>
            <p className="text-xs text-muted-foreground">
              This is how your event will appear to users.
            </p>
          </div>
          <Link href="/events/1" target="_blank">
            <Button type="button" className="h-8 px-3 text-xs font-bold bg-indigo-600/10 text-indigo-700 hover:bg-indigo-600/20 dark:bg-indigo-500/20 dark:text-indigo-400 border-0 rounded-lg">
              Full Preview
            </Button>
          </Link>
        </div>

        {showEmptyState && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/60 rounded-xl bg-card min-h-[250px] text-center gap-3 animate-in fade-in duration-300">
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CalendarIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground">Start filling the form</p>
              <p className="text-[10px] text-muted-foreground max-w-[200px] mx-auto">
                Your live preview will appear here side-by-side as you type.
              </p>
            </div>
          </div>
        )}

        {/* 1. Essentials Card */}
        {showEssentials && (
          <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            {(title || category) && (
              <div className="flex justify-between items-center gap-4">
                {title && (
                  <h3 className="font-bold text-foreground text-sm truncate">
                    {title}
                  </h3>
                )}
                {category && (
                  <Badge variant={BadgeVariant.Secondary} className="text-[10px] shrink-0 uppercase font-bold ml-auto">
                    {category}
                  </Badge>
                )}
              </div>
            )}
            
            {(startDate || endDate) && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-muted-foreground">
                {startDate && (
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                    <span>
                      {format(startDate, "MMM d, yyyy")}
                      {startTime ? ` • ${startTime}` : ''}
                    </span>
                  </div>
                )}
                {endDate && (
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                    <span>
                      to {format(endDate, "MMM d, yyyy")}
                      {endTime ? ` • ${endTime}` : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Description Card */}
        {showDescription && (
          <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-sm flex flex-col relative">
            {headerImage ? (
              <div className="relative h-48 w-full bg-muted shrink-0">
                <Image src={headerImage} alt="Header" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ) : (
              <div className="h-48 w-full bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground text-xs shrink-0 border-b border-border/40">
                <ImageIcon className="size-8 mb-2 opacity-50" />
                No Header Image
              </div>
            )}
            
            <div className="p-4 flex-1 space-y-4 bg-background">
              <div className="space-y-4 w-full">
                {blocks.map((b) => {
                  if (b.type === "HEADING" && b.content) {
                    const Tag = (b.level || "h2") as React.ElementType;
                    const sizeClass = 
                      b.level === "h1" ? "text-2xl" :
                      b.level === "h2" ? "text-xl" :
                      b.level === "h3" ? "text-lg" :
                      b.level === "h4" ? "text-base" :
                      b.level === "h5" ? "text-sm" : "text-xs";

                    return (
                      <Tag key={b.id} className={`${sizeClass} font-bold text-foreground break-words whitespace-pre-wrap`}>
                        {b.content}
                      </Tag>
                    );
                  }
                  if (b.type === "PARAGRAPH" && b.content) {
                    const textClass = 
                      b.textSize === "sm" ? "text-xs" :
                      b.textSize === "lg" ? "text-base" : "text-sm";
                    return (
                      <p key={b.id} className={`${textClass} text-muted-foreground leading-relaxed break-words whitespace-pre-wrap`}>
                        {b.content}
                      </p>
                    );
                  }
                  if (b.type === "LIST" && b.content) {
                    const items = b.content.split('\n').filter(item => item.trim() !== '');
                    if (b.listStyle === "decimal") {
                      return (
                        <ol key={b.id} className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {items.map((item, i) => <li key={i}>{item}</li>)}
                        </ol>
                      );
                    }
                    return (
                      <ul key={b.id} className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {items.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    );
                  }
                  if (b.type === "IMAGE" && b.content) {
                    return (
                      <div key={b.id} className="relative aspect-video rounded-xl overflow-hidden shadow-sm border border-border/40">
                        <Image src={b.content} fill alt="Preview image" className="object-cover" />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Mode Card */}
        {showMode && (
          <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              {eventMode === "ONLINE" && onlineLink && (
                <>
                  <Globe className="h-4 w-4 opacity-70" />
                  <span className="truncate font-medium">{onlineLink}</span>
                </>
              )}
              {eventMode === "OFFLINE" && offlineAddress && (
                <>
                  <MapPin className="h-4 w-4 opacity-70" />
                  <span className="truncate font-medium">{offlineAddress}</span>
                </>
              )}
            </div>
            
            {capacity && (
              <div className="flex items-center gap-1.5 shrink-0 font-bold bg-secondary/30 px-2 py-1 rounded-md text-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{capacity} Seats</span>
              </div>
            )}
          </div>
        )}

        {/* 4. Passes Card */}
        {showPasses && (
          <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4">
            {/* Passes Preview List */}
            {passes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground">Passes & Tickets</h3>
                {passes.map((pass) => (
                  <div key={pass.id} className="p-3 border border-indigo-500/30 bg-indigo-500/5 rounded-lg flex flex-col gap-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <Badge variant={null} className={`border-0 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                            pass.tier === "VIP" ? "bg-amber-500/20 text-amber-600" :
                            pass.tier === "VVIP" ? "bg-purple-500/20 text-purple-600" :
                            pass.tier === "CUSTOM" ? "bg-emerald-500/20 text-emerald-600" :
                            "bg-indigo-600/15 text-indigo-700"
                          }`}>
                            {pass.tier === "CUSTOM" ? "CUSTOM" : pass.tier}
                          </Badge>
                          <Badge variant={null} className="bg-emerald-500/15 text-emerald-700 border-0 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded">
                            {pass.category}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-foreground truncate max-w-[120px]">
                          {pass.tier === "CUSTOM" 
                            ? (pass.customName || "Custom Pass")
                            : pass.tier === "GA" ? "General Admission" 
                            : pass.tier === "VIP" ? "VIP Experience" 
                            : "Elite VVIP Access"}
                        </p>
                      </div>
                      <span className="text-sm font-black text-foreground">
                        {pass.pricing === "FREE" ? "Free" : `₹${pass.price || "0.00"}`}
                      </span>
                    </div>
                    {pass.quantity && (
                      <div className="text-[9px] font-semibold text-indigo-600/80 bg-indigo-600/10 w-fit px-1.5 py-0.5 rounded">
                        {pass.quantity} Tickets Left
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Coupons Preview List */}
            {coupons.length > 0 && coupons.some(c => c.code && c.discountValue) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                {coupons.map((coupon) => {
                  if (!coupon.code || !coupon.discountValue) return null;
                  return (
                    <Badge key={coupon.id} variant={BadgeVariant.Secondary} className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      {coupon.discountType === "AMOUNT" ? <IndianRupee className="size-2.5" /> : <Percent className="size-2.5" />}
                      {coupon.code} (-{coupon.discountValue}{coupon.discountType === "PERCENTAGE" ? "%" : ""})
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

