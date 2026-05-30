"use client";

import React, { useState } from "react";
import { Badge } from "@/components/atoms/badge/badge";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { CreditCard, Wallet, Coins, Percent, ArrowLeft, ShieldCheck } from "lucide-react";
import { PassType, PassCategory } from "@/app/(main)/events/[id]/register/page";

export interface PaymentFormProps {
  userName: string;
  userEmail: string;
  selectedPass: PassType;
  selectedCategory: PassCategory;
  passTierName: string;
  passCategoryName: string;
  totalTickets: number;
  rawAmount: number;
  onBack: () => void;
  onPaymentSuccess: (couponCode: string, paymentMethod: string, finalPaid: number) => void;
  onCouponApply?: (discountPercentage: number) => void;
  onCouponRemove?: () => void;
}

export enum PaymentMethod {
  CARD = "CARD",
  WALLET = "WALLET",
  CRYPTO = "CRYPTO"
}

export interface CouponDetails {
  code: string;
  discountPercentage: number;
  description: string;
}

const MOCK_COUPONS: CouponDetails[] = [
  { code: "PASSVY20", discountPercentage: 20, description: "20% off your entire order!" },
  { code: "WELCOME10", discountPercentage: 10, description: "10% off for new attendees!" }
];

export function PaymentForm({
  userName,
  userEmail,
  selectedPass,
  selectedCategory,
  passTierName,
  passCategoryName,
  totalTickets,
  rawAmount,
  onBack,
  onPaymentSuccess,
  onCouponApply,
  onCouponRemove,
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [couponInput, setCouponInput] = useState<string>("");
  const [activeCoupon, setActiveCoupon] = useState<CouponDetails | null>(null);
  const [couponError, setCouponError] = useState<string>("");

  // Card details state
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  const couponDiscount = activeCoupon ? Math.round(rawAmount * (activeCoupon.discountPercentage / 100)) : 0;
  const finalPaid = Math.max(0, rawAmount - couponDiscount);

  const handleApplyCoupon = () => {
    setCouponError("");
    const codeUpper = couponInput.trim().toUpperCase();
    const found = MOCK_COUPONS.find((c) => c.code === codeUpper);
    if (found) {
      setActiveCoupon(found);
      setCouponInput("");
      onCouponApply?.(found.discountPercentage);
    } else {
      setCouponError("Invalid coupon code. Try PASSVY20 or WELCOME10");
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    onCouponRemove?.();
  };

  const handlePay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedMethod === PaymentMethod.CARD) {
      if (!cardNumber || !expiry || !cvv) {
        alert("Please fill in your card details.");
        return;
      }
    }
    onPaymentSuccess(activeCoupon?.code || "", selectedMethod, finalPaid);
  };

  return (
    <div className="lg:col-span-3 flex flex-col gap-6 text-left w-full">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Edit Registration Info</span>
        </button>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Secure Payment</h2>
        <p className="text-xs text-muted-foreground">Select your payment method and apply coupons to complete checkout.</p>
      </div>

      {/* User details and tier summary review */}
      <div className="p-4 border border-border/60 rounded-xl bg-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Registration Review</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">({userEmail})</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {passTierName} • {passCategoryName} • {totalTickets} Ticket(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={null} className="bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded border-0">
            {selectedPass}
          </Badge>
          <Badge variant={null} className="bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded border-0">
            {selectedCategory}
          </Badge>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Coupon code section */}
      <div className="space-y-3">
        <Label className="text-xs font-extrabold uppercase tracking-wider block">Promo Codes / Coupons</Label>
        {!activeCoupon ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter promo code (e.g., PASSVY20)"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError("");
                }}
                className="pr-10 h-10 text-xs"
              />
              <Percent className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-indigo-600 text-white font-bold h-10 px-4 rounded-lg text-xs animate-none transition-all active:scale-[0.98]"
            >
              Apply
            </Button>
          </div>
        ) : (
          <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl flex items-center justify-between gap-4 animate-none">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Badge variant={null} className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0 font-black text-[10px] px-1.5 py-0.5 rounded uppercase">
                  {activeCoupon.code}
                </Badge>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {activeCoupon.discountPercentage}% Off Applied!
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{activeCoupon.description}</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
        {couponError && <p className="text-[10px] font-semibold text-rose-500">{couponError}</p>}
      </div>

      <hr className="border-border/40" />

      {/* Payment methods section */}
      <div className="space-y-3">
        <Label className="text-xs font-extrabold uppercase tracking-wider block">Select Payment Mode</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card Method */}
          <div
            onClick={() => setSelectedMethod(PaymentMethod.CARD)}
            className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center ${
              selectedMethod === PaymentMethod.CARD
                ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                : "border-border hover:border-indigo-600 bg-secondary/10"
            }`}
          >
            <CreditCard className="size-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-extrabold text-xs text-foreground">Credit Card</span>
          </div>

          {/* Wallet Method */}
          <div
            onClick={() => setSelectedMethod(PaymentMethod.WALLET)}
            className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center ${
              selectedMethod === PaymentMethod.WALLET
                ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                : "border-border hover:border-indigo-600 bg-secondary/10"
            }`}
          >
            <Wallet className="size-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-extrabold text-xs text-foreground">Passvy Wallet</span>
          </div>

          {/* Crypto Method */}
          <div
            onClick={() => setSelectedMethod(PaymentMethod.CRYPTO)}
            className={`p-4 border rounded-xl cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-2 text-center ${
              selectedMethod === PaymentMethod.CRYPTO
                ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5"
                : "border-border hover:border-indigo-600 bg-secondary/10"
            }`}
          >
            <Coins className="size-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-extrabold text-xs text-foreground">Cryptocurrency</span>
          </div>
        </div>
      </div>

      {/* Dynamic Payment fields based on selected payment mode */}
      <form onSubmit={handlePay} className="space-y-4">
        {selectedMethod === PaymentMethod.CARD && (
          <div className="p-4 border border-border/40 rounded-xl bg-secondary/5 space-y-3.5">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  maxLength={19}
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="pr-10"
                />
                <CreditCard className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 text-left">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 text-left">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  required
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === PaymentMethod.WALLET && (
          <div className="p-4 border border-indigo-500/20 rounded-xl bg-indigo-500/5 space-y-2 text-center">
            <ShieldCheck className="size-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
            <span className="font-extrabold text-xs text-foreground block">Passvy One-Click Pay</span>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
              Pay instantly using your encrypted Passvy Balance. Wallet discount applied.
            </p>
          </div>
        )}

        {selectedMethod === PaymentMethod.CRYPTO && (
          <div className="p-4 border border-amber-500/20 rounded-xl bg-amber-500/5 space-y-2 text-center">
            <Coins className="size-8 text-amber-500 mx-auto" />
            <span className="font-extrabold text-xs text-foreground block">Web3 Cryptographic Pay</span>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
              Scan dynamic QR Code in next step to secure your seats via USDC / BTC / ETH.
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg py-2.5 shadow-sm transition-all active:scale-[0.98] mt-4 cursor-pointer text-xs uppercase tracking-wider"
        >
          Pay & Confirm • {finalPaid === 0 ? "Free" : `$${finalPaid}`}
        </Button>
      </form>
    </div>
  );
}

