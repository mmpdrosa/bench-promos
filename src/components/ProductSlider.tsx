import { useState } from 'react'
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx'

import { Product } from '@/models'
import { ProductCard } from './ProductCard'

interface ProductSliderProps {
  title: string
  products: Product[]
}

export function ProductSlider({ title, products }: ProductSliderProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastProduct = currentPage * 4
  const indexOfFirstProduct = indexOfLastProduct - 4

  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  )

  // Function to handle changing the current page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)

    document.getElementById(title)?.scrollTo(0, 0)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-max">
          <h2 className="text-xl font-extrabold uppercase text-violet-600">
            {title}
          </h2>
          <div className="h-2 w-3/4 rounded-full bg-violet-600" />
        </div>
        <div className="flex gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="borde group flex aspect-square h-8 w-8 items-center justify-center rounded-full border-zinc-300 bg-white transition-colors disabled:border-zinc-300/40 disabled:bg-white/60 hover:bg-zinc-50 dark:border dark:border-zinc-600 dark:bg-zinc-700 dark:disabled:border dark:disabled:border-zinc-700 dark:disabled:bg-zinc-900 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
          >
            <RxCaretLeft className="text-2xl group-disabled:text-black/20 dark:group-disabled:text-zinc-300" />
          </button>

          <button
            disabled={indexOfLastProduct >= products.length}
            onClick={() => handlePageChange(currentPage + 1)}
            className="group flex aspect-square h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white transition-colors disabled:border-zinc-300/40 disabled:bg-white/60 hover:bg-zinc-50 dark:border dark:border-zinc-600 dark:bg-zinc-700 dark:disabled:border dark:disabled:border-zinc-700 dark:disabled:bg-zinc-900 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
          >
            <RxCaretRight className="text-2xl group-disabled:text-black/20 dark:group-disabled:text-zinc-300" />
          </button>
        </div>
      </div>

      <div id={title} className="flex gap-8 max-xl:overflow-x-auto">
        {currentProducts.map((product) => {
          return <ProductCard key={product.id} {...product} />
        })}
      </div>
    </div>
  )
}
