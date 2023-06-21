import SubcategoriesForm from '@/components/Admin/SubcategoriesForm'
import { AdminLayout } from '@/components/layouts/admin'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'
import { Category } from '@/models'
import { getCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { BsX } from 'react-icons/bs'

interface Subcategory {
  id: string
  name: string
}

export default function SubcategoriesAdmin({
  subcategories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { categories } = useCategory()
  const [targetCategory, setTargetCategory] = useState<Category | undefined>(
    undefined,
  )
  const [targetSubcategory, setTargetSubcategory] = useState<
    Subcategory | undefined
  >(undefined)

  const [switchCategoryOrSubcategory, setSwitchCategoryOrSubcategory] =
    useState<string>('categories')

  return (
    <AdminLayout>
      <Head>
        <title>Subcategorias | Bench Promos Admin</title>
      </Head>
      <div className="flex flex-1 max-sm:flex-col">
        <SubcategoriesForm
          targetSubcategory={targetSubcategory}
          targetCategoryId={targetCategory?.id}
        />
        {switchCategoryOrSubcategory === 'categories' ? (
          <div className="flex max-h-[calc(100vh-172px)] flex-1 flex-col py-6 sm:pl-8 sm:pr-2">
            <div className="flex items-center justify-center gap-6 pb-4">
              <button className="border-b-2 border-violet-500 font-semibold text-violet-500">
                Categorias
              </button>
              <button
                className="hover:text-violet-500"
                onClick={() => setSwitchCategoryOrSubcategory('subcategories')}
              >
                Subcategorias
              </button>
            </div>
            {targetCategory && (
              <>
                <label>Categogira selecionada</label>
                <div className="relative mb-8 flex flex-col items-start rounded-lg bg-violet-500/80 px-2 py-4 text-white">
                  <button
                    className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
                    onClick={() => {
                      setTargetCategory(undefined)
                      setTargetSubcategory(undefined)
                    }}
                  >
                    <BsX />
                  </button>

                  <h1 className="font-semibold text-white">
                    {targetCategory.name}
                  </h1>
                </div>
              </>
            )}
            <span className="pb-4">Selecione uma categoria</span>
            <div className="overflow-y-scroll sm:overscroll-none">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => {
                    setTargetCategory(category)
                    setTargetSubcategory(undefined)
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
        ) : (
          <div className="flex max-h-[calc(100vh-172px)] flex-1 flex-col py-6 sm:pl-8 sm:pr-2">
            <div className="flex items-center justify-center gap-6 pb-4">
              <button
                className="hover:text-violet-500"
                onClick={() => setSwitchCategoryOrSubcategory('categories')}
              >
                Categorias
              </button>
              <button className="border-b-2 border-violet-500 font-semibold text-violet-500">
                Subcategorias
              </button>
            </div>
            {targetSubcategory && (
              <>
                <label>Subcategoria selecionada</label>
                <div className="relative mb-8 flex flex-col items-start rounded-lg bg-violet-500/80 px-2 py-4 text-white">
                  <button
                    className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
                    onClick={() => setTargetSubcategory(undefined)}
                  >
                    <BsX />
                  </button>

                  <h1 className="font-semibold text-white">
                    {targetSubcategory.name}
                  </h1>
                </div>
              </>
            )}
            <span className="pb-4">Selecione uma subcategoria</span>
            <div className="overflow-y-scroll">
              {targetCategory?.subcategories?.map((subcategory) => (
                <div
                  key={subcategory.id}
                  onClick={() => {
                    setTargetSubcategory(subcategory)
                  }}
                  className="group relative flex cursor-pointer flex-col items-start justify-start rounded-lg px-2 py-4 hover:bg-violet-500/80 hover:text-white"
                >
                  <h1 className="font-semibold text-violet-600 group-hover:text-white">
                    {subcategory.name}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps<{
  subcategories: Subcategory[]
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

  const resSubcategories = await api.get('/subcategories')

  const subcategories: Subcategory[] = resSubcategories.data

  return {
    props: {
      subcategories,
    },
  }
}
