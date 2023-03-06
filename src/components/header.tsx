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
      <div className="max-w-screen-xl flex items-center justify-between mx-auto sm:gap-4 max-md:flex-wrap">
        <SidebarMenu />

        <Link href="/" title="Bench Shop" className="w-56">
          <Image src={LogoImg} width={224} alt="Logo" />
        </Link>

        <form
          onSubmit={handleSubmit(handleSearch)}
          className="w-full inline-flex justify-center md:flex-1 max-md:order-last max-md:py-4"
        >
          <input
            className="h-16 w-4/5 px-4 outline-none text-xl rounded-l-2xl focus:shadow-[0_0_0_2px] focus:shadow-violet-800 max-md:w-full"
            type="text"
            placeholder="Busque aqui"
            {...register('q')}
          />
          <button className="p-4 rounded-r-2xl bg-amber-300">
            <HiSearch className="text-3xl" />
          </button>
        </form>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/"
            title="Alertas"
            className="group flex items-center gap-2 text-lg text-white"
          >
            <FaBell className="text-amber-300" />
            <span className="group-hover:underline">Alertas</span>
          </Link>

          <AuthDialogsWrapper />
        </div>
      </div>

      <Menu />
    </header>
  )
}
