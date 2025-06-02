"use client";

// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import type { UrlObject } from "url";
import { RiArrowRightUpLine } from "@remixicon/react";
import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

type LinkButtonProps = {
  children: React.ReactNode;
  href: Route | UrlObject;
  showIcon?: boolean;
  underline?: boolean;
  icon?: React.ReactNode;
  tabIndex?: number;
  className?: string;
  isDisabled?: boolean;
  cls?: {
    wrapper?: string;
    text?: string;
  };
};

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  {
    children,
    href,
    showIcon = false,
    underline = true,
    icon,
    tabIndex = 0,
    className,
    cls,
    isDisabled,
  }: LinkButtonProps,
  ref,
) {
  const iconNode = icon ? icon : <RiArrowRightUpLine />;
  const isExternal = typeof href === "string" && href.startsWith("http");

  if (isDisabled) {
    return (
      <button
        className={cn(
          "group inline-flex cursor-not-allowed items-center justify-center space-x-1 px-2 py-1 disabled:text-itr-tentSec-dis",
          cls?.wrapper,
          className,
        )}
        disabled
      >
        <span
          className={cn(
            "relative text-label-sm-sec",
            underline
              ? "group-disabled::after:h-0.5 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-current"
              : "",
            cls?.text,
          )}
        >
          {children}
        </span>
        {showIcon && <span className="shrink-0 [&>svg]:size-4">{iconNode}</span>}
      </button>
    );
  }

  return (
    <Link
      className={cn(
        "group inline-flex items-center justify-center space-x-1 px-2 py-1 text-itr-tentSec-df",
        "hover:text-itr-tone-hl",
        "active:rounded-full active:bg-sf-pri-df active:text-itr-tentSec-df",
        cls?.wrapper,
        className,
      )}
      href={href}
      ref={ref}
      rel={isExternal ? "noopener noreferrer" : undefined}
      tabIndex={tabIndex}
      target={isExternal ? "_blank" : undefined}
    >
      <span
        className={cn(
          "relative text-label-sm-sec",
          underline
            ? "group-disabled::after:h-0.5 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-current group-hover:after:h-0.5"
            : "",
          cls?.text,
        )}
      >
        {children}
      </span>
      {showIcon && <span className="shrink-0 [&>svg]:size-4">{iconNode}</span>}
    </Link>
  );
});
