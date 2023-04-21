import { CircularProgress } from '@mui/material'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ExpandedProductSaleCard } from '@/components/ExpandedProductSaleCard'
import { api } from '@/lib/axios'
import { Sale } from '@/models'

const ITEMS_PER_LOAD = 8

export default function Sales({
  sales: initialSales,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { ref, inView } = useInView()
  const searchParams = useSearchParams()

  const search = searchParams.get('q') ?? ''

  const {
    data: sales,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['sales'],
    async ({ pageParam = 0 }) => {
      const response = await api.get(
        `/sales?search=${search}&skip=${
          pageParam * ITEMS_PER_LOAD
        }&take=${ITEMS_PER_LOAD}`,
      )
      const sales: Sale[] = response.data

      return sales
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length

        return lastPage && lastPage.length !== 0 ? nextPage : undefined
      },
      initialData: { pages: [initialSales], pageParams: [0] },
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <>
      <Head>
        <title>Promoções | Bench Promos</title>
      </Head>
      <div className="max-w-screen-xl py-8 max-xl:px-4 mx-auto space-y-8">
        <Breadcrumbs />

        {search && (
          <div>
            <span>Você pesquisou por: {search}</span>
          </div>
        )}

        <div className="flex flex-col gap-8">
          {sales!.pages
            .filter(Boolean)
            .flat()
            .map((sale) => (
              <ExpandedProductSaleCard key={sale.id} {...sale} />
            ))}
        </div>

        <div className="text-center">
          <button
            ref={ref}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            hidden={!hasNextPage}
          >
            {isFetchingNextPage && (
              <CircularProgress className="text-violet-500" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  sales: Sale[]
}> = async (context) => {
  const { q } = context.query

  const response = await api.get(
    `/sales?search=${q ?? ''}&skip=0&take=${ITEMS_PER_LOAD}`,
  )
  const sales: Sale[] = response.data

  return {
    props: {
      sales,
    },
  }
}
