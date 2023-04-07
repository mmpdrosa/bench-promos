import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductSlider } from '@/components/ProductSlider'
import { api } from '@/lib/axios'
import { Product } from '@/models'

interface RecommendedProductsByCategory {
  id: string
  name: string
  products: Product[]
}

export default function Recommended({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const recommendedProductsByCategory = products.reduce<
    RecommendedProductsByCategory[]
  >((acc, { category, ...product }) => {
    const categoryIndex = acc.findIndex((c) => c.id === category?.id)

    if (categoryIndex === -1) {
      acc.push({
        id: category!.id,
        name: category!.name,
        products: [product],
      })
    } else {
      acc[categoryIndex].products.push(product)
    }
    return acc
  }, [])

  return (
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 max-xl:px-4 mx-auto">
      <Breadcrumbs />

      {recommendedProductsByCategory.map(({ products, ...category }) => (
        <ProductSlider
          key={category.id}
          title={category.name}
          products={products}
        />
      ))}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{
  products: Product[]
}> = async () => {
  const response = await api.get(
    `/products/with-min-price/for-all?search=recommended`,
  )

  const products: Product[] = response.data

  return {
    props: {
      products,
    },
  }
}
