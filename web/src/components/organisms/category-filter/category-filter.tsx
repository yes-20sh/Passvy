import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { type Category } from "@/app/(main)/events/data";
import { TypographySpan } from "@/components/atoms/typography/typography";

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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 my-6 py-2">
      {/* Left side: Category Carousel */}
      <div className="relative flex-1 min-w-0 group/carousel">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Carousel Track */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected =
              (cat.name === "All Events" && !selectedCategory) ||
              selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    cat.name === "All Events" ? null : cat.name,
                  )
                }
                className={`flex items-center gap-2.5 p-3 px-4 rounded-xl cursor-pointer select-none shrink-0 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 border ${
                  isSelected
                    ? "bg-indigo-700 border-indigo-700 text-white shadow-sm shadow-indigo-700/20"
                    : "bg-secondary/15 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-indigo-500/20"
                }`}
              >
                <Icon
                  className={`size-4.5 ${
                    isSelected
                      ? "text-white"
                      : "text-indigo-600 dark:text-indigo-400"
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
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full border border-border bg-background/95 text-foreground hover:bg-secondary shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer size-9 active:scale-95"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Right side: Filter Button */}
      <button
        onClick={() => alert("Advanced filtering panel coming soon!")}
        className="flex items-center gap-2 p-3 px-4 rounded-xl cursor-pointer select-none shrink-0 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 border bg-secondary/15 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-indigo-500/20 font-semibold text-[13px]"
      >
        <SlidersHorizontal className="size-4 text-indigo-600 dark:text-indigo-400" />
        <TypographySpan>Filters</TypographySpan>
      </button>
    </div>
  );
};
