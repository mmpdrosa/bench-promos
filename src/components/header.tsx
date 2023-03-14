import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaBell } from 'react-icons/fa'
import { HiSearch } from 'react-icons/hi'

import LogoImg from '@/assets/logo.svg'
import { AuthDialogsWrapper } from './AuthDialogsWrapper'
import { Menu } from './Menu'
import { SidebarMenu } from './SidebarMenu'

export function Header() {
  const router = useRouter()

  const { register, handleSubmit, reset } = useForm<{ q: string }>()

  async function handleSearch({ q }: { q: string }) {
    if (q) {
      await router.push(`/search?q=${q}`)

      reset()
    }
  }

  return (
    <header className="px-8 pt-2 max-sm:px-4 bg-violet-500">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto sm:gap-4 max-lg:flex-wrap">
        <SidebarMenu />

        <Link href="/" title="Bench Promo" className="max-sm:hidden w-60">
          <Image src={LogoImg} width={224} alt="Logo" priority />
        </Link>

        <form
          onSubmit={handleSubmit(handleSearch)}
          className="w-full inline-flex justify-center lg:flex-1 max-lg:order-last max-lg:py-4"
        >
          <input
            className="h-16 w-4/5 max-lg:w-full px-4 outline-none text-xl rounded-l-2xl border border-zinc-300 focus:outline-none focus:border-violet-800"
            type="text"
            placeholder="Busque aqui"
            {...register('q')}
          />
          <button className="group p-4 rounded-r-2xl border transition-colors border-zinc-300 bg-amber-300 hover:bg-yellow-400 active:bg-amber-400 focus:outline-none focus:outline-0 focus:border-yellow-800">
            <HiSearch className="text-3xl transition-colors text-zinc-600 group-hover:text-black" />
          </button>
        </form>

        <div className="w-60 flex items-center justify-end gap-4">
          <Link
            href="/alerts"
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
