import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { RxCopy } from 'react-icons/rx'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Toast } from '@/components/Toast'
import { useMediaQuery } from '@/hooks/use-media-query'
import { api } from '@/lib/axios'
import { Coupon } from '@/models'
import { priceFormatter } from '@/utils/formatter'
import CouponPopover from '@/components/CouponPopover'

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
      if (!coupon.available) return acc

      const retailerIndex = acc.findIndex((r) => r.id === retailer.id)

      if (retailerIndex === -1) {
        acc.push({
          id: retailer.id,
          name: retailer.name,
          coupons: [coupon],
        })
      } else {
        acc[retailerIndex].coupons.push(coupon)
      }
      return acc
    },
    [],
  )
  const discountsLabel = (couponDiscount: string) => {
    const discountArray = couponDiscount.split('+')
    const formatedDiscountArray = discountArray
      .map((discount) =>
        discount.includes('%')
          ? discount
          : priceFormatter.format(Number(discount)),
      )
      .sort((a, b) => b.length - a.length)
    return formatedDiscountArray.join(' + ')
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <Head>
        <title>Cupons | Bench Promos</title>
      </Head>
      <div className="mx-auto max-w-screen-xl space-y-8 py-8 max-xl:px-4">
        <Breadcrumbs />

        <div className="space-y-12 rounded-xl">
          {retailersWithCoupons.map((retailerWithCoupons) => (
            <div
              key={retailerWithCoupons.id}
              className="space-y-8 border-b border-zinc-300 pb-12 last:border-0 dark:border-zinc-700"
            >
              <div className="w-max">
                <h2 className="text-xl font-extrabold uppercase text-violet-600">
                  {retailerWithCoupons.name}
                </h2>
                <div className="h-2 w-3/4 rounded-full bg-violet-600" />
              </div>

              <div className="flex flex-wrap gap-11 max-sm:justify-center sm:w-fit">
                {retailerWithCoupons.coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 px-10 py-6 text-center text-white"
                  >
                    <h3 className="text-2xl font-medium">
                      {discountsLabel(coupon.discount)}
                    </h3>
                    {coupon.comments && (
                      <CouponPopover comments={coupon.comments} />
                    )}
                    <h4 className="text-xl font-medium">OFF</h4>
                    <div className="mx-auto my-6 flex items-center">
                      <span className="flex h-12 w-52 items-center justify-center rounded-l-sm border border-r-0 border-dashed border-white font-bold tracking-wider">
                        {coupon.code.toUpperCase()}
                      </span>
                      <Toast
                        title="CÓDIGO COPIADO"
                        triggerButton={
                          <button className="h-12 cursor-pointer border border-amber-300 bg-amber-300 px-1.5 font-medium text-black transition-colors hover:border-white hover:bg-white sm:px-5">
                            <span onClick={() => copyToClipboard(coupon.code)}>
                              {isSm ? 'COPIAR' : <RxCopy />}
                            </span>
                          </button>
                        }
                      />

                      <div className="absolute left-0 top-1/2 h-12 w-12 -translate-x-2/4 -translate-y-2/4 rounded-full bg-white dark:bg-zinc-900" />
                      <div className="absolute right-0 top-1/2 h-12 w-12 -translate-y-2/4 translate-x-2/4 rounded-full bg-white dark:bg-zinc-900" />
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
