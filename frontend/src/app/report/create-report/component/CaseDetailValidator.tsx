'use-client'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'

import { ReportTypeInput } from './ReportTypeInput/ReportTypeInput'
import { Divider } from '@/components/Divider'
import { TextField } from '@/components/textfield'
import { Button } from '@/components/button'
import { CaseDetailValue } from '../_helper'

type CaseDetailValidatorProps = {
  onNext: (formValue: CaseDetailValue) => void
}

const defaultValue: CaseDetailValue = {
  category: '',
  address: [''],
  url: '',
  ip: '',
}

export function CaseDetailValidator({ onNext }: CaseDetailValidatorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: defaultValue,
  })
  const watchAddress = watch('address')

  function addAddressInput() {
    setValue('address', [...watchAddress, ''])
  }

  function handleClickNext(formValue: CaseDetailValue) {
    onNext(formValue)
  }

  function renderAddressFields() {
    return watchAddress.map((address, index) => (
      <Controller
        key={index}
        control={control}
        name={`address.${index}`}
        rules={{
          required: "Please enter the scammer's blockchain address",
          pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: "Please enter a valid Ethereum address"
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col">
            <TextField
              label={`Blockchain address of the scammer ${index + 1}`}
              value={field.value}
              cls={{ label: 'text-label-sm-pri' }}
              required={true}
              placeholder="Enter address"
              onChange={field.onChange}
              iconRight={
                <MdDelete
                  className="cursor-pointer"
                  onClick={() => {
                    const newAddress = watchAddress.filter((_, i) => i !== index)
                    setValue('address', newAddress)
                  }}
                />
              }
            />
            {error && <span className="text-red-500 text-xs">{error.message}</span>}
          </div>
        )}
      />
    ))
  }
  

  return (
    <div className="space-y-4 rounded-2xl border border-bd-pri-sub p-4 md:space-y-6 md:p-6">
      <div className="text-label-lg-pri text-itr-tone-hl">Case Detail</div>
      <div className="space-y-4">
        <Controller
          control={control}
          name="category"
          rules={{ required: 'Please select a report type' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <ReportTypeInput
                label="Report type"
                scam={field.value}
                onScamChange={(scam) => {
                  setValue('category', scam)
                  field.onChange(scam)
                }}
              />
              {error && <span className="text-red-500 text-xs">{error.message}</span>}
            </>
          )}
        />
        <Divider />
        {renderAddressFields()}
        <Button
          onClick={addAddressInput}
          className="border-gray-300"
          size="xs"
          iconLeft={<IoMdAddCircleOutline />}
          variant="secondary"
        >
          Add address
        </Button>
        <Divider />
        <Controller
          control={control}
          name="url"
          render={({ field, fieldState: { error } }) => (
            <>
              <TextField
                label="URL(s) used by the scammer, if any"
                value={field.value}
                cls={{ label: 'text-label-sm-pri' }}
                placeholder="Enter URL address"
                onChange={field.onChange}
              />
              {error && <span className="text-red-500 text-xs">{error.message}</span>}
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
                cls={{ label: 'text-label-sm-pri' }}
                placeholder="Enter IP Address"
                onChange={field.onChange}
              />
              {error && <span className="text-red-500 text-xs">{error.message}</span>}
            </>
          )}
        />
        <Button variant="secondary" isFullWidth={true} onClick={handleSubmit(handleClickNext)}>
          Next
        </Button>
      </div>
    </div>
  )
}
