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
} from "@/store/slices/create-event.slice";
import { DescriptionBlock, EventPass, EventCoupon } from "./types";

export const CreateEventForm = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.createEvent);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmPublish = () => {
    setShowConfirm(false);
    console.log("Creating Event:", formState);
    alert("Event Published Successfully!");
  };

  // Wrapper handlers to convert values and dispatch cleanly
  const handleUpdate = <K extends keyof typeof formState>(field: K, value: typeof formState[K]) => {
    dispatch(updateField({ field, value }));
  };

  // Convert Date strings to Date objects for the DatePicker
  const parsedStartDate = formState.startDate ? new Date(formState.startDate) : undefined;
  const parsedEndDate = formState.endDate ? new Date(formState.endDate) : undefined;

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
            />
          )}

          {formState.step === 2 && (
            <EventDescriptionForm
              blocks={formState.blocks}
              setBlocks={(b) => dispatch(setBlocks(b as DescriptionBlock[]))}
              onBack={() => dispatch(setStep(1))}
              onNext={() => dispatch(setStep(3))}
            />
          )}

          {formState.step === 3 && (
            <EventModeForm
              eventMode={formState.eventMode}
              setEventMode={(v) => handleUpdate("eventMode", v)}
              onlineLink={formState.onlineLink}
              setOnlineLink={(v) => handleUpdate("onlineLink", v)}
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
            />
          )}

          {formState.step === 4 && (
            <EventPassesForm
              passes={formState.passes}
              setPasses={(p) => dispatch(setPasses(p as EventPass[]))}
              coupons={formState.coupons}
              setCoupons={(c) => dispatch(setCoupons(c as EventCoupon[]))}
              onBack={() => dispatch(setStep(3))}
              onNext={() => dispatch(setStep(5))}
            />
          )}

          {formState.step === 5 && (
            <EventPaymentsForm
              acceptedMethods={formState.acceptedMethods}
              setAcceptedMethods={(m) => dispatch(setAcceptedMethods(m as string[]))}
              payoutMethod={formState.payoutMethod}
              setPayoutMethod={(v) => handleUpdate("payoutMethod", v)}
              payoutUpiId={formState.payoutUpiId}
              setPayoutUpiId={(v) => handleUpdate("payoutUpiId", v)}
              payoutBankName={formState.payoutBankName}
              setPayoutBankName={(v) => handleUpdate("payoutBankName", v)}
              payoutAccountName={formState.payoutAccountName}
              setPayoutAccountName={(v) => handleUpdate("payoutAccountName", v)}
              payoutAccountNumber={formState.payoutAccountNumber}
              setPayoutAccountNumber={(v) => handleUpdate("payoutAccountNumber", v)}
              payoutIfsc={formState.payoutIfsc}
              setPayoutIfsc={(v) => handleUpdate("payoutIfsc", v)}
              onBack={() => dispatch(setStep(4))}
              onSubmit={handleSubmit}
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
        />
      </div>
    </div>
  );
};
