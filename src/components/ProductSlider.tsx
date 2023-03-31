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
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-max">
          <h2 className="text-2xl uppercase font-extrabold text-violet-600">
            {title}
          </h2>
          <div className="w-3/4 h-2 rounded-full bg-violet-600" />
        </div>
        <div className="flex gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="group w-8 h-8 aspect-square flex justify-center items-center border border-zinc-300 disabled:border-zinc-300/40 rounded-full transition-colors bg-white hover:bg-zinc-50 disabled:bg-white/60"
          >
            <RxCaretLeft className="group-disabled:text-black/20 text-2xl" />
          </button>

          <button
            disabled={indexOfLastProduct >= products.length}
            onClick={() => handlePageChange(currentPage + 1)}
            className="group w-8 h-8 aspect-square flex justify-center items-center border border-zinc-300 disabled:border-zinc-300/40 rounded-full transition-colors bg-white hover:bg-zinc-50 disabled:bg-white/60"
          >
            <RxCaretRight className="group-disabled:text-black/20 text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {currentProducts.map((product) => {
          return <ProductCard key={product.id} {...product} />
        })}
      </div>
    </div>
  )
}
