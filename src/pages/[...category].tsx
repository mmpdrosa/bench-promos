import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiHome } from 'react-icons/hi'
import { RxChevronRight } from 'react-icons/rx'

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

  return (
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 mx-auto">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3 text-xs font-bold">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 cursor-pointer hover:text-violet-500"
              title="Home"
            >
              <HiHome /> Home
            </Link>
          </li>
          {category && (
            <li>
              <div className="flex items-center">
                <RxChevronRight />
                <Link
                  href={`/${category.id}`}
                  className="ml-1 md:ml-2 cursor-pointer hover:text-violet-500"
                  title={category.name}
                >
                  {category.name}
                </Link>
              </div>
            </li>
          )}
          {subcategory && (
            <li aria-current="page">
              <div className="flex items-center">
                <RxChevronRight />
                <span className="ml-1 md:ml-2" title={subcategory.name}>
                  {subcategory.name}
                </span>
              </div>
            </li>
          )}
        </ol>
      </nav>

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

/* export const getStaticPaths: GetStaticPaths = async () => {
  const response = await api.get('/categories')

  const categories: Category[] = response.data

  const subcategoryPaths = categories.flatMap(
    (category) =>
      category.subcategories?.map((subcategory) => ({
        params: {
          category: [category.id, subcategory.id],
        },
      })) ?? [],
  )

  const categoryPaths = categories.map((category) => ({
    params: {
      category: [category.id],
    },
  }))

  const paths = [...subcategoryPaths, ...categoryPaths]

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<
  {
    products: Product[]
  },
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
    revalidate: 60, // 1 minute
  }
}
 */
