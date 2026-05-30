import React from "react";
import { CheckCircle2 } from "lucide-react";

interface StepperProps {
  step: number;
}

export const CreateEventStepper = ({ step }: StepperProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between mb-4">
      {[
        { num: 1, title: "Essentials" },
        { num: 2, title: "Passes" },
        { num: 3, title: "Payouts" }
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
          {idx < 2 && (
            <div
              className={`flex-1 h-[3px] mx-4 rounded-full transition-colors duration-300 ${
                step > s.num ? "bg-emerald-500" : "bg-secondary"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
