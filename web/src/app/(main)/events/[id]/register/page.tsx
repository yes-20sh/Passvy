"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { MOCK_EVENTS } from "../../data";
import { EventSummaryCard } from "@/components/molecules/event-summary-card/event-summary-card";
import { RegisterForm } from "@/components/organisms/register-form/register-form";

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

export enum PassType {
  GA = "GA",
  VIP = "VIP",
  VVIP = "VVIP"
}

export enum PassCategory {
  SINGLE = "SINGLE",
  FRIEND = "FRIEND",
  GROUP = "GROUP"
}

export interface CategoryDetails {
  id: PassCategory;
  name: string;
  capacity: number;
  discount: number; // percentage
  description: string;
}

export const CATEGORY_OPTIONS: CategoryDetails[] = [
  { id: PassCategory.SINGLE, name: "Single Pass", capacity: 1, discount: 0, description: "Individual entry pass for a solo attendee." },
  { id: PassCategory.FRIEND, name: "Friend Pass (2 Persons)", capacity: 2, discount: 10, description: "Entry for 2 buddies with a 10% bundle discount!" },
  { id: PassCategory.GROUP, name: "Group Pass (5 Persons)", capacity: 5, discount: 20, description: "Entry for 5 buddies with a 20% bundle discount!" }
];

export interface PassDetails {
  type: PassType;
  name: string;
  extraPrice: number;
  perks: string[];
  color: string;
}

export interface Friend {
  name: string;
  username: string;
  email: string;
}

export interface BarcodeBar {
  width: number;
  gap: number;
}

export const PASS_OPTIONS: PassDetails[] = [
  {
    type: PassType.GA,
    name: "General Admission (GA)",
    extraPrice: 0,
    perks: ["Standard Event Entry", "General Seating access", "Passvy Encrypted Digital Pass"],
    color: "border-border hover:border-indigo-600 bg-secondary/10"
  },
  {
    type: PassType.VIP,
    name: "VIP Experience",
    extraPrice: 100,
    perks: ["Fast-Track Fast Lane Entry", "Exclusive VIP Lounge access", "2 Free Premium Drinks", "Premium Seating Row"],
    color: "border-amber-500/30 hover:border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400"
  },
  {
    type: PassType.VVIP,
    name: "Elite VVIP Access",
    extraPrice: 250,
    perks: ["Backstage Access & Meet & Greet", "Front Row Reserved Seating", "Limited Edition Merchandise", "VIP Dedicated Concierge Service"],
    color: "border-purple-500/30 hover:border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400"
  }
];

export const MOCK_FRIENDS: Friend[] = [
  { name: "John Doe", username: "@johndoe", email: "john.doe@passvy.com" },
  { name: "Sarah Connor", username: "@sarah_c", email: "sarah.connor@sky.net" },
  { name: "Alex Smith", username: "@alex_smith", email: "alex.smith@passvy.com" },
  { name: "Emma Watson", username: "@emma_w", email: "emma.watson@hogwarts.edu" },
  { name: "Michael Jordan", username: "@mj23", email: "mj.air@chicago.com" }
];

export default function RegisterPage({ params }: RegisterPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const event = MOCK_EVENTS.find((e) => e.id === resolvedParams.id);

  // Form states
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [selectedPass, setSelectedPass] = useState<PassType>(PassType.GA);
  const [selectedCategory, setSelectedCategory] = useState<PassCategory>(PassCategory.SINGLE);

  // Friends & Invite Buddies State
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [friendSuggestions, setFriendSuggestions] = useState<Friend[]>([]);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteName, setInviteName] = useState<string>("");

  if (!event) {
    notFound();
  }

  const activePassDetails = PASS_OPTIONS.find((p) => p.type === selectedPass) || PASS_OPTIONS[0];
  const activeCategoryDetails = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory) || CATEGORY_OPTIONS[0];

  const basePriceNum = event.price === "Free" || event.price.toLowerCase() === "free" ? 0 : parseInt(event.price, 10);
  const singlePassPrice = basePriceNum + activePassDetails.extraPrice;
  const totalTickets = activeCategoryDetails.capacity;
  
  const rawSubtotal = singlePassPrice * totalTickets;
  const categoryDiscountAmount = Math.round(rawSubtotal * (activeCategoryDetails.discount / 100));
  const amountAfterCategoryDiscount = rawSubtotal - categoryDiscountAmount;

  const calculatedTotal = amountAfterCategoryDiscount === 0 ? "Free" : `$${amountAfterCategoryDiscount}`;
  const buddyShortage = (totalTickets - 1) - attendees.length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone) {
      alert("Please fill in your primary attendee details.");
      return;
    }
    if (buddyShortage > 0) {
      alert(`Please add details for the remaining ${buddyShortage} buddy/buddies required for your chosen ${activeCategoryDetails.name}.`);
      return;
    }

    // Save state to sessionStorage
    const checkoutData = {
      userName,
      userEmail,
      userPhone,
      selectedPass,
      selectedCategory,
      attendees,
    };
    sessionStorage.setItem(`checkout-${resolvedParams.id}`, JSON.stringify(checkoutData));

    // Redirect to payment page
    router.push(`/events/${resolvedParams.id}/payment`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/events/${resolvedParams.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Event Details</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold tracking-tight">SECURE CHECKOUT</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start w-full">
          <RegisterForm
            userName={userName}
            setUserName={setUserName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            userPhone={userPhone}
            setUserPhone={setUserPhone}
            selectedPass={selectedPass}
            setSelectedPass={setSelectedPass}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
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
            categoryOptions={CATEGORY_OPTIONS}
            passOptions={PASS_OPTIONS}
            mockFriends={MOCK_FRIENDS}
            onSubmit={handleSubmit}
          />

          <EventSummaryCard
            event={event}
            passTierName={activePassDetails.name}
            passCategoryName={activeCategoryDetails.name}
            singlePassPrice={singlePassPrice}
            totalTickets={totalTickets}
            rawSubtotal={rawSubtotal}
            discountPercentage={activeCategoryDetails.discount}
            discountAmount={categoryDiscountAmount}
            calculatedTotal={calculatedTotal}
            invitedBuddies={attendees.map((a) => a.name)}
          />
        </div>
      </main>
    </div>
  );
}
