"use client";

import React, { useState } from "react";
import { CreateEventStepper } from "../../molecules/create-event-stepper/create-event-stepper";
import { EventEssentialsForm } from "../../molecules/event-essentials-form/event-essentials-form";
import { EventModeForm } from "../../molecules/event-mode-form/event-mode-form";
import { EventDescriptionForm } from "../../molecules/event-description-form/event-description-form";
import { EventPassesForm } from "../../molecules/event-passes-form/event-passes-form";
import { EventPaymentsForm } from "../../molecules/event-payments-form/event-payments-form";
import { EventLivePreview } from "../../molecules/event-live-preview/event-live-preview";
import { Button } from "@/components/atoms/button/button";

// GraphQL/Apollo
import { useMutation } from "@apollo/client/react";
import {
  CreateEventDocument,
  CreateEventInput,
  EventStep,
  EventMode, 
  PassPricing,
  PassTier,
  DiscountType,
} from "@/gql/graphql";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Redux hooks and actions
import { useAppSelector } from "@/store/hooks/useAppSelector";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import {
  setStep,
  updateField,
  setBlocks,
  setPasses,
  setCoupons,
  setAcceptedMethods,
  updateEventFromSaved,
  CreateEventState
} from "@/store/slices/create-event.slice";


const isSameDate = (d1: string | Date | null | undefined, d2: string | Date | null | undefined) => {
  if (!d1 && !d2) return true;
  if (!d1 || !d2) return false;
  return new Date(d1).getTime() === new Date(d2).getTime();
};

const hasStepChanges = (
  step: number,
  current: CreateEventState,
  saved: CreateEventState['lastSavedValues']
) => {
  if (!saved) return true;

  switch (step) {
    case 1:
      return (
        current.title !== (saved.title ?? "") ||
        current.headerImage !== (saved.headerImage ?? "") ||
        !isSameDate(current.startDate, saved.startDate) ||
        current.startTime !== (saved.startTime ?? "") ||
        !isSameDate(current.endDate, saved.endDate) ||
        current.endTime !== (saved.endTime ?? "") ||
        current.category !== (saved.category ?? "")
      );
    case 2:
      return JSON.stringify(current.blocks) !== JSON.stringify(saved.blocks);
    case 3:
      return (
        current.eventMode !== saved.eventMode ||
        current.generateMeetLink !== saved.generateMeetLink ||
        current.onlineLink !== (saved.onlineLink ?? "") ||
        current.offlineAddress !== (saved.offlineAddress ?? "") ||
        current.offlineMapLink !== (saved.offlineMapLink ?? "") ||
        current.offlineLandmark !== (saved.offlineLandmark ?? "") ||
        current.capacity !== (saved.capacity ?? "")
      );
    case 4:
      return (
        JSON.stringify(current.passes) !== JSON.stringify(saved.passes) ||
        JSON.stringify(current.coupons) !== JSON.stringify(saved.coupons)
      );
    case 5:
      return (
        JSON.stringify(current.acceptedMethods) !== JSON.stringify(saved.acceptedMethods)
      );
    default:
      return false;
  }
};

export const CreateEventForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const formState = useAppSelector((state) => state.createEvent);

  const [createEventMutation, { loading }] = useMutation(CreateEventDocument);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async (stepNum: number, isPublishing = false) => {
    try {
      const stepperMap: Record<number, EventStep> = {
        1: "ESSENTIALS",
        2: "DESCRIPTION",
        3: "MODE",
        4: "PASSES",
        5: "PAYOUTS",
      };

      const input: CreateEventInput = {
        eventId: formState.eventId || undefined,
        title: formState.title,
        category: formState.category || undefined,
        startDate: formState.startDate || undefined,
        startTime: formState.startTime || undefined,
        endDate: formState.endDate || undefined,
        endTime: formState.endTime || undefined,
        headerImage: formState.headerImage || undefined,
        
        descriptionBlocks: formState.blocks.map((block, idx) => ({
          blockType: block.type,
          content: block.content,
          headingLevel: block.level || undefined,
          textSize: block.textSize || undefined,
          listStyle: block.listStyle || undefined,
          sortOrder: idx + 1,
        })),

        eventMode: formState.eventMode as EventMode,
        onlineLink: formState.onlineLink || undefined,
        offlineAddress: formState.offlineAddress || undefined,
        offlineMapLink: formState.offlineMapLink || undefined,
        offlineLandmark: formState.offlineLandmark || undefined,
        capacity: formState.capacity ? parseInt(formState.capacity, 10) : undefined,

        passes: formState.passes.map(p => ({
          pricing: p.pricing as PassPricing,
          tier: p.tier as PassTier,
          customName: p.customName || undefined,
          passCategory: p.category || undefined,
          quantity: p.quantity ? parseInt(p.quantity, 10) : undefined,
          price: p.pricing === "FREE" ? 0 : (p.price ? parseFloat(p.price) : 0),
        })),
        coupons: formState.coupons.map(c => ({
          code: c.code,
          discountType: c.discountType as DiscountType,
          discountValue: parseFloat(c.discountValue) || 0,
        })),

        paymentSetting: {
          acceptedMethods: formState.acceptedMethods,
        },

        stepper: stepperMap[stepNum],
        status: isPublishing ? "PUBLISHED" : "DRAFT",
      };

      const { data } = await createEventMutation({
        variables: { input },
      });

      if (data?.createEvent?.event) {
        dispatch(updateEventFromSaved(data.createEvent.event));
        toast.success(data.createEvent.message || "Event saved successfully!");
        if (isPublishing) {
          router.push("/host/events");
        }
      } else {
        toast.error("Failed to save event");
      }
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(error.message || "An error occurred while saving the event.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmPublish = () => {
    setShowConfirm(false);
    handleSave(5, true);
  };

  // Wrapper handlers to convert values and dispatch cleanly
  const handleUpdate = <K extends keyof typeof formState>(field: K, value: typeof formState[K]) => {
    dispatch(updateField({ field, value }));
  };

  // Convert Date strings to Date objects for the DatePicker
  const parsedStartDate = formState.startDate ? new Date(formState.startDate) : undefined;
  const parsedEndDate = formState.endDate ? new Date(formState.endDate) : undefined;

  const stepChanges = hasStepChanges(formState.step, formState, formState.lastSavedValues);

  return (
    <div className="flex flex-col gap-10 w-full">
      <CreateEventStepper step={formState.step} />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 flex flex-col gap-8 text-left">
          {formState.step === 1 && (
            <EventEssentialsForm
              title={formState.title}
              setTitle={(v) => handleUpdate("title", v)}
              headerImage={formState.headerImage}
              setHeaderImage={(v) => handleUpdate("headerImage", v)}
              startDate={parsedStartDate}
              setStartDate={(v) => handleUpdate("startDate", v?.toISOString())}
              startTime={formState.startTime}
              setStartTime={(v) => handleUpdate("startTime", v)}
              endDate={parsedEndDate}
              setEndDate={(v) => handleUpdate("endDate", v?.toISOString())}
              endTime={formState.endTime}
              setEndTime={(v) => handleUpdate("endTime", v)}
              category={formState.category}
              setCategory={(v) => handleUpdate("category", v)}
              onNext={() => dispatch(setStep(2))}
              hasChanges={stepChanges}
              onSave={() => handleSave(1)}
              isSaving={loading}
            />
          )}

          {formState.step === 2 && (
            <EventDescriptionForm
              blocks={formState.blocks}
              setBlocks={(b) => {
                if (typeof b === "function") {
                  dispatch(setBlocks(b(formState.blocks)));
                } else {
                  dispatch(setBlocks(b));
                }
              }}
              onBack={() => dispatch(setStep(1))}
              onNext={() => dispatch(setStep(3))}
              hasChanges={stepChanges}
              onSave={() => handleSave(2)}
              isSaving={loading}
            />
          )}

          {formState.step === 3 && (
            <EventModeForm
              eventMode={formState.eventMode}
              setEventMode={(v) => handleUpdate("eventMode", v)}
              startDate={parsedStartDate}
              setStartDate={(v) => handleUpdate("startDate", v?.toISOString())}
              startTime={formState.startTime}
              setStartTime={(v) => handleUpdate("startTime", v)}
              endDate={parsedEndDate}
              setEndDate={(v) => handleUpdate("endDate", v?.toISOString())}
              endTime={formState.endTime}
              setEndTime={(v) => handleUpdate("endTime", v)}
              offlineAddress={formState.offlineAddress}
              setOfflineAddress={(v) => handleUpdate("offlineAddress", v)}
              offlineMapLink={formState.offlineMapLink}
              setOfflineMapLink={(v) => handleUpdate("offlineMapLink", v)}
              offlineLandmark={formState.offlineLandmark}
              setOfflineLandmark={(v) => handleUpdate("offlineLandmark", v)}
              capacity={formState.capacity}
              setCapacity={(v) => handleUpdate("capacity", v)}
              onBack={() => dispatch(setStep(2))}
              onNext={() => dispatch(setStep(4))}
              hasChanges={stepChanges}
              onSave={() => handleSave(3)}
              isSaving={loading}
            />
          )}

          {formState.step === 4 && (
            <EventPassesForm
              passes={formState.passes}
              setPasses={(p) => {
                if (typeof p === "function") {
                  dispatch(setPasses(p(formState.passes)));
                } else {
                  dispatch(setPasses(p));
                }
              }}
              coupons={formState.coupons}
              setCoupons={(c) => {
                if (typeof c === "function") {
                  dispatch(setCoupons(c(formState.coupons)));
                } else {
                  dispatch(setCoupons(c));
                }
              }}
              onBack={() => dispatch(setStep(3))}
              onNext={() => dispatch(setStep(5))}
              hasChanges={stepChanges}
              onSave={() => handleSave(4)}
              isSaving={loading}
            />
          )}

          {formState.step === 5 && (
            <EventPaymentsForm
              acceptedMethods={formState.acceptedMethods}
              setAcceptedMethods={(m) => {
                if (typeof m === "function") {
                  dispatch(setAcceptedMethods(m(formState.acceptedMethods)));
                } else {
                  dispatch(setAcceptedMethods(m));
                }
              }}
              onBack={() => dispatch(setStep(4))}
              onSubmit={handleSubmit}
              hasChanges={stepChanges}
              onSave={() => handleSave(5)}
              isSaving={loading}
            />
          )}

          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight text-foreground">Publish Event?</h3>
                  <p className="text-sm text-muted-foreground">Are you sure you want to publish <strong className="text-foreground">{formState.title || "this event"}</strong>? Once published, the event will go live and attendees can start purchasing passes.</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    className="font-bold rounded-lg px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmPublish}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-6"
                  >
                    Confirm & Publish
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <EventLivePreview
          title={formState.title}
          headerImage={formState.headerImage}
          blocks={formState.blocks}
          passes={formState.passes}
          coupons={formState.coupons}
          startDate={parsedStartDate}
          startTime={formState.startTime}
          endDate={parsedEndDate}
          endTime={formState.endTime}
          category={formState.category}
          eventMode={formState.eventMode}
          onlineLink={formState.onlineLink}
          offlineAddress={formState.offlineAddress}
          capacity={formState.capacity}
          currentStep={formState.step}
        />
      </div>
    </div>
  );
};
