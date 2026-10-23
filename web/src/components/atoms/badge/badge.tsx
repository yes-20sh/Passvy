import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export enum BadgeVariant {
  Default = "default",
  Secondary = "secondary",
  Destructive = "destructive",
  Outline = "outline",
}

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        [BadgeVariant.Default]:
          "border-transparent bg-indigo-700 text-white hover:bg-indigo-600",
        [BadgeVariant.Secondary]:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        [BadgeVariant.Destructive]:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        [BadgeVariant.Outline]: "text-foreground border-border bg-background",
      },
    },
    defaultVariants: {
      variant: BadgeVariant.Default,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}
