"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Menu, Calendar, Search } from "lucide-react";
import { TypographySpan } from "@/components/atoms/typography/typography";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import { LogoutDocument } from "@/gql/graphql";

export interface HeaderActionsProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const HeaderActions = ({ theme, toggleTheme }: HeaderActionsProps) => {
  const router = useRouter();
  const [logout, { loading }] = useMutation(LogoutDocument);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      const { data } = await logout();
      if (data?.logout?.statusCode === 200) {
        toast.success("Logged out successfully");
        setIsMenuOpen(false);
        router.push("/login");
      }
    } catch (err) {
      toast.error("Logout failed", {
        description: (err as Error).message || "Something went wrong.",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="hidden md:flex p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="size-5" />
        ) : (
          <Sun className="size-5" />
        )}
      </button>

      {/* Mobile Search Icon */}
      <button className="md:hidden p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer" aria-label="Search">
        <Search className="size-5" />
      </button>

      {/* Menu & Pass Icon Group */}
      <div className="flex items-center gap-2 md:gap-5 p-1 md:pl-3 border border-transparent md:border-border hover:shadow-sm rounded-full transition-all bg-transparent md:bg-secondary/10 hover:bg-secondary/20 relative" ref={menuRef}>
        <button 
          aria-label="User menu" 
          className="cursor-pointer outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
        
        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full mt-[5px] right-1 md:right-auto md:left-0 w-48 bg-background border border-border rounded-xl shadow-lg p-1 z-50 flex flex-col">
            <Link href="/profile" className="px-3 py-1.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-primary transition-colors rounded-md">
              My Profile
            </Link>
            <Link href="/settings" className="px-3 py-1.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-primary transition-colors rounded-md">
              Settings
            </Link>
            <Link href="/my-passes" className="px-3 py-1.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-primary transition-colors rounded-md">
              My Passes
            </Link>
            <Link href="/host/events" className="md:hidden px-3 py-1.5 text-sm text-foreground/90 hover:bg-muted/50 hover:text-primary transition-colors rounded-md">
              Host Event
            </Link>
            <div className="h-px bg-border my-1 mx-1"></div>
            <button 
              onClick={handleLogout}
              disabled={loading}
              className="text-left px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full rounded-md disabled:opacity-50"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}

        <Link href="/host/events" className="hidden md:block">
          <div className="cursor-pointer h-7 px-3 gap-1.5 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center text-white font-semibold shadow-sm">
            <Calendar className="size-3.5" />
            <TypographySpan className="text-[11px] leading-none">Host Event</TypographySpan>
          </div>
        </Link>
      </div>
    </div>
  );
};
