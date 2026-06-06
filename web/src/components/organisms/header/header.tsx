import React from "react";
import { HeaderLogo } from "@/components/molecules/header-logo/header-logo";
import { HeaderSearch } from "@/components/molecules/header-search/header-search";
import { HeaderActions } from "@/components/molecules/header-actions/header-actions";

export interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const Header = ({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <HeaderLogo />
        </div>

        {/* Center Section: Search Bar with Account Avatar inside on the right */}
        <HeaderSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Right Section: Theme Toggle & Menu Icon */}
        <HeaderActions theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};
