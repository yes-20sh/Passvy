import React from "react";
import { Button } from "@/components/atoms/button/button";
import { EventEssentialsFields } from "../event-essentials-fields/event-essentials-fields";

interface EventEssentialsFormProps {
  title: string;
  setTitle: (val: string) => void;
  headerImage: string;
  setHeaderImage: (val: string) => void;
  startDate: Date | undefined;
  setStartDate: (val: Date | undefined) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endDate: Date | undefined;
  setEndDate: (val: Date | undefined) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;

  onNext: (e: React.FormEvent | React.MouseEvent) => void;
}

export const EventEssentialsForm = ({
  title, setTitle, headerImage, setHeaderImage, startDate, setStartDate, startTime, setStartTime, endDate, setEndDate, endTime, setEndTime, category, setCategory, onNext
}: EventEssentialsFormProps) => {

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* SECTION 1: EVENT ESSENTIALS */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Step 1
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Event Essentials
          </h2>
          <p className="text-xs text-muted-foreground">
            Set the core identity of your event.
          </p>
        </div>

        <form id="create-event-form" onSubmit={(e) => { e.preventDefault(); onNext(e); }} className="space-y-4">
          <EventEssentialsFields 
            title={title}
            setTitle={setTitle}
            headerImage={headerImage}
            setHeaderImage={setHeaderImage}
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endDate={endDate}
            setEndDate={setEndDate}
            endTime={endTime}
            setEndTime={setEndTime}
            category={category}
            setCategory={setCategory}
          />
        </form>
      </div>



      {/* SUBMIT */}
      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button
          type="button"
          onClick={onNext}
          className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
