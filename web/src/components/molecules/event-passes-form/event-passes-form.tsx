import React, { useState } from "react";
import { z } from "zod";
import { eventPassesFormSchema } from "@/validation/event-passes.validation";
import { Label } from "@/components/atoms/label/label";
import { Input } from "@/components/atoms/input/input";
import { Button } from "@/components/atoms/button/button";
import { Plus, Trash2, Ticket, Star, Crown, Settings, User, Users, Percent, IndianRupee } from "lucide-react";
import { EventPass, EventCoupon } from "@/interfaces/events/event.interface";

interface EventPassesFormProps {
  passes: EventPass[];
  setPasses: React.Dispatch<React.SetStateAction<EventPass[]>>;
  coupons: EventCoupon[];
  setCoupons: React.Dispatch<React.SetStateAction<EventCoupon[]>>;
  onBack: () => void;
  onNext: (e: React.FormEvent | React.MouseEvent) => void;
  hasChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  capacity?: string;
}

export const EventPassesForm = ({
  passes, setPasses, coupons, setCoupons, onBack, onNext, hasChanges = false, onSave, isSaving = false, capacity
}: EventPassesFormProps) => {

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    try {
      eventPassesFormSchema.parse({ passes, coupons });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(e);
    }
  };

  const handleSaveAction = () => {
    if (validateForm()) {
      if (onSave) onSave();
    }
  };

  React.useEffect(() => {
    if (passes.length === 1 && passes[0].quantity === "" && capacity) {
      setPasses((prev) => 
        prev.map((p) => p.id === passes[0].id ? { ...p, quantity: capacity } : p)
      );
    }
  }, [capacity, passes, setPasses]);

  const addPass = () => {
    const totalQuantity = passes.reduce((acc, pass) => acc + (parseInt(pass.quantity) || 0), 0);
    const totalCapacity = capacity ? parseInt(capacity) : 0;
    const remainingSeats = totalCapacity > 0 ? Math.max(0, totalCapacity - totalQuantity) : "";
    
    setPasses((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        pricing: "PAID",
        tier: "GA",
        customName: "",
        category: "SINGLE",
        quantity: remainingSeats.toString(),
        price: ""
      }
    ]);
  };

  const updatePass = (id: string, field: keyof EventPass, value: string) => {
    setPasses((prev) => {
      let val = value;
      if (field === "quantity" && capacity) {
        const totalCapacity = parseInt(capacity);
        const otherPassesSum = prev.filter(p => p.id !== id).reduce((acc, p) => acc + (parseInt(p.quantity) || 0), 0);
        const maxAllowed = Math.max(0, totalCapacity - otherPassesSum);
        if (parseInt(val) > maxAllowed) {
          val = maxAllowed.toString();
        }
      }
      return prev.map((p) => {
        if (p.id === id) {
          const newPass = { ...p, [field]: val };
          if (field === "pricing" && val === "FREE") {
            newPass.price = "";
          }
          return newPass;
        }
        return p;
      });
    });
  };

  const removePass = (id: string) => {
    setPasses((prev) => prev.filter((p) => p.id !== id));
  };

  const addCoupon = () => {
    setCoupons((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        code: "",
        discountType: "PERCENTAGE",
        discountValue: ""
      }
    ]);
  };

  const updateCoupon = (id: string, field: keyof EventCoupon, value: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
          <span className="text-xs font-bold uppercase tracking-wider">
            Step 2
          </span>
        </div>
        <h2 className="text-xl font-black tracking-tight text-foreground">
          Configure Passes
        </h2>
        <p className="text-xs text-muted-foreground">
          Set up the ticketing categories and pricing for your attendees.
        </p>
      </div>

      <form id="configure-passes-form" onSubmit={handleNext} className="space-y-8">
        
        {/* Passes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-extrabold text-foreground">Event Passes</Label>
            <Button
              type="button"
              onClick={addPass}
              className="bg-indigo-600/10 text-indigo-700 hover:bg-indigo-600/20 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold h-8 px-3 rounded-lg text-xs"
            >
              <Plus className="size-3 mr-1" /> Add Pass
            </Button>
          </div>
          
          <div className="space-y-4">
            {passes.map((pass, index) => (
              <div key={pass.id} className="p-4 border border-border/60 rounded-xl bg-card space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Pass #{index + 1}</span>
                  {passes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePass(pass.id)}
                      className="text-muted-foreground hover:text-rose-500 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                {/* Tier */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-extrabold uppercase tracking-wider block text-muted-foreground">Pass Tier</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div
                      onClick={() => updatePass(pass.id, "tier", "GA")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.tier === "GA" ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-600/5" : "border-border hover:border-indigo-600 bg-secondary/10"
                      }`}
                    >
                      <Ticket className={`size-4 ${pass.tier === "GA" ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">GA</span>
                    </div>
                    <div
                      onClick={() => updatePass(pass.id, "tier", "VIP")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.tier === "VIP" ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/5" : "border-border hover:border-amber-500 bg-secondary/10"
                      }`}
                    >
                      <Star className={`size-4 ${pass.tier === "VIP" ? "text-amber-500" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">VIP</span>
                    </div>
                    <div
                      onClick={() => updatePass(pass.id, "tier", "VVIP")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.tier === "VVIP" ? "ring-2 ring-purple-500 border-purple-500 bg-purple-500/5" : "border-border hover:border-purple-500 bg-secondary/10"
                      }`}
                    >
                      <Crown className={`size-4 ${pass.tier === "VVIP" ? "text-purple-500" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">VVIP</span>
                    </div>
                    <div
                      onClick={() => updatePass(pass.id, "tier", "CUSTOM")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.tier === "CUSTOM" ? "ring-2 ring-emerald-600 border-emerald-600 bg-emerald-600/5" : "border-border hover:border-emerald-600 bg-secondary/10"
                      }`}
                    >
                      <Settings className={`size-4 ${pass.tier === "CUSTOM" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">Custom</span>
                    </div>
                  </div>
                  {pass.tier === "CUSTOM" && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <Input
                        type="text"
                        placeholder="Enter custom pass name..."
                        value={pass.customName}
                        onChange={(e) => updatePass(pass.id, "customName", e.target.value)}
                        className="h-9 text-xs mt-2"
                      />
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-extrabold uppercase tracking-wider block text-muted-foreground">Pass Category</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div
                      onClick={() => updatePass(pass.id, "category", "SINGLE")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.category === "SINGLE" ? "ring-2 ring-emerald-600 border-emerald-600 bg-emerald-600/5" : "border-border hover:border-emerald-600 bg-secondary/10"
                      }`}
                    >
                      <User className={`size-4 ${pass.category === "SINGLE" ? "text-emerald-600" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">Single</span>
                    </div>
                    <div
                      onClick={() => updatePass(pass.id, "category", "FRIEND")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.category === "FRIEND" ? "ring-2 ring-emerald-600 border-emerald-600 bg-emerald-600/5" : "border-border hover:border-emerald-600 bg-secondary/10"
                      }`}
                    >
                      <Users className={`size-4 ${pass.category === "FRIEND" ? "text-emerald-600" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">Friend (2)</span>
                    </div>
                    <div
                      onClick={() => updatePass(pass.id, "category", "GROUP")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.category === "GROUP" ? "ring-2 ring-emerald-600 border-emerald-600 bg-emerald-600/5" : "border-border hover:border-emerald-600 bg-secondary/10"
                      }`}
                    >
                      <Users className={`size-4 ${pass.category === "GROUP" ? "text-emerald-600" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">Group (5)</span>
                    </div>
                    <div
                      onClick={() => updatePass(pass.id, "category", "CUSTOM")}
                      className={`p-3 border rounded-lg cursor-pointer select-none transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                        pass.category === "CUSTOM" ? "ring-2 ring-emerald-600 border-emerald-600 bg-emerald-600/5" : "border-border hover:border-emerald-600 bg-secondary/10"
                      }`}
                    >
                      <Settings className={`size-4 ${pass.category === "CUSTOM" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`} />
                      <span className="font-extrabold text-[10px] text-foreground">Custom</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Qty */}
                <div className="p-4 border border-border/40 rounded-lg bg-secondary/5 space-y-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div
                      onClick={() => updatePass(pass.id, "pricing", "FREE")}
                      className={`p-2 border rounded-md cursor-pointer select-none transition-all flex items-center justify-center gap-1.5 text-center ${
                        pass.pricing === "FREE" ? "ring-1 ring-indigo-600 border-indigo-600 bg-indigo-600/5" : "border-border bg-background"
                      }`}
                    >
                      <span className="font-extrabold text-[10px] text-foreground">Free Pass</span>
                    </div>
                    <div
                      onClick={() => updatePass(pass.id, "pricing", "PAID")}
                      className={`p-2 border rounded-md cursor-pointer select-none transition-all flex items-center justify-center gap-1.5 text-center ${
                        pass.pricing === "PAID" ? "ring-1 ring-indigo-600 border-indigo-600 bg-indigo-600/5" : "border-border bg-background"
                      }`}
                    >
                      <span className="font-extrabold text-[10px] text-foreground">Paid Pass</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor={`qty-${pass.id}`} className="text-xs">Total Quantity</Label>
                      <Input
                        id={`qty-${pass.id}`}
                        type="number"
                        placeholder="e.g. 100"
                        min="1"
                        value={pass.quantity}
                        onChange={(e) => updatePass(pass.id, "quantity", e.target.value)}
                        className="h-9 text-xs"
                      />
                      {errors[`passes.${passes.findIndex(p => p.id === pass.id)}.quantity`] && (
                        <p className="text-[10px] text-destructive font-medium mt-1">{errors[`passes.${passes.findIndex(p => p.id === pass.id)}.quantity`]}</p>
                      )}
                    </div>
                    {pass.pricing === "PAID" && (
                      <div className="space-y-1.5 text-left animate-in zoom-in-95 duration-200">
                        <Label htmlFor={`price-${pass.id}`} className="text-xs">Price (INR)</Label>
                        <div className="relative">
                          <Input
                            id={`price-${pass.id}`}
                            type="number"
                            placeholder="0.00"
                            min="1"
                            step="0.01"
                            value={pass.price}
                            onChange={(e) => updatePass(pass.id, "price", e.target.value)}
                            className="pl-8 h-9 text-xs"
                          />
                          <IndianRupee className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        {errors[`passes.${passes.findIndex(p => p.id === pass.id)}.price`] && (
                          <p className="text-[10px] text-destructive font-medium mt-1">{errors[`passes.${passes.findIndex(p => p.id === pass.id)}.price`]}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Coupons List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-extrabold text-foreground">Promo Codes</Label>
              <p className="text-[10px] text-muted-foreground">Optional discount codes for your passes.</p>
            </div>
            <Button
              type="button"
              onClick={addCoupon}
              className="bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold h-8 px-3 rounded-lg text-xs"
            >
              <Plus className="size-3 mr-1" /> Add Promo
            </Button>
          </div>
          
          <div className="space-y-3">
            {coupons.length === 0 && (
              <div className="p-6 border border-dashed border-border/60 rounded-xl text-center">
                <span className="text-xs font-semibold text-muted-foreground">No promo codes added.</span>
              </div>
            )}
            {coupons.map((coupon, idx) => (
              <div key={coupon.id} className="flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="e.g. EARLYBIRD50"
                      value={coupon.code}
                      onChange={(e) => updateCoupon(coupon.id, "code", e.target.value.toUpperCase())}
                      className="h-10 text-xs font-bold uppercase tracking-widest"
                    />
                  </div>
                  <div className="flex bg-secondary/20 p-1 rounded-lg h-10 items-stretch">
                    <button
                      type="button"
                      onClick={() => updateCoupon(coupon.id, "discountType", "PERCENTAGE")}
                      className={`px-3 flex-1 justify-center text-xs font-bold rounded flex items-center gap-1 transition-all ${coupon.discountType === "PERCENTAGE" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
                    >
                      <Percent className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCoupon(coupon.id, "discountType", "AMOUNT")}
                      className={`px-3 flex-1 justify-center text-xs font-bold rounded flex items-center gap-1 transition-all ${coupon.discountType === "AMOUNT" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
                    >
                      <IndianRupee className="size-3" />
                    </button>
                  </div>
                  <div className="w-24 relative">
                    <Input
                      type="number"
                      placeholder="0"
                      min="1"
                      value={coupon.discountValue || ""}
                      onChange={(e) => updateCoupon(coupon.id, "discountValue", e.target.value)}
                      className="h-10 text-xs pr-8"
                    />
                    {coupon.discountType === "AMOUNT" ? (
                      <IndianRupee className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    ) : (
                      <Percent className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoupon(coupon.id)}
                    className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {(errors[`coupons.${idx}.code`] || errors[`coupons.${idx}.discountValue`]) && (
                  <div className="flex gap-4">
                    {errors[`coupons.${idx}.code`] && <span className="text-[10px] text-destructive font-medium flex-1">{errors[`coupons.${idx}.code`]}</span>}
                    {errors[`coupons.${idx}.discountValue`] && <span className="text-[10px] text-destructive font-medium w-24 ml-auto mr-12 text-center">{errors[`coupons.${idx}.discountValue`]}</span>}
                  </div>
                )}
              </div>
            ))}
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
              onClick={handleSaveAction}
              loading={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
            >
              Save
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-lg h-9 px-8 shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

