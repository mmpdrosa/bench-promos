import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import NumericPriceInput from './NumericPriceInput'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'

interface Retailer {
  id: string
  name: string
}
interface Coupon {
  id: string
  available: boolean
  code: string
  discount: string
  minimum_spend: number
  comments: string
  description: string
  retailer: Retailer
}
interface CouponFormProps {
  retailers: Retailer[]
  targetCoupon: Coupon | undefined
}

const couponSchema = z.object({
  code: z
    .string()
    .min(1, 'O cupom deve possuir um código válido.')
    .transform((code) => code.toUpperCase()),
  retailer_id: z.string().min(1, 'O anunciante deve ser válido.'),
  discount: z.string().min(1, 'O desconto oferecido deve ser válido.'),
  minimum_spend: z
    .number()
    .transform((value) => value / 100)
    .optional(),
  comments: z.string().optional(),
  available: z.boolean(),
})

type couponData = z.infer<typeof couponSchema>

export default function CouponForm({
  targetCoupon,
  retailers,
}: CouponFormProps) {
  const router = useRouter()
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<couponData>({
    resolver: zodResolver(couponSchema),
  })

  useEffect(() => {
    setValue('retailer_id', targetCoupon?.retailer.id || '')
    setValue('code', targetCoupon?.code || '')
    setValue('discount', targetCoupon?.discount || '')
    setValue(
      'minimum_spend',
      (targetCoupon && targetCoupon.minimum_spend * 100) || 0,
    )
    setValue('comments', targetCoupon?.comments || '')
    setValue('available', targetCoupon ? targetCoupon.available : true)
  }, [targetCoupon, setValue])

  async function submit(data: couponData) {
    switch (submitOption) {
      case 'create':
        await api
          .post('/coupons', data, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.refresh())
        break
      case 'edit':
        await api
          .patch(`/coupons/${targetCoupon?.id}`, data, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.refresh())
        break
      case 'delete':
        await api
          .delete(`/coupons/${targetCoupon?.id}`, {
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
      className="max-w-[810px] flex-1 space-y-8 py-6 dark:border-zinc-800 sm:border-r sm:pr-8"
      onSubmit={handleSubmit(submit)}
    >
      <fieldset className="flex flex-col">
        <label>Anunciante *</label>
        <select
          className="h-12 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('retailer_id')}
        >
          <option value=""></option>
          {retailers.map((retailer) => {
            return (
              <option key={retailer.id} value={retailer.id}>
                {retailer.name}
              </option>
            )
          })}
        </select>
        {errors.retailer_id && (
          <span className="text-red-500">{errors.retailer_id.message}</span>
        )}
      </fieldset>
      <fieldset className="flex flex-col">
        <label>Código *</label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('code')}
        />
        {errors.code && (
          <span className="text-red-500">{errors.code.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col">
        <label>
          Desconto * (&quot;5&quot; para R$ 5,00 ou &quot;5%&quot; para 5%)
        </label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('discount')}
        />
        {errors.discount && (
          <span className="text-red-500">{errors.discount.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Valor mínimo (opcional)</label>
        <Controller
          name="minimum_spend"
          control={control}
          render={({ field: { value, onChange } }) => (
            <NumericPriceInput
              name="minimum_spend"
              onChange={onChange}
              value={value}
            />
          )}
        />
        {errors.minimum_spend && (
          <span className="text-red-500">{errors.minimum_spend.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Descrição (opcional)</label>
        <textarea
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('comments')}
        />
        {errors.comments && (
          <span className="text-red-500">{errors.comments.message}</span>
        )}
      </fieldset>

      <fieldset className="flex justify-between">
        <label>Disponibilidade *</label>
        <input
          type="checkbox"
          className="h-6 w-6 cursor-pointer"
          {...register('available')}
        />
        {errors.available && (
          <span className="text-red-500">{errors.available.message}</span>
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

        {targetCoupon?.id ? (
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
              className="mt-3 flex-1  rounded-full bg-red-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-red-400"
            >
              Excluir
            </button>
          </>
        ) : null}
      </div>
      {/* <input className="hidden w-0 h-0" {...register('retailer_id')} /> */}
    </form>
  )
}
