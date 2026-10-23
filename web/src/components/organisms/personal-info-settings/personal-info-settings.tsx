"use client";

import React, { useState } from "react";
import { User, Phone, Mail } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/atoms/card/card";
import { TypographyMuted } from "@/components/atoms/typography/typography";
import { UpdateSettingsDocument } from "@/gql/graphql";
import VALIDATION from "@/validation";

interface PersonalInfoSettingsProps {
  email?: string | null;
  fullName?: string | null;
  mobileNumber?: string | null;
  onSuccess?: () => void;
}

export function PersonalInfoSettings({
  email,
  fullName: dbFullName,
  mobileNumber: dbMobileNumber,
  onSuccess,
}: PersonalInfoSettingsProps) {
  const [fullName, setFullName] = useState(dbFullName || "");
  const [mobileNumber, setMobileNumber] = useState(dbMobileNumber || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [updateSettings, { loading }] = useMutation(UpdateSettingsDocument);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = VALIDATION.personalInfoValidation.safeParse({
      fullName,
      mobileNumber: mobileNumber || null,
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


    try {
      const { data } = await updateSettings({
        variables: {
          input: {
            fullName,
            mobileNumber: mobileNumber || null,
          },
        },
      });

      if (data?.updateSettings?.success) {
        toast.success("Success", {
          description: "Personal information updated successfully.",
        });
        if (onSuccess) onSuccess();
      } else {
        toast.error("Update failed", {
          description: data?.updateSettings?.message || "Could not save settings.",
        });
      }
    } catch (err) {
      toast.error("Save failed", {
        description: (err as Error).message || "Something went wrong saving your settings.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email || ""}
              readOnly
              disabled
              className="bg-muted/50 cursor-not-allowed opacity-70"
            />
            <TypographyMuted className="text-[11px] px-1">
              Your email address cannot be changed.
            </TypographyMuted>
          </div>

          <div className="space-y-2 group">
            <Label
              htmlFor="fullName"
              className="flex items-center gap-2 transition-colors group-focus-within:text-primary"
            >
              <User className="size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              className="transition-all focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2 group">
            <Label
              htmlFor="mobile"
              className="flex items-center gap-2 transition-colors group-focus-within:text-primary"
            >
              <Phone className="size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              Mobile Number
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              error={errors.mobileNumber}
              className="transition-all focus-visible:ring-primary/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border/50 pt-5 pb-5 px-6 bg-muted/20">
          <Button
            type="submit"
            loading={loading}
            className="shadow-sm hover:shadow transition-all"
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
