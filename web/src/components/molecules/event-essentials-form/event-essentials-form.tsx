import React, { useState } from 'react';
import { z } from 'zod';
import { eventEssentialsSchema } from '@/validation/event-essentials.validation';
import { Button } from '@/components/atoms/button/button';
import { EventEssentialsFields } from '../event-essentials-fields/event-essentials-fields';
import { EventEssentialsFormProps } from '@/interfaces/events/event-essentials-form.interface';

export const EventEssentialsForm = ({
  title,
  setTitle,
  headerImage,
  setHeaderImage,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  category,
  setCategory,
  onNext,
  hasChanges = false,
  onSave,
  isSaving = false,
}: EventEssentialsFormProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    try {
      eventEssentialsSchema.parse({
        title,
        startDate,
        startTime,
        endDate,
        endTime,
        category,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
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
    <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-8 duration-300">
      {/* SECTION 1: EVENT ESSENTIALS */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold tracking-wider uppercase">
              Step 1
            </span>
          </div>
          <h2 className="text-foreground text-xl font-black tracking-tight">
            Event Essentials
          </h2>
          <p className="text-muted-foreground text-xs">
            Set the core identity of your event.
          </p>
        </div>

        <form
          id="create-event-form"
          onSubmit={handleAction}
          className="space-y-4"
        >
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
      <div className="border-border/50 flex justify-end border-t pt-4">
        {hasChanges ? (
          <Button
            type="button"
            onClick={handleAction}
            loading={isSaving}
            className="h-9 cursor-pointer rounded-lg bg-emerald-600 px-8 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            Save
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleAction}
            className="h-9 cursor-pointer rounded-lg bg-indigo-700 px-8 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-indigo-600 active:scale-[0.98]"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
