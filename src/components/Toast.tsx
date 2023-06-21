import * as ToastPrimitive from '@radix-ui/react-toast'
import { clsx } from 'clsx'
import React from 'react'

import { useMediaQuery } from '../hooks/use-media-query'

type ToastProps = {
  title: string
  description?: string
  triggerButton: React.ReactNode
  beforeOpen?: () => Promise<void>
}

const Toast = ({
  title,
  description,
  triggerButton,
  beforeOpen,
}: ToastProps) => {
  const [open, setOpen] = React.useState(false)
  const isMd = useMediaQuery('(min-width: 768px)')

  return (
    <ToastPrimitive.Provider swipeDirection={isMd ? 'right' : 'down'}>
      {React.cloneElement(triggerButton as React.ReactElement, {
        onClick: async () => {
          if (open) {
            setOpen(false)
            setTimeout(() => {
              setOpen(true)
            }, 400)
          } else {
            if (beforeOpen) {
              await beforeOpen()
            }
            setOpen(true)
          }
        },
      })}
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={clsx(
          'fixed inset-x-4 bottom-4 z-50 w-auto rounded-lg shadow-lg md:bottom-auto md:left-auto md:right-4 md:top-4 md:w-full md:max-w-sm',
          'bg-white',
          'dark:bg-zinc-800',
          'rdx-state-open:animate-toast-slide-in-bottom md:rdx-state-open:animate-toast-slide-in-right',
          'rdx-state-closed:animate-toast-hide',
          'rdx-swipe-direction-right:rdx-swipe-end:animate-toast-swipe-out-x',
          'rdx-swipe-direction-right:translate-x-rdx-toast-swipe-move-x',
          'rdx-swipe-direction-down:rdx-swipe-end:animate-toast-swipe-out-y',
          'rdx-swipe-direction-down:translate-y-rdx-toast-swipe-move-y',
          'rdx-swipe-cancel:translate-x-0 rdx-swipe-cancel:duration-200 rdx-swipe-cancel:ease-[ease]',
          'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
        )}
      >
        <div className="flex">
          <div className="flex w-0 flex-1 items-center py-4 pl-5">
            <div className="w-full">
              <ToastPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-zinc-200">
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 dark:text-zinc-300">
                {description}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col space-y-1 px-3 py-2">
              <div className="flex h-0 flex-1">
                <ToastPrimitive.Close className="flex w-full items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-700 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  Fechar
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  )
}

export { Toast }
