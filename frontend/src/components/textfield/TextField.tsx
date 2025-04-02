"use client";

import { useMergedRef } from "@mantine/hooks";
import { RiCloseCircleFill, RiEyeLine, RiEyeOffLine, RiInformationFill } from "@remixicon/react";
import { DefaultNumeralDelimiter, registerCursorTracker } from "cleave-zen";
import * as React from "react";

import { cn } from "@/lib/utils";

import { formatNumeral, unformatNumeral } from "./helpers/formatter";

type TextFieldSize = "sm" | "md" | "lg";
type TextFieldType = "text" | "password";
type TextFieldVariant = "default" | "solid";

type Props = {
  label?: string;
  subLabel?: string;
  value: string;
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  placeholder?: string;
  hintText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  isReadOnly?: boolean;
  cls?: {
    wrapper?: string;
    container?: string;
    input?: string;
    label?: string;
  };
  type?: TextFieldType;
  numberInput?: boolean;
  decimals?: number;
  positiveOnly?: boolean;
  hourInput?: boolean;
  rightNode?: React.ReactNode;
  rounded?: boolean;
  autoFocus?: boolean;
  clearInput?: boolean;
  tabIndex?: number;
  maxLength?: number;
  autoCapitalize?: "none";
  displayWordCount?: boolean;
  required?: boolean;
  onChange?: (val: string) => void;
  onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
  onBlur?: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

const SIZE_MAP = {
  inputWrap: {
    normal: {
      sm: "px-3 py-2 hover:px-[11px] hover:py-[7px] active:px-[11px] active:py-[7px] disabled:px-3 disabled:py-2",
      md: "px-4 py-2.5 hover:px-[15px] hover:py-[9px] active:px-[15px] active:py-[9px] disabled:px-4 disabled:py-2.5",
      lg: "px-4 py-4 hover:px-[15px] hover:py-[15px] active:px-[15px] active:py-[15px] disabled:px-4 disabled:py-4",
    },
    active: {
      sm: "px-[11px] py-[7px]",
      md: "px-[15px] py-[9px]",
      lg: "px-[15px] py-[15px]",
    },
  },
  input: {
    sm: "text-p-sm",
    md: "text-p-md",
    lg: "text-p-md",
  },
};

const ICON_SIZE_MAP: Record<TextFieldSize, string> = {
  sm: "[&>svg]:w-4 [&>svg]:h-4",
  md: "[&>svg]:w-5 [&>svg]:h-5",
  lg: "[&>svg]:w-5 [&>svg]:h-5",
};

export const TextField = React.forwardRef<HTMLInputElement, Props>(function TextField(
  {
    label,
    subLabel,
    value,
    variant = "default",
    size = "sm",
    placeholder,
    hintText,
    iconLeft,
    iconRight,
    isDisabled,
    isError,
    isWarning,
    isReadOnly,
    cls,
    type = "text",
    numberInput,
    decimals = 0,
    positiveOnly = true,
    hourInput,
    rightNode,
    rounded = true,
    autoFocus,
    clearInput = true,
    tabIndex,
    maxLength,
    autoCapitalize,
    displayWordCount,
    required,
    onChange,
    onPaste,
    onBlur,
    onKeyDown,
  },
  ref,
) {
  const [isFocusing, setIsFocusing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(inputRef, ref);
  const [isShowPassword, setIsShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    return registerCursorTracker({ input: inputRef.current, delimiter: DefaultNumeralDelimiter });
  }, []);

  const handleFocus = (): void => {
    if (isDisabled) {
      return;
    }
    inputRef.current?.focus();
    setIsFocusing(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    inputRef.current?.blur();
    setIsFocusing(false);
    onBlur?.(event.target.value);
  };

  const handleChangeTextField = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!onChange) {
      return;
    }
    const value = e.target.value;
    if (hourInput) {
      if (value.includes(":")) {
        let [hours, minutes] = value.split(":");
        hours = hours.replace(/[^0-9]/g, "");
        minutes = minutes.replace(/[^0-9]/g, "");
        if (Number.parseInt(hours) > 23) {
          hours = "23";
        }
        if (Number.parseInt(minutes) > 59) {
          minutes = "59";
        }
        onChange(`${hours}:${minutes}`);
        return;
      }
      let _v = value.replace(/[^0-9]/g, "");
      if (_v.length > 2) {
        _v = _v.slice(0, 2) + ":" + _v.slice(2, 4);
      }
      if (_v.length > 5) {
        _v = _v.slice(0, 5);
      }
      if (_v.length === 5) {
        let [hours, minutes] = _v.split(":");
        if (Number.parseInt(hours) > 23) {
          hours = "23";
        }
        if (Number.parseInt(minutes) > 59) {
          minutes = "59";
        }
        _v = `${hours}:${minutes}`;
      }
      onChange(_v);
      return;
    }
    if (numberInput) {
      let unformatValue = unformatNumeral(value);
      /**
       * In mobile, if users're using `comma` number separator input layout, replace it by `dot`.
       */
      if (value.endsWith(",")) {
        unformatValue += ".";
      }
      const decimalCount = unformatValue.split(".")[1]?.length;
      if (decimalCount && decimalCount > decimals) {
        return;
      }
      onChange(unformatValue);
      return;
    }
    onChange(value);
  };

  const handleToggleShowPassword = (): void => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className={cn("w-full space-y-1", rounded ? "rounded-full" : "rounded-[4px]", cls?.wrapper)}>
      {(!!label || displayWordCount) && (
        <div className={cn("flex items-center justify-between text-label-sm-sec text-itr-tentPri-df", cls?.label)}>
          <span>
            <span>{label}</span>
            {!!subLabel && (
              <>
                &nbsp;
                <span className="text-p-sm text-itr-tentPri-sub">{subLabel}</span>
              </>
            )}
            {required && (
              <>
                &nbsp;
                <span className="text-p-sm text-itr-dg-df">*</span>
              </>
            )}
          </span>
          {displayWordCount && (
            <span className="text-p-xs text-itr-tentPri-sub">{`${value.length}${
              maxLength ? `/${maxLength}` : ""
            }`}</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "flex w-full items-center space-x-2 hover:border-2 active:border-2",
          rounded ? "rounded-full" : "rounded-[4px]",
          isFocusing ? "border-2" : "border",
          variant === "default"
            ? isDisabled
              ? "border-bd-pri-dis hover:border active:border"
              : isError
                ? "border-bd-dg-df"
                : isWarning
                  ? "border-bd-wn-df"
                  : isFocusing
                    ? "border-bd-pri-pressed"
                    : "border-bd-pri-df hover:border-bd-pri-hv"
            : isDisabled
              ? "border-sf-pri-dis bg-sf-pri-dis hover:border active:border"
              : isError
                ? "border-bd-dg-df bg-sf-dg-df"
                : isWarning
                  ? "border-bd-wn-df bg-sf-wn-df"
                  : isFocusing
                    ? "border-bd-pri-pressed"
                    : "border-sf-pri-df bg-sf-pri-df hover:border-sf-pri-hv hover:bg-sf-pri-hv",
          SIZE_MAP.inputWrap[isDisabled || isFocusing ? "active" : "normal"][size],
          cls?.container,
        )}
        onClick={handleFocus}
      >
        {iconLeft ? (
          <span
            className={cn("shrink-0", isDisabled ? "text-itr-tentPri-dis" : "text-itr-tentPri-df", ICON_SIZE_MAP[size])}
          >
            {iconLeft}
          </span>
        ) : null}

        <input
          autoCapitalize={autoCapitalize}
          autoComplete="off"
          autoCorrect="off"
          autoFocus={autoFocus}
          className={cn(
            "min-w-0 flex-1 bg-transparent focus:outline-none",
            SIZE_MAP.input[size],
            isDisabled ? "text-itr-tentPri-dis" : "text-itr-tentPri-df",
            isReadOnly ? "cursor-default" : "",
            cls?.input,
          )}
          inputMode={numberInput ? "decimal" : undefined}
          maxLength={maxLength}
          placeholder={placeholder}
          readOnly={isReadOnly || isDisabled}
          ref={mergedRef}
          spellCheck="false"
          tabIndex={tabIndex}
          type={type === "password" ? (isShowPassword ? "text" : "password") : type}
          value={numberInput ? formatNumeral(value, decimals, positiveOnly) : value}
          onBlur={handleBlur}
          onChange={handleChangeTextField}
          onFocus={handleFocus}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
        {type === "password" ? (
          <button
            className={cn("shrink-0", isDisabled ? "text-itr-tentPri-dis" : "text-itr-tentPri-df", ICON_SIZE_MAP[size])}
            tabIndex={-1}
            onClick={handleToggleShowPassword}
          >
            {isShowPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        ) : null}
        {rightNode ||
          (iconRight && type !== "password" ? (
            <span
              className={cn(
                "shrink-0",
                isDisabled ? "text-itr-tentPri-dis" : "text-itr-tentPri-df",
                ICON_SIZE_MAP[size],
              )}
            >
              {iconRight}
            </span>
          ) : null)}
        {clearInput && !isReadOnly && value.length > 0 && !iconRight && type !== "password" && !!onChange && (
          <span
            className={cn(
              "shrink-0 cursor-pointer",
              isDisabled ? "text-itr-tentPri-dis" : "text-itr-tentPri-df",
              ICON_SIZE_MAP[size],
            )}
            onClick={() => onChange("")}
          >
            <RiCloseCircleFill />
          </span>
        )}
      </div>
      {!!hintText && (
        <div className="flex items-start space-x-1">
          <RiInformationFill
            className={cn(
              "mt-px size-4 shrink-0",
              isError ? "text-itr-tone-dgSub" : isWarning ? "text-itr-tone-wnSub" : "text-itr-tentPri-sub",
            )}
          />
          <span
            className={cn(
              "flex-1 text-p-sm",
              isError ? "text-itr-tone-dg" : isWarning ? "text-itr-tone-wn" : "text-itr-tentPri-sub",
            )}
          >
            {hintText}
          </span>
        </div>
      )}
    </div>
  );
});
