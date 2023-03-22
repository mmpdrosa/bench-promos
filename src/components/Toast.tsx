import * as ToastPrimitive from '@radix-ui/react-toast'
import { clsx } from 'clsx'
import React from 'react'

import { useMediaQuery } from '../hooks/use-media-query'

type ToastProps = {
  title: string
  description?: string
  triggerButton: React.ReactNode
}

const Toast = ({ title, description, triggerButton }: ToastProps) => {
  const [open, setOpen] = React.useState(false)
  const isMd = useMediaQuery('(min-width: 768px)')

  return (
    <ToastPrimitive.Provider swipeDirection={isMd ? 'right' : 'down'}>
      {React.cloneElement(triggerButton as React.ReactElement, {
        onClick: () => {
          if (open) {
            setOpen(false)
            setTimeout(() => {
              setOpen(true)
            }, 400)
          } else {
            setOpen(true)
          }
        },
      })}
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={clsx(
          'z-50 fixed bottom-4 inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg',
          'bg-white dark:bg-gray-800',
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
          <div className="w-0 flex-1 flex items-center pl-5 py-4">
            <div className="w-full">
              <ToastPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                {description}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col px-3 py-2 space-y-1">
              <div className="h-0 flex-1 flex">
                <ToastPrimitive.Close className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
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
