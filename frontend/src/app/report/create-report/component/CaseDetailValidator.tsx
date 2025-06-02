"use-client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

import { ReportTypeInput } from "./ReportTypeInput/ReportTypeInput";
import { Divider } from "@/components/Divider";
import { TextField } from "@/components/textfield";
import { Button } from "@/components/button";
import { CaseDetailValue } from "../_helper";
import Link from "next/link";

type CaseDetailValidatorProps = {
  onNext: (formValue: CaseDetailValue) => void;
  isLogin: boolean;
};

const defaultValue: CaseDetailValue = {
  category: "",
  address: "",
  url: "",
  ip: "",
};

export function CaseDetailValidator({
  onNext,
  isLogin,
}: CaseDetailValidatorProps) {
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: defaultValue,
  });

  function handleClickNext(formValue: CaseDetailValue) {
    onNext(formValue);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-bd-pri-sub p-4 md:space-y-6 md:p-6">
      <div className="text-label-lg-pri text-black">Case Detail</div>
      <div className="space-y-4">
        <Controller
          control={control}
          name="category"
          rules={{ required: "Please select a report type" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <ReportTypeInput
                label="Report type"
                scam={field.value}
                onScamChange={(scam) => {
                  setValue("category", scam);
                  field.onChange(scam);
                }}
              />
              {error && (
                <span className="text-red-500 text-xs">{error.message}</span>
              )}
            </>
          )}
        />
        <Divider />
        <Controller
          control={control}
          name={`address`}
          rules={{
            required: "Please enter the scammer's blockchain address",
            pattern: {
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Please enter a valid Ethereum address",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col">
              <TextField
                label={`Blockchain address of the scammer`}
                value={field.value}
                cls={{ label: "text-label-sm-pri" }}
                required={true}
                placeholder="Enter address (start with 0x)"
                onChange={field.onChange}
              />
              {error && (
                <span className="text-red-500 text-xs">{error.message}</span>
              )}
            </div>
          )}
        />
        <Divider />
        <Controller
          control={control}
          name="url"
          render={({ field, fieldState: { error } }) => (
            <>
              <TextField
                label="URL(s) used by the scammer, if any"
                value={field.value}
                cls={{ label: "text-label-sm-pri" }}
                placeholder="Enter URL address"
                onChange={field.onChange}
              />
              {error && (
                <span className="text-red-500 text-xs">{error.message}</span>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="ip"
          render={({ field, fieldState: { error } }) => (
            <>
              <TextField
                label="Scammer IP address, if any"
                value={field.value}
                cls={{ label: "text-label-sm-pri" }}
                placeholder="Enter IP Address"
                onChange={field.onChange}
              />
              {error && (
                <span className="text-red-500 text-xs">{error.message}</span>
              )}
            </>
          )}
        />
        {isLogin ? (
          <Button
            variant="secondary"
            isFullWidth={true}
            onClick={handleSubmit(handleClickNext)}
          >
            Next
          </Button>
        ) : (
          <Button variant="sub" isFullWidth={true}>
            <Link href="/login">Login to continue</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
