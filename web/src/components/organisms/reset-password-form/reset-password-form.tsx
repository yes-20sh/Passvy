"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { TypographyMuted } from "@/components/atoms/typography/typography";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import {
  ForgotPasswordDocument,
  ResetPasswordDocument,
  VerifyOtpDocument,
} from "@/gql/graphql";
import VALIDATION from "@/validation";


enum ResetStep {
  EMAIL = "EMAIL",
  OTP = "OTP",
  PASSWORD = "PASSWORD",
  SUCCESS = "SUCCESS",
}

export function ResetPasswordForm() {
  const [step, setStep] = useState<ResetStep>(ResetStep.EMAIL);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [forgotPassword, { loading: isSendingOtp }] = useMutation(
    ForgotPasswordDocument
  );
  const [verifyOtpMutation, { loading: isVerifying }] = useMutation(
    VerifyOtpDocument
  );
  const [resetPassword, { loading: isResetting }] = useMutation(
    ResetPasswordDocument
  );

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = VALIDATION.forgotPasswordValidation.safeParse({ email });
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(formattedErrors);
      toast.error("Validation failed", { description: "Please enter a valid email." });
      return;
    }

    try {
      const { data } = await forgotPassword({
        variables: { input: { email } },
      });
      if (data?.forgotPassword?.statusCode === 200) {
        toast.success("OTP Sent!", { description: data.forgotPassword.message || "Please check your email inbox." });
        setStep(ResetStep.OTP);
      }
    } catch (err) {
      toast.error("Failed to send OTP", {
        description: (err as Error).message || "Something went wrong.",
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "OTP must be exactly 6 characters" });
      return;
    }
    setErrors({});
    
    try {
      const { data } = await verifyOtpMutation({
        variables: { input: { email, otp } },
      });
      if (data?.verifyOtp?.statusCode === 200) {
        toast.success("OTP Verified", { description: data.verifyOtp.message || "You can now set a new password." });
        setStep(ResetStep.PASSWORD);
      }
    } catch (err) {
      toast.error("Invalid OTP", {
        description: (err as Error).message || "The OTP entered is incorrect or expired.",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = VALIDATION.resetPasswordValidation.safeParse({
      email,
      otp,
      newPassword: password,
      confirmPassword,
    });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(formattedErrors);
      toast.error("Validation failed", {
        description: "Please check the highlighted fields.",
      });
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: {
          input: {
            email,
            otp,
            newPassword: password,
            confirmPassword,
          },
        },
      });
      if (data?.resetPassword?.statusCode === 200) {
        toast.success("Password Reset Successful", {
          description: data.resetPassword.message || "Your password has been successfully updated.",
        });
        setStep(ResetStep.SUCCESS);
      }
    } catch (err) {
      toast.error("Password reset failed", {
        description: (err as Error).message || "Something went wrong.",
      });
    }
  };

  if (step === ResetStep.SUCCESS) {
    return (
      <div className="space-y-4 text-center mt-4">
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
          className="inline-flex w-full justify-center items-center rounded-lg bg-indigo-700 hover:bg-indigo-600 cursor-pointer text-white h-10 px-4 text-sm font-semibold transition-colors duration-200 mt-2"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      {step === ResetStep.EMAIL && (
        <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
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
              error={errors.email}
            />
          </div>
          <Button type="submit" className="w-full mt-2" loading={isSendingOtp}>
            Send OTP
          </Button>
        </form>
      )}

      {step === ResetStep.OTP && (
        <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
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
              error={errors.otp}
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
              onClick={handleSendOtp}
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Sending..." : "Resend OTP"}
            </button>
          </div>
          <Button type="submit" className="w-full" loading={isVerifying}>
            Verify OTP
          </Button>
        </form>
      )}

      {step === ResetStep.PASSWORD && (
        <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
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
              error={errors.newPassword}
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
              error={errors.confirmPassword}
            />
          </div>
          <Button type="submit" className="w-full mt-2" loading={isResetting}>
            Reset Password
          </Button>
        </form>
      )}

      <div className="text-center mt-6">
        <Link
          href="/login"
          className="text-sm font-medium hover:underline text-primary transition-all duration-200"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
