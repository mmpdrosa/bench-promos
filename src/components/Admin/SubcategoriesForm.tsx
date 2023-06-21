import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Subcategory {
  id: string
  name: string
}

interface SubcategoriesFormProps {
  targetSubcategory?: Subcategory
  targetCategoryId?: string
}

const subcategorySchema = z.object({
  name: z.string().min(1, 'A subcategoria deve possuir um nome válido.'),
})

type subcategoryData = z.infer<typeof subcategorySchema>

export default function SubcategoriesForm({
  targetSubcategory,
  targetCategoryId,
}: SubcategoriesFormProps) {
  const router = useRouter()
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<subcategoryData>({ resolver: zodResolver(subcategorySchema) })

  useEffect(() => {
    setValue('name', targetSubcategory?.name || '')
  }, [targetSubcategory, setValue])

  async function submit(data: subcategoryData) {
    switch (submitOption) {
      case 'create':
        await api
          .post(
            '/subcategories',
            {
              ...data,
              category_id: targetCategoryId,
            },
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
            `/subcategories/${targetSubcategory?.id}`,
            {
              ...data,
              category_id: targetCategoryId,
            },
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
          .delete(`/subcategories/${targetSubcategory?.id}`, {
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

      {targetCategoryId ? (
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="mt-3 flex-1 rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-violet-400"
            onClick={() => setSubmitOption('create')}
          >
            Criar
          </button>

          {targetSubcategory && (
            <>
              <button
                type="submit"
                className="mt-3 flex-1 rounded-full bg-violet-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-violet-400"
                onClick={() => setSubmitOption('edit')}
              >
                Editar
              </button>
              <button
                className="mt-3 flex-1 rounded-full bg-red-500 px-4 py-2.5 text-xl text-white transition-colors hover:bg-red-400"
                onClick={() => setSubmitOption('delete')}
              >
                Excluir
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center font-semibold text-violet-500">
          Selecione uma categoria
        </div>
      )}
      <input
        className="hidden h-0 w-0"
        readOnly
        value={targetCategoryId || ''}
      />
    </form>
  )
}
