import React, { useRef, useState, useEffect } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

interface StepperProps {
  step: number;
}

export const CreateEventStepper = ({ step }: StepperProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({ left: direction === "left" ? -clientWidth / 2 : clientWidth / 2, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto flex items-center group">
      {canScrollLeft && (
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 p-1 bg-background/80 backdrop-blur-sm border border-border shadow-sm rounded-full -translate-x-1/2 hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="size-4 text-foreground" />
        </button>
      )}

      <div 
        ref={scrollRef} 
        onScroll={checkScroll}
        className="w-full overflow-x-auto pb-4 scrollbar-none scroll-smooth"
      >
        <div className="flex items-center justify-between min-w-[600px] md:min-w-full px-2 pt-2">
      {[
        { num: 1, title: "Essentials" },
        { num: 2, title: "Description" },
        { num: 3, title: "Mode" },
        { num: 4, title: "Passes" },
        { num: 5, title: "Payouts" }
      ].map((s, idx) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step === s.num
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110"
                  : step > s.num
                  ? "bg-emerald-500 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="size-5" /> : s.num}
            </div>
            <span
              className={`text-xs font-extrabold uppercase tracking-widest transition-colors ${
                step >= s.num ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.title}
            </span>
          </div>
          {idx < 4 && (
            <div
              className={`flex-1 h-[3px] mx-4 rounded-full transition-colors duration-300 ${
                step > s.num ? "bg-emerald-500" : "bg-secondary"
              }`}
            />
          )}
        </React.Fragment>
      ))}
        </div>
      </div>

      {canScrollRight && (
        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 p-1 bg-background/80 backdrop-blur-sm border border-border shadow-sm rounded-full translate-x-1/2 hover:bg-secondary transition-colors"
        >
          <ChevronRight className="size-4 text-foreground" />
        </button>
      )}
    </div>
  );
};
