import { useCategory } from '@/contexts/CategoryContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import NumericPriceInput from './NumericPriceInput'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'
import { MdWarningAmber } from 'react-icons/md'
import { BsCheck } from 'react-icons/bs'

interface Sale {
  id: string
  title: string
  image_url: string
  html_url: string
  category: { id: string; name: string }
  specs: string
  price: number
  comments: string
  coupon: string
  product_id: string
}

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

interface Props {
  targetSale?: Sale
  targetProduct?: Product
}

const saleSchema = z.object({
  title: z.string().min(1, 'A promoção deve conter um título.'),
  image_url: z
    .string()
    .url('A promoção deve possuir uma URL de imagem válida.'),
  html_url: z.string().url('A promoção deve possuir um link válido.'),
  price: z.number({
    required_error: 'A promoção deve possuir um valor válido.',
  }),
  category_id: z
    .string()
    .min(1, 'A promoção deve possuir uma categoria válida.'),
  specs: z.string().optional(),
  comments: z.string().optional(),
  coupon: z.string().optional(),
})

type SaleData = z.infer<typeof saleSchema>

export default function SalesForm({ targetSale, targetProduct }: Props) {
  const { categories } = useCategory()
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SaleData>({
    resolver: zodResolver(saleSchema),
  })
  const router = useRouter()

  useEffect(() => {
    setValue('title', targetSale?.title || '')
    setValue('image_url', targetSale?.image_url || '')
    setValue('category_id', targetSale?.category.id || '')
    setValue('price', targetSale?.price || 0)
    setValue('html_url', targetSale?.html_url || '')
    setValue('coupon', targetSale?.coupon || '')
    setValue('comments', targetSale?.comments || '')
  }, [targetSale, setValue])

  async function submit(data: SaleData) {
    console.log(targetProduct?.id)
    switch (submitOption) {
      case 'create':
        await api
          .post(
            '/sales',
            { ...data, product_id: targetProduct?.id },
            {
              headers: {
                'api-key': process.env.NEXT_PUBLIC_API_KEY,
              },
            },
          )
          .then(() => router.refresh())
        break
      case 'edit':
        await api
          .patch(
            `/sales/${targetSale?.id}`,
            { ...data, product_id: targetProduct?.id },
            {
              headers: {
                'api-key': process.env.NEXT_PUBLIC_API_KEY,
              },
            },
          )
          .then(() => router.refresh())

        break
      case 'delete':
        await api
          .delete(`/sales/${targetSale?.id}`, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.refresh())
        break
    }
  }
  return (
    <form
      className="py-6 sm:pr-8 flex-1 space-y-8 sm:border-r dark:border-zinc-800"
      onSubmit={handleSubmit(submit)}
    >
      <fieldset className="flex flex-col">
        {!targetProduct ? (
          <span className="text-amber-600 flex justify-center items-center gap-2 font-semibold">
            <MdWarningAmber /> Nenhum produto foi selecionado
          </span>
        ) : (
          <span className="text-green-600 flex justify-center items-center gap-2 font-semibold">
            <BsCheck /> Produto selecionado
          </span>
        )}
        <label>Título *</label>
        <input
          type="text"
          className="p-2 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
          {...register('title')}
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Imagem *</label>
        <input
          type="text"
          className="p-2 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
          {...register('image_url')}
        />
        {errors.image_url && (
          <span className="text-red-500">{errors.image_url.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Categoria *</label>
        <select
          className="p-2 h-12 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
          {...register('category_id')}
        >
          <option value=""></option>
          {categories.map((category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            )
          })}
        </select>
        {errors.category_id && (
          <span className="text-red-500">{errors.category_id.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Preço *</label>
        <Controller
          name="price"
          control={control}
          render={({ field: { value, onChange } }) => (
            <NumericPriceInput name="price" onChange={onChange} value={value} />
          )}
        />
        {errors.price && (
          <span className="text-red-500">{errors.price.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Link *</label>
        <input
          type="text"
          className="p-2 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
          {...register('html_url')}
        />
        {errors.html_url && (
          <span className="text-red-500">{errors.html_url.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Cupom</label>
        <input
          type="text"
          className="p-2 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
          {...register('coupon')}
        />
        {errors.coupon && (
          <span className="text-red-500">{errors.coupon.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Comentários</label>
        <textarea
          className="p-2 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
          {...register('comments')}
        />
        {errors.comments && (
          <span className="text-red-500">{errors.comments.message}</span>
        )}
      </fieldset>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          onClick={() => setSubmitOption('create')}
          className="flex-1 px-4  mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-violet-500 hover:bg-violet-400"
        >
          Postar
        </button>

        {targetSale?.id && (
          <>
            <button
              type="submit"
              onClick={() => setSubmitOption('edit')}
              className="flex-1 px-4  mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-violet-500 hover:bg-violet-400"
            >
              Editar
            </button>
            <button
              type="submit"
              className="flex-1 px-4  mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-red-500 hover:bg-red-400"
              onClick={() => setSubmitOption('delete')}
            >
              Excluir
            </button>
          </>
        )}
      </div>
      <input
        className="w-0 h-0 hidden"
        readOnly
        value={targetProduct ? targetProduct.id : ''}
      />
    </form>
  )
}
