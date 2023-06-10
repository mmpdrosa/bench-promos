import ProductRetailerForm from '@/components/Admin/ProductRetailerForm'
import ProductsList from '@/components/Admin/ProductsList'
import { AdminLayout } from '@/components/layouts/admin'
import { api } from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { BsX } from 'react-icons/bs'

interface Retailer {
  id: string
  name: string
}

interface ProductRetailerRelation {
  price: number
  html_url: string
  dummy: string
  retailer: Retailer
}

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

export default function ProductRetailersPage({
  products,
  retailers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [targetProduct, setTargetProduct] = useState<Product | undefined>(
    undefined,
  )
  const [targetProductRetailer, setTargetProductRetailer] = useState<
    ProductRetailerRelation | undefined
  >(undefined)

  const [machingProductRetailers, setMachingProductRetailers] = useState<
    ProductRetailerRelation[] | undefined
  >(undefined)

  const [switchProductsOrRetailers, setSwitchProductsOrRetailers] =
    useState<string>('products')

  useEffect(() => {
    if (targetProduct) {
      api
        .get(`/products/${targetProduct.id}/retailers`)
        .then((res) => setMachingProductRetailers(res.data))
    }
    setTargetProductRetailer(undefined)
  }, [targetProduct])

  return (
    <AdminLayout>
      <Head>
        <title>Anúncios de Produtos | Bench Promos Admin</title>
      </Head>
      <div className="flex flex-1 max-sm:flex-col">
        <ProductRetailerForm
          targetProductId={targetProduct?.id}
          targetProductRetailer={targetProductRetailer}
          retailers={retailers}
        />

        {switchProductsOrRetailers === 'products' ? (
          <div className="flex flex-1 flex-col max-h-[calc(100vh-172px)] py-6 sm:pl-8 sm:pr-2">
            <div className="flex justify-center items-center gap-6 pb-4">
              <button className="text-violet-500 border-b-2 border-violet-500 font-semibold">
                Produtos
              </button>
              <button
                className="hover:text-violet-500"
                onClick={() => setSwitchProductsOrRetailers('retailers')}
              >
                Anúncios
              </button>
            </div>
            <ProductsList
              products={products}
              targetProduct={targetProduct}
              setTargetProduct={setTargetProduct}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col max-h-[calc(100vh-172px)] py-6 sm:pl-8 sm:pr-2">
            <div className="flex justify-center items-center gap-6 pb-4">
              <button
                className="hover:text-violet-500"
                onClick={() => setSwitchProductsOrRetailers('products')}
              >
                Produtos
              </button>
              <button className="text-violet-500 border-b-2 border-violet-500 font-semibold">
                Anúncios
              </button>
            </div>
            {targetProductRetailer && targetProduct ? (
              <>
                <label>Anúncio selecionado</label>
                <div className="flex items-start flex-col py-4 px-2 rounded-lg bg-violet-500/80 text-white mb-8 relative">
                  <button
                    className="absolute p-1 top-2 right-2 bg-red-500 rounded-lg hover:bg-red-400"
                    onClick={() => setTargetProductRetailer(undefined)}
                  >
                    <BsX />
                  </button>

                  <h1 className="font-semibold">
                    {targetProductRetailer.retailer.name}
                  </h1>
                  <span className="flex text-lg font-semibold">
                    R${' '}
                    {(targetProductRetailer.price / 100)
                      .toString()
                      .replace('.', ',')}
                  </span>
                </div>
              </>
            ) : null}
            <span>Selecione um anúncio</span>
            <div className="overflow-y-scroll sm:overscroll-none">
              {targetProduct &&
                machingProductRetailers?.map((retailer) => (
                  <div
                    key={retailer.retailer.id}
                    onClick={() => {
                      setTargetProductRetailer(retailer)
                    }}
                    className="relative group flex flex-col items-start justify-start py-4 px-2 cursor-pointer rounded-lg hover:bg-violet-500/80 hover:text-white"
                  >
                    <h1 className="font-semibold text-violet-500 group-hover:text-white">
                      {retailer.retailer.name}
                    </h1>
                    <span className="flex text-lg font-semibold">
                      R$ {(retailer.price / 100).toString().replace('.', ',')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: Product[]
  retailers: Retailer[]
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
  const retailersResponse = await api.get('/retailers')

  const products: Product[] = productsResponse.data.reverse()
  const retailers: Retailer[] = retailersResponse.data
  return {
    props: {
      products,
      retailers,
    },
  }
}
