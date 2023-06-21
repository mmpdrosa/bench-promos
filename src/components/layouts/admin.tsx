import Link from 'next/link'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 dark:bg-zinc-900  dark:text-zinc-200 max-lg:pl-4 max-sm:px-4 sm:min-h-[calc(100vh-172px)]">
      <aside className="flex w-44 flex-col space-y-4 border-r font-semibold dark:border-zinc-800 max-lg:hidden">
        <Link
          href="/admin/sales"
          className=" hover:text rounded-lg p-6 hover:bg-violet-500 hover:text-white"
        >
          Promoções
        </Link>
        <Link
          href="/admin/products"
          className="hover:text rounded-lg p-6 hover:bg-violet-500 hover:text-white"
        >
          Produtos
        </Link>
        <Link
          href="/admin/product-retailers"
          className=" hover:text rounded-lg p-6 hover:bg-violet-500 hover:text-white"
        >
          Anúncios
        </Link>
        <Link
          href="/admin/coupons"
          className="hover:text rounded-lg p-6 hover:bg-violet-500 hover:text-white"
        >
          Cupons
        </Link>
        <Link
          href="/admin/retailers"
          className=" hover:text rounded-lg p-6 hover:bg-violet-500 hover:text-white"
        >
          Anunciantes
        </Link>
        <Link
          href="/admin/categories"
          className="hover:text rounded-lg p-6 hover:bg-violet-500 hover:text-white"
        >
          Categorias
        </Link>
        <Link
          href="/admin/subcategories"
          className=" hover:text rounded-lg p-6 hover:bg-violet-500 hover:text-white"
        >
          Subcategorias
        </Link>
      </aside>
      {children}
    </div>
  )
}
