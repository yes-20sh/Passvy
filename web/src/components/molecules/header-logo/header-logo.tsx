import React from "react";
import { Ticket } from "lucide-react";
import { TypographySpan } from "@/components/atoms/typography/typography";

export const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-2 font-semibold text-xl tracking-tight">
      <div className="h-8 w-8 rounded-lg bg-indigo-700 flex items-center justify-center text-white">
        <Ticket className="size-5" />
      </div>
      <TypographySpan>Passvy</TypographySpan>
    </div>
  );
};
