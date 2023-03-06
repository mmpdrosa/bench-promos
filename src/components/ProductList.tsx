import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'
import { BsBoxArrowUpRight } from 'react-icons/bs'
import { RxChevronLeft, RxChevronRight } from 'react-icons/rx'
import ReactPaginate from 'react-paginate'

import { Product } from '@/models'

import { priceFormatter } from '@/utils/formatter'

interface ProductListProps {
  products: Product[]
}

const ITEMS_PER_PAGE = 8

export function ProductList({ products }: ProductListProps) {
  const [sortOrder, setSortOrder] = useState('default')
  const [productOffset, setProductOffset] = useState(0)

  useEffect(() => {
    setSortOrder('default')
    setProductOffset(0)
  }, [products])

  const currentPage = productOffset / ITEMS_PER_PAGE

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

    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <span className="text-xs">{products.length} resultados</span>

        <select
          className="block w-max p-2.5 rounded text-sm bg-gray-50 border border-gray-300  focus:ring-violet-500 focus:border-violet-500"
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
          return (
            <div
              className="w-74 min-h-[544px] flex flex-col rounded-lg overflow-hidden bg-white border border-zinc-300 transition ease-in-out duration-300 hover:shadow-xl"
              key={product.id}
            >
              <Link
                className="w-full h-74 relative"
                href={`/product/${product.id}`}
                rel="noreferrer"
              >
                <Image
                  className="object-contain"
                  alt=""
                  src={product.image_url}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </Link>
              <div className="flex flex-col gap-4 p-4">
                <Link
                  className="h-10"
                  href={`/product/${product.id}`}
                  rel="noreferrer"
                >
                  <h4 className="line-clamp-2 text-sm font-medium">
                    {product.title}
                  </h4>
                </Link>
                {product.available ? (
                  <>
                    <h5 className="text-sm font-medium text-zinc-500">
                      Menor preço via{' '}
                      <a
                        target="_blank"
                        href={product.retailer.html_url}
                        className="hover:text-violet-500 transition ease-in-out duration-300"
                        rel="noreferrer"
                      >
                        {product.retailer.name}
                      </a>
                    </h5>
                    <strong className="text-xl font-bold">
                      {priceFormatter.format(product.price / 100)}
                    </strong>

                    {product.coupon && (
                      <div className="text-sm text-zinc-700">
                        Com cupom
                        <h6 className="font-black">{product.coupon?.code}</h6>
                      </div>
                    )}
                  </>
                ) : (
                  <strong className="text-xl font-bold text-red-500">
                    Indisponível
                  </strong>
                )}
              </div>
              <a
                href={product.html_url}
                target="_blank"
                className="inline-flex justify-between items-center mt-auto px-4 py-2 text-sm font-medium cursor-pointer bg-zinc-100 hover:bg-zinc-200 transition ease-in-out duration-300"
                rel="noreferrer"
              >
                Acessar site
                <BsBoxArrowUpRight />
              </a>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center">
        <ReactPaginate
          pageCount={pageCount}
          forcePage={currentPage}
          onPageChange={handlePageClick}
          containerClassName="flex bg-white border rounded-lg shadow-sm mt-6"
          pageClassName="px-3 py-2 rounded-md text-xl font-medium text-zinc-500 hover:text-violet-500"
          activeLinkClassName="font-bold text-violet-700"
          previousClassName="px-3 py-2 rounded-md text-xl font-medium text-zinc-500 hover:text-violet-500"
          nextClassName="px-3 py-2 rounded-md text-xl font-medium text-zinc-500 hover:text-violet-500"
          previousLabel={<RxChevronLeft />}
          nextLabel={<RxChevronRight />}
        />
      </div>
    </>
  )
}
