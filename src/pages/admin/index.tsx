import { zodResolver } from '@hookform/resolvers/zod'
import { getCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ExpandedProductSaleCard } from '@/components/ExpandedProductSaleCard'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'

const newSaleSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().url(),
  htmlUrl: z.string().url(),
  price: z.number().int().min(1),
  categoryId: z.string(),
  specs: z.string().optional(),
  comments: z.string().optional(),
  coupon: z.string().optional(),
})

type NewSaleFormInput = z.infer<typeof newSaleSchema>

export default function CreateSale() {
  const { register, handleSubmit, watch, reset } = useForm<NewSaleFormInput>({
    resolver: zodResolver(newSaleSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      htmlUrl: '',
      price: 0,
    },
  })

  const { categories } = useCategory()

  async function handleNewSale({
    imageUrl,
    htmlUrl,
    categoryId,
    ...rest
  }: NewSaleFormInput) {
    try {
      await api.post('/sales', {
        image_url: imageUrl,
        html_url: htmlUrl,
        category_id: categoryId,
        ...rest,
      })

      reset()
    } catch (err) {}
  }

  const newSale = watch()

  return (
    <div className="max-w-screen-xl space-y-12 py-8 mx-auto">
      <div className="w-max">
        <h2 className="text-2xl font-extrabold text-violet-600">
          ADICIONAR PROMOÇÃO
        </h2>
        <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
      </div>

      <ExpandedProductSaleCard
        id="admin"
        title={newSale.title}
        image_url={newSale.imageUrl}
        html_url={newSale.htmlUrl}
        price={newSale.price}
        specs={newSale.specs}
        comments={newSale.comments}
        coupon={newSale.coupon}
        category={{
          id: newSale.categoryId,
          name:
            categories.find(({ id }) => id === newSale.categoryId)?.name ?? '',
        }}
        created_at={new Date()}
      />

      <form
        className="max-md:flex flex-col grid grid-cols-2 gap-8"
        onSubmit={handleSubmit(handleNewSale)}
      >
        <InputField label="Título" name="title" register={register} />

        <fieldset className="flex flex-col justify-start">
          <label
            className="block mb-1.5 text-xl font-medium tracking-wider"
            htmlFor="category"
          >
            Categoria
          </label>
          <select
            className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
            id="category"
            {...register('categoryId')}
          >
            <option value=""></option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </fieldset>

        <InputField
          label="Link da Imagem"
          name="imageUrl"
          register={register}
          type="url"
        />

        <InputField label="Link do Site" name="htmlUrl" register={register} />

        <fieldset className="flex flex-col justify-start">
          <label
            className="block mb-1.5 text-xl font-medium tracking-wider"
            htmlFor="price"
          >
            Preço
          </label>
          <input
            className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
            id="price"
            {...register('price', { valueAsNumber: true })}
          />
        </fieldset>

        <InputField label="Especificações" name="specs" register={register} />

        <fieldset className="flex flex-col justify-start">
          <label
            className="block mb-1.5 text-xl font-medium tracking-wider"
            htmlFor="comments"
          >
            Comentários
          </label>
          <textarea
            className="h-16 p-3.5 text-lg outline-none border border-black/20 shadow-md focus:ring-violet-500 focus:border-violet-500"
            id="comments"
            {...register('comments')}
          />
        </fieldset>

        <InputField label="Cupom" name="coupon" register={register} />

        <button
          className="col-span-2 mx-auto px-4 py-2.5 text-xl rounded-full text-white transition-colors bg-violet-500 hover:bg-violet-400"
          type="submit"
        >
          Adicionar
        </button>
      </form>
    </div>
  )
}

function InputField({
  label,
  name,
  register,
  ...rest
}: {
  label: string
  name: keyof NewSaleFormInput
  register: any
  [key: string]: any
}) {
  return (
    <fieldset className="flex flex-col justify-start">
      <label
        className="block mb-1.5 text-xl font-medium tracking-wider"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="h-16 px-3.5 text-lg outline-none border border-black/20 rounded-full shadow-md focus:ring-violet-500 focus:border-violet-500"
        id={name}
        {...register(name)}
        {...rest}
      />
    </fieldset>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getCookie('bench-promos.token', ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const response = await api.get('/users/role/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const isAdmin = response.data

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
