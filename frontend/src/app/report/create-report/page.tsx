'use client'
import { useState } from 'react'
import { CreateReportStep, CreateReportSteps } from './component/ReportStep'
import { CaseDetailValidator } from './component/CaseDetailValidator'
import { ScammerDetailValidator } from './component/ScammerDetailValidator'
import { defaultReportDetailValue, ReportDetailValue, ScammerDetailValue } from './_helper'
import { submitReport } from '@/services/report'
import { useRouter } from 'next/navigation';

export default function CreateReport() {
  const [currentStep, setCurrentStep] = useState<CreateReportStep>(
    CreateReportStep.CASE_DETAIL
  )

  const router = useRouter() // may be null or a NextRouter instance

  const [reportDetail, setReportDetail] = useState<ReportDetailValue>(defaultReportDetailValue)
  const userId = 1
  async function handleSubmitReport(form: ReportDetailValue) {
    form.userId = userId
    const data = await submitReport(form);
    console.log("Result: ", data)

    return data.report_id
  }

  return (
    <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-6 md:py-8">
      <div className="mx-auto max-w-[846px] space-y-4 md:space-y-6">
        <div className="space-y-2">
          <div className="font-interDisplay text-title-h4">Report a Scam</div>
          <p className="text-p-md text-itr-tentPri-sub">
            Enter the details of your case. The more information you provide, the better
            we can help you
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr,1.7fr]">
          <CreateReportSteps
            className="top-[60px] z-10 self-start md:sticky md:top-[92px]"
            step={currentStep}
          />
        {currentStep === CreateReportStep.CASE_DETAIL ? (
          <CaseDetailValidator
            onNext={(formValue) => {
                setReportDetail((prev) => ({ ...prev, ...formValue }))
                setCurrentStep(CreateReportStep.SCAMMER_DETAIL)
              }}
            />
          ) : (
            <ScammerDetailValidator
              onCreate={async (form: ScammerDetailValue) => {
                const data = { ...reportDetail, ...form, user_id: 1 }
                setReportDetail(data)
                const id = await handleSubmitReport(data)
                router.push(`/report/${id}`)
                return {id: id.toString()}
              }}
              onBack={() => {
                setCurrentStep(CreateReportStep.CASE_DETAIL)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
