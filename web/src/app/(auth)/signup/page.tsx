import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/atoms/button/button";
import { Input } from "@/components/atoms/input/input";
import { Label } from "@/components/atoms/label/label";
import { Separator } from "@/components/atoms/separator/separator";

export const metadata: Metadata = {
  title: "Sign Up - Passvy Epass",
  description: "Create your Passvy account.",
};

interface SignupField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

const signupFields: SignupField[] = [
  { id: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "name@example.com",
  },
  {
    id: "mobile",
    label: "Mobile Number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
  },
];

export default function SignupPage() {
  return (
    <div className="relative flex items-center justify-center min-h-svh overflow-y-auto bg-background selection:bg-primary/30 py-6">
      <div className="relative z-10 w-full max-w-sm p-4 sm:p-8">
        <div className="space-y-2 text-center pb-6">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-foreground drop-shadow-sm">
            Passvy
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        <form className="space-y-4">
          {signupFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label
                htmlFor={field.id}
                className="text-sm font-medium leading-none text-foreground/90"
              >
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}

          <Button type="submit" className="w-full mt-2">
            Sign up
          </Button>
        </form>

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

        <div className="space-y-4">
          <Button variant="outline" className="w-full">
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

          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline transition-all"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

