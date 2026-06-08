import React, { useState } from "react";
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
  hasChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}

export const EventEssentialsForm = ({
  title, setTitle, headerImage, setHeaderImage, startDate, setStartDate, startTime, setStartTime, endDate, setEndDate, endTime, setEndTime, category, setCategory, onNext, hasChanges = false, onSave, isSaving = false
}: EventEssentialsFormProps) => {

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title?.trim()) newErrors.title = "Event title is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (!category) newErrors.category = "Event category is required";

    if (startDate && startTime && endDate && endTime) {
      const start = new Date(startDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      start.setHours(startHours, startMinutes, 0, 0);

      const end = new Date(endDate);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      end.setHours(endHours, endMinutes, 0, 0);

      if (end <= start) {
        newErrors.endDate = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (hasChanges && onSave) {
      onSave();
    } else {
      onNext(e);
    }
  };

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

        <form id="create-event-form" onSubmit={handleAction} className="space-y-4">
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
            errors={errors}
          />
        </form>
      </div>



      {/* SUBMIT */}
      <div className="flex justify-end pt-4 border-t border-border/50">
        {hasChanges ? (
          <Button
            type="button"
            onClick={handleAction}
            loading={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
          >
            Save
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleAction}
            className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
