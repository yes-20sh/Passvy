'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/atoms/badge/badge';
import { Button } from '@/components/atoms/button/button';
import { Input } from '@/components/atoms/input/input';
import { Label } from '@/components/atoms/label/label';
import {
  CreditCard,
  Wallet,
  Coins,
  Percent,
  ArrowLeft,
  ShieldCheck,
  Hash,
  Banknote,
} from 'lucide-react';

export interface PaymentFormProps {
  userName: string;
  userEmail: string;
  passTierName: string;
  passCategoryName: string;
  totalTickets: number;
  rawAmount: number;
  onBack: () => void;
  onPaymentSuccess: (
    couponCode: string,
    paymentMethod: string,
    finalPaid: number,
  ) => void;
  onCouponApply?: (discountPercentage: number) => void;
  onCouponRemove?: () => void;
}

export enum PaymentMethod {
  RAZORPAY = 'RAZORPAY',
  CHECKIN = 'CHECKIN',
}

export interface CouponDetails {
  code: string;
  discountPercentage: number;
  description: string;
}

const MOCK_COUPONS: CouponDetails[] = [
  {
    code: 'PASSVY20',
    discountPercentage: 20,
    description: '20% off your entire order!',
  },
  {
    code: 'WELCOME10',
    discountPercentage: 10,
    description: '10% off for new attendees!',
  },
];

export function PaymentForm({
  userName,
  userEmail,
  passTierName,
  passCategoryName,
  totalTickets,
  rawAmount,
  onBack,
  onPaymentSuccess,
  onCouponApply,
  onCouponRemove,
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.CHECKIN,
  );
  const [couponInput, setCouponInput] = useState<string>('');
  const [activeCoupon, setActiveCoupon] = useState<CouponDetails | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  const couponDiscount = activeCoupon
    ? Math.round(rawAmount * (activeCoupon.discountPercentage / 100))
    : 0;
  const finalPaid = Math.max(0, rawAmount - couponDiscount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const codeUpper = couponInput.trim().toUpperCase();
    const found = MOCK_COUPONS.find((c) => c.code === codeUpper);
    if (found) {
      setActiveCoupon(found);
      setCouponInput('');
      onCouponApply?.(found.discountPercentage);
    } else {
      setCouponError('Invalid coupon code. Try PASSVY20 or WELCOME10');
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    onCouponRemove?.();
  };

  const handlePay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onPaymentSuccess(activeCoupon?.code || '', selectedMethod, finalPaid);
  };

  return (
    <div className="flex w-full flex-col gap-6 text-left lg:col-span-3">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground group flex cursor-pointer items-center gap-2 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Edit Registration Info</span>
        </button>
      </div>

      <div className="space-y-1">
        <h2 className="text-foreground text-2xl font-black tracking-tight">
          Secure Payment
        </h2>
        <p className="text-muted-foreground text-xs">
          Select your payment method and apply coupons to complete checkout.
        </p>
      </div>

      {/* User details and tier summary review */}
      <div className="border-border/60 bg-secondary/15 flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Registration Review
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-foreground text-sm font-extrabold">
              {userName}
            </span>
            <span className="text-muted-foreground text-xs">({userEmail})</span>
          </div>
          <p className="text-muted-foreground text-xs">
            {passTierName} • {passCategoryName} • {totalTickets} Ticket(s)
          </p>
        </div>
      </div>

      <hr className="border-border/40" />

      {/* Coupon code section */}
      {/* <div className="space-y-3">
        <Label className="text-xs font-extrabold uppercase tracking-wider block">Promo Codes / Coupons</Label>
        <div className="flex gap-2 relative opacity-70 cursor-not-allowed group">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Promo codes coming soon"
              disabled
              className="pr-10 h-10 text-xs cursor-not-allowed bg-secondary/20 pointer-events-none"
            />
            <Percent className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            type="button"
            disabled
            className="bg-indigo-600/50 text-white font-bold h-10 px-4 rounded-lg text-xs animate-none transition-all cursor-not-allowed pointer-events-none"
          >
            Apply
          </Button>
          <div className="absolute -top-2.5 -right-1 bg-secondary text-[9px] font-bold py-0.5 px-2 rounded-full border border-border shadow-sm text-foreground uppercase tracking-wider">
            Coming Soon
          </div>
        </div>
      </div> */}

      <hr className="border-border/40" />

      {/* Payment methods section */}
      <div className="space-y-3">
        <Label className="block text-xs font-extrabold tracking-wider uppercase">
          Select Payment Mode
        </Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {/* CHECK-IN */}
          <div
            onClick={() => setSelectedMethod(PaymentMethod.CHECKIN)}
            className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-4 text-center transition-all select-none ${
              selectedMethod === PaymentMethod.CHECKIN
                ? 'border-indigo-600 bg-indigo-600/5 ring-2 ring-indigo-600'
                : 'border-border bg-secondary/10 hover:border-indigo-600'
            }`}
          >
            <Hash className="size-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-foreground text-xs leading-tight font-extrabold">
              Pay at
              <br />
              Check-in
            </span>
          </div>

          {/* RAZORPAY */}
          <button
            type="button"
            disabled
            className="border-border/60 bg-secondary/20 text-muted-foreground relative flex cursor-not-allowed flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-4 text-center opacity-70"
          >
            <Banknote className="size-5" />
            <span className="text-xs font-extrabold">Razorpay</span>
            <div className="bg-secondary absolute inset-x-0 top-0 py-0.5 text-center text-[9px] font-bold">
              Coming Soon
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Payment fields based on selected payment mode */}
      <form onSubmit={handlePay} className="space-y-4">
        {selectedMethod === PaymentMethod.CHECKIN && (
          <div className="space-y-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center">
            <Hash className="mx-auto size-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-foreground block text-xs font-extrabold">
              Pay at Venue
            </span>
            <p className="text-muted-foreground mx-auto max-w-xs text-[10px]">
              You have chosen to pay later. Please prepare your payment for when
              you check in at the event location.
            </p>
          </div>
        )}

        <div className="border-border/50 flex justify-end border-t pt-4">
          <Button
            type="submit"
            className="h-9 cursor-pointer rounded-lg bg-indigo-700 px-8 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-indigo-600 active:scale-[0.98]"
          >
            Pay & Confirm • {finalPaid === 0 ? 'Free' : `$${finalPaid}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
