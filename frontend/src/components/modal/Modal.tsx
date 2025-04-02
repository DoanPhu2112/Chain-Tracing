import { RiCloseFill } from '@remixicon/react'
import type * as React from 'react'
import { Dialog, Portal } from '@ark-ui/react';

import { handleArkClickOutside } from '@/helpers/client/handleArkClickOutside'
import { cn } from '@/lib/utils'

import { IconButton } from '../button'
import { Divider } from '../Divider'
import styles from './Modal.module.scss'

type Props = {
  children: React.ReactNode
  isOpen: boolean
  title: string
  subTitle?: string
  footer?: React.ReactNode
  preventClickOutside?: boolean
  cls?: {
    wrapper?: string
    content?: string
    backdrop?: string
    positioner?: string
  }
  dataTest?: {
    content?: string
    close?: string
  }
  trapFocus?: boolean
  separateFooter?: boolean
  onClose: () => void
}

function Modal({
  isOpen,
  title,
  subTitle,
  children,
  footer,
  preventClickOutside,
  cls,
  dataTest,
  trapFocus = false,
  separateFooter = true,
  onClose,
}: Props): React.ReactElement {
  function handleOpenChange({ open }: { open: boolean }) {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog.Root
      closeOnInteractOutside={false}
      open={isOpen}
      trapFocus={trapFocus}
      lazyMount
      unmountOnExit
      onOpenChange={handleOpenChange}
      onPointerDownOutside={(event) => {
        !preventClickOutside && handleArkClickOutside(event, onClose)
      }}
    >
      <Portal>
        <Dialog.Backdrop
          className={cn(
            'fixed inset-0 z-50 bg-ovl-md backdrop-blur-sm',
            styles.backdrop,
            cls?.backdrop
          )}
        />
        <Dialog.Positioner
          className={cn(
            'fixed inset-0 z-50 flex flex-col items-center',
            'justify-center px-6 py-24',
            cls?.positioner
          )}
        >
          <Dialog.Content
            className={cn(
              'flex w-full flex-col overflow-hidden bg-base-bg text-left align-middle shadow-2xl',
              'max-w-screen-xs',
              'h-fit max-h-full space-y-6 rounded-[20px] py-6',
              cls?.wrapper,
              styles.content
            )}
            data-test={dataTest?.content}
          >
            <div className="flex items-center justify-between space-x-2 px-4 md:px-6">
              <div className="space-y-2">
                <Dialog.Title className="font-interDisplay text-title-h6 text-itr-tentPri-df">
                  {title}
                </Dialog.Title>
                {!!subTitle && (
                  <p className="text-p-sm text-itr-tentPri-sub">{subTitle}</p>
                )}
              </div>
              <IconButton
                className="size-6"
                dataTest={dataTest?.close}
                icon={<RiCloseFill />}
                size="md"
                variant="ghost"
                onClick={onClose}
              />
            </div>
            <div className={cn('flex-1 overflow-y-auto px-4 md:px-6', cls?.content)}>
              {children}
            </div>
            {!!footer && (
              <div className="space-y-4 px-4 md:space-y-6 md:px-6">
                {separateFooter && <Divider />}
                {footer}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default Modal
