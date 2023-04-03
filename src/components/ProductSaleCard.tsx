import dayjs from 'dayjs'
import Image from 'next/image'
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa'
import { TbDiscount2 } from 'react-icons/tb'

import { Sale } from '@/models'
import { priceFormatter } from '@/utils/formatter'

export function ProductSaleCard(sale: Omit<Sale, 'id'>) {
  return (
    <div className="px-12 max-md:px-3.5 py-8 space-y-8 rounded-xl shadow bg-white">
      <div className="flex justify-between items-center">
        <span className="text-lg tracking-wider">{sale.category.name}</span>
        <span>{dayjs(sale.created_at).fromNow()}</span>
      </div>

      <h2 className="text-3xl font-medium break-words">{sale.title}</h2>

      <div className="flex gap-8 max-md:flex-col-reverse">
        <div className="md:w-3/5 flex flex-col items-start gap-8">
          {sale.specs && <p className="text-lg break-words">{sale.specs}</p>}

          <h3 className="text-4xl font-bold">
            {priceFormatter.format(sale.price / 100)}
          </h3>

          {sale.coupon && (
            <div className="text-lg text-zinc-700">
              <span>Com cupom</span>
              <div className="flex items-center gap-2 px-4 py-1 rounded-full text-2xl font-semibold bg-amber-200">
                <TbDiscount2 className="w-8 h-8 text-violet-500" />
                <span>{sale.coupon}</span>
              </div>
            </div>
          )}
          <a
            href={sale.html_url}
            target="_blank"
            className="flex items-center gap-2 px-6 py-4 rounded-full text-xl font-semibold transition-colors text-white bg-violet-500 hover:bg-violet-400 cursor-pointer"
            rel="noreferrer"
          >
            <FaExternalLinkAlt /> ACESSAR
          </a>

          {sale.comments && (
            <div className="flex items-center mt-auto gap-4">
              <FaInfoCircle className="not-sr-only text-2xl text-violet-500" />
              <span className="text-sm font-bold break-words whitespace-pre-line text-black/75">
                {sale.comments}
              </span>
            </div>
          )}
        </div>
        <div className="relative md:w-2/5 aspect-square">
          {sale.image_url && (
            <Image
              className="object-contain"
              alt=""
              src={sale.image_url}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      </div>
    </div>
  )
}
