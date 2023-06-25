import { useCategory } from '@/contexts/CategoryContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import NumericPriceInput from './NumericPriceInput'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, telegramApi } from '@/lib/axios'
import { MdWarningAmber } from 'react-icons/md'
import { BsCheck } from 'react-icons/bs'
import { priceFormatter } from '@/utils/formatter'

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
  label: string
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
  /* eslint-disable */
  specs: z
    .string()
    .transform((specsString) => specsString.replace(/[^\x00-\xFF]/g, ''))
    .optional(),
  comments: z
    .string()
    .transform((specsString) => specsString.replace(/[^\x00-\xFF]/g, ''))
    .optional(),
  /* eslint-enable */
  coupon: z.string().optional(),
  label: z.string().optional(),
})

type SaleData = z.infer<typeof saleSchema>

export default function SalesForm({ targetSale, targetProduct }: Props) {
  const labelOptions = ['', 'LANÇAMENTO', 'PREÇÃO', 'BAIXOU', 'PARCELADO']
  const { categories } = useCategory()
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SaleData>({
    resolver: zodResolver(saleSchema),
  })
  const router = useRouter()
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false)
  console.log()
  useEffect(() => {
    setValue('title', targetSale?.title || '')
    setValue('image_url', targetSale?.image_url || '')
    setValue('category_id', targetSale?.category.id || '')
    setValue('price', targetSale?.price || 0)
    setValue('html_url', targetSale?.html_url || '')
    setValue('coupon', targetSale?.coupon || '')
    setValue('comments', targetSale?.comments || '')
    setValue('specs', targetSale?.specs || '')
    setValue('label', targetSale?.label || '')
  }, [targetSale, setValue])

  function telegramMessageFoward(saleData: SaleData) {
    const message = `${saleData.label && `⭐️ ${saleData.label}! ⭐️\n\n`}🔥 ${
      saleData.title
    } - ${priceFormatter.format(saleData.price / 100)} 🔥\n ${
      saleData.specs && `\n🔴 ${saleData.specs} 🔴\n`
    } ${
      saleData.coupon && `\n🎟 Cupom: ${saleData.coupon}`
    } \n💸 ${priceFormatter.format(saleData.price / 100)}\n  \n🔗 ${
      saleData.html_url
    }\n ${
      saleData.comments &&
      `\n${saleData.comments
        .split('\n\n')
        .map((comment) => `🔸 ${comment}`)
        .join('\n\n')}`
    }`
    console.log(message)

    return message
  }

  async function submit(data: SaleData) {
    switch (submitOption) {
      case 'create':
        setIsSubmiting(true)
        try {
          telegramApi.post(
            '/sendPhoto',
            {
              photo: data.image_url,
              caption: telegramMessageFoward(data),
              chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
            },
            {
              timeout: 20000,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
        } catch (err) {
          console.log(err)
        }
        // router.refresh()

        await api.post(
          '/sales',
          { ...data, product_id: targetProduct?.id },
          {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          },
        )
        reset()
        setIsSubmiting(false)

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
      className="flex-1 space-y-8 py-6 dark:border-zinc-800 sm:border-r sm:pr-8"
      onSubmit={handleSubmit(submit)}
    >
      <fieldset className="flex flex-col">
        {!targetProduct ? (
          <span className="flex items-center justify-center gap-2 font-semibold text-amber-600">
            <MdWarningAmber /> Nenhum produto foi selecionado
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2 font-semibold text-green-600">
            <BsCheck /> Produto selecionado
          </span>
        )}
        <label>Título *</label>
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
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('html_url')}
        />
        {errors.html_url && (
          <span className="text-red-500">{errors.html_url.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Especificações</label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('specs')}
        />
        {errors.specs && (
          <span className="text-red-500">{errors.specs.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Cupom</label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('coupon')}
        />
        {errors.coupon && (
          <span className="text-red-500">{errors.coupon.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Destaque</label>
        <select
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('label')}
        >
          {labelOptions.map((label, index) => (
            <option key={index} value={label}>
              {label}
            </option>
          ))}
        </select>

        {errors.label && (
          <span className="text-red-500">{errors.label.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>Comentários</label>
        <textarea
          className="h-36 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('comments')}
        />
        {errors.comments && (
          <span className="text-red-500">{errors.comments.message}</span>
        )}
      </fieldset>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmiting}
          onClick={() => setSubmitOption('create')}
          className="mt-3 flex-1 rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors disabled:cursor-not-allowed hover:bg-violet-400"
        >
          Postar
        </button>

        {targetSale?.id && (
          <>
            <button
              type="submit"
              onClick={() => setSubmitOption('edit')}
              className="mt-3 flex-1  rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-violet-400"
            >
              Editar
            </button>
            <button
              type="submit"
              className="mt-3 flex-1  rounded-full bg-red-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-red-400"
              onClick={() => setSubmitOption('delete')}
            >
              Excluir
            </button>
          </>
        )}
      </div>
      <input
        className="hidden h-0 w-0"
        readOnly
        value={targetProduct ? targetProduct.id : ''}
      />
    </form>
  )
}
