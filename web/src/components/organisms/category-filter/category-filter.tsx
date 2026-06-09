import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { type Category } from '@/app/(main)/data';
import { TypographySpan } from '@/components/atoms/typography/typography';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/atoms/dropdown-menu';

export interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6;
      scrollRef.current.scrollTo({
        left:
          direction === 'left'
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="my-6 flex items-center gap-4 py-2">
      {/* Left side: Category Carousel */}
      <div className="group/carousel relative min-w-0 flex-1">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 left-0 z-10 hidden size-9 -translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/carousel:opacity-100 active:scale-95 md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Carousel Track */}
        <div
          ref={scrollRef}
          className="flex scrollbar-none items-center gap-3 overflow-x-auto scroll-smooth px-1 py-1"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected =
              (cat.name === 'All Events' && !selectedCategory) ||
              selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    cat.name === 'All Events' ? null : cat.name,
                  )
                }
                className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border p-3 px-4 transition-all duration-300 select-none hover:-translate-y-0.5 active:scale-95 ${
                  isSelected
                    ? 'border-indigo-700 bg-indigo-700 text-white shadow-sm shadow-indigo-700/20'
                    : 'bg-secondary/15 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-indigo-500/20'
                }`}
              >
                <Icon
                  className={`size-4.5 ${
                    isSelected
                      ? 'text-white'
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}
                />
                <TypographySpan className="text-[13px] font-semibold tracking-wide">
                  {cat.name}
                </TypographySpan>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="border-border bg-background/95 text-foreground hover:bg-secondary absolute top-1/2 right-0 z-10 hidden size-9 translate-x-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border p-2 opacity-0 shadow-md transition-opacity duration-300 group-hover/carousel:opacity-100 active:scale-95 md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Right side: Filter Button */}
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-secondary/15 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/30 flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border p-3 px-4 text-[13px] font-semibold transition-all duration-300 outline-none select-none hover:-translate-y-0.5 hover:border-indigo-500/20 active:scale-95">
          <SlidersHorizontal className="size-4 text-indigo-600 dark:text-indigo-400" />
          <TypographySpan>Filters</TypographySpan>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Event Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Upcoming
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Ongoing
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Past</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
