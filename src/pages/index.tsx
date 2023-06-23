import { CircularProgress } from '@mui/material'
import { GetServerSideProps, InferGetServerSidePropsType, Metadata } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'

import { ProductSaleCard } from '@/components/ProductSaleCard'
import { api } from '@/lib/axios'
import { Sale } from '@/models'

export const metadata: Metadata = {
  title: 'Bench Promos: As Melhores Ofertas e Promoções',
  description:
    'Encontre os melhores os descontos, ofertas, cupons e promoções em uma comunidade especializada em tecnologia.',
}

const ITEMS_PER_LOAD = 12

export default function Home({
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
      cacheTime: 1000 * 60 * 1, // 1 minute
    },
  )

  useEffect(() => {
    refetch()
  }, [refetch, search])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <>
      <Head>
        <title>Bench Promos: As Melhores Ofertas e Promoções</title>
      </Head>
      <div className="mx-auto max-w-screen-xl space-y-8 py-8 max-xl:px-4">
        {search && (
          <div>
            <span>Você pesquisou por: {search}</span>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-7">
          {sales!.pages
            .filter(Boolean)
            .flat()
            .map((sale) => (
              <ProductSaleCard
                key={sale.id}
                id={sale.id}
                title={sale.title}
                html_url={sale.html_url}
                image_url={sale.image_url}
                category={sale.category.name}
                price={sale.price}
                coupon={sale.coupon}
                specs={sale.specs}
                created_at={sale.created_at}
                reactions={sale.reactions}
                product_id={sale.product_id}
                comments={sale.comments}
                label={sale.label}
              />
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
