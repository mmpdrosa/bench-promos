import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ExpandedProductSaleCard } from '@/components/ExpandedProductSaleCard'
import { api } from '@/lib/axios'
import { Sale } from '@/models'

const ITEMS_PER_LOAD = 2

export default function Sales({
  sales: initialSales,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { ref, inView } = useInView()

  const {
    data: sales,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['sales'],
    async ({ pageParam = 0 }) => {
      const response = await api.get(
        `/sales?skip=${pageParam * ITEMS_PER_LOAD}&take=${ITEMS_PER_LOAD}`,
      )
      const sales: Sale[] = response.data.sales

      return sales
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length

        return lastPage.length !== 0 ? nextPage : undefined
      },
      initialData: { pages: [initialSales], pageParams: [0] },
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <div className="max-w-screen-xl py-8 max-xl:px-4 mx-auto space-y-8">
      <Breadcrumbs />

      <div className="flex flex-col gap-8">
        {sales!.pages.flat().map((sale) => (
          <ExpandedProductSaleCard key={sale.id} {...sale} />
        ))}
      </div>

      <div>
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          hidden={!hasNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load Newer'
            : 'Nothing more to load'}
        </button>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{
  sales: Sale[]
}> = async () => {
  const response = await api.get(`/sales?skip=0&take=${ITEMS_PER_LOAD}`)
  const sales: Sale[] = response.data.sales

  return {
    props: {
      sales,
    },
  }
}
