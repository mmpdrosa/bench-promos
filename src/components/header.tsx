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

export function Header() {
  const router = useRouter()
  const [searchLocation, setSearchLocation] = useState<'sales' | 'products'>(
    'sales',
  )

  const { register, handleSubmit } = useForm<{ q: string }>()

  async function handleSearch({ q }: { q: string }) {
    if (!q) return

    if (searchLocation === 'products') {
      await router.push(`/busca?q=${q}`)
    } else {
      await router.push(`/promocoes?q=${q}`)
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
    <header className="px-4 max-sm:pt-2 bg-violet-500">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto sm:gap-4 max-lg:flex-wrap">
        <SidebarMenu />

        <Link href="/" title="Bench Promos" className="max-sm:hidden w-60">
          <Image
            src="https://media.discordapp.net/attachments/826681789677436950/1097633179264876564/Logo_atualizada.png?width=550&height=253"
            width={224}
            height={1}
            alt="Logo"
            priority
            className="h-auto w-auto"
          />
        </Link>

        <Link href="/" title="Bench Promos" className="sm:hidden h-10">
          <Image
            src="https://media.discordapp.net/attachments/826681789677436950/1097652886294499409/removal.ai_tmp-643dc88e9dff3-PhotoRoom.png-PhotoRoom.png"
            width={50}
            height={1}
            alt="Logo"
            priority
            className="h-auto w-auto"
          />
        </Link>

        <form
          onSubmit={handleSubmit(handleSearch)}
          className="w-full inline-flex justify-center lg:flex-1 max-lg:order-12 max-lg:py-4"
        >
          <div
            onClick={handleSwitchSearch}
            className="flex items-center justify-center gap-2 max-sm:gap-1 px-4 max-sm:px-2.5 rounded-l-xl bg-white cursor-pointer"
          >
            <span className="w-24 max-sm:w-20 text-sm max-sm:text-xs font-bold select-none">
              {searchLocation === 'sales' ? 'Promoções' : 'Produtos'}
            </span>

            <HiOutlineSwitchVertical className="max-sm:text-sm" />
          </div>

          <div className="py-4 max-sm:py-2.5 bg-white">
            <div className="w-px h-full bg-zinc-300"></div>
          </div>

          <input
            className="w-3/5 h-14 max-sm:h-10 max-lg:w-full px-4 max-sm:px-2.5 outline-none text-sm focus:outline-none"
            type="search"
            placeholder="Digite sua busca..."
            {...register('q')}
          />
          <button className="group w-14 flex items-center justify-center rounded-r-xl transition-colors bg-amber-300 hover:bg-yellow-400 focus:outline-none">
            <HiSearch className="text-2xl max-sm:text-lg transition-colors text-zinc-600 group-hover:text-black" />
          </button>
        </form>

        <div className="w-60 flex items-center justify-end gap-4">
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
