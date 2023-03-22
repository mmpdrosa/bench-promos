import { Toast } from '@/components/Toast'
import { api } from '@/lib/axios'
import { Coupon } from '@/models'
import { priceFormatter } from '@/utils/formatter'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

interface RetailersWithCoupons {
  id: string
  name: string
  coupons: Omit<Coupon, 'retailer'>[]
}

export default function Coupons({
  coupons,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const retailersWithCoupons = coupons.reduce<RetailersWithCoupons[]>(
    (acc, { retailer, ...coupon }) => {
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

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-screen-xl py-8 mx-auto">
      <div className="px-6 py-8 space-y-12 rounded-xl shadow-md bg-white">
        {retailersWithCoupons.map((retailerWithCoupons) => (
          <div
            key={retailerWithCoupons.id}
            className="pb-12 space-y-8 border-b last:border-0 border-zinc-300"
          >
            <div className="w-max">
              <h2 className="text-2xl uppercase font-extrabold text-violet-600">
                {retailerWithCoupons.name}
              </h2>
              <div className="w-3/4 h-2 rounded-full bg-violet-600" />
            </div>
            <div className="w-fit flex justify-between flex-wrap gap-5">
              {retailerWithCoupons.coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="relative px-10 py-6 rounded-2xl text-center shadow-sm text-white bg-gradient-to-br from-violet-600 to-violet-400"
                >
                  <h3 className="text-2xl font-medium">
                    {coupon.discount.endsWith('%')
                      ? coupon.discount
                      : priceFormatter.format(Number(coupon.discount))}
                  </h3>
                  <h4 className="text-xl font-medium">OFF</h4>
                  <div className="w-fit flex items-center my-6 mx-auto">
                    <span className="w-52 py-2.5 tracking-wider font-bold border border-dashed border-white border-r-0">
                      {coupon.code}
                    </span>
                    <Toast
                      title="CÓDIGO COPIADO"
                      triggerButton={
                        <button className="py-2.5 px-5 font-medium text-black border border-amber-300 bg-amber-300 cursor-pointer">
                          <span onClick={() => copyToClipboard(coupon.code)}>
                            COPIAR
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
  )
}

export const getServerSideProps: GetServerSideProps<{
  coupons: Coupon[]
}> = async () => {
  const response = await api.get(`/coupons`)
  const coupons: Coupon[] = response.data

  return {
    props: {
      coupons,
    },
  }
}
