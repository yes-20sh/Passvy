"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Moon, Sun, Lock, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/atoms/card/card";
import { TypographyMuted } from "@/components/atoms/typography/typography";
import AVTAR from "@/assets/image/avtar";
import { Header } from "@/components/organisms/header/header";
import { Badge, BadgeVariant } from "@/components/atoms/badge/badge";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(AVTAR.avtar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const EVENT_CATEGORIES = ["Music", "Technology", "Sports", "Arts & Culture", "Business", "Food & Drink", "Networking", "Education", "Health & Wellness"];
  const [eventPreferences, setEventPreferences] = useState<string[]>(["Music", "Technology"]);

  const toggleEventPreference = (category: string) => {
    setEventPreferences((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = (savedTheme as "light" | "dark") || systemTheme;

    setTimeout(() => {
      setTheme(initialTheme);
    }, 0);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container mx-auto py-10 max-w-4xl px-4 animate-in fade-in duration-500 flex-1">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-start">
          <div className="md:col-span-1 space-y-6 sticky top-24">
            {/* Avatar Section */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your avatar.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div 
                  className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-muted/50 hover:border-primary/50 transition-colors shadow-sm cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <Image
                    src={avatarUrl}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="text-white size-8" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleAvatarClick}>
                  Upload New Photo
                </Button>
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your app preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-colors">
                  <div className="space-y-0.5">
                    <Label className="cursor-pointer">Theme</Label>
                    <TypographyMuted className="text-xs">
                      Toggle dark or light mode
                    </TypographyMuted>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                    className="rounded-full shadow-sm hover:scale-105 transition-transform"
                  >
                    {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Event Preferences */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Event Preferences</CardTitle>
                <CardDescription>Select the types of events you are interested in attending.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map((category) => {
                    const isSelected = eventPreferences.includes(category);
                    return (
                      <Badge
                        key={category}
                        variant={isSelected ? BadgeVariant.Default : BadgeVariant.Outline}
                        className="cursor-pointer text-sm py-1.5 px-4 transition-all hover:scale-105"
                        onClick={() => toggleEventPreference(category)}
                      >
                        {category}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-border/50 pt-5 pb-5 px-6 bg-muted/20">
                <Button className="shadow-sm hover:shadow transition-all">Save Preferences</Button>
              </CardFooter>
            </Card>

            {/* Personal Information */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="user@example.com"
                    readOnly
                    disabled
                    className="bg-muted/50 cursor-not-allowed opacity-70"
                  />
                  <TypographyMuted className="text-[11px] px-1">
                    Your email address cannot be changed.
                  </TypographyMuted>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="fullName" className="flex items-center gap-2 transition-colors group-focus-within:text-primary">
                    <User className="size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    Full Name
                  </Label>
                  <Input id="fullName" placeholder="Enter your full name" defaultValue="John Doe" className="transition-all focus-visible:ring-primary/50" />
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="mobile" className="flex items-center gap-2 transition-colors group-focus-within:text-primary">
                    <Phone className="size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    Mobile Number
                  </Label>
                  <Input id="mobile" type="tel" placeholder="Enter your mobile number" defaultValue="+1 234 567 890" className="transition-all focus-visible:ring-primary/50" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-border/50 pt-5 pb-5 px-6 bg-muted/20">
                <Button className="shadow-sm hover:shadow transition-all">Save Changes</Button>
              </CardFooter>
            </Card>

            {/* Security */}
            <Card className="hover:shadow-md transition-shadow overflow-hidden">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-4" /> Security
                </CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </CardHeader>
              {!isChangingPassword ? (
                <CardContent className="pt-6 pb-6">
                  <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="text-sm font-medium text-foreground">Password</div>
                      <TypographyMuted className="text-xs mt-0.5">Protect your account with a strong password.</TypographyMuted>
                    </div>
                    <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardContent className="space-y-5 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 size-4 text-muted-foreground/70" />
                        <Input id="currentPassword" type="password" placeholder="••••••••" className="pl-9 focus-visible:ring-destructive/30" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 size-4 text-muted-foreground/70" />
                        <Input id="newPassword" type="password" placeholder="••••••••" className="pl-9 focus-visible:ring-destructive/30" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 size-4 text-muted-foreground/70" />
                        <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-9 focus-visible:ring-destructive/30" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3 border-t border-border/50 pt-5 pb-5 px-6 bg-muted/20">
                    <Button variant="outline" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                    <Button variant="destructive" className="shadow-sm hover:shadow transition-all">Update Password</Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
