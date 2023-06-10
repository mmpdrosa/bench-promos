import Link from 'next/link'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="flex sm:min-h-[calc(100vh-172px)] max-w-7xl mx-auto dark:bg-zinc-900  dark:text-zinc-200 gap-8 max-lg:pl-4 max-sm:px-4">
      <aside className="w-44 max-lg:hidden flex flex-col space-y-4 border-r dark:border-zinc-800 font-semibold">
        <Link
          href="/admin/sales"
          className=" hover:bg-violet-500 hover:text-white p-6 rounded-lg hover:text"
        >
          Promoções
        </Link>
        <Link
          href="/admin/products"
          className="hover:bg-violet-500 p-6 rounded-lg hover:text hover:text-white"
        >
          Produtos
        </Link>
        <Link
          href="/admin/product-retailers"
          className=" hover:bg-violet-500 p-6 rounded-lg hover:text hover:text-white"
        >
          Anúncios
        </Link>
        <Link
          href="/admin/coupons"
          className="hover:bg-violet-500 p-6 rounded-lg hover:text hover:text-white"
        >
          Cupons
        </Link>
        <Link
          href="/admin/retailers"
          className=" hover:bg-violet-500 p-6 rounded-lg hover:text hover:text-white"
        >
          Anunciantes
        </Link>
        <Link
          href="/admin/categories"
          className="hover:bg-violet-500 p-6 rounded-lg hover:text hover:text-white"
        >
          Categorias
        </Link>
        <Link
          href="/admin/subcategories"
          className=" hover:bg-violet-500 p-6 rounded-lg hover:text hover:text-white"
        >
          Subcategorias
        </Link>
      </aside>
      {children}
    </div>
  )
}
