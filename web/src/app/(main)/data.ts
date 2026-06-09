import React from "react";
import {
  Laptop,
  Music,
  Palette,
  Utensils,
  Briefcase,
  Heart,
  PartyPopper,
  Sparkles,
  Trophy,
  Laugh,
  GraduationCap,
  Gamepad2,
  Users,
} from "lucide-react";
import { type EventData } from "@/components/molecules/event-card/event-card";

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Events", icon: Sparkles },
  { id: "tech", name: "Technology", icon: Laptop },
  { id: "music", name: "Music", icon: Music },
  { id: "art", name: "Art & Culture", icon: Palette },
  { id: "food", name: "Food & Drinks", icon: Utensils },
  { id: "business", name: "Business", icon: Briefcase },
  { id: "wellness", name: "Wellness", icon: Heart },
  { id: "parties", name: "Parties", icon: PartyPopper },
  { id: "sports", name: "Sports & Fitness", icon: Trophy },
  { id: "comedy", name: "Comedy & Theater", icon: Laugh },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "gaming", name: "Gaming", icon: Gamepad2 },
  { id: "community", name: "Community", icon: Users },
];

export const MOCK_EVENTS: EventData[] = [
  {
    id: "1",
    title: "Global Tech Summit 2026",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    date: "Jun 12, 2026",
    time: "09:00 AM - 05:00 PM",
    tag: "Technology",
    price: "199",
    location: "San Francisco, CA",
  },
  {
    id: "2",
    title: "Neon Beats Music Festival",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    date: "Jul 05, 2026",
    time: "04:00 PM - 11:30 PM",
    tag: "Music",
    price: "49",
    location: "Los Angeles, CA",
  },
  {
    id: "3",
    title: "Modern Art Exhibition & Gallery",
    image:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop&q=80",
    date: "Aug 20, 2026",
    time: "10:00 AM - 06:00 PM",
    tag: "Art & Culture",
    price: "Free",
    location: "New York, NY",
  },
  {
    id: "4",
    title: "Culinary Secrets: Masterclass Workshop",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
    date: "Sep 15, 2026",
    time: "02:00 PM - 06:00 PM",
    tag: "Food & Drinks",
    price: "85",
    location: "Chicago, IL",
  },
  {
    id: "5",
    title: "Startup Pitch & Networking Night",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80",
    date: "Oct 01, 2026",
    time: "06:30 PM - 09:30 PM",
    tag: "Business",
    price: "15",
    location: "Austin, TX",
  },
  {
    id: "6",
    title: "Zen & Yoga Outdoor Retreat",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
    date: "Oct 18, 2026",
    time: "07:00 AM - 11:00 AM",
    tag: "Wellness",
    price: "Free",
    location: "Seattle, WA",
  },
  {
    id: "7",
    title: "VIP Rooftop Networking & Cocktail Party",
    image:
      "https://images.unsplash.com/photo-1496337589254-7e19d01ced44?w=800&auto=format&fit=crop&q=80",
    date: "Nov 05, 2026",
    time: "08:00 PM - 01:00 AM",
    tag: "Parties",
    price: "120",
    location: "Miami, FL",
  },
];
