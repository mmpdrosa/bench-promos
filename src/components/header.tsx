import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaBell } from 'react-icons/fa'
import { HiOutlineSwitchVertical, HiSearch } from 'react-icons/hi'

import { AuthDialogsWrapper } from './AuthDialogsWrapper'
import { Menu } from './Menu'
import { SidebarMenu } from './SidebarMenu'
import ThemeToggleButton from './ThemeToggle'

export function Header() {
  const router = useRouter()
  const [searchLocation, setSearchLocation] = useState<'sales' | 'products'>(
    'products',
  )

  const { register, handleSubmit } = useForm<{ q: string }>()

  async function handleSearch({ q }: { q: string }) {
    if (!q) return

    if (searchLocation === 'products') {
      await router.push(`/busca?q=${q}`)
    } else {
      await router.push(`/?q=${q}`)
    }
  }

  const handleSwitchSearch = () => {
    if (searchLocation === 'sales') {
      setSearchLocation('products')
    } else {
      setSearchLocation('sales')
    }
  }

  return (
    <header className="bg-violet-500 px-4 dark:bg-zinc-900 max-sm:pt-2">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-x-4 max-lg:flex-wrap max-lg:justify-start">
        <SidebarMenu />

        <Link
          href="/"
          title="Bench Promos"
          className="relative h-28 w-60 max-sm:hidden"
        >
          <Image
            className="object-contain"
            src="https://media.discordapp.net/attachments/826681789677436950/1097633179264876564/Logo_atualizada.png"
            fill
            alt="Logo"
            priority
          />
        </Link>

        <Link
          href="/"
          title="Bench Promos"
          className="relative h-12 w-20 sm:hidden"
        >
          <Image
            className="object-contain"
            src="https://media.discordapp.net/attachments/826681789677436950/1097652886294499409/removal.ai_tmp-643dc88e9dff3-PhotoRoom.png-PhotoRoom.png"
            fill
            alt="Logo"
            priority
          />
        </Link>

        <form
          onSubmit={handleSubmit(handleSearch)}
          className="inline-flex w-full justify-center max-lg:order-12 max-lg:py-4 lg:flex-1"
        >
          <div
            onClick={handleSwitchSearch}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-l-xl bg-white px-4 dark:bg-zinc-800 dark:text-zinc-200 max-sm:gap-1 max-sm:px-2.5"
          >
            <span className="w-24 select-none text-sm font-bold max-sm:w-20 max-sm:text-xs">
              {searchLocation === 'sales' ? 'Promoções' : 'Produtos'}
            </span>

            <HiOutlineSwitchVertical className="max-sm:text-sm" />
          </div>

          <div className="bg-white py-4 dark:bg-zinc-800 max-sm:py-2.5">
            <div className="h-full w-px bg-zinc-300 dark:bg-zinc-600"></div>
          </div>

          <input
            className="h-14 w-3/5 px-4 text-sm outline-none focus:outline-none dark:bg-zinc-800 dark:text-zinc-200 max-lg:w-full max-sm:h-10 max-sm:px-2.5"
            type="search"
            placeholder="Digite sua busca..."
            {...register('q')}
          />
          <button className="group flex w-14 items-center justify-center rounded-r-xl bg-amber-300 transition-colors focus:outline-none hover:bg-yellow-400">
            <HiSearch className="text-2xl text-zinc-600 transition-colors group-hover:text-black max-sm:text-lg" />
          </button>
        </form>

        <div className="flex items-center justify-end gap-4 max-lg:ml-auto lg:w-60">
          <div className="ml-0 mr-0 scale-75 lg:hidden">
            <ThemeToggleButton />
          </div>
          <Link
            href="/alertas"
            title="Alertas"
            className="group flex items-center gap-2 p-1 text-lg text-white"
          >
            <FaBell className="text-amber-300" />
            <span className="group-hover:underline max-sm:hidden">Alertas</span>
          </Link>

          <AuthDialogsWrapper />
        </div>
      </div>

      <Menu />
    </header>
  )
}
