import { Metadata } from "next";
import { AuthTemplate } from "@/components/template/auth-template/auth-template";
import { LoginForm } from "@/components/organisms/login-form/login-form";

export const metadata: Metadata = {
  title: "Login - Passvy",
  description: "Log in to Passvy, your digital epass manager.",
};

export default function LoginPage() {
  return (
    <AuthTemplate
      title="Passvy"
      description="Enter your details to sign in to your account"
    >
      <LoginForm />
    </AuthTemplate>
  );
}
