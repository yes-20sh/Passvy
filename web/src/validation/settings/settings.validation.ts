import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." }),
  mobileNumber: z
    .string()
    .refine((val) => !val || val.length >= 10, {
      message: "Mobile number must be at least 10 digits.",
    })
    .optional()
    .or(z.null()),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;
