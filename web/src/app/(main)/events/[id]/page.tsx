'use client';

import React, { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { GetEventDetailDocument } from '@/gql/graphql';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks/useAppDispatch';
import { setEventDetail } from '@/store/slices/event-detail.slice';

import { EventDetailHeader } from '@/components/organisms/event-detail-header/event-detail-header';
import { EventHero } from '@/components/molecules/event-hero/event-hero';
import { EventHeadlineInfo } from '@/components/molecules/event-headline-info/event-headline-info';
import { EventDescription } from '@/components/molecules/event-description/event-description';
import { EventSidebar } from '@/components/organisms/event-sidebar/event-sidebar';
import { EventMobileFooterBar } from '@/components/organisms/event-mobile-footer-bar/event-mobile-footer-bar';

export interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const dispatch = useAppDispatch();

  const { data, loading, error } = useQuery(GetEventDetailDocument, {
    variables: { slug: id },
  });

  const rawEvent = data?.getEventDetail?.event;
  const isSavedInitial = data?.getEventDetail?.isSaved ?? false;

  const formatTime12hr = (timeStr?: string | null) => {
    if (!timeStr) return 'TBA';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${m} ${ampm}`;
    }
    return timeStr;
  };

  const formattedDate = rawEvent?.startDate
    ? new Date(rawEvent.startDate as string).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : 'TBA';

  const formattedTime = formatTime12hr(rawEvent?.startTime);
  
  const location = rawEvent?.mode?.city
    ? `${rawEvent.mode.city}${rawEvent.mode.state ? `, ${rawEvent.mode.state}` : ''}`
    : 'TBD';
    
  const price = rawEvent?.passes?.[0]?.price?.toString() || 'Free';
  const tag = rawEvent?.category || 'General';
  
  const image =
    rawEvent?.headerImage ||
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

  const description =
    rawEvent?.descriptionBlocks?.[0]?.content ||
    `Join us for the highly anticipated ${rawEvent?.title || 'event'}! This premium event brings together industry experts, enthusiasts, and innovators for an unforgettable experience.`;

  useEffect(() => {
    if (rawEvent) {
      dispatch(
        setEventDetail({
          id: rawEvent.id,
          slug: id,
          title: rawEvent.title,
          image,
          date: formattedDate,
          time: formattedTime,
          tag,
          price,
          location,
          description,
          passes: rawEvent.passes || [],
        })
      );
    }
  }, [rawEvent, id, image, formattedDate, formattedTime, tag, price, location, description, dispatch]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!rawEvent || error) {
    return notFound();
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col transition-colors duration-200">
      <EventDetailHeader />

      <main className="container mx-auto flex-1 px-4 py-8 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left Column: Details & Media */}
          <div className="space-y-8 lg:col-span-2">
            <EventHero image={image} title={rawEvent.title} tag={tag} eventSlug={id} initialIsSaved={isSavedInitial} />

            <EventHeadlineInfo
              title={rawEvent.title}
              date={formattedDate}
              time={formattedTime}
              location={location}
            />

            <hr className="border-border/40" />

            <EventDescription description={description} />
          </div>

          {/* Right Column: Dynamic Sticky Booking Widget */}
          <EventSidebar
            id={id}
            price={price}
            tag={tag}
            location={location}
            date={formattedDate}
            time={formattedTime}
          />
        </div>
      </main>

      <EventMobileFooterBar id={id} price={price} />
    </div>
  );
}
