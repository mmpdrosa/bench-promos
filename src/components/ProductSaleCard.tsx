import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { RxCopy } from 'react-icons/rx'

import { priceFormatter } from '@/utils/formatter'
import { useState } from 'react'
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa'
import { SaleReactions } from './SaleReactions'
import { Toast } from './Toast'
import { MdSell } from 'react-icons/md'

interface ProductSaleCardProps {
  id: string
  title: string
  image_url: string
  html_url: string
  price: number
  specs?: string
  created_at: Date
  comments?: string
  category: string
  coupon?: string
  reactions?: { [key: string]: number }
  product_id?: string
}

export function ProductSaleCard({
  category,
  created_at,
  html_url,
  id,
  image_url,
  price,
  title,
  comments = '',
  coupon = '',
  product_id = '',
  reactions = {},
  specs = '',
}: ProductSaleCardProps) {
  const [openComments, setOpenComments] = useState(false)

  /*  const handleShare = async () => {
    await navigator.share({
      title,
      url: window.location.href,
    })
  } */

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div
      id={id}
      className="w-[408px] max-w-[408px] inline-flex flex-col rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition dark:transition-none ease-in-out duration-300 hover:shadow-xl"
    >
      <div className="flex justify-between items-center py-2 px-4 text-sm dark:text-zinc-300">
        <span className="text-sm tracking-wider">{category}</span>
        <span className="text-xs">{dayjs(created_at).fromNow()}</span>
      </div>

      <div className="flex-1 w-full inline-flex flex-col p-4">
        <div className="sm:h-[72px] mb-2.5">
          <Link href={product_id ? `/produto/${product_id}` : '/'}>
            <h4 className="font-medium line-clamp-3">{title}</h4>
          </Link>
        </div>

        <Link
          href={product_id ? `/produto/${product_id}` : '/'}
          className="relative w-8/12 mx-auto aspect-square"
        >
          <Image
            className="object-contain rounded-lg"
            alt=""
            src={image_url}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </Link>

        <div className="mt-4">
          {specs && (
            <div className="mb-2.5">
              <p className="text-sm line-clamp-3 text-zinc-600 dark:text-zinc-300">
                {specs}
              </p>
            </div>
          )}

          <div>
            <strong className="text-xl">
              {priceFormatter.format(price / 100)}
            </strong>
          </div>

          {coupon && (
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
              <span>Com cupom</span>
              <div className="h-8 flex items-center gap-1 py-1 px-4 border border-dashed dark:border-zinc-500 border-black rounded-full bg-amber-200 dark:text-zinc-900">
                <MdSell className="text-2xl text-violet-400" />
                <span className="mr-auto font-semibold tracking-wider max-md:text-xs">
                  {coupon}
                </span>
                <Toast
                  title="CÓDIGO COPIADO"
                  triggerButton={
                    <button>
                      <span onClick={() => copyToClipboard(coupon!)}>
                        <RxCopy className="text-lg" />
                      </span>
                    </button>
                  }
                />
              </div>
            </div>
          )}

          <a
            href={html_url}
            target="_blank"
            className="w-full flex items-center justify-center gap-2 mt-6 mb-auto px-4 py-2.5 rounded-full font-semibold transition-colors text-white bg-violet-500 hover:bg-violet-400 cursor-pointer select-none"
            rel="noreferrer"
          >
            ACESSAR <FaExternalLinkAlt />
          </a>

          {comments && (
            <div
              onClick={() => setOpenComments((prev) => !prev)}
              className="group flex items-center mt-4 gap-4 cursor-pointer"
            >
              <FaInfoCircle
                className={`group-hover:text-violet-500 rounded-ful not-sr-only text-2xl transition-colors ${
                  openComments && 'text-violet-500'
                }`}
              />
              <span
                className={`text-xs font-bold whitespace-pre-line text-black/75 select-none dark:text-zinc-300 ${
                  !openComments && 'line-clamp-1'
                }`}
              >
                {comments}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="py-2">
        <SaleReactions saleId={id} reactions={reactions} />
      </div>
    </div>
  )
}
