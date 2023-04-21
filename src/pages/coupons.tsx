import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { RxCopy } from 'react-icons/rx'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Toast } from '@/components/Toast'
import { useMediaQuery } from '@/hooks/use-media-query'
import { api } from '@/lib/axios'
import { Coupon } from '@/models'
import { priceFormatter } from '@/utils/formatter'

interface RetailersWithCoupons {
  id: string
  name: string
  coupons: Omit<Coupon, 'retailer'>[]
}

export default function Coupons({
  coupons,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isSm = useMediaQuery('(min-width: 640px)')

  const retailersWithCoupons = coupons.reduce<RetailersWithCoupons[]>(
    (acc, { retailer, ...coupon }) => {
      const retailerIndex = acc.findIndex((r) => r.id === retailer.id)

      if (retailerIndex === -1) {
        acc.push({
          id: retailer.id,
          name: retailer.name,
          coupons: [coupon],
        })
      } else if (coupon.available) {
        acc[retailerIndex].coupons.push(coupon)
      }
      return acc
    },
    [],
  )

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <Head>
        <title>Cupons | Bench Promos</title>
      </Head>
      <div className="max-w-screen-xl py-8 max-xl:px-4 mx-auto space-y-8">
        <Breadcrumbs />

        <div className="space-y-12 rounded-xl">
          {retailersWithCoupons.map((retailerWithCoupons) => (
            <div
              key={retailerWithCoupons.id}
              className="pb-12 space-y-8 border-b last:border-0 border-zinc-300"
            >
              <div className="w-max">
                <h2 className="text-xl uppercase font-extrabold text-violet-600">
                  {retailerWithCoupons.name}
                </h2>
                <div className="w-3/4 h-2 rounded-full bg-violet-600" />
              </div>

              <div className="sm:w-fit flex max-sm:justify-center flex-wrap gap-11">
                {retailerWithCoupons.coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="relative px-10 py-6 rounded-2xl text-center overflow-hidden text-white bg-gradient-to-br from-violet-600 to-violet-400"
                  >
                    <h3 className="text-2xl font-medium">
                      {coupon.discount.endsWith('%')
                        ? coupon.discount
                        : priceFormatter.format(Number(coupon.discount))}
                    </h3>
                    <h4 className="text-xl font-medium">OFF</h4>
                    <div className="flex items-center my-6 mx-auto">
                      <span className="w-52 h-10 flex items-center justify-center tracking-wider font-bold border border-dashed border-white border-r-0">
                        {coupon.code.toUpperCase()}
                      </span>
                      <Toast
                        title="CÓDIGO COPIADO"
                        triggerButton={
                          <button className="h-10 px-1.5 sm:px-5 font-medium text-black border border-amber-300 bg-amber-300 cursor-pointer">
                            <span onClick={() => copyToClipboard(coupon.code)}>
                              {isSm ? 'COPIAR' : <RxCopy />}
                            </span>
                          </button>
                        }
                      />

                      <div className="absolute top-1/2 left-0 -translate-x-2/4 -translate-y-2/4 w-12 h-12 rounded-full bg-white" />
                      <div className="absolute top-1/2 right-0 translate-x-2/4 -translate-y-2/4 w-12 h-12 rounded-full bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  coupons: Coupon[]
}> = async () => {
  const response = await api.get('/coupons')
  const coupons: Coupon[] = response.data

  return {
    props: {
      coupons,
    },
  }
}
