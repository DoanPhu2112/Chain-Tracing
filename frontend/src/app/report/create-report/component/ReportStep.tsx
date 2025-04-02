import { cn } from '@/lib/utils'
import { RiCheckLine } from '@remixicon/react'

export enum CreateReportStep {
  CASE_DETAIL = 0,
  SCAMMER_DETAIL = 1,
}

type Props = {
  step: CreateReportStep
  className?: string
}

export function CreateReportSteps({ step, className }: Props) {
  return (
    <div className={cn("space-y-4 md:space-y-6", className)}>
      <div className="relative flex items-start justify-between rounded-2xl bg-sf-pri-sub px-4 md:block md:px-6">
        <div className="relative flex flex-col space-x-0 space-y-2 py-4 md:flex-row md:items-start md:justify-between md:space-x-3 md:space-y-0 md:py-6">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-label-md-pri",
              step >= CreateReportStep.CASE_DETAIL
                ? "bg-itr-tone-hl text-itr-tone-tent"
                : "bg-sf-pri-df text-itr-tentPri-df",
            )}
          >
            {step > CreateReportStep.CASE_DETAIL ? <RiCheckLine className="size-4 shrink-0" /> : "1"}
          </div>
            <div className="flex-1 space-y-0.5">
              <div className="text-label-sm-sec">Case Detail</div>
              <p className="-mr-8 text-p-xs text-itr-tentPri-sub md:mr-0">
                Information to help the community identify you.
              </p>
            </div>
          <div
            className={cn(
              "absolute !m-0 hidden md:block",
              step > CreateReportStep.CASE_DETAIL ? "bg-itr-tone-hl" : "bg-bd-pri-df",
            )}
            style={{
              top: "58px",
              left: "15px",
              width: "2px",
              height: "calc(100% - 36px)",
            }}
          />
        </div>
        <div
          className={cn(
            "absolute !m-0 md:hidden",
            step > CreateReportStep.SCAMMER_DETAIL ? "bg-itr-tone-hl" : "bg-bd-pri-df",
          )}
          style={{
            top: "32px",
            left: "50px",
            width: "calc(100% - 100px)",
            height: "2px",
          }}
        />
        <div className="flex flex-col items-end space-x-0 space-y-2 py-4 text-right md:flex-row md:items-start md:justify-between md:space-x-3 md:space-y-0 md:py-6 md:text-left">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-label-md-pri",
              step >= CreateReportStep.SCAMMER_DETAIL
                ? "bg-itr-tone-hl text-itr-tone-tent"
                : "bg-sf-pri-df text-itr-tentPri-df",
            )}
          >
            2
          </div>
            <div className="flex-1 space-y-0.5">
              <div className="text-label-sm-sec">Scam Detail</div>
              <p className="-ml-8 text-p-xs text-itr-tentPri-sub md:ml-0">
                Key event details: raise amount, start/end dates, etc.
              </p>
            </div>
        </div>
      </div>

    </div>
  )
}
