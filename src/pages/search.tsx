import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductList } from '@/components/ProductList'
import { api } from '@/lib/axios'
import { Product } from '@/models'

export default function Search({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchParams = useSearchParams()

  const search = searchParams.get('q')

  return (
    <>
      <Head>
        <title>{search} | Bench Promos</title>
      </Head>
      <div className="max-w-screen-xl flex flex-col gap-8 py-8 max-xl:px-4 mx-auto">
        <Breadcrumbs />

        <span>Você pesquisou por: {search}</span>

        <ProductList products={products} />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: Product[]
}> = async (context) => {
  const { q } = context.query

  const response = await api.get(`/products/with-min-price/for-all?search=${q}`)

  const products: Product[] = response.data

  return {
    props: {
      products,
    },
  }
}
