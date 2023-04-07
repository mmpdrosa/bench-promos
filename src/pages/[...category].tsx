import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { usePathname } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductList } from '@/components/ProductList'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'
import { Product } from '@/models'

export default function CategoryProducts({
  products = [],
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { categories } = useCategory()

  const paths = usePathname()?.split('/')
  paths?.shift()

  const category = categories.find(({ id }) => paths?.length && id === paths[0])

  const subcategory = category?.subcategories?.find(
    ({ id }) => paths?.length && id === paths[1],
  )

  const breadcrumbsLocations: Array<{ label: string; path: string }> = []
  if (category) {
    breadcrumbsLocations.push({ label: category.name, path: `/${category.id}` })

    if (subcategory)
      breadcrumbsLocations.push({
        label: subcategory.name,
        path: `/${category.id}/${subcategory.id}`,
      })
  }

  return (
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 max-xl:px-4 mx-auto">
      <Breadcrumbs locations={breadcrumbsLocations} />

      <ProductList products={products} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<
  { products: Product[] },
  { category: string[] }
> = async ({ params }) => {
  const [category_id, subcategory_id] = params!.category

  let url = `/products/with-min-price/for-all?category=${category_id}`

  if (subcategory_id) {
    url = url.concat(`&subcategory=${subcategory_id}`)
  }

  const response = await api.get(url)

  const products: Product[] = response.data

  return {
    props: {
      products,
    },
  }
}
