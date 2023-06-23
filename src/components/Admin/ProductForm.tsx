import { useCategory } from '@/contexts/CategoryContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { BsPlus } from 'react-icons/bs'
import { FaMinus } from 'react-icons/fa'
import { z } from 'zod'
import NumericPriceInput from './NumericPriceInput'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'

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
  description: string
}

interface Props {
  targetProduct: Product | undefined
}

const productSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1, 'O produto deve possuir um título'),
  image_url: z.string().url('O produto deve possuir uma URL de imagem válida.'),
  category_id: z.string().min(1, 'O produto deve possuir uma categoria.'),
  subcategory_id: z.string(),
  specs: z
    .array(
      z.object({
        title: z.string().min(1, 'Título de especificação não deve ser nulo.'),
        value: z.string().min(1, 'Valor de especificação não deve ser nulo.'),
      }),
    )
    .min(1, 'O produto deve possuir ao menos 1 especificação.'),
  review_url: z.string().optional(),
  reference_price: z.number().nonnegative().optional(),
  recommended: z.boolean(),
  description: z.string().optional(),
})

type ProductData = z.infer<typeof productSchema>

export default function ProductForm({ targetProduct }: Props) {
  const { categories } = useCategory()
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: { specs: [{ title: '', value: '' }] },
  })
  const categoryChosen = watch('category_id')
  const {
    fields: specsFields,
    append: specsAppend,
    remove: specsRemove,
  } = useFieldArray({
    control,
    name: 'specs',
  })
  const router = useRouter()

  useEffect(() => {
    setValue('productId', targetProduct?.id || '')
    setValue('title', targetProduct?.title || '')
    setValue('image_url', targetProduct?.image_url || '')
    setValue('category_id', targetProduct?.category.id || '')
    setValue('subcategory_id', targetProduct?.subcategory?.id || '')
    setValue('reference_price', targetProduct?.reference_price || 0)
    setValue('review_url', targetProduct?.review_url || '')
    setValue('recommended', targetProduct?.recommended.valueOf() || false)
    setValue('specs', targetProduct?.specs || [{ title: '', value: '' }])
    setValue('description', targetProduct?.description || '')
  }, [targetProduct, setValue])

  async function submit(data: ProductData) {
    const dataWithoutEmptyValues = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== ''),
    )
    switch (submitOption) {
      case 'create':
        await api
          .post('/products', dataWithoutEmptyValues, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
              'Content-Type': 'application/json',
            },
          })
          .then(() => router.refresh())

        break

      case 'edit':
        await api
          .patch(`/products/${targetProduct?.id}`, dataWithoutEmptyValues, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
              'Content-Type': 'application/json',
            },
          })
          .then(() => router.refresh())
        break

      case 'delete':
        await api
          .delete(`/products/${targetProduct?.id}`, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
              'Content-Type': 'application/json',
            },
          })
          .then(() => router.refresh())
    }
  }

  return (
    <form
      className="max-w-[810px] flex-1 space-y-8 py-6 dark:border-zinc-800 sm:border-r sm:pr-8"
      onSubmit={handleSubmit(submit)}
    >
      <fieldset className="flex flex-col">
        <label>Nome do produto *</label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
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
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('image_url')}
        />
        {errors.image_url && (
          <span className="text-red-500">{errors.image_url.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Categoria *</label>
        <select
          className="h-12 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('category_id')}
          onChange={() => setValue('subcategory_id', '')}
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
        <label>Subcategoria *</label>
        <select
          className="h-12 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('subcategory_id')}
        >
          <option value=""></option>
          {categories.map((category) =>
            category.subcategories?.map((subcategory) => (
              <option
                key={subcategory.id}
                value={subcategory.id}
                className={category.id !== categoryChosen ? 'hidden' : ''}
              >
                {subcategory.name}
              </option>
            )),
          )}
        </select>
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Preço de referência (opcional)</label>
        <Controller
          name="reference_price"
          control={control}
          render={({ field: { value, onChange } }) => (
            <NumericPriceInput
              name="reference_price"
              onChange={onChange}
              value={value}
            />
          )}
        />
        {errors.reference_price && (
          <span className="text-red-500">{errors.reference_price.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Link do review (opcional)</label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('review_url')}
        />
        {errors.review_url && (
          <span className="text-red-500">{errors.review_url.message}</span>
        )}
      </fieldset>

      <fieldset className="flex justify-between">
        <label>Recomendação (opcional)</label>
        <input
          type="checkbox"
          className="h-6 w-6 cursor-pointer"
          {...register('recommended')}
        />
        {errors.recommended && (
          <span className="text-red-500">{errors.recommended.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <div className="flex justify-between">
          <label>Especificações *</label>
          <div className="flex gap-2 text-white">
            <button
              type="button"
              onClick={() => specsAppend({ title: '', value: '' })}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-violet-500 hover:bg-violet-400"
            >
              <BsPlus />
            </button>
            <button
              type="button"
              onClick={() => {
                if (specsFields.length > 1) specsRemove(-1)
              }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-red-500 hover:bg-red-400"
            >
              <FaMinus size={10} />
            </button>
          </div>
        </div>

        {specsFields
          .sort((a, b) => {
            return a.title.length - b.title.length
          })
          .map((spec, index) => (
            <div key={spec.id} className="grid grid-cols-2 gap-2">
              <input
                type="text"
                className="rounded-lg border border-black/20 p-2 text-sm outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
                {...register(`specs.${index}.title`)}
              />
              <input
                type="text"
                className="rounded-lg border border-black/20 p-2 py-3 text-sm outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
                {...register(`specs.${index}.value`)}
              />
              {errors.specs?.[index]?.title && (
                <span className="text-red-500">
                  {errors.specs[index]?.title?.message}
                </span>
              )}
              {errors.specs?.[index]?.value && (
                <span className="text-red-500">
                  {errors.specs[index]?.value?.message}
                </span>
              )}
            </div>
          ))}
        {errors.specs && (
          <span className="text-red-500">{errors.specs.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Descrição (opcional)</label>
        <textarea
          className="h-36 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('description')}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </fieldset>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          onClick={() => setSubmitOption('create')}
          className="mt-3 flex-1  rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-violet-400"
        >
          Criar
        </button>

        {targetProduct?.id ? (
          <>
            <button
              type="submit"
              onClick={() => setSubmitOption('edit')}
              className="mt-3 flex-1  rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-violet-400"
            >
              Editar
            </button>
            <button
              onClick={() => setSubmitOption('delete')}
              type="submit"
              className="mt-3 flex-1  rounded-full bg-red-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-red-400"
            >
              Excluir
            </button>
          </>
        ) : null}
      </div>
      <input className="hidden h-0 w-0" {...register('productId')} />
    </form>
  )
}
