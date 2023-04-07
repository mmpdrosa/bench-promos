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
      await router.push(`/busca?q=${q}`)

      reset()
    }
  }

  return (
    <header className="px-4 max-sm:pt-2 bg-violet-500">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto sm:gap-4 max-lg:flex-wrap">
        <SidebarMenu />

        <Link href="/" title="Bench Promos" className="max-sm:hidden w-60">
          <Image src={LogoImg} width={224} alt="Logo" priority />
        </Link>

        <form
          onSubmit={handleSubmit(handleSearch)}
          className="w-full inline-flex justify-center lg:flex-1 max-lg:order-last max-lg:py-4"
        >
          <input
            className="h-14 max-sm:h-10 w-4/5 max-lg:w-full px-4 outline-none text-sm rounded-l-xl focus:outline-none"
            type="text"
            placeholder="Digite sua busca..."
            {...register('q')}
          />
          <button className="group w-14 flex items-center justify-center rounded-r-xl transition-colors bg-amber-300 hover:bg-yellow-400 focus:outline-none">
            <HiSearch className="text-2xl transition-colors text-zinc-600 group-hover:text-black" />
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
