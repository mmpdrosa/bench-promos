import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useRouter } from 'next/navigation'
import { FaSignOutAlt, FaUserLock } from 'react-icons/fa'

import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'

export function UserMenuAvatar() {
  const { user, isAdmin, logOut } = useAuth()
  const router = useRouter()

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
          className="w-44 p-[4px] rounded-md shadow-md bg-white dark:bg-zinc-800 dark:text-zinc-200"
          sideOffset={5}
          align="end"
        >
          {isAdmin && (
            <>
              <Link href="/admin/sales">
                <DropdownMenu.Item className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600">
                  Promoções
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/products">
                <DropdownMenu.Item className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600">
                  Produtos
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/product-retailers">
                <DropdownMenu.Item className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600">
                  Anúncios
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/retailers">
                <DropdownMenu.Item className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600">
                  Anunciantes
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/coupons">
                <DropdownMenu.Item className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600">
                  Cupons
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/categories">
                <DropdownMenu.Item className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600">
                  Categorias
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/subcategories">
                <DropdownMenu.Item className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600">
                  Subcategorias
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
            </>
          )}

          <DropdownMenu.Item
            onClick={handleSignOutClick}
            className="h-6 relative flex justify-between items-center px-1 pl-6 py-4 rounded text-sm font-medium leading-none select-none outline-none cursor-pointer rdx-highlighted:text-violet-50 rdx-highlighted:bg-violet-600"
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
