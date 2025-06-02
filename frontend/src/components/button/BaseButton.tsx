"use client";

import * as React from "react";

import type { OverridableComponentProps } from "@/types/overrideableComponent";
import { cn } from "@/lib/utils";;

type Props<C extends React.ElementType> = OverridableComponentProps<C>;

export const BaseButton = React.forwardRef<HTMLButtonElement, Props<"button">>(function BaseButton(
  { className, children, component, ...rest }: Props<"button">,
  ref,
) {
  const Component = React.useMemo(() => component ?? "button", [component]);

  return (
    <Component
      className={cn(
        "flex select-none items-center justify-center space-x-2 whitespace-nowrap transition-colors",
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  );
});
