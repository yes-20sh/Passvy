import React from "react";
import { Label } from "@/components/atoms/label/label";
import { Button } from "@/components/atoms/button/button";
import {  CheckCircle2, CreditCard, QrCode, Building2, Hash, Banknote } from "lucide-react";


interface EventPaymentsFormProps {
  acceptedMethods: string[];
  setAcceptedMethods: React.Dispatch<React.SetStateAction<string[]>>;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  hasChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
}

export const EventPaymentsForm = ({
  acceptedMethods, setAcceptedMethods,
  onBack, onSubmit,
  hasChanges = false,
  onSave,
  isSaving = false
}: EventPaymentsFormProps) => {

  const toggleMethod = (method: string) => {
    setAcceptedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">


      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
          <span className="text-xs font-bold uppercase tracking-wider">
            Step 3
          </span>
        </div>
        <h2 className="text-xl font-black tracking-tight text-foreground">
          Payment & Payouts
        </h2>
        <p className="text-xs text-muted-foreground">
          Select how your attendees can pay and configure where your funds will be sent.
        </p>
      </div>

      <form id="publish-event-form" onSubmit={onSubmit} className="space-y-8">
        
        <div className="space-y-3">
          <Label className="text-xs font-extrabold uppercase tracking-wider block">Accepted Payment Methods</Label>
          <div className="flex gap-4 flex-wrap">
            {/* FREE */}
            <button
              type="button"
              onClick={() => toggleMethod("FREE")}
              className={`flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center relative ${
                acceptedMethods.includes("FREE")
                  ? "ring-2 ring-emerald-600 border-emerald-600 bg-emerald-600/5 text-emerald-700 dark:text-emerald-500"
                  : "border-border hover:border-emerald-600 bg-secondary/10 text-muted-foreground opacity-70 grayscale"
              }`}
            >
              {acceptedMethods.includes("FREE") && (
                <CheckCircle2 className="size-4 text-emerald-600 absolute top-2 right-2" />
              )}
              <Banknote className="size-6" />
              <span className="font-bold text-xs">Free</span>
            </button>

            {/* CHECKIN */}
            <button
              type="button"
              onClick={() => toggleMethod("CHECKIN")}
              className={`flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center relative ${
                acceptedMethods.includes("CHECKIN")
                  ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5 text-indigo-700 dark:text-indigo-400"
                  : "border-border hover:border-indigo-600 bg-secondary/10 text-muted-foreground opacity-70 grayscale"
              }`}
            >
              {acceptedMethods.includes("CHECKIN") && (
                <CheckCircle2 className="size-4 text-indigo-600 absolute top-2 right-2" />
              )}
              <Hash className="size-6" />
              <span className="font-bold text-xs leading-tight">Pay at<br/>Check-in</span>
            </button>

            {/* RAZORPAY */}
            <button
              type="button"
              disabled
              className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl border-2 border-border/60 bg-secondary/20 text-muted-foreground cursor-not-allowed opacity-70 relative overflow-hidden"
            >
              <CreditCard className="size-6" />
              <span className="font-bold text-xs">Razorpay</span>
              <div className="absolute top-0 inset-x-0 bg-secondary text-[9px] font-bold py-0.5 text-center">Coming Soon</div>
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/40">
          <Label className="text-xs font-extrabold uppercase tracking-wider block">Payout Details</Label>
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              disabled
              className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl border-2 border-border/60 bg-secondary/20 text-muted-foreground cursor-not-allowed opacity-70 relative overflow-hidden"
            >
              <Building2 className="size-6" />
              <span className="font-bold text-xs leading-tight text-center">Bank<br/>Account</span>
              <div className="absolute top-0 inset-x-0 bg-secondary text-[9px] font-bold py-0.5 text-center">Coming Soon</div>
            </button>
            <button
              type="button"
              disabled
              className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl border-2 border-border/60 bg-secondary/20 text-muted-foreground cursor-not-allowed opacity-70 relative overflow-hidden"
            >
              <QrCode className="size-6" />
              <span className="font-bold text-xs">UPI ID</span>
              <div className="absolute top-0 inset-x-0 bg-secondary text-[9px] font-bold py-0.5 text-center">Coming Soon</div>
            </button>
          </div>
          

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
          >
            Back
          </Button>
          {hasChanges ? (
            <Button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
            >
              Publish Event
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

