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
  label?: string
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
  label,
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
      className="inline-flex w-[408px] max-w-[408px] flex-col overflow-hidden rounded-lg border border-zinc-300 transition duration-300 ease-in-out hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-800 dark:transition-none dark:hover:bg-zinc-700"
    >
      <div className="relative flex items-center justify-between px-4 py-2 text-sm dark:text-zinc-300">
        <span className="text-sm tracking-wider">{category}</span>
        {label && (
          <span className="border-0.5 absolute right-1/2 translate-x-1/2 rounded bg-amber-200 px-2 py-0.5 text-xs font-semibold text-zinc-900 max-sm:px-0.5">
            {label}
          </span>
        )}
        <span className="text-xs max-sm:text-[11px]">
          {dayjs(created_at).fromNow()}
        </span>
      </div>

      <div className="inline-flex w-full flex-1 flex-col p-4">
        <div className="mb-2.5 sm:h-[72px]">
          <Link href={product_id ? `/produto/${product_id}` : '/'}>
            <h4 className="line-clamp-3 font-medium">{title}</h4>
          </Link>
        </div>

        <Link
          href={product_id ? `/produto/${product_id}` : '/'}
          className="relative mx-auto aspect-square w-8/12"
        >
          <Image
            className="rounded-lg object-contain"
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
              <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
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
              <div className="flex h-8 items-center gap-1 rounded-full border border-dashed border-black bg-amber-200 px-4 py-1 dark:border-zinc-500 dark:text-zinc-900">
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
            className="mb-auto mt-6 flex w-full cursor-pointer select-none items-center justify-center gap-2 rounded-full bg-violet-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-violet-400"
            rel="noreferrer"
          >
            ACESSAR <FaExternalLinkAlt />
          </a>

          {comments && (
            <div
              onClick={() => setOpenComments((prev) => !prev)}
              className="group mt-4 flex cursor-pointer items-center gap-4"
            >
              <FaInfoCircle
                className={`rounded-ful not-sr-only text-2xl transition-colors group-hover:text-violet-500 ${
                  openComments && 'text-violet-500'
                }`}
              />
              <span
                className={`select-none whitespace-pre-line text-xs font-bold text-black/75 dark:text-zinc-300 ${
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
