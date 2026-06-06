import { SignupField } from "@/components/interfaces/auth/signup.interface";

export const signupFields: SignupField[] = [
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
    placeholder: "+91 98765 43210",
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
