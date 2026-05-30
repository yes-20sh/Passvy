import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Separator } from "@/components/atoms/separator/separator";

export const metadata: Metadata = {
  title: "Login - Passvy Epass",
  description: "Log in to Passvy, your digital epass manager.",
};

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-svh overflow-y-auto bg-background selection:bg-primary/30 py-6">
      <div className="relative z-10 w-full max-w-sm p-4 sm:p-8">
        <div className="space-y-2 text-center pb-6">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-foreground drop-shadow-sm">
            Passvy
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to sign in to your account
          </p>
        </div>

        <div className="space-y-4">
          {/* Email / Username */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="identifier"
                className="text-sm font-medium leading-none text-foreground/90"
              >
                Email or Username
              </Label>
            </div>

            <Input
              id="identifier"
              type="text"
              placeholder="john@example.com or johndoe"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium leading-none text-foreground/90"
              >
                Password
              </Label>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline transition-all"
              >
                Forgot password?
              </Link>
            </div>

            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          {/* Sign In Button */}
          <Button className="w-full mt-2">
            Sign in
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-border" />
            </div>

            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-3 text-muted-foreground backdrop-blur-md">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full"
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
            Login with Google
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline transition-all"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

