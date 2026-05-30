"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { MOCK_EVENTS } from "../../data";
import { EventSummaryCard } from "@/components/molecules/event-summary-card/event-summary-card";
import { PaymentForm } from "@/components/organisms/payment-form/payment-form";
import {
  PassType,
  PassCategory,
  type Attendee,
  PASS_OPTIONS,
  CATEGORY_OPTIONS,
} from "@/app/(main)/events/[id]/register/page";

export interface PaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface SavedCheckoutData {
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedPass: PassType;
  selectedCategory: PassCategory;
  attendees: Attendee[];
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const event = MOCK_EVENTS.find((e) => e.id === resolvedParams.id);

  const [checkoutData, setCheckoutData] = useState<SavedCheckoutData | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(`checkout-${resolvedParams.id}`);
    if (saved) {
      try {
        setCheckoutData(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing checkout data", err);
      }
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  if (!event) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
          Loading payment details...
        </span>
      </div>
    );
  }

  // Redirect to register if no registration details found
  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          No registration details found
        </span>
        <Link
          href={`/events/${resolvedParams.id}/register`}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Return to registration form
        </Link>
      </div>
    );
  }

  const { userName, userEmail, selectedPass, selectedCategory, attendees } = checkoutData;

  const activePassDetails = PASS_OPTIONS.find((p) => p.type === selectedPass) || PASS_OPTIONS[0];
  const activeCategoryDetails = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory) || CATEGORY_OPTIONS[0];

  const basePriceNum = event.price === "Free" || event.price.toLowerCase() === "free" ? 0 : parseInt(event.price, 10);
  const singlePassPrice = basePriceNum + activePassDetails.extraPrice;
  const totalTickets = activeCategoryDetails.capacity;
  
  const rawSubtotal = singlePassPrice * totalTickets;
  const categoryDiscountAmount = Math.round(rawSubtotal * (activeCategoryDetails.discount / 100));
  const amountAfterCategoryDiscount = rawSubtotal - categoryDiscountAmount;

  const couponDiscountAmount = Math.round(amountAfterCategoryDiscount * (couponDiscountPercent / 100));
  const totalAmount = amountAfterCategoryDiscount - couponDiscountAmount;

  const calculatedTotal = totalAmount === 0 ? "Free" : `$${totalAmount}`;

  const finalDiscountPercent = activeCategoryDetails.discount + couponDiscountPercent;
  const finalDiscountAmount = categoryDiscountAmount + couponDiscountAmount;

  const handlePaymentSuccess = (couponCode: string, paymentMethod: string, finalPaid: number) => {
    // Generate secure order ID
    const ticketCode = `PV-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Save order data to sessionStorage for pass page
    const orderData = {
      ...checkoutData,
      ticketCode,
      couponCode,
      paymentMethod,
      finalPaidAmount: calculatedTotal,
    };
    sessionStorage.setItem(`order-${resolvedParams.id}`, JSON.stringify(orderData));

    // Redirect to pass success page
    router.push(`/events/${resolvedParams.id}/pass?flow=checkout`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/events/${resolvedParams.id}/register`}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Registration Info</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold tracking-tight">SECURE CHECKOUT</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start w-full">
          <PaymentForm
            userName={userName}
            userEmail={userEmail}
            selectedPass={selectedPass}
            selectedCategory={selectedCategory}
            passTierName={activePassDetails.name}
            passCategoryName={activeCategoryDetails.name}
            totalTickets={totalTickets}
            rawAmount={amountAfterCategoryDiscount}
            onBack={() => router.push(`/events/${resolvedParams.id}/register`)}
            onPaymentSuccess={handlePaymentSuccess}
            onCouponApply={(discountPercent) => setCouponDiscountPercent(discountPercent)}
            onCouponRemove={() => setCouponDiscountPercent(0)}
          />

          <EventSummaryCard
            event={event}
            passTierName={activePassDetails.name}
            passCategoryName={activeCategoryDetails.name}
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
