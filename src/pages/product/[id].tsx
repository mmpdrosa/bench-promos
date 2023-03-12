import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import {
  FaBell,
  FaChartLine,
  FaExternalLinkAlt,
  FaMinus,
  FaPlus,
  FaRegListAlt,
  FaVideo,
} from 'react-icons/fa'
import { TbDiscount2 } from 'react-icons/tb'

import { api } from '@/lib/axios'
import { Product } from '@/models'
import { priceFormatter } from '@/utils/formatter'
import { PriceChart } from '@/components/PriceChart'

export default function ProductPage({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="max-w-screen-xl py-8 mx-auto">
      <div className="flex flex-col gap-10 px-6 max-sm:px-2.5 py-8 rounded-xl shadow-md bg-white">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 items-stretch">
          <h1 className="sm:hidden text-xl">{product.title}</h1>
          <div className="flex flex-col items-start gap-6 max-sm:order-3">
            <h1 className="text-3xl max-sm:hidden">{product.title}</h1>

            <span className="text-lg font-medium text-zinc-500">
              Menor preço via{' '}
              <a
                target="_blank"
                href={product.retailer.html_url}
                className="hover:text-violet-500 transition ease-in-out duration-300"
                rel="noreferrer"
              >
                {product.retailer.name}
              </a>
            </span>

            <strong className="text-4xl font-bold">
              {priceFormatter.format(product.price / 100)}
            </strong>

            {product.coupon && (
              <div className="text-lg text-zinc-700">
                Com cupom
                <div className="flex items-center gap-2 px-4 py-1 rounded-full text-2xl font-semibold bg-amber-200">
                  <TbDiscount2 className="w-8 h-8 text-violet-500" />
                  {product.coupon?.code}
                </div>
              </div>
            )}

            <a
              href={product.html_url}
              target="_blank"
              className="flex items-center gap-2 px-6 py-4 rounded-full text-xl font-semibold text-white bg-violet-400 cursor-pointer"
              rel="noreferrer"
            >
              <FaExternalLinkAlt /> ACESSAR
            </a>
          </div>
          <div className="flex justify-center max-sm:order-2">
            <div className="relative w-full max-sm:w-80 h-[512px] max-sm:h-80">
              <Image
                className="object-contain"
                alt=""
                src={product.image_url}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
        <nav className="overflow-x-auto">
          <ul className="flex gap-12 py-2 border-b border-zinc-300">
            <li>
              <a
                href="#historic"
                className="flex items-center gap-2.5 text-lg font-medium"
              >
                <FaChartLine className="text-amber-400" />
                Histórico
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 text-lg font-medium"
              >
                <FaRegListAlt className="text-amber-400" />
                Especificações
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 text-lg font-medium"
              >
                <FaVideo className="text-amber-400" />
                Review
              </a>
            </li>
          </ul>
        </nav>

        <div id="historic" className="space-y-10">
          <div className="w-max">
            <h2 className="text-2xl font-extrabold text-violet-600">
              HISTÓRICO
            </h2>
            <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
          </div>
          <div className="grid grid-cols-3 max-lg:grid-cols-1 items-end gap-8 max-lg:gap-x-0">
            <div className="col-span-2 max-lg:order-last">
              <PriceChart />
            </div>
            <div className="flex flex-col items-center gap-5 p-8 border border-zinc-300 rounded-xl shadow-md">
              <h3 className="flex justify-between items-center gap-4 text-xl font-extrabold">
                <FaBell /> Crie um alerta de preço
              </h3>
              <div className="flex flex-col items-center gap-1.5 text-lg font-bold">
                <span className="text-violet-500">MENOR PREÇO NO PERÍODO</span>
                <span className="text-2xl">
                  {priceFormatter.format(982156 / 100)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-lg font-bold">
                <span className="text-violet-500">PREÇO ATUAL</span>
                <span className="text-2xl">
                  {priceFormatter.format(982156 / 100)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-lg font-bold">
                <span className="text-violet-500">PREÇO DESEJADO</span>
                <div className="flex items-center gap-4 text-lg font-medium">
                  <button className="w-12 h-12 flex justify-center items-center border rounded-full border-zinc-300">
                    <FaMinus />
                  </button>
                  <span className="h-12 inline-flex items-center px-4 border rounded-2xl text-2xl border-zinc-300">
                    {priceFormatter.format(982156 / 100)}
                  </span>
                  <button className="w-12 h-12 flex justify-center items-center border rounded-full border-zinc-300">
                    <FaPlus />
                  </button>{' '}
                </div>
              </div>
              <button className="px-5 py-3.5 rounded-full text-lg font-semibold bg-amber-200">
                CRIAR ALERTA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    product: Product
  },
  { id: string }
> = async ({ params }) => {
  const response = await api.get(`/products/${params!.id}/with-min-price/`)

  const product: Product = response.data

  return {
    props: {
      product,
    },
  }
}
