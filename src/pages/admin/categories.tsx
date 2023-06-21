import { AdminLayout } from '@/components/layouts/admin'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import { BsX } from 'react-icons/bs'
import CategoriesForm from '@/components/Admin/CategoriesForm'
import Head from 'next/head'

export default function CategoriesAdmin() {
  const { categories } = useCategory()
  const [targetCategory, setTargetCategory] = useState<
    { id: string; name: string } | undefined
  >(undefined)
  return (
    <AdminLayout>
      <Head>
        <title>Categorias | Bench Promos Admin</title>
      </Head>
      <div className="flex flex-1 max-sm:flex-col">
        <CategoriesForm targetCategory={targetCategory} />
        <div className="flex max-h-[calc(100vh-172px)] flex-1 flex-col py-6 sm:pl-8 sm:pr-2">
          {targetCategory ? (
            <>
              <label>Categoria selecionada</label>
              <div className="relative mb-8 flex flex-col rounded-lg bg-violet-500/80 px-2 py-4 text-white">
                <button
                  className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
                  onClick={() => setTargetCategory(undefined)}
                >
                  <BsX />
                </button>

                <h1 className="font-semibold text-white">
                  {targetCategory?.name}
                </h1>
              </div>
            </>
          ) : null}
          <span className="pb-4">Selecione uma categoria</span>
          <div className="overflow-y-scroll sm:overscroll-none">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setTargetCategory(category)
                }}
                className="group relative flex cursor-pointer flex-col rounded-lg px-2 py-4 hover:bg-violet-500/80 hover:text-white"
              >
                <h1 className="font-semibold text-violet-600 group-hover:text-white">
                  {category.name}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  categories: { id: string; name: string }
}> = async (ctx) => {
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

  const resCoupons = await api.get('/retailers')

  const categories: { id: string; name: string } = resCoupons.data

  return {
    props: {
      categories,
    },
  }
}
