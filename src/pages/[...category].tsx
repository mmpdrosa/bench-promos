import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

import { ProductList } from '@/components/ProductList'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'
import { Category, Product } from '@/models'

export default function CategoryProducts({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { categories } = useCategory()

  const [sortOrder, setSortOrder] = useState('default')

  const paths = usePathname()!.split('/')
  paths!.shift()

  const category = categories.find(({ id }) => id === paths[0])

  const subcategory = category?.subcategories?.find(({ id }) => id === paths[1])

  function handleSortOrderChange(event: ChangeEvent<HTMLSelectElement>) {
    const newSortOrder = event.target.value
    setSortOrder(newSortOrder)

    if (newSortOrder === 'low-to-high') {
      products.sort((a, b) => a.price - b.price)
    } else if (newSortOrder === 'high-to-low') {
      products.sort((a, b) => b.price - a.price)
    }
  }

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
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          {category && (
            <li>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChevronRight} />
                <Link
                  href={`/${category!.id}`}
                  className="ml-1 md:ml-2 cursor-pointer hover:text-violet-500"
                  title={category!.name}
                >
                  {category!.name}
                </Link>
              </div>
            </li>
          )}
          {subcategory && (
            <li aria-current="page">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChevronRight} />
                <span className="ml-1 md:ml-2" title={subcategory!.name}>
                  {subcategory!.name}
                </span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="flex justify-between items-center">
        <span className="text-xs">{products.length} resultados</span>

        <select
          className="block w-max p-2.5 rounded text-sm bg-gray-50 border border-gray-300  focus:ring-violet-500 focus:border-violet-500"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="default" selected>
            Padrão
          </option>
          <option value="low-to-high">Menor preço</option>
          <option value="high-to-low">Maior preço</option>
        </select>
      </div>
      <ProductList products={products} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
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

  return { paths, fallback: false }
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
