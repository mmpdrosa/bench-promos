import CouponForm from '@/components/Admin/CouponForm'
import { AdminLayout } from '@/components/layouts/admin'
import { api } from '@/lib/axios'
import { priceFormatter } from '@/utils/formatter'
import { getCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { BsX } from 'react-icons/bs'

interface Retailer {
  id: string
  name: string
}

interface Coupon {
  id: string
  available: boolean
  code: string
  discount: string
  minimum_spend: number
  comments: string
  description: string
  retailer: Retailer
}

export default function CouponsAdmin({
  coupons,
  retailers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [targetCoupon, setTargetCoupon] = useState<Coupon | undefined>(
    undefined,
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

  return (
    <AdminLayout>
      <Head>
        <title>Cupons | Bench Promos Admin</title>
      </Head>
      <div className="flex flex-1 max-sm:flex-col">
        <CouponForm retailers={retailers} targetCoupon={targetCoupon} />
        <div className="flex max-h-[calc(100vh-172px)] flex-1 flex-col py-6 sm:pl-8 sm:pr-2">
          {targetCoupon ? (
            <>
              <label>Cupom selecionado</label>
              <div className="relative mb-8 flex flex-col rounded-lg bg-violet-500/80 px-2 py-4 text-white">
                <button
                  className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
                  onClick={() => setTargetCoupon(undefined)}
                >
                  <BsX />
                </button>

                <h1 className="font-semibold text-white">
                  {targetCoupon.retailer.name}
                </h1>
                <div className="flex justify-between">
                  <span className="font-semibold">{targetCoupon.code}</span>
                  <span className="font-semibold">
                    {discountsLabel(targetCoupon.discount)}
                  </span>
                </div>
              </div>
            </>
          ) : null}
          <span className="pb-4">Selecione um cupom</span>
          <div className="overflow-y-scroll sm:overscroll-none">
            {retailers.map((retailer) =>
              coupons
                .filter((coupon) => {
                  return coupon.retailer.id === retailer.id
                })
                .map((coupon) => (
                  <div
                    key={coupon.id}
                    onClick={() => {
                      setTargetCoupon(coupon)
                    }}
                    className="group relative flex cursor-pointer flex-col rounded-lg px-2 py-4 hover:bg-violet-500/80 hover:text-white"
                  >
                    <h1 className="font-semibold text-violet-600 group-hover:text-white">
                      {coupon.retailer.name}
                    </h1>
                    <div className="flex justify-between">
                      <span className="font-semibold">{coupon.code}</span>
                      <span className="font-semibold">
                        {discountsLabel(coupon.discount)}
                      </span>
                    </div>
                  </div>
                )),
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  coupons: Coupon[]
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

  const response = await api.get('/users/role/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const isAdmin = response.data

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const resCoupons = await api.get('/coupons')
  const resRetailers = await api.get('/retailers')

  const coupons: Coupon[] = resCoupons.data
  const retailers: Retailer[] = resRetailers.data

  return {
    props: {
      coupons,
      retailers,
    },
  }
}
