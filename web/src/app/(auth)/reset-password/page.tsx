"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import Link from "next/link";
import {
  TypographyH2,
  TypographyMuted,
} from "@/components/atoms/typography/typography";

enum ResetStep {
  EMAIL = "EMAIL",
  OTP = "OTP",
  PASSWORD = "PASSWORD",
  SUCCESS = "SUCCESS",
}

export default function ResetPasswordPage() {
  const [step, setStep] = useState<ResetStep>(ResetStep.EMAIL);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setStep(ResetStep.OTP);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setError("");
    setStep(ResetStep.PASSWORD);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setStep(ResetStep.SUCCESS);
  };

  return (
    <div className="relative flex items-center justify-center min-h-svh overflow-y-auto bg-background selection:bg-primary/30 py-6">
      <div className="relative z-10 w-full max-w-sm p-4 sm:p-8">
        <div className="space-y-2 text-center pb-6">
          <TypographyH2 className="border-b-0 pb-0 drop-shadow-sm text-foreground">
            Passvy
          </TypographyH2>
          <TypographyMuted>
            {step === ResetStep.EMAIL &&
              "Enter your email to receive a verification code"}
            {step === ResetStep.OTP && `Enter the code sent to ${email}`}
            {step === ResetStep.PASSWORD &&
              "Choose a new strong password for your account"}
            {step === ResetStep.SUCCESS &&
              "Your password has been successfully updated"}
          </TypographyMuted>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-md text-center border border-destructive/20 animate-in fade-in zoom-in-95 duration-200">
            {error}
          </div>
        )}

        {step === ResetStep.EMAIL && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium leading-none text-foreground/90"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Send OTP
            </Button>
          </form>
        )}

        {step === ResetStep.OTP && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="text-sm font-medium leading-none text-foreground/90"
              >
                Verification Code (OTP)
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="text-center tracking-widest text-lg"
              />
            </div>
            <div className="flex justify-between items-center text-xs pb-2">
              <button
                type="button"
                onClick={() => setStep(ResetStep.EMAIL)}
                className="text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
              >
                Change Email
              </button>
              <button
                type="button"
                className="text-primary hover:underline transition-colors cursor-pointer"
                onClick={() => alert("OTP resent!")}
              >
                Resend OTP
              </button>
            </div>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        )}

        {step === ResetStep.PASSWORD && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium leading-none text-foreground/90"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium leading-none text-foreground/90"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Reset Password
            </Button>
          </form>
        )}

        {step === ResetStep.SUCCESS && (
          <div className="space-y-4 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <TypographyMuted>
              You can now log in using your new password.
            </TypographyMuted>
            <Link
              href="/login"
              className="inline-flex w-full justify-center items-center rounded-lg bg-indigo-700 hover:bg-indigo-600 cursor-pointer text-white h-10 px-4 text-sm font-semibold transition-colors duration-200"
            >
              Go to Login
            </Link>
          </div>
        )}

        {step !== ResetStep.SUCCESS && (
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-sm font-medium hover:underline text-primary transition-all duration-200"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

