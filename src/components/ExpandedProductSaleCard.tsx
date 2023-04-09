import dayjs from 'dayjs'
import Image from 'next/image'
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa'
import { RxCopy } from 'react-icons/rx'
import { TbDiscount2 } from 'react-icons/tb'

import { Sale } from '@/models'
import { priceFormatter } from '@/utils/formatter'
import { SaleReactions } from './SaleReactions'
import { Toast } from './Toast'

export function ExpandedProductSaleCard(sale: Sale) {
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="px-12 max-md:px-3.5 py-8 space-y-8 rounded-xl border border-zinc-300 shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <span className="text-sm tracking-wider">{sale.category.name}</span>
        <span className="text-xs">{dayjs(sale.created_at).fromNow()}</span>
      </div>

      <h2 className="text-xl max-sm:text-lg font-medium break-words">
        {sale.title}
      </h2>

      <div className="flex gap-8 max-md:flex-col-reverse">
        <div className="md:w-3/5 flex flex-col items-start">
          {sale.specs && <p className="mb-6 break-words">{sale.specs}</p>}

          <h3 className="text-4xl font-bold">
            {priceFormatter.format(sale.price / 100)}
          </h3>

          {sale.coupon && (
            <div className="mt-2 text-sm text-zinc-700">
              <span>Com cupom</span>
              <div className="flex items-center gap-2 px-4 py-1 rounded-full text-lg font-semibold tracking-wider border border-dashed border-black bg-amber-200">
                <TbDiscount2 className="w-8 h-8 text-violet-500" />
                <span>{sale.coupon}</span>
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
          )}

          <a
            href={sale.html_url}
            target="_blank"
            className="max-sm:w-full flex items-center justify-center gap-2 mt-6 mb-auto px-6 py-4 rounded-full text-xl font-semibold transition-colors text-white bg-violet-500 hover:bg-violet-400 cursor-pointer"
            rel="noreferrer"
          >
            ACESSAR <FaExternalLinkAlt />
          </a>

          {sale.comments && (
            <div className="flex items-center mt-8 gap-4">
              <FaInfoCircle className="not-sr-only text-2xl text-violet-500" />
              <span className="text-xs font-bold break-words whitespace-pre-line text-black/75">
                {sale.comments}
              </span>
            </div>
          )}
          <div className="mt-6">
            <SaleReactions saleId={sale.id} reactions={sale.reactions} />
          </div>
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
