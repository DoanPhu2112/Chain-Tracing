'use client'
import { useEffect, useState } from 'react'
import { CreateReportStep, CreateReportSteps } from './component/ReportStep'
import { CaseDetailValidator } from './component/CaseDetailValidator'
import { ScammerDetailValidator } from './component/ScammerDetailValidator'
import {
  defaultReportDetailValue,
  ReportDetailValue,
  ScammerDetailValue,
} from './_helper'
import { useRouter } from 'next/navigation'
import { useCreateReport } from '@/api/hooks/use-create-report'
import { useToast } from '@/hooks/use-toast'

export default function CreateReport() {
  const { toast } = useToast()
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<CreateReportStep>(
    CreateReportStep.CASE_DETAIL
  )

  const { mutateAsync: submitReport } = useCreateReport()

  const router = useRouter() // may be null or a NextRouter instance

  const [reportDetail, setReportDetail] = useState<ReportDetailValue>(
    defaultReportDetailValue
  )

  async function handleSubmitReport(form: ReportDetailValue) {
    const formVar = {
      ...form,
      userName: userName || 'phu',
      title: form.category,
      timestamp: Number(new Date()),
    }
    console.log('formVar', formVar)
    try {
      const data = await submitReport(formVar)
      console.log('data', data)
      if (!data.status) {
        throw 'Failed to create report'
      }
      return data
    } catch (error) {
      // Ky exposes the response via error.response
      const errorMessage = await (error as any).response?.json()

      toast({
        title: 'Submission failed',
        description:
          typeof errorMessage === 'string'
            ? errorMessage
            : errorMessage?.error || 'Unexpected error',
      })

      throw new Error(
        typeof errorMessage === 'string'
          ? errorMessage
          : errorMessage?.error || 'Unexpected error'
      )
    }
  }

  useEffect(() => {
    const userName = localStorage.getItem('chain-tracing:account')
    if (userName) {
      setUserName(userName)
    } else {
      setUserName(null)
    }
  })

  return (
    <div>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white">Loading...</span>
        </div>
      )}

      <div className="space-y-6 px-4 py-6 md:space-y-8 md:px-6 md:py-8">
        <div className="mx-auto max-w-[846px] space-y-4 md:space-y-6">
          <div className="space-y-2">
            <div className="font-sans text-title-h4">Report a Scam</div>
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
                isLogin={!!userName}
                onNext={(formValue) => {
                  setReportDetail((prev) => ({ ...prev, ...formValue }))
                  setCurrentStep(CreateReportStep.SCAMMER_DETAIL)
                }}
              />
            ) : (
              <ScammerDetailValidator
                onCreate={async (form: ScammerDetailValue) => {
                  setIsLoading(true)
                  const data = { ...reportDetail, ...form, user_id: 1 }
                  setReportDetail(data)
                  try {
                    const response = await handleSubmitReport(data)
                    setIsLoading(false)
                    const id = await response?.json()
                    if (!id) {
                      throw 'Failed to create report'
                    }
                    console.log(id.report_id)
                    router.push(`/report/${id.report_id}`)
                    return { id: id.report_id }
                  } catch (error) {
                    setIsLoading(false)
                    toast({
                      title: 'Failed to submit report',
                      description: error as string,
                      duration: 3000,
                    })
                    console.error('Submit failed:', error)
                  }
                }}
                onBack={() => {
                  setCurrentStep(CreateReportStep.CASE_DETAIL)
                }}
              />
            )}
          </div>
        </div>{' '}
      </div>
    </div>
  )
}
