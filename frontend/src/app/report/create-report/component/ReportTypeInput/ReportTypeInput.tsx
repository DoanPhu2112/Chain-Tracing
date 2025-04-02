import { RiArrowDownSFill, RiInformationFill } from '@remixicon/react'
import * as React from 'react'

import { SelectReportModal } from './SelectReportModal'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  scam: string
  errorText?: string
  readOnly?: boolean
  onScamChange: (scam: string) => void
}

export function ReportTypeInput({
  label,
  errorText,
  readOnly,
  scam,
  onScamChange,
}: Props): React.ReactElement {
  const [isShowingSelectAssetModal, setIsShowingSelectAssetModal] = React.useState(false)

  const handleOpenSelectModal = () => {
    if (readOnly) {
      return
    }
    setIsShowingSelectAssetModal(true)
  }

  const handleCloseSelectModal = () => {
    setIsShowingSelectAssetModal(false)
  }

  const handleScamChange = (scam: string) => {
    onScamChange?.(scam)
  }

  return (
    <React.Fragment>
      <div className="space-y-1">
        <div className="text-label-sm-pri text-itr-tentPri-df">
          <span>{label}</span>
          &nbsp;
          <span className="text-p-sm text-itr-dg-df">*</span>
        </div>
        <div
          className={cn(
            'flex items-center justify-between space-x-2 rounded-full border px-3 py-2 hover:border-2 hover:px-[11px] hover:py-[7px]',
            errorText ? 'border-bd-dg-df' : 'border-bd-pri-df',
            readOnly ? '' : 'cursor-pointer'
          )}
          onClick={handleOpenSelectModal}
        >
          <span className="flex-1 text-p-sm">{scam}</span>
          {!readOnly && (
            <RiArrowDownSFill className="size-4 shrink-0 text-itr-tentPri-df" />
          )}
        </div>
        {!!errorText && (
          <div className="flex items-start space-x-1">
            <RiInformationFill className="mt-px size-4 shrink-0 text-itr-tone-dgSub" />
            <span className="flex-1 text-p-sm text-itr-tone-dg">{errorText}</span>
          </div>
        )}
      </div>
      <SelectReportModal
        isOpen={isShowingSelectAssetModal}
        onClose={handleCloseSelectModal}
        onSelectScam={handleScamChange}
      />
    </React.Fragment>
  )
}
