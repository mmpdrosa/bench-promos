import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Category {
  id: string
  name: string
}

interface CategoriesFormProps {
  targetCategory: Category | undefined
}

const categorySchema = z.object({
  name: z.string().min(1, 'A categoria deve possuir um nome válido.'),
})

type categoryData = z.infer<typeof categorySchema>

export default function CategoriesForm({
  targetCategory,
}: CategoriesFormProps) {
  const router = useRouter()
  const [submitOption, setSubmitOption] = useState<
    'create' | 'edit' | 'delete'
  >('create')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<categoryData>({ resolver: zodResolver(categorySchema) })

  useEffect(() => {
    setValue('name', targetCategory?.name || '')
  }, [targetCategory, setValue])

  async function submit(data: categoryData) {
    switch (submitOption) {
      case 'create':
        await api
          .post('/categories', data, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.refresh())
        break
      case 'edit':
        await api
          .patch(`/categories/${targetCategory?.id}`, data, {
            headers: {
              'api-key': process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(() => router.refresh())
        break
      case 'delete':
        await api
          .delete(`/categories/${targetCategory?.id}`, {
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
      className="sm:pr-8 py-6 flex-1 space-y-8 max-w-[810px] sm:border-r dark:border-zinc-800"
    >
      <fieldset className="flex flex-col">
        <label>Nome *</label>
        <input
          type="text"
          className="p-2 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
          {...register('name')}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </fieldset>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          onClick={() => setSubmitOption('create')}
          className="flex-1 px-4  mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-violet-500 hover:bg-violet-400"
        >
          Criar
        </button>

        {targetCategory?.id ? (
          <>
            <button
              type="submit"
              onClick={() => setSubmitOption('edit')}
              className="flex-1 px-4  mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-violet-500 hover:bg-violet-400"
            >
              Editar
            </button>
            <button
              onClick={() => setSubmitOption('delete')}
              className="flex-1 px-4  mt-3 py-2.5 text-xl rounded-full text-white transition-colors bg-red-500 hover:bg-red-400"
            >
              Excluir
            </button>
          </>
        ) : null}
      </div>

      <input name="retailer" className="hidden w-0 h-0" />
    </form>
  )
}
