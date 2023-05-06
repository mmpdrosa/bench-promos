import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { clsx } from 'clsx'
import React from 'react'

interface TooltipProps {
  triggerElement: React.ReactNode
  content: string
}

const Tooltip = ({ triggerElement, content }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {React.cloneElement(triggerElement as React.ReactElement)}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          sideOffset={4}
          collisionPadding={16}
          className={clsx(
            'rdx-side-top:animate-slide-down-fade',
            'rdx-side-right:animate-slide-left-fade',
            'rdx-side-bottom:animate-slide-up-fade',
            'rdx-side-left:animate-slide-right-fade',
            'inline-flex items-center rounded-md px-4 py-2.5',
            'w-[384px] max-w-sm bg-gray-100',
          )}
        >
          <TooltipPrimitive.Arrow className="fill-current text-black" />
          <span className="block text-xs leading-none whitespace-pre-line text-gray-700">
            {content}
          </span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export { Tooltip }
