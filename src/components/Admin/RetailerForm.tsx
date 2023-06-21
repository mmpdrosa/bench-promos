import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Retailer {
  id: string
  name: string
  html_url: string
}

interface RetailerFormProps {
  targetRetailer: Retailer | undefined
}

const retailerSchema = z.object({
  name: z.string().min(1, 'O anunciante deve possuir um nome válido.'),
  html_url: z.string().url('O anunciante deve possuir um endereço URL válido.'),
})

type retailerData = z.infer<typeof retailerSchema>

export default function RetailerForm({ targetRetailer }: RetailerFormProps) {
  const router = useRouter()
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<retailerData>({ resolver: zodResolver(retailerSchema) })

  useEffect(() => {
    setValue('name', targetRetailer?.name || '')
    setValue('html_url', targetRetailer?.html_url || '')
  }, [targetRetailer, setValue])

  async function submit(data: retailerData) {
    switch (submitOption) {
      case 'create':
        await api
          .post('/retailers', data, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.refresh())
        break
      case 'edit':
        await api
          .patch(`/retailers/${targetRetailer?.id}`, data, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.refresh())
        break
      case 'delete':
        await api
          .delete(`/retailers/${targetRetailer?.id}`, {
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
      onSubmit={handleSubmit(submit)}
      className="max-w-[810px] flex-1 space-y-8 py-6 dark:border-zinc-800 sm:border-r sm:pr-8"
    >
      <fieldset className="flex flex-col">
        <label>Nome *</label>
        <input
          type="text"
          className="rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('name')}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </fieldset>

      <fieldset className="flex flex-col justify-between">
        <label>Endereço URL * (ex: https://www.amazon.com.br)</label>
        <input
          type="text"
          className="h-12 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
          {...register('html_url')}
        />
        {errors.html_url && (
          <span className="text-red-500">{errors.html_url.message}</span>
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

        {targetRetailer?.id ? (
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
    </form>
  )
}
