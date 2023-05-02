import Link from 'next/link'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="max-w-screen-xl space-y-12 py-8 max-xl:px-4 mx-auto">
      <div className="flex items-center justify-center gap-12 font-medium">
        <Link
          href={'/admin/products'}
          className="px-4 w-40 flex items-center justify-center py-2.5 text-xl rounded-full border border-gray-300 text-zinc-800 transition-colors bg-white hover:bg-violet-500 hover:text-white"
        >
          Produtos
        </Link>
        <Link
          href={'/admin/sales'}
          className="px-4 w-40 py-2.5 flex items-center justify-center text-xl rounded-full border border-gray-300 text-zinc-800 transition-colors bg-white hover:bg-violet-500 hover:text-white"
        >
          Promoções
        </Link>
        <Link
          href={'/admin/coupons'}
          className="px-4 w-40 py-2.5 flex items-center justify-center text-xl rounded-full border border-gray-300 text-zinc-800 transition-colors bg-white hover:bg-violet-500 hover:text-white"
        >
          Cupons
        </Link>
      </div>
      {children}
    </div>
  )
}
