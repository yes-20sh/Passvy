import { Metadata } from "next";
import { AuthTemplate } from "@/components/template/auth-template/auth-template";
import { SignupForm } from "@/components/organisms/signup-form/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - Passvy",
  description: "Create your Passvy account.",
};

export default function SignupPage() {
  return (
    <AuthTemplate
      title="Passvy"
      description="Enter your details below to create your account"
    >
      <SignupForm />
    </AuthTemplate>
  );
}

