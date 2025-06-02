"use client";

import * as React from "react";

import type { OverridableComponentProps } from "@/types/overrideableComponent";
import { cn } from "@/lib/utils";
import { BaseButton } from "./BaseButton";

type ButtonVariant = "primary" | "secondary" | "sub" | "danger" | "ghost" | "border";

type ButtonSize = "xs" | "sm" | "md" | "lg";

type ButtonProps = {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  tabIndex?: number;
};

type Props<C extends React.ElementType> = OverridableComponentProps<C, ButtonProps> & {
  dataTest?: string;
};

const BUTTON_VARIANT_MAP: Record<ButtonVariant, string> = {
  primary: "bg-itr-tone-pri hover:bg-itr-tentSec-df active:bg-itr-tentSec-sub disabled:bg-sf-pri-dis",
  secondary:
    "border-itr-tentSec-sub bg-base-empty hover:border-transparent hover:bg-itr-tentSec-df active:border-transparent active:bg-itr-tentSec-sub disabled:border-bd-pri-sub disabled:bg-base-empty border",
  sub: "bg-sf-pri-df hover:bg-sf-pri-hv active:bg-sf-pri-pressed disabled:bg-sf-pri-dis",
  danger: "bg-itr-dg-df hover:bg-itr-dg-hv active:bg-itr-dg-pressed disabled:bg-sf-dg-df",
  ghost: "bg-transparent hover:bg-sf-pri-hv active:bg-sf-pri-pressed disabled:bg-transparent",
  border:
    "border-bd-pri-df border bg-transparent bg-clip-padding dark:bg-transparent hover:border-sf-pri-hv hover:bg-sf-pri-hv active:border-sf-pri-pressed active:bg-sf-pri-pressed disabled:border-bd-pri-sub disabled:bg-base-empty",
};

const ICON_VARIANT_MAP: Record<ButtonVariant, string> = {
  primary:
    "text-cpn-tent group-hover:text-itr-tone-tent group-active:text-itr-tone-tent group-disabled:text-itr-tentPri-dis",
  secondary:
    "text-itr-tentSec-df group-hover:text-itr-tone-tent group-active:text-itr-tone-tent group-disabled:text-itr-tentSec-dis",
  sub: "text-itr-tentSec-df group-hover:text-itr-tentSec-df group-active:text-itr-tentSec-df group-disabled:text-itr-tentSec-dis",
  danger:
    "text-itr-tentPri-df group-hover:text-itr-tentPri-df group-active:text-itr-tentPri-df group-disabled:text-itr-dg-tentSub",
  ghost:
    "text-itr-tentSec-df group-hover:text-itr-tentSec-df group-active:text-itr-tentSec-df group-disabled:text-itr-tentPri-dis",
  border:
    "text-itr-tentSec-df group-hover:text-itr-tentSec-df group-active:text-itr-tentSec-df group-disabled:text-itr-tentSec-dis",
};

const BUTTON_SIZE_MAP: Record<ButtonSize, string> = {
  xs: "size-7",
  sm: "size-9",
  md: "size-11",
  lg: "size-14",
};

const ICON_SIZE_MAP: Record<ButtonSize, string> = {
  xs: "[&>svg]:size-4",
  sm: "[&>svg]:size-5",
  md: "[&>svg]:size-6",
  lg: "[&>svg]:size-8",
};

export const IconButton = React.forwardRef<HTMLButtonElement, Props<"button">>(function IconButton(
  {
    icon,
    tabIndex = 0,
    size = "md",
    variant = "primary",
    className,
    disabled = false,
    component,
    dataTest,
    onClick,
    type,
  }: Props<"button">,
  ref,
) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (disabled) {
      return;
    }
    if (onClick) {
      onClick(event);
    }
  }

  return (
    <BaseButton
      className={cn(
        "group rounded-full",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        BUTTON_VARIANT_MAP[variant],
        BUTTON_SIZE_MAP[size],
        className,
      )}
      component={component}
      disabled={disabled}
      ref={ref}
      tabIndex={tabIndex}
      type={type}
      onClick={handleClick}
    >
      <span className={cn(ICON_SIZE_MAP[size], ICON_VARIANT_MAP[variant])}>{icon}</span>
    </BaseButton>
  );
}) as <C extends React.ElementType = "button">(props: Props<C>) => React.ReactElement;
