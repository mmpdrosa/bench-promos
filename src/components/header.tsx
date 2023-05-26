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
    <header className="px-4 max-sm:pt-2 bg-violet-500 dark:bg-zinc-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto gap-x-4 max-lg:flex-wrap max-lg:justify-start">
        <SidebarMenu />

        <Link
          href="/"
          title="Bench Promos"
          className="relative max-sm:hidden w-60 h-28"
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
          className="relative sm:hidden w-20 h-12"
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
          className="w-full inline-flex justify-center lg:flex-1 max-lg:order-12 max-lg:py-4"
        >
          <div
            onClick={handleSwitchSearch}
            className="flex items-center justify-center gap-2 max-sm:gap-1 px-4 max-sm:px-2.5 rounded-l-xl bg-white dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
          >
            <span className="w-24 max-sm:w-20 text-sm max-sm:text-xs font-bold select-none">
              {searchLocation === 'sales' ? 'Promoções' : 'Produtos'}
            </span>

            <HiOutlineSwitchVertical className="max-sm:text-sm" />
          </div>

          <div className="py-4 max-sm:py-2.5 bg-white dark:bg-zinc-800">
            <div className="w-px h-full bg-zinc-300 dark:bg-zinc-600"></div>
          </div>

          <input
            className="w-3/5 h-14 max-sm:h-10 max-lg:w-full px-4 max-sm:px-2.5 outline-none text-sm dark:bg-zinc-800 focus:outline-none dark:text-zinc-200"
            type="search"
            placeholder="Digite sua busca..."
            {...register('q')}
          />
          <button className="group w-14 flex items-center justify-center rounded-r-xl transition-colors bg-amber-300 hover:bg-yellow-400 focus:outline-none">
            <HiSearch className="text-2xl max-sm:text-lg transition-colors text-zinc-600 group-hover:text-black" />
          </button>
        </form>

        <div className="lg:w-60 flex items-center justify-end gap-4 max-lg:ml-auto">
          <div className="lg:hidden scale-75 mr-0 ml-0">
            <ThemeToggleButton />
          </div>
          <Link
            href="/alertas"
            title="Alertas"
            className="group flex items-center gap-2 p-1 text-lg text-white"
          >
            <FaBell className="text-amber-300" />
            <span className="max-sm:hidden group-hover:underline">Alertas</span>
          </Link>

          <AuthDialogsWrapper />
        </div>
      </div>

      <Menu />
    </header>
  )
}
