"use client";

import React, { useState } from "react";
import { DescriptionBlock, EventPass, EventCoupon } from "./types";
import { CreateEventStepper } from "../../molecules/create-event-stepper/create-event-stepper";
import { EventEssentialsForm } from "../../molecules/event-essentials-form/event-essentials-form";
import { EventPassesForm } from "../../molecules/event-passes-form/event-passes-form";
import { EventPaymentsForm } from "../../molecules/event-payments-form/event-payments-form";
import { EventLivePreview } from "../../molecules/event-live-preview/event-live-preview";

export const CreateEventForm = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [blocks, setBlocks] = useState<DescriptionBlock[]>([
    {
      id: "1",
      type: "heading",
      content: "About This Event",
      level: "h2"
    },
    {
      id: "2",
      type: "paragraph",
      content: "Join us for an unforgettable experience...",
      textSize: "base"
    }
  ]);
  const [passes, setPasses] = useState<EventPass[]>([
    {
      id: "1",
      pricing: "FREE",
      tier: "GA",
      customName: "",
      category: "SINGLE",
      quantity: "100",
      price: ""
    }
  ]);
  const [coupons, setCoupons] = useState<EventCoupon[]>([]);
  const [acceptedMethods, setAcceptedMethods] = useState<string[]>(["CARD", "WALLET", "CRYPTO"]);
  const [payoutAddress, setPayoutAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating Event:", { title, headerImage, blocks, passes, coupons, acceptedMethods, payoutAddress });
    alert("Event Published Successfully!");
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <CreateEventStepper step={step} />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 flex flex-col gap-8 text-left">
          {step === 1 && (
            <EventEssentialsForm
              title={title}
              setTitle={setTitle}
              headerImage={headerImage}
              setHeaderImage={setHeaderImage}
              blocks={blocks}
              setBlocks={setBlocks}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <EventPassesForm
              passes={passes}
              setPasses={setPasses}
              coupons={coupons}
              setCoupons={setCoupons}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <EventPaymentsForm
              acceptedMethods={acceptedMethods}
              setAcceptedMethods={setAcceptedMethods}
              payoutAddress={payoutAddress}
              setPayoutAddress={setPayoutAddress}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <EventLivePreview
          title={title}
          headerImage={headerImage}
          blocks={blocks}
          passes={passes}
          coupons={coupons}
        />
      </div>
    </div>
  );
};
