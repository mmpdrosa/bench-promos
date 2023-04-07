import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useState } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductSaleCard } from '@/components/ProductSaleCard'
import { api } from '@/lib/axios'
import { Sale } from '@/models'

const ITEMS_PER_LOAD = 10

export default function Sales({
  sales,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loadedSales, setLoadedSales] = useState(sales.slice(0, ITEMS_PER_LOAD))

  const loadMoreSales = async () => {
    const nextSales = sales.slice(
      loadedSales.length,
      loadedSales.length + ITEMS_PER_LOAD,
    )
    setLoadedSales([...loadedSales, ...nextSales])
  }

  return (
    <div className="max-w-screen-xl py-8 max-xl:px-4 mx-auto space-y-8">
      <Breadcrumbs />

      <div className="flex flex-col gap-8">
        {loadedSales.map((sale) => (
          <ProductSaleCard key={sale.id} {...sale} />
        ))}
        {loadedSales.length < sales.length && (
          <button
            className="mx-auto px-4 py-2.5 rounded-full text-white transition-colors bg-violet-500 hover:bg-violet-400"
            onClick={loadMoreSales}
          >
            Carregar mais
          </button>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{
  sales: Sale[]
}> = async () => {
  const response = await api.get('/sales')
  const sales: Sale[] = response.data

  return {
    props: {
      sales,
    },
  }
}
