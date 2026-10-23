import { ReactNode } from "react";
import { Ticket } from "lucide-react";
import {
  TypographyH2,
  TypographyMuted,
} from "@/components/atoms/typography/typography";

interface AuthTemplateProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthTemplate({
  title,
  description,
  children,
}: AuthTemplateProps) {
  return (
    <div className="relative flex items-center justify-center min-h-svh overflow-y-auto bg-custom-gradient selection:bg-primary/30 py-6">
      <div className="relative z-10 w-full max-w-sm p-4 sm:p-8">
        <div className="space-y-2 text-center pb-6">
          <div className="flex items-center justify-center gap-2">
            <div className="h-7 w-7 rounded-sm bg-indigo-700 flex items-center justify-center text-white">
              <Ticket className="size-5" />
            </div>
            <TypographyH2 className="border-b-0 pb-0 text-foreground">
              {title}
            </TypographyH2>
          </div>
          <TypographyMuted>{description}</TypographyMuted>
        </div>
        {children}
      </div>
    </div>
  );
}
