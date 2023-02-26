import Image from 'next/image'

import { Product } from '@/models'
import { priceFormatter } from '@/utils/formatter'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-fill justify-center gap-8">
      {products.map((product) => {
        return (
          <div
            className="w-74 flex flex-col rounded-lg overflow-hidden bg-white border border-zinc-300 transition ease-in-out duration-300 hover:shadow-xl"
            key={product.id}
          >
            <a
              className="w-full h-74 relative"
              target="_blank"
              href={product.html_url}
              rel="noreferrer"
            >
              <Image
                className="object-contain"
                alt=""
                src={product.image_url}
                fill
                priority
              />
            </a>
            <div className="flex flex-col gap-4 p-4">
              <a
                className="h-10"
                target="_blank"
                href={product.html_url}
                rel="noreferrer"
              >
                <h4 className="line-clamp-2 text-sm font-medium">
                  {product.title}
                </h4>
              </a>
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
            </div>
          </div>
        )
      })}
    </div>
  )
}
