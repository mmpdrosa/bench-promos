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

interface ProductRetailerRelation {
  price: number
  html_url: string
  dummy: string
  retailer: Retailer
}

interface Props {
  targetProductRetailer?: ProductRetailerRelation
  retailers: Retailer[]
  targetProductId?: string
}

const productRetailerSchema = z.object({
  retailer_id: z.string().min(1, 'O anunciante não deve ser nulo.'),
  html_url: z.string().url('O endereço URL do anúncio deve ser válido.'),
  price: z.number().min(1, 'O produto deve possuir um preço válido.'),
  dummy: z.string().optional(),
})

type productRetailerData = z.infer<typeof productRetailerSchema>

export default function ProductRetailerForm({
  targetProductRetailer,
  targetProductId,
  retailers,
}: Props) {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<productRetailerData>({
    resolver: zodResolver(productRetailerSchema),
  })
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  useEffect(() => {
    setValue('retailer_id', targetProductRetailer?.retailer.id || '')
    setValue('html_url', targetProductRetailer?.html_url || '')
    setValue('price', targetProductRetailer?.price || 0)
    setValue('dummy', targetProductRetailer?.dummy || '')
  }, [targetProductRetailer, setValue])

  async function submit(data: productRetailerData) {
    switch (submitOption) {
      case 'create':
        await api
          .post(
            `/products/${targetProductId}/retailers/${data.retailer_id}`,
            data,
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
            `/products/${targetProductId}/retailers/${data.retailer_id}`,
            data,
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
          .delete(
            `/products/${targetProductId}/retailers/${data.retailer_id}`,
            {
              headers: {
                'api-key': process.env.NEXT_PUBLIC_API_KEY,
              },
            },
          )
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
        <label>Anunciante *</label>
        <select
          disabled={!!targetProductRetailer}
          className="h-12 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900"
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
        <label>SKU (Aliexpress, Casas Bahia, Ponto Frio, Fastshop)</label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('dummy')}
        />
        {errors.dummy && (
          <span className="text-red-500">{errors.dummy.message}</span>
        )}
      </fieldset>
      {targetProductId ? (
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!!targetProductRetailer}
            className="mt-3 flex-1  rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors disabled:hidden hover:bg-violet-400"
            onClick={() => setSubmitOption('create')}
          >
            Vincular
          </button>

          {targetProductRetailer && (
            <>
              <button
                type="submit"
                className="mt-3 flex-1  rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-violet-400"
                onClick={() => setSubmitOption('edit')}
              >
                Editar
              </button>
              <button
                className="mt-3 flex-1  rounded-full bg-red-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-red-400"
                onClick={() => setSubmitOption('delete')}
              >
                Excluir
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center font-semibold text-violet-500">
          Selecione um produto
        </div>
      )}
      <input
        className="hidden h-0 w-0"
        value={targetProductId || ''}
        readOnly
      />
    </form>
  )
}
