import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

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
    <header className="bg-violet-400 px-8 pt-2 max-sm:px-4">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto sm:gap-4 max-md:flex-wrap">
        <SidebarMenu />

        <Link href="/" title="Bench Shop" className="w-48">
          <Image src={LogoImg} width={192} alt="Logo" />
        </Link>

        <form
          onSubmit={handleSubmit(handleSearch)}
          className="w-full inline-flex justify-center md:flex-1 max-md:order-last max-md:py-4"
        >
          <input
            className="h-12 w-4/5 px-2.5 rounded outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet-800 max-md:w-full"
            id="password"
            type="text"
            placeholder="Busque aqui"
            {...register('q')}
          />
        </form>

        <div className="sm:w-48 flex items-center justify-end gap-4">
          <AuthDialogsWrapper />
        </div>
      </div>

      <Menu />
    </header>
  )
}
