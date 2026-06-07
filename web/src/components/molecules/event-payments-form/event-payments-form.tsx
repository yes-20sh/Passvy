import React from "react";
import { Label } from "@/components/atoms/label/label";
import { Input } from "@/components/atoms/input/input";
import { Button } from "@/components/atoms/button/button";
import {  CheckCircle2, CreditCard, QrCode, Building2, UserCircle2, Hash, Code, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventPaymentsFormProps {
  acceptedMethods: string[];
  setAcceptedMethods: React.Dispatch<React.SetStateAction<string[]>>;
  payoutMethod: "BANK" | "UPI";
  setPayoutMethod: (method: "BANK" | "UPI") => void;
  payoutUpiId: string;
  setPayoutUpiId: (val: string) => void;
  payoutBankName: string;
  setPayoutBankName: (val: string) => void;
  payoutAccountName: string;
  setPayoutAccountName: (val: string) => void;
  payoutAccountNumber: string;
  setPayoutAccountNumber: (val: string) => void;
  payoutIfsc: string;
  setPayoutIfsc: (val: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EventPaymentsForm = ({
  acceptedMethods, setAcceptedMethods,
  payoutMethod, setPayoutMethod,
  payoutUpiId, setPayoutUpiId,
  payoutBankName, setPayoutBankName,
  payoutAccountName, setPayoutAccountName,
  payoutAccountNumber, setPayoutAccountNumber,
  payoutIfsc, setPayoutIfsc,
  onBack, onSubmit
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => toggleMethod("RAZORPAY")}
              className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center relative ${
                acceptedMethods.includes("RAZORPAY")
                  ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                  : "border-border hover:border-indigo-600 bg-secondary/10 opacity-70 grayscale"
              }`}
            >
              {acceptedMethods.includes("RAZORPAY") && (
                <CheckCircle2 className="size-4 text-indigo-600 absolute top-2 right-2" />
              )}
              <CreditCard className={`size-6 ${acceptedMethods.includes("RAZORPAY") ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`} />
              <span className="font-extrabold text-xs text-foreground">Razorpay</span>
            </div>

            <div
              onClick={() => toggleMethod("CHECKIN")}
              className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center relative ${
                acceptedMethods.includes("CHECKIN")
                  ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                  : "border-border hover:border-indigo-600 bg-secondary/10 opacity-70 grayscale"
              }`}
            >
              {acceptedMethods.includes("CHECKIN") && (
                <CheckCircle2 className="size-4 text-indigo-600 absolute top-2 right-2" />
              )}
              <Banknote className={`size-6 ${acceptedMethods.includes("CHECKIN") ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`} />
              <span className="font-extrabold text-xs text-foreground">Pay at Check-in</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/40">
          <Label className="text-xs font-extrabold uppercase tracking-wider block">Payout Details</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPayoutMethod("BANK")}
              className={cn(
                "flex flex-row items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                payoutMethod === "BANK"
                  ? "border-emerald-600 bg-emerald-600/5 text-emerald-700 dark:text-emerald-500"
                  : "border-border/60 bg-card hover:bg-secondary/40 text-muted-foreground"
              )}
            >
              <Building2 className={cn("size-5", payoutMethod === "BANK" ? "opacity-100" : "opacity-50")} />
              <span className="font-bold text-sm">Bank Account</span>
            </button>
            <button
              type="button"
              onClick={() => setPayoutMethod("UPI")}
              className={cn(
                "flex flex-row items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                payoutMethod === "UPI"
                  ? "border-emerald-600 bg-emerald-600/5 text-emerald-700 dark:text-emerald-500"
                  : "border-border/60 bg-card hover:bg-secondary/40 text-muted-foreground"
              )}
            >
              <QrCode className={cn("size-5", payoutMethod === "UPI" ? "opacity-100" : "opacity-50")} />
              <span className="font-bold text-sm">UPI ID</span>
            </button>
          </div>

          <div className="p-5 border border-border/40 rounded-xl bg-secondary/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {payoutMethod === "BANK" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bankName" className="text-xs">Bank Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="bankName"
                        placeholder="e.g. HDFC Bank"
                        value={payoutBankName}
                        onChange={(e) => setPayoutBankName(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accName" className="text-xs">Account Holder Name</Label>
                    <div className="relative">
                      <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="accName"
                        placeholder="John Doe"
                        value={payoutAccountName}
                        onChange={(e) => setPayoutAccountName(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="accNum" className="text-xs">Account Number</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="accNum"
                        placeholder="000000000000"
                        value={payoutAccountNumber}
                        onChange={(e) => setPayoutAccountNumber(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ifsc" className="text-xs">IFSC Code</Label>
                    <div className="relative">
                      <Code className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="ifsc"
                        placeholder="HDFC0001234"
                        value={payoutIfsc}
                        onChange={(e) => setPayoutIfsc(e.target.value)}
                        className="pl-9 h-10 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="upiId" className="text-xs">UPI ID</Label>
                <div className="relative">
                  <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="upiId"
                    placeholder="name@okhdfcbank"
                    value={payoutUpiId}
                    onChange={(e) => setPayoutUpiId(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground pt-2">Funds will be securely transferred post-event minus platform fees.</p>
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
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
          >
            Publish Event
          </Button>
        </div>
      </form>
    </div>
  );
};

