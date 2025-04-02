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

type ScammerDetailValidatorProps = {
  onBack: () => void;
  onCreate: (form: ScammerDetailValue) => Promise<{ id: string }>;
};

const defaultValue: ScammerDetailValue = {
  amount: [{ value: 0, token: "ETH" }],
  transactionHash: [""],
  description: "",
  timestamp: 0,
};

export function ScammerDetailValidator({
  onBack,
  onCreate,
}: ScammerDetailValidatorProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: defaultValue,
  });

  const watchTransaction = watch("transactionHash");

  function handleBack() {
    onBack();
  }
  async function handleClickNext(formValue: ScammerDetailValue) {
    setIsLoading(true);
    const report = await onCreate(formValue);
    return report.id;
  }

  function handleAddTransactionHash() {
    setValue("transactionHash", [...watchTransaction, ""]);
  }

  function renderTransactionHashFields() {
    return watchTransaction.map((txn, index) => (
      <Controller
        key={index}
        control={control}
        name={`transactionHash.${index}`}
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
                iconRight={
                  <MdDelete
                    className="cursor-pointer"
                    onClick={() => {
                      const newTransaction = watchTransaction.filter(
                        (_, i) => i !== index,
                      );
                      setValue("transactionHash", newTransaction);
                    }}
                  />
                }
              />
              {error && (
                <span className="text-red-500 text-xs">{error.message}</span>
              )}
            </div>
          );
        }}
      />
    ));
  }

  return (
    <div>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white">Loading...</span>
        </div>
      )}
      <div className="space-y-4 rounded-2xl border border-bd-pri-sub p-4 md:space-y-6 md:p-6">
        <div className="text-label-lg-pri text-itr-tone-hl">Scam Detail</div>
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
                <div>
                  <TextField
                    label="How much was lost"
                    value={field.value?.toString() || ""}
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
                <div >
                  <TextField
                    label="Symbol"
                    value={field.value || ""}
                    placeholder="e.g. ETH"
                    onChange={field.onChange}
                    cls={{
                      label: "text-label-sm-pri text-right",
                    }}
                  />
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
            Transaction Hash(es)
          </div>
          {renderTransactionHashFields()}
          <Button
            onClick={handleAddTransactionHash}
            className="border-gray-300"
            size="xs"
            iconLeft={<IoMdAddCircleOutline />}
            variant="secondary"
          >
            Add Transaction Hash
          </Button>

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
