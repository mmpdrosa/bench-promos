import { GetServerSideProps, InferGetServerSidePropsType, Metadata } from 'next'
import Head from 'next/head'
import { useQuery } from 'react-query'

import { CompactProductSaleCard } from '@/components/CompactProductSaleCard'
import { api } from '@/lib/axios'
import { Sale } from '@/models'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home',
  description: '',
}

const ITEMS_PER_LOAD = 8

export default function Home({
  sales: initialSales,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: sales } = useQuery({
    queryKey: ['sales', 'home'],
    queryFn: async () => {
      const response = await api.get(`/sales?skip=0&take=${ITEMS_PER_LOAD}`)
      const sales: Sale[] = response.data

      return sales
    },
    initialData: initialSales,
    refetchOnWindowFocus: false,
  })

  return (
    <>
      <Head>
        <title>Bench Promos</title>
      </Head>
      <div className="max-w-screen-xl flex flex-col gap-16 py-8 max-xl:px-4 mx-auto">
        <div className="grid grid-cols-fill justify-center gap-8">
          {sales?.map((sale) => (
            <CompactProductSaleCard
              key={sale.id}
              id={sale.id}
              title={sale.title}
              html_url={sale.html_url}
              image_url={sale.image_url}
              price={sale.price}
              coupon={sale.coupon}
              specs={sale.specs}
              created_at={sale.created_at}
              reactions={sale.reactions}
              product_id={sale.product_id}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/promocoes"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-semibold transition-colors text-white bg-violet-500 hover:bg-violet-400 cursor-pointer"
          >
            ACESSAR MAIS
          </Link>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  sales: Sale[]
}> = async () => {
  const response = await api.get(`/sales?skip=0&take=${ITEMS_PER_LOAD}`)
  const sales: Sale[] = response.data

  return {
    props: {
      sales,
    },
  }
}
