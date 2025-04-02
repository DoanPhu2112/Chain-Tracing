import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center justify-center gap-2.5 rounded-full border transition-colors whitespace-nowrap", {
  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
      secondary:
        "border-transparent hover:bg-secondary/80",
      destructive:
        "border-transparent hover:bg-destructive/80",
      outline: "text-foreground",
      gray: "border-transparent bg-gray-200 text-dp-sec-fg",

      yellow: "border-transparent text-dp-sec-fg",
      pink: "border-transparent text-dp-sec-fg"
    },
    size: {
      md: "px-2 text-[13px] w-fit",
      sm: "px-1 text-[8px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
