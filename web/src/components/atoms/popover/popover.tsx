"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

const Popover = BasePopover.Root;

const PopoverTrigger = BasePopover.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof BasePopover.Popup>,
  React.ComponentPropsWithoutRef<typeof BasePopover.Popup> & { align?: "start" | "center" | "end" }
>(({ className, align = "center", ...props }, ref) => (
  <BasePopover.Portal>
    <BasePopover.Positioner sideOffset={4} align={align} className="z-50 outline-none">
      <BasePopover.Popup
        ref={ref}
        className={cn(
          "w-auto rounded-lg bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </BasePopover.Positioner>
  </BasePopover.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
