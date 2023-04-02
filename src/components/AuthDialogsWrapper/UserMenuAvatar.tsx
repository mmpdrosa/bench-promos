import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import { FaSignOutAlt, FaUserLock } from 'react-icons/fa'

import { useAuth } from '../../contexts/AuthContext'

export function UserMenuAvatar() {
  const { user, isAdmin, logOut } = useAuth()
  const router = useRouter()

  function handleAdminClick() {
    router.push('/admin')
  }

  async function handleSignOutClick() {
    await logOut()

    router.push('/')
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="h-10 w-10 inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle cursor-pointer">
          {user?.photoURL ? (
            <Avatar.Image
              className="h-full w-full rounded-[inherit] object-cover"
              src={user.photoURL}
              referrerPolicy="no-referrer"
              alt={user.displayName ? user.displayName : 'Avatar'}
            />
          ) : (
            <Avatar.Fallback
              className="h-full w-full flex items-center justify-center font-semibold bg-white"
              delayMs={600}
            >
              {user?.displayName
                ?.split(' ')
                .map((word) => word.charAt(0))
                .join('')
                .toUpperCase() || '?'}
            </Avatar.Fallback>
          )}
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-40 p-[3px] rounded-md shadow-md bg-white"
          sideOffset={5}
          align="end"
        >
          {isAdmin && (
            <DropdownMenu.Item
              onClick={handleAdminClick}
              className="h-6 relative flex justify-between items-center px-1 pl-6 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600"
            >
              Admin
              <FaUserLock />
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item
            onClick={handleSignOutClick}
            className="h-6 relative flex justify-between items-center px-1 pl-6 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600"
          >
            Sair
            <FaSignOutAlt />
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
