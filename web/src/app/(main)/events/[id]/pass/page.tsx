"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { MOCK_EVENTS } from "../../data";
import { SuccessPassTicket } from "@/components/molecules/success-pass-ticket/success-pass-ticket";
import {
  PassType,
  PassCategory,
  type Attendee,
  CATEGORY_OPTIONS,
} from "@/app/(main)/events/[id]/register/page";

export interface PassPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface SavedOrderData {
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedPass: PassType;
  selectedCategory: PassCategory;
  attendees: Attendee[];
  ticketCode: string;
  couponCode: string;
  paymentMethod: string;
  finalPaidAmount: string;
}

export default function PassPage({ params }: PassPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const event = MOCK_EVENTS.find((e) => e.id === resolvedParams.id);

  const [orderData, setOrderData] = useState<SavedOrderData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(`order-${resolvedParams.id}`);
    if (saved) {
      try {
        setOrderData(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing order details", err);
      }
    } else if (event) {
      // Create a premium default ticket mock so page never displays empty error
      const defaultPrice = event.price === "Free" || event.price.toLowerCase() === "free"
        ? "Free"
        : `$${event.price}`;
      setOrderData({
        userName: "Guest Registrant",
        userEmail: "guest@passvy.io",
        userPhone: "+1 (555) 019-2834",
        selectedPass: PassType.GA,
        selectedCategory: PassCategory.SINGLE,
        attendees: [],
        ticketCode: `PV-${resolvedParams.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        couponCode: "WELCOME10",
        paymentMethod: "Credit Card",
        finalPaidAmount: defaultPrice,
      });
    }
    setIsLoading(false);
  }, [resolvedParams.id, event]);

  if (!event) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
          Loading Passvy Ticket...
        </span>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  const {
    userName,
    userEmail,
    userPhone,
    selectedPass,
    selectedCategory,
    ticketCode,
    finalPaidAmount,
    attendees,
    paymentMethod,
    couponCode,
  } = orderData;
  const activeCategoryDetails = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory) || CATEGORY_OPTIONS[0];
  const totalTickets = activeCategoryDetails.capacity;

  const handlePrint = () => {
    window.print();
  };

  const isCheckout = searchParams.get("flow") === "checkout";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/events"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Events Directory</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold tracking-tight">PV SECURE TICKET</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <SuccessPassTicket
          event={event}
          userName={userName}
          selectedPass={selectedPass}
          selectedCategory={selectedCategory}
          totalTickets={totalTickets}
          ticketCode={ticketCode}
          calculatedTotal={finalPaidAmount}
          attendees={attendees}
          onPrint={handlePrint}
          userEmail={userEmail}
          userPhone={userPhone}
          paymentMethod={paymentMethod}
          couponCode={couponCode}
          isCheckout={isCheckout}
        />
      </main>
    </div>
  );
}
