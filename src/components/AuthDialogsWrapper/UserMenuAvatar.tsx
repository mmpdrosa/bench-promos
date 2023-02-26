import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { useAuth } from '../../contexts/AuthContext'

export function UserMenuAvatar() {
  const { logOut } = useAuth()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="h-10 w-10 inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle cursor-pointer">
          <Avatar.Fallback
            className="h-full w-full flex items-center justify-center font-semibold bg-white"
            delayMs={600}
          >
            MP
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-40 p-[3px] rounded-md shadow-md bg-white"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            onClick={logOut}
            className="h-6 relative flex items-center px-1 pl-6 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600"
          >
            Sair
            <FontAwesomeIcon className="ml-auto pl-5" icon={faSignOut} />
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
