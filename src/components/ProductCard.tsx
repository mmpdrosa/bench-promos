import Image from 'next/image'
import Link from 'next/link'
import { BsBoxArrowUpRight } from 'react-icons/bs'

import { priceFormatter } from '@/utils/formatter'

interface ProductCardProps {
  id: string
  available: boolean
  title: string
  price: number
  image_url: string
  html_url: string
  retailer: {
    name: string
    html_url: string
  }
  coupon?: {
    code: string
  }
}

export function ProductCard(product: ProductCardProps) {
  return (
    <div className="flex min-h-[544px] w-74 min-w-[296px] flex-col overflow-hidden rounded-lg border border-zinc-300 bg-white transition duration-300 ease-in-out hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
      <Link
        className="relative h-74 w-full"
        href={`/produto/${product.id}`}
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
        <Link className="h-10" href={`/produto/${product.id}`} rel="noreferrer">
          <h4 className="line-clamp-2 text-sm font-medium">{product.title}</h4>
        </Link>
        {product.available ? (
          <>
            <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Menor preço via{' '}
              <a
                target="_blank"
                href={product.retailer.html_url}
                className="transition duration-300 ease-in-out hover:text-violet-500"
                rel="noreferrer"
              >
                {product.retailer.name}
              </a>
            </h4>
            <strong className="text-xl font-bold">
              {priceFormatter.format(product.price / 100)}
            </strong>

            {product.coupon && (
              <div className="text-sm text-zinc-700 dark:text-zinc-400">
                Com cupom
                <h6 className="font-black dark:text-zinc-200">
                  {product.coupon.code}
                </h6>
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
        className="mt-auto inline-flex cursor-pointer items-center justify-between bg-zinc-100 px-4 py-2 text-sm font-medium transition duration-300 ease-in-out hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-500"
        rel="noreferrer"
      >
        Acessar site
        <BsBoxArrowUpRight />
      </a>
    </div>
  )
}
