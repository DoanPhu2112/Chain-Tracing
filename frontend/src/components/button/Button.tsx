"use client";

import { RiLoader4Line } from "@remixicon/react";
import * as React from "react";

import type { OverridableComponentProps } from "@/types/overrideableComponent";
import { cn } from "@/lib/utils";

import { BaseButton } from "./BaseButton";

type ButtonVariant = "primary" | "secondary" | "sub" | "danger";

type ButtonSize = "xs" | "sm" | "md" | "lg";

type ButtonProps = {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  tabIndex?: number;
  cls?: {
    iconLeft?: string;
    iconRight?: string;
    content?: string;
  };
};

type Props<C extends React.ElementType> = OverridableComponentProps<C, ButtonProps> & {
  dataTest?: string;
};

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-itr-tone-pri border-transparent text-cpn-tent",
    "hover:bg-itr-tentSec-df hover:border-transparent hover:text-itr-tone-tent",
    "active:bg-itr-tentSec-sub active:border-transparent active:text-itr-tone-tent",
    "disabled:border-transparent disabled:bg-sf-pri-dis disabled:text-itr-tentSec-dis",
  ),
  secondary: cn(
    "border border-itr-tentSec-sub text-itr-tentSec-df",
    "hover:bg-itr-tentSec-df hover:text-itr-tone-tent hover:border-transparent",
    "active:border-transparent active:bg-itr-tentSec-sub active:text-itr-tone-tent",
    "disabled:border-sf-pri-dis disabled:bg-transparent disabled:text-itr-tentPri-dis",
  ),
  sub: cn(
    "bg-sf-pri-df border-transparent text-itr-tentSec-df",
    "hover:bg-sf-pri-hv hover:border-transparent hover:text-itr-tentSec-df",
    "active:bg-sf-pri-pressed active:border-transparent active:text-itr-tentSec-df",
    "disabled:bg-sf-pri-dis disabled:border-transparent disabled:text-itr-tentSec-dis",
  ),
  danger: cn(
    "bg-itr-dg-df border-transparent text-cpn-tent",
    "hover:bg-itr-dg-hv hover:border-transparent hover:text-cpn-tent",
    "active:bg-itr-dg-pressed active:border-transparent active:text-cpn-tent",
    "disabled:bg-sf-dg-df disabled:border-transparent disabled:text-itr-dg-tentSub",
  ),
};

const SIZE_MAP: Record<ButtonSize, string> = {
  xs: "text-label-sm-sec px-5 py-1 rounded-full",
  sm: "text-label-sm-sec px-5 py-2 rounded-full",
  md: "text-label-md-sec px-6 py-2.5 rounded-full",
  lg: "text-label-md-sec px-6 py-4 rounded-full",
};

const ICON_SIZE_MAP: Record<ButtonSize, string> = {
  xs: "size-4 [&>svg]:size-4",
  sm: "size-5 [&>svg]:size-5",
  md: "size-5 [&>svg]:size-5",
  lg: "size-6 [&>svg]:size-6",
};

export const Button = React.forwardRef<HTMLButtonElement, Props<"button">>(function Button(
  {
    children,
    iconLeft,
    iconRight,
    tabIndex = 0,
    isLoading = false,
    isFullWidth = false,
    size = "md",
    variant = "primary",
    className,
    disabled = false,
    component,
    cls,
    onClick,
    type,
    form,
  }: Props<"button">,
  ref,
) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (isLoading || disabled) {
      return;
    }
    if (onClick) {
      onClick(event);
    }
  }

  return (
    <BaseButton
      className={cn(
        "border outline-none",
        isLoading || disabled ? "cursor-not-allowed" : "cursor-pointer text-sf-dg-pressed",
        VARIANT_MAP[variant],
        SIZE_MAP[size],
        isFullWidth ? "w-full" : null,
        className,
      )}
      component={component}
      disabled={disabled}
      form={form}
      ref={ref}
      tabIndex={tabIndex}
      type={type}
      onClick={handleClick}
    >
      {isLoading ? (
        <>
          <span className={cn(ICON_SIZE_MAP[size], cls?.iconLeft, "animate-spin")}>
            <RiLoader4Line />
          </span>
          <span className={cls?.content}>{children}</span>
          {iconRight ? <span className={cn(ICON_SIZE_MAP[size], cls?.iconRight)}>{iconRight}</span> : null}
        </>
      ) : (
        <>
          {iconLeft ? <span className={cn(ICON_SIZE_MAP[size], cls?.iconLeft)}>{iconLeft}</span> : null}
          <span className={cls?.content}>{children}</span>
          {iconRight ? <span className={cn(ICON_SIZE_MAP[size], cls?.iconRight)}>{iconRight}</span> : null}
        </>
      )}
    </BaseButton>
  );
}) as <C extends React.ElementType = "button">(props: Props<C>) => React.ReactElement;
