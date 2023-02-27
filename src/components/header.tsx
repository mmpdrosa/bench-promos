import Image from 'next/image'
import Link from 'next/link'

import LogoImg from '@/assets/logo.svg'
import { AuthDialogsWrapper } from './AuthDialogsWrapper'
import { Menu } from './Menu'
import { SidebarMenu } from './SidebarMenu'

export function Header() {
  return (
    <header className="bg-violet-400 px-8 pt-2">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto">
        <SidebarMenu />

        <Link href="/" title="Bench Shop">
          <Image src={LogoImg} height={96} alt="Logo" />
        </Link>

        <AuthDialogsWrapper />
      </div>

      <Menu />
    </header>
  )
}
