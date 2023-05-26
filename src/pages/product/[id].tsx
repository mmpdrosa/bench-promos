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
      <div className="max-w-screen-xl py-8 mx-auto space-y-8">
        <div className="flex flex-col gap-8 max-xl:px-4">
          <Breadcrumbs />

          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-y-6 items-stretch">
            <h1 className="sm:hidden text-lg mb-6 font-semibold">
              {product.title}
            </h1>
            <div className="flex flex-col items-start max-sm:order-3">
              <h1 className="text-xl mb-6 font-semibold max-sm:hidden">
                {product.title}
              </h1>

              {product.available ? (
                <>
                  <span className="text-sm mb-2 font-medium text-zinc-500 dark:text-zinc-400">
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
                    <div className="text-sm mt-2 text-zinc-700 dark:text-zinc-200">
                      Com cupom
                      <div className="flex items-center gap-2 px-4 py-1 rounded-full dark:text-zinc-900 text-lg font-semibold tracking-wider bg-amber-200 uppercase">
                        <MdSell className="w-7 h-7 text-violet-500" />
                        {product.coupon?.code}
                      </div>
                    </div>
                  )}

                  {product.cashback?.value && (
                    <div className="text-sm mt-2 text-zinc-700 dark:text-zinc-200">
                      Com cashback de
                      <div className="flex">
                        <div className="flex items-center gap-2 px-4 py-1 rounded-l-full text-lg font-semibold tracking-wider dark:text-zinc-900 bg-amber-200">
                          <TbDiscount2 className="w-8 h-8 text-violet-500" />
                          {product.cashback?.value}%
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1 rounded-r-full text-lg font-semibold tracking-wider bg-violet-500 text-white hover:bg-violet-400 cursor-pointer transition-colors">
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
                className="max-sm:w-full flex items-center justify-center gap-2 mt-6 px-6 py-4 rounded-full text-xl font-semibold transition-colors text-white bg-violet-500 hover:bg-violet-400 cursor-pointer"
                rel="noreferrer"
              >
                ACESSAR <FaExternalLinkAlt />
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
            <ul className="flex whitespace-nowrap border-b text-sm font-medium border-zinc-300 dark:border-zinc-600">
              <li>
                <a
                  href="#price-history"
                  className="flex items-center py-2 px-4 gap-2.5 hover:underline"
                >
                  <FaChartLine className="text-amber-400" />
                  Histórico
                </a>
              </li>
              <li>
                <a
                  href="#last-sales"
                  className="flex items-center py-2 px-4 gap-2.5 hover:underline"
                >
                  <TbDiscount2 className="text-lg text-amber-400" />
                  Últimas Promoções
                </a>
              </li>
              <li>
                <a
                  href="#specs"
                  className="flex items-center py-2 px-4 gap-2.5 hover:underline"
                >
                  <FaRegListAlt className="text-amber-400" />
                  Especificações
                </a>
              </li>
              <li>
                <a
                  href="#review"
                  className="flex items-center py-2 px-4 gap-2.5 hover:underline"
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
              <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
            </div>
            <div className="grid grid-cols-3 max-lg:grid-cols-1 items-end gap-8 max-lg:gap-x-0">
              <div className="col-span-2 max-lg:order-last">
                <ProductPriceChart
                  productId={product.id}
                  onInsertLowestPrice={changeLowestPrice}
                />
              </div>
              <div className="flex flex-col items-center gap-5 p-8 border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-xl">
                <h3 className="flex justify-between items-center gap-4 text-lg font-extrabold">
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
                      className="w-12 h-12 flex justify-center items-center border rounded-full dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-600 border-zinc-300"
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
                      className="w-48 h-12 inline-flex items-center px-4 border rounded-2xl text-2xl border-zinc-300 dark:bg-zinc-900  dark:border-zinc-600"
                      value={alertPrice / 100}
                      onValueChange={({ floatValue }) =>
                        setAlertPrice(floatValue ? floatValue * 100 : 0)
                      }
                    />
                    <button
                      onClick={incrementAlertPrice}
                      className="w-12 h-12 flex justify-center items-center border rounded-full dark:bg-zinc-900 dark:border-zinc-600 dark:hover:bg-zinc-800 border-zinc-300"
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
                      className="px-5 py-3.5 rounded-full text-lg font-semibold transition-colors bg-amber-300 dark:bg-violet-500 dark:hover:bg-violet-400 dark:text-zinc-200 hover:bg-yellow-400"
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
                <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
              </div>
              <div className="max-h-[724px] border rounded-xl dark:border-zinc-700 dark:scrollbar-thumb-zinc-700 border-zinc-300 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-thumb-zinc-300">
                <ul>
                  {sales.map((sale) => (
                    <li
                      key={sale.id}
                      className="border-b last:border-0 border-zinc-300 dark:border-zinc-700"
                    >
                      <div className="p-6 max-sm:p-4">
                        <div className="mb-2 text-end">
                          <span className="text-sm">
                            {dayjs(sale.created_at).fromNow()}
                          </span>
                        </div>
                        <div className="flex justify-center gap-8 mr-auto max-sm:flex-wrap">
                          <div className="relative h-40 aspect-square">
                            <Image
                              className="object-contain rounded-lg"
                              alt=""
                              src={sale.image_url}
                              fill
                              sizes="33vw"
                              priority
                            />
                          </div>
                          <div className="w-full flex gap-x-8 gap-y-4 justify-between max-md:flex-col">
                            <div className="w-full flex items-center gap-x-8 flex-wrap">
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
                                  <div className="h-8 flex items-center gap-1 py-1 px-2.5 border border-dashed border-black rounded-full bg-amber-200">
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
                                className="flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold transition-colors text-white bg-violet-500 hover:bg-violet-400 cursor-pointer"
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

          {product.specs && (
            <div id="specs" className="space-y-10">
              <div className="w-max">
                <h2 className="text-xl font-extrabold text-violet-600">
                  ESPECIFICAÇÕES
                </h2>
                <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
              </div>
              <div className="border border-zinc-300 dark:border-zinc-700  rounded-xl overflow-hidden">
                <table className="w-full border-collapse break-all">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr
                        key={key}
                        className="border-b last:border-0 border-zinc-300 dark:even:bg-violet-500  even:bg-amber-200  dark:border-zinc-700"
                      >
                        <th className="table-cell w-1/2 py-4 px-4 text-left text-lg font-bold border-r border-zinc-300 dark:border-zinc-700">
                          {key}
                        </th>
                        <td className="table-cell w-1/2 py-2 px-4 text-lg font-bold">
                          {value}
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
                <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
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
