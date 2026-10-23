'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { GetEventDetailDocument } from '@/gql/graphql';
import { useAppSelector } from '@/store/hooks/useAppSelector';
import { useAppDispatch } from '@/store/hooks/useAppDispatch';
import {
  setEventDetail,
  type EventDetailState,
  type EventPass,
} from '@/store/slices/event-detail.slice';
import { EventSummaryCard } from '@/components/molecules/event-summary-card/event-summary-card';
import { RegisterForm } from '@/components/organisms/register-form/register-form';

export interface RegisterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  isInvite: boolean;
}

export interface Friend {
  name: string;
  username: string;
  email: string;
}

export const MOCK_FRIENDS: Friend[] = [
  { name: 'John Doe', username: '@johndoe', email: 'john.doe@passvy.com' },
  { name: 'Sarah Connor', username: '@sarah_c', email: 'sarah.connor@sky.net' },
  {
    name: 'Alex Smith',
    username: '@alex_smith',
    email: 'alex.smith@passvy.com',
  },
  {
    name: 'Emma Watson',
    username: '@emma_w',
    email: 'emma.watson@hogwarts.edu',
  },
  { name: 'Michael Jordan', username: '@mj23', email: 'mj.air@chicago.com' },
];

export default function RegisterPage({ params }: RegisterPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  // Form states
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [selectedPassId, setSelectedPassId] = useState<string>('');

  // Friends & Invite Buddies State
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [friendSuggestions, setFriendSuggestions] = useState<Friend[]>([]);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteName, setInviteName] = useState<string>('');

  const storedEvent = useAppSelector((state) => state.eventDetail.currentEvent);
  const dispatch = useAppDispatch();
  const shouldSkipQuery =
    !!storedEvent &&
    (storedEvent.id === resolvedParams.id ||
      storedEvent.slug === resolvedParams.id);

  const { data, loading, error } = useQuery(GetEventDetailDocument, {
    variables: { slug: resolvedParams.id },
    skip: shouldSkipQuery,
  });

  let event: EventDetailState | null = storedEvent;
  let rawPasses: EventPass[] = storedEvent?.passes || [];

  if (!shouldSkipQuery) {
    const rawEvent = data?.getEventDetail?.event;

    if (rawEvent) {
      rawPasses = rawEvent.passes || [];
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

      const formattedDate = rawEvent.startDate
        ? new Date(rawEvent.startDate as string).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })
        : 'TBA';

      const formattedTime = formatTime12hr(rawEvent.startTime);
      const location = rawEvent.mode?.city
        ? `${rawEvent.mode.city}${rawEvent.mode.state ? `, ${rawEvent.mode.state}` : ''}`
        : 'TBD';
      const price = rawPasses?.[0]?.price?.toString() || 'Free';

      event = {
        id: rawEvent.id,
        slug: resolvedParams.id, // Store slug so shouldSkipQuery works reliably
        title: rawEvent.title,
        image:
          rawEvent.headerImage ||
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        date: formattedDate,
        time: formattedTime,
        tag: rawEvent.category || 'General',
        price: price,
        location: location,
        passes: rawPasses,
      };
    }
  }



  useEffect(() => {
    if (!shouldSkipQuery && event) {
      dispatch(setEventDetail(event));
    }
  }, [shouldSkipQuery, event, dispatch]);

  if (!shouldSkipQuery && loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event || (!shouldSkipQuery && error)) {
    return notFound();
  }

  const activePass =
    rawPasses.find((p) => p.id === selectedPassId) || rawPasses[0];

  const getCapacity = (category: string | null) => {
    const cat = category?.toUpperCase() || '';
    if (cat === 'FRIEND' || cat === 'COUPLE') return 2;
    if (cat === 'GROUP' || cat === 'TEAM') return 5;
    return 1;
  };

  const totalTickets = activePass ? getCapacity(activePass.passCategory) : 1;
  const singlePassPrice = activePass?.price || 0;

  // We'll treat the pass price as the bundle price
  const rawSubtotal = singlePassPrice;
  const calculatedTotal = rawSubtotal === 0 ? 'Free' : `$${rawSubtotal}`;
  const buddyShortage = totalTickets - 1 - attendees.length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone) {
      alert('Please fill in your primary attendee details.');
      return;
    }
    if (buddyShortage > 0) {
      alert(
        `Please add details for the remaining ${buddyShortage} buddy/buddies required for your chosen ${activePass?.customName || activePass?.tier || 'pass'}.`,
      );
      return;
    }

    const checkoutData = {
      userName,
      userEmail,
      userPhone,
      selectedPassId,
      attendees,
    };
    sessionStorage.setItem(
      `checkout-${resolvedParams.id}`,
      JSON.stringify(checkoutData),
    );

    router.push(`/events/${resolvedParams.id}/payment`);
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col pb-12 transition-colors duration-200">
      <header className="border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href={`/events/${resolvedParams.id}`}
            className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Event Details</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold tracking-tight">
              SECURE CHECKOUT
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-8">
        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-5">
          <RegisterForm
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            userPhone={userPhone}
            setUserPhone={setUserPhone}
            selectedPassId={selectedPassId || activePass?.id || ''}
            setSelectedPassId={setSelectedPassId}
            attendees={attendees}
            setAttendees={setAttendees}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            friendSuggestions={friendSuggestions}
            setFriendSuggestions={setFriendSuggestions}
            inviteName={inviteName}
            setInviteName={setInviteName}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            buddyShortage={buddyShortage}
            calculatedTotal={calculatedTotal}
            passes={rawPasses}
            mockFriends={MOCK_FRIENDS}
            onSubmit={handleSubmit}
          />

          <EventSummaryCard
            event={event}
            passTierName={activePass?.tier || 'General Admission'}
            passCategoryName={
              activePass?.customName ||
              activePass?.passCategory ||
              'Single Pass'
            }
            singlePassPrice={singlePassPrice}
            totalTickets={totalTickets}
            rawSubtotal={rawSubtotal}
            discountPercentage={0}
            discountAmount={0}
            calculatedTotal={calculatedTotal}
            invitedBuddies={attendees.map((a) => a.name)}
          />
        </div>
      </main>
    </div>
  );
}
