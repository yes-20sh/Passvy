import { Metadata } from "next";
import { AuthTemplate } from "@/components/template/auth-template/auth-template";
import { ResetPasswordForm } from "@/components/organisms/reset-password-form/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Passvy Epass",
  description: "Reset your Passvy password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthTemplate
      title="Passvy"
      description="Follow the steps to recover your account"
    >
      <ResetPasswordForm />
    </AuthTemplate>
  );
}
