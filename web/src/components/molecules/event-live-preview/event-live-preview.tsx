import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/atoms/button/button';
import { Badge, BadgeVariant } from '@/components/atoms/badge/badge';
import {
  Image as ImageIcon,
  Percent,
  CalendarIcon,
  MapPin,
  Globe,
  Users,
  IndianRupee,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DescriptionBlock,
  EventPass,
  EventCoupon,
} from '@/interfaces/events/event.interface';

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
  eventMode?: 'ONLINE' | 'OFFLINE';
  meetingStartDate?: Date;
  meetingStartTime?: string;
  meetingEndDate?: Date;
  meetingEndTime?: string;
  onlineLink?: string;
  offlineAddress?: string;
  capacity?: string;
  currentStep?: number;
}

export const EventLivePreview = ({
  title,
  headerImage,
  blocks,
  passes,
  coupons,
  startDate,
  startTime,
  endDate,
  endTime,
  category,
  eventMode,
  meetingStartDate,
  meetingStartTime,
  meetingEndDate,
  meetingEndTime,
  onlineLink,
  offlineAddress,
  capacity,
  currentStep = 1,
}: EventLivePreviewProps) => {
  const hasEssentials = !!(title || startDate || endDate || category);
  const hasDescription = !!(
    headerImage || blocks.some((b) => b.content?.trim())
  );
  const hasMode = !!(eventMode || onlineLink || offlineAddress || capacity);
  const hasPasses = passes.length > 0 || coupons.length > 0;

  const showEssentials = currentStep >= 1 && hasEssentials;
  const showDescription = currentStep >= 2 && hasDescription;
  const showMode = currentStep >= 3 && hasMode;
  const showPasses = currentStep >= 4 && hasPasses;

  const showEmptyState =
    !showEssentials && !showDescription && !showMode && !showPasses;

  return (
    <div className="relative hidden md:col-span-2 md:block">
      <div className="scrollbar-thumb-border sticky top-24 max-h-[85vh] scrollbar-thin scrollbar-track-transparent space-y-4 overflow-y-auto pr-2 pb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-foreground text-xl font-black tracking-tight">
              Live Preview
            </h2>
            <p className="text-muted-foreground text-xs">
              This is how your event will appear to users.
            </p>
          </div>
          <Link href="/events/1" target="_blank">
            <Button
              type="button"
              className="h-8 rounded-lg border-0 bg-indigo-600/10 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-600/20 dark:bg-indigo-500/20 dark:text-indigo-400"
            >
              Full Preview
            </Button>
          </Link>
        </div>

        {showEmptyState && (
          <div className="border-border/60 bg-card animate-in fade-in flex min-h-[250px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center duration-300">
            <div className="rounded-full bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
              <CalendarIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-xs font-bold">
                Start filling the form
              </p>
              <p className="text-muted-foreground mx-auto max-w-[200px] text-[10px]">
                Your live preview will appear here side-by-side as you type.
              </p>
            </div>
          </div>
        )}

        {/* 1. Essentials Card */}
        {showEssentials && (
          <div className="bg-card border-border/60 flex flex-col gap-3 rounded-xl border p-4 shadow-sm">
            {(title || category) && (
              <div className="flex items-center justify-between gap-4">
                {title && (
                  <h3 className="text-foreground truncate text-sm font-bold">
                    {title}
                  </h3>
                )}
                {category && (
                  <Badge
                    variant={BadgeVariant.Secondary}
                    className="ml-auto shrink-0 text-[10px] font-bold uppercase"
                  >
                    {category}
                  </Badge>
                )}
              </div>
            )}

            {(startDate || endDate) && (
              <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-6">
                {startDate && (
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                    <span>
                      {format(startDate, 'MMM d, yyyy')}
                      {startTime ? ` • ${startTime}` : ''}
                    </span>
                  </div>
                )}
                {endDate && (
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 opacity-70" />
                    <span>
                      to {format(endDate, 'MMM d, yyyy')}
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
          <div className="border-border/60 bg-card relative flex flex-col overflow-hidden rounded-xl border shadow-sm">
            {headerImage ? (
              <div className="bg-muted relative h-48 w-full shrink-0">
                <Image
                  src={headerImage}
                  alt="Header"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ) : (
              <div className="bg-secondary/20 text-muted-foreground border-border/40 flex h-48 w-full shrink-0 flex-col items-center justify-center border-b text-xs">
                <ImageIcon className="mb-2 size-8 opacity-50" />
                No Header Image
              </div>
            )}

            <div className="bg-background flex-1 space-y-4 p-4">
              <div className="w-full space-y-4">
                {blocks.map((b) => {
                  if (b.type === 'HEADING' && b.content) {
                    const Tag = (b.level || 'h2') as React.ElementType;
                    const sizeClass =
                      b.level === 'h1'
                        ? 'text-2xl'
                        : b.level === 'h2'
                          ? 'text-xl'
                          : b.level === 'h3'
                            ? 'text-lg'
                            : b.level === 'h4'
                              ? 'text-base'
                              : b.level === 'h5'
                                ? 'text-sm'
                                : 'text-xs';

                    return (
                      <Tag
                        key={b.id}
                        className={`${sizeClass} text-foreground font-bold break-words whitespace-pre-wrap`}
                      >
                        {b.content}
                      </Tag>
                    );
                  }
                  if (b.type === 'PARAGRAPH' && b.content) {
                    const textClass =
                      b.textSize === 'sm'
                        ? 'text-xs'
                        : b.textSize === 'lg'
                          ? 'text-base'
                          : 'text-sm';
                    return (
                      <p
                        key={b.id}
                        className={`${textClass} text-muted-foreground leading-relaxed break-words whitespace-pre-wrap`}
                      >
                        {b.content}
                      </p>
                    );
                  }
                  if (b.type === 'LIST' && b.content) {
                    const items = b.content
                      .split('\n')
                      .filter((item) => item.trim() !== '');
                    if (b.listStyle === 'decimal') {
                      return (
                        <ol
                          key={b.id}
                          className="text-muted-foreground list-inside list-decimal space-y-1 text-sm"
                        >
                          {items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      );
                    }
                    return (
                      <ul
                        key={b.id}
                        className="text-muted-foreground list-inside list-disc space-y-1 text-sm"
                      >
                        {items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (b.type === 'IMAGE' && b.content) {
                    return (
                      <div
                        key={b.id}
                        className="border-border/40 relative aspect-video overflow-hidden rounded-xl border shadow-sm"
                      >
                        <Image
                          src={b.content}
                          fill
                          alt="Preview image"
                          className="object-cover"
                        />
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
          <div className="bg-card border-border/60 text-muted-foreground flex flex-col justify-between gap-4 rounded-xl border p-4 text-xs shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 truncate">
              {eventMode === 'ONLINE' && (
                <>
                  <Globe className="h-4 w-4 opacity-70" />
                  <div className="flex flex-col gap-0.5">
                    <span className="truncate font-medium">
                      {onlineLink || 'Online Meeting'}
                    </span>
                    {meetingStartDate && meetingStartTime && (
                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        {format(meetingStartDate, 'MMM d, yyyy')} •{' '}
                        {meetingStartTime}
                        {meetingEndTime && ` - ${meetingEndTime}`}
                      </span>
                    )}
                  </div>
                </>
              )}
              {eventMode === 'OFFLINE' && offlineAddress && (
                <>
                  <MapPin className="h-4 w-4 opacity-70" />
                  <span className="truncate font-medium">{offlineAddress}</span>
                </>
              )}
            </div>

            {capacity && (
              <div className="bg-secondary/30 text-foreground flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-bold">
                <Users className="h-3.5 w-3.5" />
                <span>{capacity} Seats</span>
              </div>
            )}
          </div>
        )}

        {/* 4. Passes Card */}
        {showPasses && (
          <div className="bg-card border-border/60 space-y-4 rounded-xl border p-4 shadow-sm">
            {/* Passes Preview List */}
            {passes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-foreground text-sm font-bold">
                  Passes & Tickets
                </h3>
                <div className="grid gap-3">
                  {passes.map((pass) => (
                    <div
                      key={pass.id}
                      className="border-border/60 bg-card group relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-md"
                    >
                      {/* Ticket notches */}
                      <div className="bg-background border-border/60 absolute top-1/2 -left-2 z-10 h-4 w-4 -translate-y-1/2 rounded-full border-r transition-colors group-hover:border-indigo-500/40" />
                      <div className="bg-background border-border/60 absolute top-1/2 -right-2 z-10 h-4 w-4 -translate-y-1/2 rounded-full border-l transition-colors group-hover:border-indigo-500/40" />

                      {/* Ticket Body */}
                      <div className="border-border/60 flex items-center justify-between border-b border-dashed bg-gradient-to-br from-indigo-500/5 to-transparent p-3">
                        <div className="space-y-1.5">
                          <Badge
                            variant={null}
                            className={`rounded-md border-0 px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${
                              pass.tier === 'VIP'
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : pass.tier === 'VVIP'
                                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                  : pass.tier === 'CUSTOM'
                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-indigo-600/15 text-indigo-700 dark:text-indigo-400'
                            }`}
                          >
                            {pass.tier === 'CUSTOM'
                              ? pass.customName || 'CUSTOM'
                              : pass.tier}
                          </Badge>
                          <p className="text-foreground max-w-[140px] truncate text-xs font-bold">
                            {pass.tier === 'CUSTOM'
                              ? pass.customName || 'Custom Pass'
                              : pass.tier === 'GA'
                                ? 'General Admission'
                                : pass.tier === 'VIP'
                                  ? 'VIP Experience'
                                  : 'Elite VVIP Access'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-foreground block text-sm font-black">
                            {pass.pricing === 'FREE'
                              ? 'Free'
                              : `₹${pass.price || '0.00'}`}
                          </span>
                        </div>
                      </div>

                      {/* Ticket Footer */}
                      <div className="bg-card/50 flex items-center justify-between p-2.5 px-3">
                        <Badge
                          variant={null}
                          className="bg-secondary/50 text-muted-foreground rounded border-0 px-1.5 py-0.5 text-[8px] font-bold uppercase"
                        >
                          {pass.category}
                        </Badge>
                        {pass.quantity && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600/80 dark:text-indigo-400/80">
                            <span className="size-1.5 animate-pulse rounded-full bg-indigo-500/50" />
                            {pass.quantity} Pass
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupons Preview List */}
            {coupons.length > 0 &&
              coupons.some((c) => c.code && c.discountValue) && (
                <div className="border-border/40 space-y-2 border-t pt-4">
                  <h3 className="text-foreground text-sm font-bold">
                    Promo Codes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coupons.map((coupon) => {
                      if (!coupon.code || !coupon.discountValue) return null;
                      return (
                        <div
                          key={coupon.id}
                          className="bg-card border-border/60 flex items-center gap-2 rounded-lg border py-1 pr-1 pl-2.5 shadow-sm"
                        >
                          <span className="text-muted-foreground text-xs font-black tracking-wider uppercase">
                            {coupon.code}
                          </span>
                          <Badge
                            variant={BadgeVariant.Secondary}
                            className="flex items-center gap-0.5 rounded-md border-0 bg-emerald-500/10 px-2 py-1 text-xs font-extrabold text-emerald-600 uppercase dark:text-emerald-400"
                          >
                            {coupon.discountType === 'AMOUNT' ? (
                              <IndianRupee className="size-3.5" />
                            ) : (
                              <Percent className="size-3.5" />
                            )}
                            {coupon.discountValue}
                            {coupon.discountType === 'PERCENTAGE'
                              ? '%'
                              : ''}{' '}
                            OFF
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
