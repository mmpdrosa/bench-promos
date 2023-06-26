import { ChangeEvent, useEffect, useState } from 'react'
import { RxChevronLeft, RxChevronRight, RxDotsHorizontal } from 'react-icons/rx'
import ReactPaginate from 'react-paginate'

import { Product } from '@/models'
import { ProductCard } from './ProductCard'
import Link from 'next/link'

interface Subcategory {
  id: string
  name: string
}

interface ProductListProps {
  products: Product[]
  subcategories?: Subcategory[]
  categoryId?: string
}

const ITEMS_PER_PAGE = 12

export function ProductList({
  products,
  subcategories,
  categoryId,
}: ProductListProps) {
  const [sortOrder, setSortOrder] = useState('default')
  const [productOffset, setProductOffset] = useState(0)

  useEffect(() => {
    setSortOrder('default')
    setProductOffset(0)
  }, [products])

  const currentPage = products.length > 0 ? productOffset / ITEMS_PER_PAGE : -1

  const endOffset = productOffset + ITEMS_PER_PAGE
  const currentProducts = products.slice(productOffset, endOffset)
  const pageCount = Math.ceil(products.length / ITEMS_PER_PAGE)

  function handleSortOrderChange(event: ChangeEvent<HTMLSelectElement>) {
    const newSortOrder = event.target.value
    setSortOrder(newSortOrder)

    if (newSortOrder === 'low-to-high') {
      products.sort((a, b) => a.price - b.price)
    } else if (newSortOrder === 'high-to-low') {
      products.sort((a, b) => b.price - a.price)
    }
  }

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * ITEMS_PER_PAGE) % products.length
    setProductOffset(newOffset)

    document.getElementById('products')?.scrollIntoView()
  }

  return (
    <>
      {subcategories && subcategories.length > 0 && (
        <div className="max-sm:flex max-sm:overflow-x-auto sm:space-y-2">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              className="mr-2 h-8 rounded-full border border-zinc-300 transition-colors  hover:bg-violet-500 hover:text-white dark:border-zinc-700 max-sm:min-w-fit"
            >
              <Link
                className="px-4 py-1 text-sm font-medium"
                href={`${categoryId}/${subcategory.id}`}
              >
                <span className="mx-1">{subcategory.name}</span>
              </Link>
            </button>
          ))}
        </div>
      )}

      <div id="products" className="flex items-center justify-between">
        <span className="text-xs">{products.length} resultados</span>

        <select
          className="block w-max cursor-pointer rounded border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="default">Padrão</option>
          <option value="low-to-high">Menor preço</option>
          <option value="high-to-low">Maior preço</option>
        </select>
      </div>

      <div className="grid grid-cols-fill justify-center gap-8">
        {currentProducts.map((product) => {
          return <ProductCard key={product.id} {...product} />
        })}
      </div>
      <div className="flex justify-center">
        <ReactPaginate
          forcePage={currentPage}
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          breakClassName="flex justify-center items-center px-3 py-2"
          onPageChange={handlePageClick}
          breakLabel={<RxDotsHorizontal />}
          previousLabel={<RxChevronLeft />}
          nextLabel={<RxChevronRight />}
          containerClassName="flex bg-white border rounded-lg shadow-sm mt-6 dark:bg-zinc-800 dark:border-zinc-700"
          pageClassName="px-3 py-2 rounded-md text-xl font-medium text-zinc-500 dark:text-zinc-300 transition-colors hover:text-violet-500"
          activeLinkClassName="font-bold text-violet-700 dark:text-violet-500"
          previousClassName="flex justify-center items-center px-3 py-2 rounded-md text-xl font-medium text-zinc-500 transition-colors hover:text-violet-500 dark:text-zinc-300 dark:hover:text-violet-500"
          nextClassName="flex justify-center items-center px-3 py-2 rounded-md text-xl font-medium text-zinc-500 transition-colors hover:text-violet-500 dark:text-zinc-300 dark:hover:text-violet-500"
        />
      </div>
    </>
  )
}
