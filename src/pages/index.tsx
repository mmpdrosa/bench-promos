import { ProductList } from '@/components/ProductList'
import { api } from '@/lib/axios'
import { Product } from '@/models'

interface HomeProps {
  products: Product[]
}

export default function Home({ products }: HomeProps) {
  return (
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 mx-auto">
      <ProductList products={products} />
    </div>
  )
}

export async function getStaticProps() {
  const response = await api.get('/products/with-min-price/for-all')

  const products: Product[] = response.data

  return {
    props: {
      products,
    },
    revalidate: 60, // 1 minute
  }
}
