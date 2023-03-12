import { ReactNode } from 'react'
import { Footer } from './footer'

import { Header } from './header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="w-full h-2 bg-gradient-to-r from-violet-500 via-amber-200 to-violet-500"></div>

      <main className="flex-1 px-8 max-sm:px-4">{children}</main>

      <Footer />
    </>
  )
}
