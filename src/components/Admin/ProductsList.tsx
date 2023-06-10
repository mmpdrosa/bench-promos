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
          <div className="flex items-center gap-4 py-6 px-2 rounded-lg bg-violet-500/80 text-white mb-8 relative">
            <button
              className="absolute p-1 top-2 right-2 bg-red-500 rounded-lg hover:bg-red-400"
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
          className="p-2 mb-4 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800 placeholder:italic"
          placeholder="Insira o nome do produto"
        />
      </fieldset>
      <div className="overflow-y-scroll sm:overscroll-none">
        {searchMatchedProducts?.map((product) => (
          <div
            key={product.id}
            onClick={() => setTargetProduct(product)}
            className="flex items-center justify-start gap-4 py-6 px-2 cursor-pointer rounded-lg hover:bg-violet-500/80 hover:text-white"
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
