import SalesForm from '@/components/Admin/SalesForm'
import { AdminLayout } from '@/components/layouts/admin'
import { api } from '@/lib/axios'
import { getCookie } from 'cookies-next'
import dayjs from 'dayjs'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { BsX } from 'react-icons/bs'

interface Product {
  id: string
  title: string
  image_url: string
  category: { id: string; name: string }
  subcategory: { id: string; name: string; category: string }
  recommended: boolean
  review_url: string
  specs: { title: string; value: string }[]
  reference_price: number
}

interface Sale {
  id: string
  product_id: string
  title: string
  image_url: string
  html_url: string
  category: { id: string; name: string }
  specs: string
  price: number
  comments: string
  coupon: string
  created_at: Date
}

export default function ProductsAdmin({
  products,
  sales,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [targetProduct, setTargetProduct] = useState<Product | undefined>(
    undefined,
  )
  const [targetSale, setTargetSale] = useState<Sale | undefined>(undefined)
  const [searchMatchedProducts, setSearchMatchedProducts] = useState<
    Product[] | undefined
  >(products)
  const [searchMatchedSales, setSearchMatchedSales] = useState<
    Sale[] | undefined
  >(sales)
  const [switchProductOrSales, setSwitchProductOrSales] =
    useState<string>('products')

  function handleProductSearch(event: ChangeEvent<HTMLInputElement>) {
    const searchStringsArray = event.currentTarget.value.split(' ')
    setSearchMatchedProducts(
      products.filter((product) => {
        return searchStringsArray.every((searchString) =>
          product.title.toLowerCase().includes(searchString.toLowerCase()),
        )
      }),
    )
  }

  function handleSaleSearch(event: ChangeEvent<HTMLInputElement>) {
    const searchStringsArray = event.currentTarget.value.split(' ')
    setSearchMatchedSales(
      sales.filter((sale) => {
        return searchStringsArray.every((searchString) =>
          sale.title.toLowerCase().includes(searchString.toLowerCase()),
        )
      }),
    )
  }

  return (
    <AdminLayout>
      <Head>
        <title>Promoções | Bench Promos Admin</title>
      </Head>
      <div className="flex flex-1 max-sm:flex-col">
        <SalesForm targetSale={targetSale} targetProduct={targetProduct} />
        {switchProductOrSales === 'products' ? (
          <div className="flex max-h-[calc(100vh-172px)] flex-1 flex-col py-6 sm:pl-8 sm:pr-2">
            <div className="flex items-center justify-center gap-6 pb-4">
              <button className="border-b-2 border-violet-500 font-semibold text-violet-500">
                Produtos
              </button>
              <button
                className="hover:text-violet-500"
                onClick={() => setSwitchProductOrSales('sales')}
              >
                Promoções
              </button>
            </div>
            {targetProduct ? (
              <>
                <label>Produto selecionado</label>
                <div className="relative mb-8 flex items-center gap-4 rounded-lg bg-violet-500/80 px-2 py-6 text-white">
                  <button
                    className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
                    onClick={() => setTargetProduct(undefined)}
                  >
                    <BsX />
                  </button>
                  <Image
                    src={targetProduct.image_url}
                    alt="product-image"
                    width={70}
                    height={1}
                  />
                  {targetProduct.title}
                </div>
              </>
            ) : null}
            <fieldset className="flex flex-col">
              <label>Selecionar um produto</label>
              <input
                type="text"
                name="productsSearch"
                onChange={(event) => handleProductSearch(event)}
                className="mb-4 rounded-lg border border-black/20 p-2 text-lg outline-none placeholder:italic focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
                placeholder="Insira o nome do produto"
              />
            </fieldset>

            <div className="overflow-y-scroll sm:overscroll-none">
              {searchMatchedProducts?.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setTargetProduct(product)}
                  className="flex cursor-pointer items-center justify-start gap-4 rounded-lg px-2 py-6 hover:bg-violet-500/80 hover:text-white"
                >
                  <Image
                    src={product.image_url}
                    alt="product-image"
                    width={70}
                    height={1}
                  />
                  {product.title}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex max-h-[calc(100vh-172px)] flex-1 flex-col py-6 sm:pl-8 sm:pr-2">
            <div className="flex items-center justify-center gap-6 pb-4">
              <button
                className="hover:text-violet-500"
                onClick={() => setSwitchProductOrSales('products')}
              >
                Produtos
              </button>
              <button className="border-b-2 border-violet-500 font-semibold text-violet-500">
                Promoções
              </button>
            </div>
            {targetSale ? (
              <>
                <label>Promoção selecionada</label>
                <div className="relative mb-8 flex items-center gap-4 rounded-lg bg-violet-500/80 px-2 py-6 text-white">
                  <button
                    className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
                    onClick={() => {
                      setTargetSale(undefined)
                      setTargetProduct(undefined)
                    }}
                  >
                    <BsX />
                  </button>
                  <span className="absolute right-10 top-2 text-xs">
                    {dayjs(targetSale.created_at).fromNow()}
                  </span>
                  <Image
                    src={targetSale.image_url}
                    alt="product-image"
                    width={70}
                    height={1}
                  />
                  <div className="flex flex-col gap-4">
                    <span>{targetSale.title}</span>
                    <span className="font-semibold">
                      R${' '}
                      {(targetSale.price / 100)
                        .toFixed(2)
                        .toString()
                        .replace('.', ',')}
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            <fieldset className="flex flex-col">
              <label>Selecionar uma promoção</label>
              <input
                type="text"
                name="salesSearch"
                onChange={(event) => handleSaleSearch(event)}
                className="mb-4 rounded-lg border border-black/20 p-2 text-lg outline-none placeholder:italic focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
                placeholder="Insira o título de uma promoção"
              />
            </fieldset>

            <div className="overflow-y-scroll sm:overscroll-none">
              {searchMatchedSales?.map((sale) => {
                if (
                  (targetProduct && sale.product_id === targetProduct.id) ||
                  !targetProduct
                )
                  return (
                    <div
                      key={sale.id}
                      onClick={() => {
                        setTargetSale(sale)
                        setTargetProduct(
                          products.find(
                            (product) => product.id === sale.product_id,
                          ),
                        )
                      }}
                      className="relative flex cursor-pointer items-center justify-start gap-4 rounded-lg px-2 py-6 hover:bg-violet-500/80 hover:text-white"
                    >
                      <span className="absolute right-2 top-2 text-xs">
                        {dayjs(sale.created_at).fromNow()}
                      </span>
                      <Image
                        src={sale.image_url}
                        alt={`${sale.id}`}
                        width={70}
                        height={1}
                      />
                      <div className="flex flex-col gap-4">
                        <span>{sale.title}</span>
                        <span className="font-semibold">
                          R${' '}
                          {(sale.price / 100)
                            .toFixed(2)
                            .toString()
                            .replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  )
                return null
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: Product[]
  sales: Sale[]
}> = async (ctx) => {
  const token = getCookie('bench-promos.token', ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const adminResponse = await api.get('/users/role/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const isAdmin = adminResponse.data

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const productsResponse = await api.get('/products')
  const salesResponse = await api.get('/sales', {
    params: { take: 1000, skip: 0 },
  })

  const products: Product[] = productsResponse.data.reverse()
  const sales: Sale[] = salesResponse.data
  return {
    props: {
      products,
      sales,
    },
  }
}
