import * as Popover from '@radix-ui/react-popover'
import { FaInfoCircle } from 'react-icons/fa'

interface CouponTooltipProps {
  comments: string
}
const CouponPopover = ({ comments }: CouponTooltipProps) => {
  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className=" absolute right-10 top-5 h-8 w-8 text-amber-300 transition-colors hover:text-white">
            <FaInfoCircle size={30} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="max-w-xs rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-600 p-4 font-semibold text-zinc-50"
            sideOffset={5}
          >
            {comments}
            <Popover.Arrow height={8} width={16} className="fill-zinc-800" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}

export default CouponPopover
