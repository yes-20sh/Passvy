'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { EventSummaryCard } from '@/components/molecules/event-summary-card/event-summary-card';
import { PaymentForm } from '@/components/organisms/payment-form/payment-form';
import { type Attendee } from '@/app/(main)/events/[id]/register/page';
import { useAppSelector } from '@/store/hooks/useAppSelector';
import { useAppDispatch } from '@/store/hooks/useAppDispatch';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GetEventDetailDocument,
  CreateEventRegistrationDocument,
} from '@/gql/graphql';
import { setEventDetail } from '@/store/slices/event-detail.slice';

export interface PaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface SavedCheckoutData {
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedPassId: string;
  attendees: Attendee[];
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.eventDetail.currentEvent);

  // Decide whether to fetch data: we only skip if event is in Redux AND matches the slug
  const shouldSkipQuery = !!event?.id && event?.slug === resolvedParams.id;

  const { data, loading: queryLoading } = useQuery(GetEventDetailDocument, {
    variables: { slug: resolvedParams.id },
    skip: shouldSkipQuery,
  });

  const [createRegistration, { loading: isRegistering }] = useMutation(
    CreateEventRegistrationDocument,
  );

  const [checkoutData, setCheckoutData] = useState<SavedCheckoutData | null>(
    null,
  );
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync with Redux if we fetched from query
  useEffect(() => {
    if (!shouldSkipQuery && data?.getEventDetail?.event) {
      const rawEvent = data.getEventDetail.event;

      // format date/time manually or roughly, since it's just for display on checkout
      const formattedDate = rawEvent.startDate
        ? new Date(rawEvent.startDate as string).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })
        : 'TBA';

      dispatch(
        setEventDetail({
          id: rawEvent.id,
          slug: resolvedParams.id,
          title: rawEvent.title,
          image:
            typeof rawEvent.headerImage === 'string'
              ? rawEvent.headerImage
              : '',
          date: formattedDate,
          time: rawEvent.startDate
            ? new Date(rawEvent.startDate as string).toLocaleTimeString(
                'en-US',
                { hour: '2-digit', minute: '2-digit' },
              )
            : 'TBA',
          tag: rawEvent.category || '',
          price: rawEvent.passes?.[0]?.price?.toString() || 'Free',
          location:
            rawEvent.mode?.offlineAddress || rawEvent.mode?.city || 'TBA',
          description: rawEvent.descriptionBlocks?.[0]?.content || '',
          passes: rawEvent.passes || [],
        }),
      );
    }
  }, [data, shouldSkipQuery, resolvedParams.id, dispatch]);

  const rawPasses = event?.passes || [];

  useEffect(() => {
    // Wrap in setTimeout to prevent synchronous setState warning during hydration
    const timer = setTimeout(() => {
      const saved = sessionStorage.getItem(`checkout-${resolvedParams.id}`);
      if (saved) {
        try {
          setCheckoutData(JSON.parse(saved));
        } catch (err) {
          console.error('Error parsing checkout data', err);
        }
      }
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [resolvedParams.id]);

  if (isLoading || (queryLoading && !shouldSkipQuery) || isRegistering) {
    return (
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <span className="text-muted-foreground animate-pulse text-xs font-bold tracking-widest uppercase">
          {isRegistering
            ? 'Processing Registration...'
            : 'Loading payment details...'}
        </span>
      </div>
    );
  }

  if (!event || !event.id) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
          Event not found or failed to load
        </span>
        <Link
          href={`/events/${resolvedParams.id}`}
          className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Return to event
        </Link>
      </div>
    );
  }

  // Redirect to register if no registration details found
  if (!checkoutData) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
          No registration details found
        </span>
        <Link
          href={`/events/${resolvedParams.id}/register`}
          className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Return to registration form
        </Link>
      </div>
    );
  }

  const { userName, userEmail, selectedPassId, attendees } = checkoutData;

  const activePass =
    rawPasses.find((p) => p.id === selectedPassId) || rawPasses[0];

  if (!activePass) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4">
        <span className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
          Selected pass not found
        </span>
        <Link
          href={`/events/${resolvedParams.id}/register`}
          className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Return to registration form
        </Link>
      </div>
    );
  }

  const getCapacity = (category: string | null) => {
    const cat = category?.toUpperCase() || '';
    if (cat === 'FRIEND' || cat === 'COUPLE') return 2;
    if (cat === 'GROUP' || cat === 'TEAM') return 5;
    return 1;
  };

  const passTierName = activePass.tier || 'General Admission';
  const passCategoryName =
    activePass.customName || activePass.passCategory || 'Single Pass';

  const singlePassPrice = activePass.price || 0;
  const totalTickets = getCapacity(activePass.passCategory);

  const rawSubtotal = singlePassPrice;

  // NOTE: Category Discount from MOCK was hardcoded. We no longer have category discounts in DB schema natively
  // so we skip category discounts, but keep coupon discount percent functionality.
  const amountAfterCategoryDiscount = rawSubtotal;

  const couponDiscountAmount = Math.round(
    amountAfterCategoryDiscount * (couponDiscountPercent / 100),
  );
  const totalAmount = amountAfterCategoryDiscount - couponDiscountAmount;

  const calculatedTotal = totalAmount === 0 ? 'Free' : `$${totalAmount}`;

  const finalDiscountPercent = couponDiscountPercent;
  const finalDiscountAmount = couponDiscountAmount;

  const handlePaymentSuccess = async (
    couponCode: string,
    paymentMethod: string,
  ) => {
    try {
      await createRegistration({
        variables: {
          input: {
            slug: resolvedParams.id,
            eventId: event.id,
            name: checkoutData.userName,
            email: checkoutData.userEmail,
            mobileNumber: checkoutData.userPhone,
          },
        },
      });

      // Generate secure order ID for local presentation
      const ticketCode = `PV-${Math.floor(100000 + Math.random() * 900000)}`;

      // Save order data to sessionStorage for pass page
      const orderData = {
        ...checkoutData,
        ticketCode,
        couponCode,
        paymentMethod,
        finalPaidAmount: calculatedTotal,
      };
      sessionStorage.setItem(
        `order-${resolvedParams.id}`,
        JSON.stringify(orderData),
      );

      // Redirect to pass success page
      router.push(`/events/${resolvedParams.id}/pass?flow=checkout`);
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to complete registration. Please try again.',
      );
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col pb-12 transition-colors duration-200">
      {/* Top Header */}
      <header className="border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href={`/events/${resolvedParams.id}/register`}
            className="text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Registration Info</span>
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
          <PaymentForm
            userName={userName}
            userEmail={userEmail}
            passTierName={passTierName}
            passCategoryName={passCategoryName}
            totalTickets={totalTickets}
            rawAmount={amountAfterCategoryDiscount}
            onBack={() => router.push(`/events/${resolvedParams.id}/register`)}
            onPaymentSuccess={handlePaymentSuccess}
            onCouponApply={(discountPercent) =>
              setCouponDiscountPercent(discountPercent)
            }
            onCouponRemove={() => setCouponDiscountPercent(0)}
          />

          <EventSummaryCard
            event={event}
            passTierName={passTierName}
            passCategoryName={passCategoryName}
            singlePassPrice={singlePassPrice}
            totalTickets={totalTickets}
            rawSubtotal={rawSubtotal}
            discountPercentage={finalDiscountPercent}
            discountAmount={finalDiscountAmount}
            calculatedTotal={calculatedTotal}
            invitedBuddies={attendees.map((a) => a.name)}
          />
        </div>
      </main>
    </div>
  );
}
