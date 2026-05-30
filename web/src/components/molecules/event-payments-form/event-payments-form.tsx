import React from "react";
import { Label } from "@/components/atoms/label/label";
import { Input } from "@/components/atoms/input/input";
import { Button } from "@/components/atoms/button/button";
import { ArrowLeft, CheckCircle2, CreditCard, Wallet, Coins, Building2 } from "lucide-react";

interface EventPaymentsFormProps {
  acceptedMethods: string[];
  setAcceptedMethods: React.Dispatch<React.SetStateAction<string[]>>;
  payoutAddress: string;
  setPayoutAddress: (val: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EventPaymentsForm = ({
  acceptedMethods, setAcceptedMethods, payoutAddress, setPayoutAddress, onBack, onSubmit
}: EventPaymentsFormProps) => {

  const toggleMethod = (method: string) => {
    setAcceptedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Passes</span>
        </button>
      </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => toggleMethod("CARD")}
              className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center relative ${
                acceptedMethods.includes("CARD")
                  ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                  : "border-border hover:border-indigo-600 bg-secondary/10 opacity-70 grayscale"
              }`}
            >
              {acceptedMethods.includes("CARD") && (
                <CheckCircle2 className="size-4 text-indigo-600 absolute top-2 right-2" />
              )}
              <CreditCard className={`size-6 ${acceptedMethods.includes("CARD") ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`} />
              <span className="font-extrabold text-xs text-foreground">Credit Card</span>
            </div>

            <div
              onClick={() => toggleMethod("WALLET")}
              className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center relative ${
                acceptedMethods.includes("WALLET")
                  ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                  : "border-border hover:border-indigo-600 bg-secondary/10 opacity-70 grayscale"
              }`}
            >
              {acceptedMethods.includes("WALLET") && (
                <CheckCircle2 className="size-4 text-indigo-600 absolute top-2 right-2" />
              )}
              <Wallet className={`size-6 ${acceptedMethods.includes("WALLET") ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`} />
              <span className="font-extrabold text-xs text-foreground">Passvy Wallet</span>
            </div>

            <div
              onClick={() => toggleMethod("CRYPTO")}
              className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center relative ${
                acceptedMethods.includes("CRYPTO")
                  ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                  : "border-border hover:border-indigo-600 bg-secondary/10 opacity-70 grayscale"
              }`}
            >
              {acceptedMethods.includes("CRYPTO") && (
                <CheckCircle2 className="size-4 text-indigo-600 absolute top-2 right-2" />
              )}
              <Coins className={`size-6 ${acceptedMethods.includes("CRYPTO") ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`} />
              <span className="font-extrabold text-xs text-foreground">Crypto</span>
            </div>
          </div>
        </div>

        <div className="p-4 border border-border/40 rounded-xl bg-secondary/5 space-y-4">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="payoutAddress">Payout Bank/Wallet Address</Label>
            <div className="relative">
              <Input
                id="payoutAddress"
                type="text"
                placeholder="Enter Bank Account or Web3 Wallet Address..."
                value={payoutAddress}
                onChange={(e) => setPayoutAddress(e.target.value)}
                className="pl-9 h-10"
              />
              <Building2 className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Funds will be settled to this account post-event minus platform fees.</p>
          </div>
        </div>

        <hr className="border-border/40" />

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg py-3 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
        >
          Publish Event
        </Button>
      </form>
    </div>
  );
};

