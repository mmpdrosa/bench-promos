import ProductForm from '@/components/Admin/ProductForm'
import ProductsList from '@/components/Admin/ProductsList'
import { AdminLayout } from '@/components/layouts/admin'
import { api } from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useState } from 'react'

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

export default function ProductsAdmin({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [targetProduct, setTargetProduct] = useState<Product | undefined>(
    undefined,
  )

  return (
    <AdminLayout>
      <Head>
        <title>Produtos | Bench Promos Admin</title>
      </Head>
      <div className="flex flex-1 max-sm:flex-col">
        <ProductForm targetProduct={targetProduct} />
        <div className="flex flex-1 flex-col max-h-[calc(100vh-172px)] py-6 sm:pl-8 sm:pr-2">
          <ProductsList
            products={products}
            targetProduct={targetProduct}
            setTargetProduct={setTargetProduct}
          />
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: Product[]
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

  const products: Product[] = productsResponse.data.reverse()
  return {
    props: {
      products,
    },
  }
}
