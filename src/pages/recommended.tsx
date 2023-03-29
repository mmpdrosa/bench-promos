import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { ProductSlider } from '@/components/ProductSlider'
import { api } from '@/lib/axios'
import { Product } from '@/models'

export default function Recommended({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 mx-auto">
      <ProductSlider products={products} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: Product[]
}> = async () => {
  const response = await api.get(`/products/with-min-price/for-all`)

  const products: Product[] = response.data

  return {
    props: {
      products,
    },
  }
}
