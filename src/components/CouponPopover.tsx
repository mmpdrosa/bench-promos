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
          <button className=" h-8 w-8 top-5 right-10 absolute text-amber-300 hover:text-white transition-colors">
            <FaInfoCircle size={30} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="bg-gradient-to-br from-zinc-800 to-zinc-600 rounded-lg text-zinc-50 font-semibold p-4 max-w-xs"
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
