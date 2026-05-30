import React, { useRef } from "react";
import { Badge } from "@/components/atoms/badge/badge";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PassType,
  PassCategory,
  type Attendee,
  type Friend,
  type CategoryDetails,
  type PassDetails,
} from "@/app/(main)/events/[id]/register/page";

export interface RegisterFormProps {
  userName: string;
  setUserName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  userPhone: string;
  setUserPhone: (val: string) => void;
  selectedPass: PassType;
  setSelectedPass: (val: PassType) => void;
  selectedCategory: PassCategory;
  setSelectedCategory: (val: PassCategory) => void;
  attendees: Attendee[];
  setAttendees: React.Dispatch<React.SetStateAction<Attendee[]>>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  friendSuggestions: Friend[];
  setFriendSuggestions: (val: Friend[]) => void;
  inviteName: string;
  setInviteName: (val: string) => void;
  inviteEmail: string;
  setInviteEmail: (val: string) => void;
  buddyShortage: number;
  calculatedTotal: string;
  categoryOptions: CategoryDetails[];
  passOptions: PassDetails[];
  mockFriends: Friend[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function RegisterForm({
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  userPhone,
  setUserPhone,
  selectedPass,
  setSelectedPass,
  selectedCategory,
  setSelectedCategory,
  attendees,
  setAttendees,
  searchQuery,
  setSearchQuery,
  friendSuggestions,
  setFriendSuggestions,
  inviteName,
  setInviteName,
  inviteEmail,
  setInviteEmail,
  buddyShortage,
  calculatedTotal,
  categoryOptions,
  passOptions,
  mockFriends,
  onSubmit,
}: RegisterFormProps) {
  const passScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategory = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const { scrollLeft, clientWidth } = categoryScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      categoryScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollPass = (direction: "left" | "right") => {
    if (passScrollRef.current) {
      const { scrollLeft, clientWidth } = passScrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      passScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle Friend Search Typing
  const handleFriendSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockFriends.filter(
        (f) =>
          f.username.toLowerCase().includes(query.toLowerCase()) ||
          f.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFriendSuggestions(filtered);
    } else {
      setFriendSuggestions([]);
    }
  };

  // Add search-filled friend as an attendee
  const addFriendAttendee = (friend: Friend) => {
    if (attendees.some((a) => a.email === friend.email)) {
      alert(`${friend.name} is already added!`);
      return;
    }
    const newAttendee: Attendee = {
      id: Math.random().toString(),
      name: friend.name,
      email: friend.email,
      isInvite: false,
    };
    setAttendees((prev) => [...prev, newAttendee]);
    setSearchQuery("");
    setFriendSuggestions([]);
  };

  // Add custom manual invite friend
  const handleAddManualInvite = () => {
    if (!inviteName || !inviteEmail) {
      alert("Please fill in both name and email to invite a friend.");
      return;
    }
    const newAttendee: Attendee = {
      id: Math.random().toString(),
      name: inviteName,
      email: inviteEmail,
      isInvite: true,
    };
    setAttendees((prev) => [...prev, newAttendee]);
    setInviteName("");
    setInviteEmail("");
  };

  // Remove attendee
  const removeAttendee = (id: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const activeCategory =
    categoryOptions.find((c) => c.id === selectedCategory) ||
    categoryOptions[0];

  return (
    <div className="md:col-span-3 flex flex-col gap-8 text-left">
      {/* SECTION 1: PASS CATEGORY SELECTOR */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 1
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Select Pass Category
          </h2>
          <p className="text-xs text-muted-foreground">
            Choose a pass category option suited for you or a group of buddies.
          </p>
        </div>

        <div className="relative group/category-carousel">
          {/* Left Scroll Button */}
          <button
            type="button"
            onClick={() => scrollCategory("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/category-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Right Scroll Button */}
          <button
            type="button"
            onClick={() => scrollCategory("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/category-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth w-full"
          >
            {categoryOptions.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setAttendees([]);
                }}
                className={`p-3.5 border rounded-xl cursor-pointer select-none transition-all flex flex-col justify-between text-left gap-3 shrink-0 w-[240px] sm:w-[260px] snap-center min-h-[140px] ${
                  selectedCategory === cat.id
                    ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5 scale-[1.01]"
                    : "border-border hover:border-indigo-600 bg-secondary/10"
                }`}
              >
                <div className="space-y-1">
                  <span className="font-extrabold text-xs text-foreground block">
                    {cat.name}
                  </span>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {cat.description}
                  </p>
                </div>
                {cat.discount > 0 && (
                  <div>
                    <Badge
                      variant={null}
                      className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[8px] uppercase tracking-wide border-0 px-1.5 py-0.5 rounded"
                    >
                      {cat.discount}% Off
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* SECTION 2: PASS TYPE SELECTOR */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 2
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Select Pass Type
          </h2>
          <p className="text-xs text-muted-foreground">
            Select the tier of event access you would like to secure.
          </p>
        </div>

        <div className="relative group/pass-carousel">
          {/* Left Scroll Button */}
          <button
            type="button"
            onClick={() => scrollPass("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/pass-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Right Scroll Button */}
          <button
            type="button"
            onClick={() => scrollPass("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/pass-carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={passScrollRef}
            className="flex items-center gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth w-full"
          >
            {passOptions.map((option) => (
              <div
                key={option.type}
                onClick={() => setSelectedPass(option.type)}
                className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col justify-between gap-4 shrink-0 w-[280px] sm:w-[300px] snap-center min-h-[160px] ${
                  selectedPass === option.type
                    ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5 scale-[1.01]"
                    : option.color
                }`}
              >
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-foreground">
                      {option.name}
                    </span>
                    {option.type !== PassType.GA && (
                      <Badge
                        variant={null}
                        className="bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[9px] px-1.5 py-0.5 rounded border-0"
                      >
                        Premium
                      </Badge>
                    )}
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-0.5">
                    {option.perks.slice(0, 3).map((perk, i) => (
                      <li key={i} className="truncate">
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-baseline justify-between border-t border-border/40 pt-2.5 mt-auto">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {option.extraPrice === 0
                      ? "Included"
                      : `+$${option.extraPrice}`}
                  </span>
                  <span className="text-base font-black text-foreground">
                    {option.extraPrice === 0 ? "Free" : `$${option.extraPrice}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* SECTION 3: ATTENDEE INFORMATION FORM */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 3
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Your Contact Details
          </h2>
          <p className="text-xs text-muted-foreground">
            Primary attendee contact credentials.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                type="text"
                required
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="userEmail">Email Address</Label>
              <Input
                id="userEmail"
                type="email"
                required
                placeholder="you@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="userPhone">Phone Number</Label>
            <Input
              id="userPhone"
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
          </div>

          {selectedCategory !== PassCategory.SINGLE && (
            <>
              <hr className="border-border/40 my-6" />

              {/* SECTION 4: REGISTER FRIEND / INVITES */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Step 4
                      </span>
                    </div>
                    {/* Helpful validation helper badge */}
                    <div>
                      {buddyShortage > 0 ? (
                        <Badge
                          variant={null}
                          className="bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[9px] px-2 py-0.5 rounded border-0"
                        >
                          ⚠️ Needs {buddyShortage} more buddy details
                        </Badge>
                      ) : buddyShortage === 0 ? (
                        <Badge
                          variant={null}
                          className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[9px] px-2 py-0.5 rounded border-0"
                        >
                          ✅ All buddy details added!
                        </Badge>
                      ) : (
                        <Badge
                          variant={null}
                          className="bg-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold text-[9px] px-2 py-0.5 rounded border-0"
                        >
                          ⚠️ Too many buddies added (Remove{" "}
                          {Math.abs(buddyShortage)})
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">
                    Register or Invite Friends
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Search and register buddies instantly or invite them via
                    email to complete your {activeCategory.name}.
                  </p>
                </div>

                {/* Friend Search Input */}
                <div className="relative space-y-1.5">
                  <Label htmlFor="friendSearch">Search Passvy Friends</Label>
                  <div className="relative">
                    <Input
                      id="friendSearch"
                      type="text"
                      placeholder="Search friend by name or @username..."
                      value={searchQuery}
                      onChange={handleFriendSearch}
                      className="pl-8"
                    />
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  {/* Suggestions list */}
                  {friendSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1.5 p-1 rounded-xl bg-card border border-border/80 shadow-lg max-h-48 overflow-y-auto">
                      {friendSuggestions.map((friend) => (
                        <button
                          key={friend.username}
                          type="button"
                          onClick={() => addFriendAttendee(friend)}
                          className="w-full p-2.5 hover:bg-secondary/40 rounded-lg text-left text-xs flex justify-between items-center transition-colors cursor-pointer"
                        >
                          <div>
                            <span className="font-bold text-foreground block">
                              {friend.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {friend.username}
                            </span>
                          </div>
                          <Badge
                            variant={null}
                            className="bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold border-0 text-[9px] px-2 py-0.5 rounded"
                          >
                            Add Buddy
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Manual Email Invite Fields */}
                <div className="p-4 border border-border/40 rounded-xl bg-secondary/10 space-y-3">
                  <span className="text-xs font-bold text-foreground block">
                    Invite Friend via Email
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      placeholder="Friend's Name"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="text-xs h-9"
                    />
                    <Input
                      type="email"
                      placeholder="Friend's Email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddManualInvite}
                    size="sm"
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg text-xs"
                  >
                    Add to Invite List
                  </Button>
                </div>

                {/* Dynamic Buddy List */}
                {attendees.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground block">
                      Buddy Registration List ({attendees.length})
                    </span>
                    <div className="space-y-2">
                      {attendees.map((buddy) => (
                        <div
                          key={buddy.id}
                          className="p-3 border border-border/60 rounded-xl flex items-center justify-between text-xs gap-4 bg-card"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground truncate">
                                {buddy.name}
                              </span>
                              <Badge
                                variant={null}
                                className="bg-indigo-600/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 border-0 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded"
                              >
                                {buddy.isInvite ? "Invite Only" : "Direct Add"}
                              </Badge>
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate block mt-0.5">
                              {buddy.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttendee(buddy.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 active:scale-95 transition-all cursor-pointer"
                            aria-label="Remove attendee"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg py-2.5 shadow-sm transition-all active:scale-[0.98] mt-6 cursor-pointer text-xs uppercase tracking-wider"
          >
            Complete Checkout • {calculatedTotal}
          </Button>
        </form>
      </div>
    </div>
  );
}

