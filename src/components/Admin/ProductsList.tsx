import Image from 'next/image'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { BsX } from 'react-icons/bs'

interface Product {
  id: string
  title: string
  image_url: string
  category: { id: string; name: string }
  subcategory: { id: string; name: string; category: string }
  recommended: boolean
  review_url: string
  specs: { title: string; value: string }[]
  reference_price: number
}

interface ProductsListProps {
  products: Product[]
  targetProduct: Product | undefined
  setTargetProduct: Dispatch<SetStateAction<Product | undefined>>
}

export default function ProductsList({
  products,
  targetProduct,
  setTargetProduct,
}: ProductsListProps) {
  const [searchMatchedProducts, setSearchMatchedProducts] = useState<
    Product[] | undefined
  >(products)

  function handleProductSearch(event: ChangeEvent<HTMLInputElement>) {
    const searchStringsArray = event.currentTarget.value.split(' ')
    setSearchMatchedProducts(
      products.filter((product) => {
        return searchStringsArray.every((searchString) =>
          product.title.toLowerCase().includes(searchString.toLowerCase()),
        )
      }),
    )
  }
  return (
    <>
      {targetProduct ? (
        <>
          <label>Produto selecionado</label>
          <div className="relative mb-8 flex items-center gap-4 rounded-lg bg-violet-500/80 px-2 py-6 text-white">
            <button
              className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
              onClick={() => setTargetProduct(undefined)}
            >
              <BsX />
            </button>
            <Image
              src={targetProduct.image_url}
              alt={targetProduct.id}
              width={70}
              height={1}
            />
            {targetProduct.title}
          </div>
        </>
      ) : null}

      <fieldset className="flex flex-col">
        <label>Selecionar um produto</label>
        <input
          type="text"
          onChange={(event) => handleProductSearch(event)}
          className="mb-4 rounded-lg border border-black/20 p-2 text-lg outline-none placeholder:italic focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          placeholder="Insira o nome do produto"
        />
      </fieldset>
      <div className="overflow-y-scroll sm:overscroll-none">
        {searchMatchedProducts?.map((product) => (
          <div
            key={product.id}
            onClick={() => setTargetProduct(product)}
            className="flex cursor-pointer items-center justify-start gap-4 rounded-lg px-2 py-6 hover:bg-violet-500/80 hover:text-white"
          >
            <Image
              src={product.image_url}
              alt="product-image"
              width={70}
              height={1}
            />
            {product.title}
          </div>
        ))}
      </div>
    </>
  )
}
