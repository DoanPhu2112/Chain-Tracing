import { TextField } from "@/components/textfield";
import { Controller, useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { ReportTypeInput } from "./ReportTypeInput/ReportTypeInput";
import { Divider } from "@/components/Divider";
import { Button } from "@/components/button";
import { Textarea } from "@/components/textarea";
import { IoMdAddCircleOutline } from "react-icons/io";
import { ReportDetailValue, ScammerDetailValue } from "../_helper";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { shortenedTokens } from "@/constants/tokens";
import { RangePickerProps } from "antd/es/date-picker";

type ScammerDetailValidatorProps = {
  onBack: () => void;
  onCreate: (form: ScammerDetailValue) => Promise<{ id: string } | undefined>;
};

const defaultValue: ScammerDetailValue = {
  amount: [{ value: 0, token: "ETH" }],
  transactionHash: "",
  description: "",
};

export function ScammerDetailValidator({
  onBack,
  onCreate,
}: ScammerDetailValidatorProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: defaultValue,
  });

  function handleBack() {
    onBack();
  }
  async function handleClickNext(formValue: ScammerDetailValue) {
    const report = await onCreate(formValue);
    console.log("report", report);
    if (!report) {
      return;
    }
    return report.id;
  }

  return (
    <div>
      <div className="space-y-4 rounded-2xl border border-bd-pri-sub p-4 md:space-y-6 md:p-6">
        <div className="text-label-lg-pri text-black">Scam Detail</div>
        <div className="space-y-4">
          <div className="flex gap-x-3">
            <Controller
              control={control}
              name="amount.0.value"
              rules={{
                required: "Please enter an amount",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="w-4/5">
                  <TextField
                    required
                    label="How much was lost"
                    value={field.value !== 0 ? field.value.toString() : ""}
                    placeholder="Loss amount (digits only)"
                    onChange={field.onChange}
                    cls={{ label: "text-label-sm-pri" }}
                  />
                  {error && (
                    <span className="text-red-500 text-xs">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="amount.0.token"
              rules={{
                required: "Token symbol is required",
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="w-1/5">
                  <label className="text-label-sm-pri text-right block mb-1">
                    Symbol
                  </label>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="bg-white">
                        <SelectLabel>Symbol</SelectLabel>
                        {shortenedTokens.slice(0, 10).map((symbol) => (
                          <SelectItem key={symbol} value={symbol}>
                            {symbol}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {error && (
                    <span className="text-red-500 text-xs">
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="text-label-sm-pri text-itr-tentPri-df">
            Transaction Hash(es) <span>*</span>
          </div>
          <Controller
            control={control}
            name={`transactionHash`}
            rules={{
              required: "Please enter the transaction hash",
              pattern: {
                value: /^0x[a-fA-F0-9]{64}$/,
                message: "Please enter a valid Ethereum transaction hash",
              },
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <div className="flex flex-col">
                  <TextField
                    value={field.value}
                    cls={{ label: "text-label-sm-pri" }}
                    placeholder="Enter Txn Hash"
                    required={true}
                    onChange={field.onChange}
                  />
                  {error && (
                    <span className="text-red-500 text-xs">
                      {error.message}
                    </span>
                  )}
                </div>
              );
            }}
          />
          <Controller
            control={control}
            name="description"
            rules={{
              required: "Please provide a description",
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Textarea
                  cls={{ label: "text-label-sm-pri" }}
                  subLabel="Please describe the case with as many details as possible to support investigations. If you are posting publicly, make sure not to enter any personal information here."
                  label="Description"
                  onChange={field.onChange}
                  value={field.value}
                />
                {error && (
                  <span className="text-red-500 text-xs">{error.message}</span>
                )}
              </>
            )}
          />
          <div className="flex gap-5">
            <Button variant="secondary" isFullWidth={true} onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="secondary"
              isFullWidth={true}
              onClick={handleSubmit(handleClickNext)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
