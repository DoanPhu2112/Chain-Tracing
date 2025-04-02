import { Button } from '@/components/button'
import Modal from '@/components/modal/Modal'
import { ScamCategory } from '@/constants/ScamCategory'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelectScam: (scam: string) => void
}

export function SelectReportModal({ isOpen, onClose, onSelectScam }: Props) {
  function handleSelectScam(scam: string) {
    onSelectScam(scam)
    onClose()
  }
  return (
    <Modal
      cls={{
        wrapper: 'h-[calc(100%-52px)] md:h-auto max-w-[500px]',
        content: 'flex flex-col overflow-y-hidden space-y-6 px-10',
      }}
      isOpen={isOpen}
      title="Select Scam Type"
      onClose={onClose}
    >
      {ScamCategory.map((scam) => (
        <div key={scam.toString()}>
            <Button variant='secondary' onClick={() => handleSelectScam(scam)}>{scam}</Button>
        </div>
      ))}
    </Modal>
  )
}