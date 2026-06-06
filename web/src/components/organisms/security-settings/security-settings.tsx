"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/atoms/card/card";
import { TypographyMuted } from "@/components/atoms/typography/typography";
import VALIDATION from "@/validation";

export function SecuritySettings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = VALIDATION.passwordChangeValidation.safeParse({
      currentPassword,
      newPassword,
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
        description: "Please correct the errors before saving.",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Success", {
        description: "Your password has been updated successfully.",
      });
    }, 1500);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-4" /> Security
        </CardTitle>
        <CardDescription>
          Manage your password and security settings.
        </CardDescription>
      </CardHeader>
      {!isChangingPassword ? (
        <CardContent className="pt-6 pb-6">
          <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
            <div>
              <div className="text-sm font-medium text-foreground">Password</div>
              <TypographyMuted className="text-xs mt-0.5">
                Protect your account with a strong password.
              </TypographyMuted>
            </div>
            <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
              Change Password
            </Button>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground/70" />
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={errors.currentPassword}
                  className="pl-9 focus-visible:ring-destructive/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground/70" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                  className="pl-9 focus-visible:ring-destructive/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground/70" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  className="pl-9 focus-visible:ring-destructive/30"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-border/50 pt-5 pb-5 px-6 bg-muted/20">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="submit"
              loading={loading}
              className="shadow-sm hover:shadow transition-all"
            >
              Update Password
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
