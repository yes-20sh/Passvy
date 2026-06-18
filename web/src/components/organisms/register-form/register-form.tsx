import React, { useRef } from "react";
import { Badge } from "@/components/atoms/badge/badge";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  type Attendee,
  type Friend,
} from "@/app/(main)/events/[id]/register/page";
import { type EventPass } from "@/store/slices/event-detail.slice";
import { useAppSelector } from "@/store/hooks/useAppSelector";

export interface RegisterFormProps {
  userName: string;
  setUserName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  userPhone: string;
  setUserPhone: (val: string) => void;
  selectedPassId: string;
  setSelectedPassId: (val: string) => void;
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
  passes: EventPass[];
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
  selectedPassId,
  setSelectedPassId,
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
  passes,
  mockFriends,
  onSubmit,
}: RegisterFormProps) {
  const passScrollRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  React.useEffect(() => {
    if (user) {
      if (!userName && user.fullName) setUserName(user.fullName as string);
      if (!userEmail && user.email) setUserEmail(user.email as string);
      if (!userPhone && user.mobileNumber) setUserPhone(user.mobileNumber as string);
    }
  }, [user, userName, userEmail, userPhone, setUserName, setUserEmail, setUserPhone]);

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

  const addFriendAttendee = (friend: Friend) => {
    if (attendees.some((a) => a.email === friend.email)) {
      alert(`${friend.name} is already added!`);
      return;
    }
    const newAttendee: Attendee = {
      id: friend.email,
      name: friend.name,
      email: friend.email,
      isInvite: false,
    };
    setAttendees((prev) => [...prev, newAttendee]);
    setSearchQuery("");
    setFriendSuggestions([]);
  };

  const handleAddManualInvite = () => {
    if (!inviteName || !inviteEmail) {
      alert("Please fill in both name and email to invite a friend.");
      return;
    }
    if (attendees.some((a) => a.email === inviteEmail)) {
      alert(`${inviteName} is already added!`);
      return;
    }
    const newAttendee: Attendee = {
      id: inviteEmail,
      name: inviteName,
      email: inviteEmail,
      isInvite: true,
    };
    setAttendees((prev) => [...prev, newAttendee]);
    setInviteName("");
    setInviteEmail("");
  };

  const removeAttendee = (id: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const activePass = passes.find((p) => p.id === selectedPassId) || passes[0];
  const requiresBuddies = activePass && activePass.passCategory !== 'SINGLE';

  return (
    <div className="md:col-span-3 flex flex-col gap-8 text-left">
      {/* SECTION 1: PASS SELECTOR */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 1
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Select Pass
          </h2>
          <p className="text-xs text-muted-foreground">
            Choose a pass option for you or your group.
          </p>
        </div>

        <div className="relative group/pass-carousel py-4">
          {/* Left Scroll Button */}
          <button
            type="button"
            onClick={() => scrollPass("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-2.5 rounded-full border border-white/10 bg-background/60 backdrop-blur-md text-foreground hover:bg-secondary/80 shadow-[0_0_15px_rgba(0,0,0,0.1)] opacity-0 group-hover/pass-carousel:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer size-10 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Right Scroll Button */}
          <button
            type="button"
            onClick={() => scrollPass("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-2.5 rounded-full border border-white/10 bg-background/60 backdrop-blur-md text-foreground hover:bg-secondary/80 shadow-[0_0_15px_rgba(0,0,0,0.1)] opacity-0 group-hover/pass-carousel:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center cursor-pointer size-10 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Carousel Track */}
          <div
            ref={passScrollRef}
            className="flex items-stretch gap-5 overflow-x-auto scrollbar-none py-4 px-2 scroll-smooth w-full snap-x snap-mandatory"
          >
            {passes.map((option) => {
              const isSelected = selectedPassId === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    setSelectedPassId(option.id);
                    setAttendees([]); // Reset attendees on pass change
                  }}
                  className={`relative overflow-hidden p-5 rounded-2xl cursor-pointer select-none transition-all duration-500 flex flex-col justify-between gap-5 shrink-0 w-[290px] sm:w-[320px] snap-center min-h-[180px] group ${
                    isSelected
                      ? "border-transparent shadow-[0_8px_30px_rgb(79,70,229,0.2)] scale-[1.02] translate-y-[-4px]"
                      : "border-border/50 hover:border-indigo-500/50 hover:shadow-[0_8px_25px_rgb(0,0,0,0.05)] hover:-translate-y-1 bg-secondary/5 dark:bg-white/[0.02]"
                  }`}
                >
                  {/* Active Gradient Background & Border */}
                  {isSelected && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent z-0" />
                      <div className="absolute inset-0 border-2 border-indigo-600 rounded-2xl z-10 pointer-events-none" />
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/30 blur-[40px] rounded-full z-0 pointer-events-none" />
                    </>
                  )}

                  <div className="relative z-10 space-y-3 text-left">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`font-black text-lg tracking-tight ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-foreground'}`}>
                        {option.customName || option.passCategory}
                      </span>
                      {option.tier && option.tier !== "GA" && (
                        <Badge
                          variant={null}
                          className={`font-bold text-[10px] px-2 py-0.5 rounded-full border-0 uppercase tracking-wider ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {option.tier}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-500' : 'bg-border'}`} />
                        <span className="font-medium">Category: <span className="text-foreground/80">{option.passCategory}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-500' : 'bg-border'}`} />
                        <span className="font-medium">Tier: <span className="text-foreground/80">{option.tier}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-end justify-between pt-4 mt-auto border-t border-border/30">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      Price
                    </span>
                    <span className={`text-2xl font-black tracking-tighter ${isSelected ? 'text-indigo-600 dark:text-indigo-400 drop-shadow-sm' : 'text-foreground'}`}>
                      {option.price === 0 || option.pricing === 'FREE' ? "Free" : `$${option.price}`}
                    </span>
                  </div>
                </div>
              );
            })}
            {passes.length === 0 && (
               <div className="text-sm text-muted-foreground p-4">No passes available for this event.</div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* SECTION 2: ATTENDEE INFORMATION FORM */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 2
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

          {requiresBuddies && (
            <>
              <hr className="border-border/40 my-6" />

              {/* SECTION 3: REGISTER FRIEND / INVITES */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Step 3
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
                    email to complete your {activePass?.customName || activePass?.passCategory || 'pass'}.
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

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              size="sm"
              className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg px-6 py-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-[11px] uppercase tracking-wider"
            >
              Complete Checkout • {calculatedTotal}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
