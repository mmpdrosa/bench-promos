import dayjs from 'dayjs'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import {
  FaBell,
  FaChartLine,
  FaExternalLinkAlt,
  FaMinus,
  FaPlus,
  FaRegListAlt,
  FaVideo,
  FaWhmcs,
} from 'react-icons/fa'
import { TbDiscount2 } from 'react-icons/tb'
import { NumericFormat } from 'react-number-format'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductPriceChart } from '@/components/ProductPriceChart'
import { Toast } from '@/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/axios'
import { Product } from '@/models'
import { priceFormatter } from '@/utils/formatter'
import { MdSell } from 'react-icons/md'

type Sale = {
  id: string
  price: number
  image_url: string
  html_url: string
  coupon?: string
  created_at: string
}

export default function ProductPage({
  product,
  sales,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useAuth()
  const [alertPrice, setAlertPrice] = useState(product.price)
  const [periodLowestPrice, setPeriodLowestPrice] = useState(0)

  function incrementAlertPrice() {
    setAlertPrice((prev) => prev + 5000) // R$ 50
  }

  function decrementAlertPrice() {
    setAlertPrice((prev) => prev - 5000) // R$ 50
  }

  async function handleCreateAlert() {
    if (!user) return

    const token = await user.getIdToken()

    await api.post(
      `/users/notify-product/${product.id}`,
      { price: alertPrice },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  }

  function changeLowestPrice(price: number) {
    setPeriodLowestPrice(price)
  }

  return (
    <>
      <Head>
        <title>{product.title} | Bench Promos</title>
      </Head>
      <div className="mx-auto max-w-screen-xl space-y-8 py-8">
        <div className="flex flex-col gap-8 max-xl:px-4">
          <Breadcrumbs />

          <div className="grid grid-cols-2 items-stretch gap-y-6 max-sm:grid-cols-1">
            <h1 className="mb-6 text-lg font-semibold sm:hidden">
              {product.title}
            </h1>
            <div className="flex flex-col items-start max-sm:order-3">
              <h1 className="mb-6 text-xl font-semibold max-sm:hidden">
                {product.title}
              </h1>

              {product.available ? (
                <>
                  <span className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Menor preço via{' '}
                    <a
                      target="_blank"
                      href={product.retailer.html_url}
                      className="transition duration-300 ease-in-out hover:text-violet-500"
                      rel="noreferrer"
                    >
                      {product.retailer.name}
                    </a>
                  </span>

                  <strong className="text-4xl font-bold">
                    {priceFormatter.format(product.price / 100)}
                  </strong>

                  {product.coupon && (
                    <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                      Com cupom
                      <div className="flex items-center gap-2 rounded-full bg-amber-200 px-4 py-1 text-lg font-semibold uppercase tracking-wider dark:text-zinc-900">
                        <MdSell className="h-7 w-7 text-violet-500" />
                        {product.coupon?.code}
                      </div>
                    </div>
                  )}

                  {product.cashback?.value && (
                    <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                      Com cashback de
                      <div className="flex">
                        <div className="flex items-center gap-2 rounded-l-full bg-amber-200 px-4 py-1 text-lg font-semibold tracking-wider dark:text-zinc-900">
                          <TbDiscount2 className="h-8 w-8 text-violet-500" />
                          {product.cashback?.value}%
                        </div>
                        <div className="flex cursor-pointer items-center gap-2 rounded-r-full bg-violet-500 px-4 py-1 text-lg font-semibold tracking-wider text-white transition-colors hover:bg-violet-400">
                          <a
                            href={product.cashback.affiliatedLink}
                            target="_blank"
                          >
                            {product.cashback.name}
                          </a>
                          <FaExternalLinkAlt />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <strong className="text-4xl text-red-500">Indisponível</strong>
              )}

              <a
                href={product.html_url}
                target="_blank"
                className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-4 text-xl font-semibold text-white transition-colors hover:bg-violet-400 max-sm:w-full"
                rel="noreferrer"
              >
                ACESSAR <FaExternalLinkAlt />
              </a>
            </div>
            <div className="flex justify-center max-sm:order-2">
              <div className="relative h-[512px] w-full max-sm:h-80 max-sm:w-80">
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
            <ul className="flex whitespace-nowrap border-b border-zinc-300 text-sm font-medium dark:border-zinc-600">
              <li>
                <a
                  href="#price-history"
                  className="flex items-center gap-2.5 px-4 py-2 hover:underline"
                >
                  <FaChartLine className="text-amber-400" />
                  Histórico
                </a>
              </li>
              <li>
                <a
                  href="#last-sales"
                  className="flex items-center gap-2.5 px-4 py-2 hover:underline"
                >
                  <TbDiscount2 className="text-lg text-amber-400" />
                  Últimas Promoções
                </a>
              </li>
              <li>
                <a
                  href="#description"
                  className="flex items-center gap-2.5 px-4 py-2 hover:underline"
                >
                  <FaRegListAlt className="text-amber-400" />
                  Descrição
                </a>
              </li>
              <li>
                <a
                  href="#specs"
                  className="flex items-center gap-2.5 px-4 py-2 hover:underline"
                >
                  <FaWhmcs className="text-amber-400" />
                  Especificações
                </a>
              </li>
              <li>
                <a
                  href="#review"
                  className="flex items-center gap-2.5 px-4 py-2 hover:underline"
                >
                  <FaVideo className="text-amber-400" />
                  Review
                </a>
              </li>
            </ul>
          </nav>

          <div id="price-history" className="space-y-10">
            <div className="w-max">
              <h2 className="text-xl font-extrabold text-violet-600">
                HISTÓRICO
              </h2>
              <div className="h-2 w-3/4 rounded-full bg-violet-600"></div>
            </div>
            <div className="grid grid-cols-3 items-end gap-8 max-lg:grid-cols-1 max-lg:gap-x-0">
              <div className="col-span-2 max-lg:order-last">
                <ProductPriceChart
                  productId={product.id}
                  onInsertLowestPrice={changeLowestPrice}
                />
              </div>
              <div className="flex flex-col items-center gap-5 rounded-xl border border-zinc-300 p-8 dark:border-zinc-700 dark:bg-zinc-800">
                <h3 className="flex items-center justify-between gap-4 text-lg font-extrabold">
                  <FaBell className="text-amber-300" /> Crie um alerta de preço
                </h3>
                <div className="flex flex-col items-center gap-1.5 font-bold">
                  <span className="text-violet-500">
                    MENOR PREÇO NO PERÍODO
                  </span>
                  <span className="text-2xl">
                    {priceFormatter.format(periodLowestPrice / 100)}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 font-bold">
                  <span className="text-violet-500">
                    {product.available ? 'PREÇO ATUAL' : 'ÚLTIMO PREÇO'}
                  </span>
                  <span className="text-2xl">
                    {priceFormatter.format(product.price / 100)}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 font-bold">
                  <span className="text-violet-500">PREÇO DESEJADO</span>
                  <div className="flex items-center gap-4 text-lg font-medium">
                    <button
                      onClick={decrementAlertPrice}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      <FaMinus />
                    </button>
                    <NumericFormat
                      displayType="input"
                      prefix="R$ "
                      decimalScale={2}
                      decimalSeparator=","
                      thousandSeparator="."
                      fixedDecimalScale={true}
                      allowNegative={false}
                      className="inline-flex h-12 w-48 items-center rounded-2xl border border-zinc-300 px-4 text-2xl dark:border-zinc-600  dark:bg-zinc-900"
                      value={alertPrice / 100}
                      onValueChange={({ floatValue }) =>
                        setAlertPrice(floatValue ? floatValue * 100 : 0)
                      }
                    />
                    <button
                      onClick={incrementAlertPrice}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <Toast
                  title="ALERTA CRIADO"
                  description={`Você receberá uma notificação quando o preço chegar em ${priceFormatter.format(
                    alertPrice / 100,
                  )}.`}
                  triggerButton={
                    <button
                      className="rounded-full bg-amber-300 px-5 py-3.5 text-lg font-semibold transition-colors hover:bg-yellow-400 dark:bg-violet-500 dark:text-zinc-200 dark:hover:bg-violet-400"
                      disabled={!user}
                    >
                      <span>CRIAR ALERTA</span>
                    </button>
                  }
                  beforeOpen={handleCreateAlert}
                />
              </div>
            </div>
          </div>

          {sales.length > 0 && (
            <div id="last-sales" className="space-y-10">
              <div className="w-max">
                <h2 className="text-xl font-extrabold text-violet-600">
                  ÚLTIMAS PROMOÇÕES
                </h2>
                <div className="h-2 w-3/4 rounded-full bg-violet-600"></div>
              </div>
              <div className="max-h-[724px] overflow-y-auto rounded-xl border border-zinc-300 scrollbar scrollbar-thumb-zinc-300 scrollbar-thumb-rounded-full scrollbar-w-2 dark:border-zinc-700 dark:scrollbar-thumb-zinc-700">
                <ul>
                  {sales.map((sale) => (
                    <li
                      key={sale.id}
                      className="border-b border-zinc-300 last:border-0 dark:border-zinc-700"
                    >
                      <div className="p-6 max-sm:p-4">
                        <div className="mb-2 text-end">
                          <span className="text-sm">
                            {dayjs(sale.created_at).fromNow()}
                          </span>
                        </div>
                        <div className="mr-auto flex justify-center gap-8 max-sm:flex-wrap">
                          <div className="relative aspect-square h-40">
                            <Image
                              className="rounded-lg object-contain"
                              alt=""
                              src={sale.image_url}
                              fill
                              sizes="33vw"
                              priority
                            />
                          </div>
                          <div className="flex w-full justify-between gap-x-8 gap-y-4 max-md:flex-col">
                            <div className="flex w-full flex-wrap items-center gap-x-8">
                              <div>
                                <span className="block text-sm">Preço</span>
                                <strong className="text-2xl font-bold">
                                  {priceFormatter.format(sale.price / 100)}
                                </strong>
                              </div>

                              {sale.coupon && (
                                <div className="text-sm text-zinc-700 dark:text-zinc-900">
                                  <span className="dark:text-zinc-300">
                                    Com cupom
                                  </span>
                                  <div className="flex h-8 items-center gap-1 rounded-full border border-dashed border-black bg-amber-200 px-2.5 py-1">
                                    <TbDiscount2 className="text-2xl text-violet-500" />
                                    <span className="mr-auto font-semibold tracking-wider">
                                      {sale.coupon}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center">
                              <a
                                href={sale.html_url}
                                target="_blank"
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-4 font-semibold text-white transition-colors hover:bg-violet-400"
                                rel="noreferrer"
                              >
                                ACESSAR <FaExternalLinkAlt />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {product.description && (
            <div id="description" className="space-y-10">
              <div className="w-max">
                <h2 className="text-xl font-extrabold text-violet-600">
                  DESCRIÇÃO
                </h2>
                <div className="h-2 w-3/4 rounded-full bg-violet-600"></div>
              </div>
              <div className="overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700">
                <p className="px-8 py-10 text-lg font-semibold">
                  {product.description}
                </p>
              </div>
            </div>
          )}

          {product.specs && (
            <div id="specs" className="space-y-10">
              <div className="w-max">
                <h2 className="text-xl font-extrabold text-violet-600">
                  ESPECIFICAÇÕES
                </h2>
                <div className="h-2 w-3/4 rounded-full bg-violet-600"></div>
              </div>
              <div className="overflow-hidden rounded-xl border  border-zinc-300 dark:border-zinc-700">
                <table className="w-full border-collapse break-all">
                  <tbody>
                    {product.specs.map((spec, index) => (
                      <tr
                        key={index}
                        className="border-b border-zinc-300 last:border-0 even:bg-amber-200  dark:border-zinc-700  dark:even:bg-violet-500"
                      >
                        <th className="table-cell w-1/2 border-r border-zinc-300 px-4 py-4 text-left text-lg font-bold dark:border-zinc-700">
                          {spec.title}
                        </th>
                        <td className="table-cell w-1/2 px-4 py-2 text-lg font-bold">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {product.review_url && (
            <div id="review" className="space-y-10">
              <div className="w-max">
                <h2 className="text-xl font-extrabold text-violet-600">
                  REVIEW
                </h2>
                <div className="h-2 w-3/4 rounded-full bg-violet-600"></div>
              </div>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={product.review_url}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  {
    product: Product
    sales: Sale[]
  },
  { id: string }
> = async ({ params }) => {
  try {
    const [productResponse, salesResponse] = await Promise.all([
      api.get(`/products/${params!.id}/with-min-price`),
      api.get(`/products/${params!.id}/sales`),
    ])

    const product: Product = productResponse.data
    const sales: Sale[] = salesResponse.data

    return {
      props: {
        product,
        sales,
      },
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
