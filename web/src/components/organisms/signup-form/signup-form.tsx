"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Separator } from "@/components/atoms/separator/separator";
import {
  TypographyMuted,
  TypographySpan,
} from "@/components/atoms/typography/typography";

import { useState } from "react";
import { toast } from "sonner";

import { SignupDocument } from "@/gql/graphql";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import VALIDATION from "@/validation";
import DATA from "@/data";
import { useMutation } from "@apollo/client/react";

export function SignupForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signup, { loading }] = useMutation(SignupDocument);
  const { loginWithGoogle, loading: googleLoading } = useGoogleLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const result = VALIDATION.signupValidation.safeParse(data);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(formattedErrors);
      toast.error("Validation failed", {
        description: "Please check the highlighted fields and try again.",
      });
      return;
    }

    setErrors({});

    try {
      const { data } = await signup({
        variables: {
          input: {
            fullName: result.data.name,
            email: result.data.email,
            mobileNumber: result.data.mobile,
            password: result.data.password,
            confirmPassword: result.data.confirmPassword,
          },
        },
      });
      
      if (data?.signup?.statusCode === 201) {
        toast.success("Account created successfully!", {
          description: data.signup.message || "You can now log in with your credentials.",
        });
      }
      
    } catch (err) {
      toast.error("Signup failed", {
        description: (err as Error).message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {DATA.signupFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={field.id}
              className="text-sm font-medium leading-none text-foreground/90"
            >
              {field.label}
            </Label>
            <Input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              error={errors[field.id]}
            />
          </div>
        ))}

        <Button type="submit" className="w-full mt-2" loading={loading}>
          Sign up
        </Button>
      </form>

      <div className="flex items-center my-6">
        <Separator className="flex-1 bg-transparent border-t border-dashed border-border" />
        <TypographySpan className="px-3 text-[10px] uppercase text-muted-foreground shrink-0">
          Or continue with
        </TypographySpan>
        <Separator className="flex-1 bg-transparent border-t border-dashed border-border" />
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={loginWithGoogle}
          loading={googleLoading}
          type="button"
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Sign up with Google
        </Button>

        <TypographyMuted className="text-center mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline transition-all"
          >
            Log in
          </Link>
        </TypographyMuted>
      </div>
    </>
  );
}
