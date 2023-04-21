import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { BsBoxArrowInUpRight } from 'react-icons/bs'
import { RxCopy, RxShare1 } from 'react-icons/rx'
import { TbDiscount2 } from 'react-icons/tb'

import { priceFormatter } from '@/utils/formatter'
import { SaleReactions } from './SaleReactions'
import { Toast } from './Toast'

interface CompactProductSaleCardProps {
  id: string
  title: string
  image_url: string
  html_url: string
  price: number
  specs?: string
  created_at: Date
  coupon?: string
  reactions?: { [key: string]: number }
  product_id?: string
}

export function CompactProductSaleCard(sale: CompactProductSaleCardProps) {
  const handleShare = async () => {
    await navigator.share({
      title: sale.title,
      url: window.location.href,
    })
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col w-74 max-w-[296px] rounded-lg overflow-hidden border border-zinc-300 transition ease-in-out duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center py-2 px-4 text-sm">
        <span>{dayjs(sale.created_at).fromNow()}</span>
        <button onClick={handleShare}>
          <RxShare1 />
        </button>
      </div>

      <Link
        href={sale.product_id ? `/produto/${sale.product_id}` : '/'}
        className="relative w-full aspect-square"
      >
        <Image
          className="object-contain"
          alt=""
          src={sale.image_url}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </Link>

      <div className="pt-2 pb-6 px-4 mb-auto">
        <Link href={sale.product_id ? `/produto/${sale.product_id}` : '/'}>
          <h4 className="font-medium line-clamp-2">{sale.title}</h4>
        </Link>

        {sale.specs && (
          <Suspense>
            <p className="mt-2.5 text-sm line-clamp-3 text-zinc-600">
              {sale.specs}
            </p>
          </Suspense>
        )}

        <div className="mt-4">
          <strong className="text-xl">
            {priceFormatter.format(sale.price / 100)}
          </strong>
        </div>

        {sale.coupon && (
          <Suspense>
            <div className="mt-2 text-sm text-zinc-700">
              <span>Com cupom</span>
              <div className="h-8 flex items-center gap-1 py-1 px-4 border border-dashed border-black rounded-full bg-amber-200">
                <TbDiscount2 className="text-2xl text-violet-500" />
                <span className="mr-auto font-semibold tracking-wider">
                  {sale.coupon}
                </span>
                <Toast
                  title="CÓDIGO COPIADO"
                  triggerButton={
                    <button onClick={() => copyToClipboard(sale.coupon!)}>
                      <RxCopy className="text-lg" />
                    </button>
                  }
                />
              </div>
            </div>
          </Suspense>
        )}
      </div>

      <SaleReactions saleId={sale.id} reactions={sale.reactions} />

      <div className="mt-4">
        <Link
          href={`/promocoes#${sale.id}`}
          className="flex justify-between items-center px-4 py-2 text-sm font-medium cursor-pointer bg-zinc-100 hover:bg-zinc-200 transition ease-in-out duration-300"
        >
          Ver detalhes
          <BsBoxArrowInUpRight />
        </Link>
      </div>
    </div>
  )
}
