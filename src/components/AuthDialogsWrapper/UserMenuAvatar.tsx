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
        <Avatar.Root className="inline-flex h-10 w-10 cursor-pointer select-none items-center justify-center overflow-hidden rounded-full align-middle">
          {user?.photoURL ? (
            <Avatar.Image
              className="h-full w-full rounded-[inherit] object-cover"
              src={user.photoURL}
              referrerPolicy="no-referrer"
              alt={user.displayName ? user.displayName : 'Avatar'}
            />
          ) : (
            <Avatar.Fallback
              className="flex h-full w-full items-center justify-center bg-white font-semibold"
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
          className="w-44 rounded-md bg-white p-[4px] shadow-md dark:bg-zinc-800 dark:text-zinc-200"
          sideOffset={5}
          align="end"
        >
          {isAdmin && (
            <>
              <Link href="/admin/sales">
                <DropdownMenu.Item className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50">
                  Promoções
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/products">
                <DropdownMenu.Item className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50">
                  Produtos
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/product-retailers">
                <DropdownMenu.Item className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50">
                  Anúncios
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/retailers">
                <DropdownMenu.Item className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50">
                  Anunciantes
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/coupons">
                <DropdownMenu.Item className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50">
                  Cupons
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/categories">
                <DropdownMenu.Item className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50">
                  Categorias
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
              <Link href="/admin/subcategories">
                <DropdownMenu.Item className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50">
                  Subcategorias
                  <FaUserLock />
                </DropdownMenu.Item>
              </Link>
            </>
          )}

          <DropdownMenu.Item
            onClick={handleSignOutClick}
            className="relative flex h-6 cursor-pointer select-none items-center justify-between rounded px-1 py-4 pl-6 text-sm font-medium leading-none outline-none rdx-highlighted:bg-violet-600 rdx-highlighted:text-violet-50"
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
