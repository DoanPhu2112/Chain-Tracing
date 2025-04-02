import { useMergedRef } from "@mantine/hooks";
import { RiInformationFill } from "@remixicon/react";
import * as React from "react";

import type { OverridableComponentProps } from "@/types/overrideableComponent";
import { cn } from "@/lib/utils";

type Size = "md" | "sm";

type TextareaProps = {
  value: string;
  label?: string;
  subLabel?: string;
  size?: Size;
  placeholder?: string;
  hintText?: string;
  cls?: {
    wrapper?: string;
    container?: string;
    input?: string;
    label?: string;
  };
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  displayWordCount?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isWarning?: boolean;
  isReadOnly?: boolean;
  required?: boolean;
  dataTest?: string;
  onChange?: (val: string) => void;
};

type Props<C extends React.ElementType> = OverridableComponentProps<C, TextareaProps>;

const SIZE_MAP = {
  sm: "px-2 py-1",
  md: "px-3 py-1.5",
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props<"textarea">>(function Textarea(
  {
    value,
    label,
    subLabel,
    size = "md",
    placeholder,
    hintText,
    cls,
    displayWordCount,
    isDisabled,
    isError,
    isReadOnly,
    isWarning,
    dataTest,
    tabIndex,
    rows = 5,
    maxLength,
    required,
    onChange,
    ...props
  },
  ref,
) {
  const [isFocusing, setIsFocusing] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMergedRef(inputRef, ref);

  const handleFocus = (): void => {
    if (isDisabled) {
      return;
    }
    inputRef.current?.focus();
    setIsFocusing(true);
  };

  const handleBlur = (): void => {
    inputRef.current?.blur();
    setIsFocusing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn("w-full space-y-1", cls?.wrapper)}>
      {(!!label || displayWordCount) && (
        <div className={cn("flex items-center justify-between text-label-sm-sec text-itr-tentPri-df", cls?.label)}>
          <span>
            <span>{label}</span>
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
      {!!subLabel && (
        <>
          <span className="text-p-sm text-itr-tentPri-sub">{subLabel}</span>
        </>
      )}

      <div
        className={cn(
          "flex w-full items-center space-x-2 rounded-xl hover:border-2 hover:p-[3px] active:border-2 active:p-[3px] disabled:border disabled:p-1",
          isFocusing ? "border-2 p-[3px] hover:p-[3px] active:p-[3px] disabled:p-[3px]" : "border p-1",
          isDisabled
            ? "border-bd-pri-dis !p-1 hover:border active:border disabled:border"
            : isError
              ? "border-bd-dg-df"
              : isWarning
                ? "border-bd-wn-df"
                : isFocusing
                  ? "border-bd-pri-pressed"
                  : "border-bd-pri-df hover:border-bd-pri-hv",
          cls?.container,
        )}
        onClick={handleFocus}
      >
        <textarea
          autoFocus={false}
          className={cn(
            "hide-scrollbar min-w-0 flex-1 bg-transparent text-p-sm focus:outline-none",
            isDisabled ? "text-itr-tentPri-dis" : "text-itr-tentPri-df",
            isReadOnly ? "cursor-default" : "",
            SIZE_MAP[size],
            cls?.input,
          )}
          data-test={dataTest}
          maxLength={maxLength}
          placeholder={placeholder}
          readOnly={isReadOnly || isDisabled}
          ref={mergedRef}
          rows={rows}
          tabIndex={tabIndex}
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          {...props}
        />
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
