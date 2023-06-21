import { CircularProgress } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useQuery } from 'react-query'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAuth } from '@/contexts/AuthContext'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { ProductAlert } from '@/models'
import { priceFormatter } from '@/utils/formatter'

type CategoryAlert = {
  id: string
  category: {
    id: string
    name: string
  }
}

export default function Alerts() {
  const { user } = useAuth()
  const { categories } = useCategory()

  const {
    data: alerts,
    isLoading,
    refetch,
  } = useQuery(
    'alerts',
    async () => {
      if (!user) return

      const token = await user.getIdToken()

      const productAlertsPromise = api.get(
        '/users/product-notifications/for-all',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const categoryAlertsPromise = api.get(
        '/users/category-notifications/for-all',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      const [productAlertsResponse, categoryAlertsResponse] = await Promise.all(
        [productAlertsPromise, categoryAlertsPromise],
      )

      const productAlerts: ProductAlert[] = productAlertsResponse.data
      const categoryAlerts: CategoryAlert[] = categoryAlertsResponse.data

      return { productAlerts, categoryAlerts }
    },
    { refetchOnWindowFocus: false },
  )

  const productAlerts = alerts?.productAlerts
  const categoryAlerts = alerts?.categoryAlerts

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleProductAlertDelete(productId: string) {
    const token = await user!.getIdToken()

    try {
      await api.delete(`/users/unnotify-product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {}

    queryClient.invalidateQueries('alerts')
  }

  const handleCategoryClick = async (categoryId: string) => {
    const token = await user!.getIdToken()

    try {
      await api.post(
        `/users/toggle-category-notification/${categoryId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    } catch (err) {}

    queryClient.invalidateQueries('alerts')
  }

  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <CircularProgress className="text-violet-500" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Alertas | Bench Promos</title>
      </Head>
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 py-8 max-xl:px-4">
        <Breadcrumbs />

        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              disabled={!user}
              className={`mr-2 h-8 rounded-full border border-zinc-300 px-4 py-1 text-sm font-medium transition-colors disabled:bg-zinc-50 disabled:text-black/50 dark:border-zinc-700 ${
                categoryAlerts?.find(
                  (categoryAlert) => categoryAlert.category.id === category.id,
                )
                  ? 'border-opacity-0 bg-violet-500 text-white hover:bg-violet-400'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="mx-1">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="w-max">
          <h2 className="text-xl font-extrabold text-violet-600">
            ALERTAS DE PREÇOS
          </h2>
          <div className="h-2 w-3/4 rounded-full bg-violet-600"></div>
        </div>

        {productAlerts?.length ? (
          <div className="grid grid-cols-2 flex-col gap-4 max-lg:flex">
            {productAlerts.map((productAlert) => (
              <div key={productAlert.id}>
                <div className="flex gap-3.5 rounded-t-xl border border-b-0 border-zinc-300 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-800 max-sm:flex-col">
                  <div className="sm:w-2/5">
                    <div className="relative mx-auto aspect-square w-full max-w-[192px]">
                      <Image
                        className="object-contain"
                        alt=""
                        src={productAlert.product.image_url}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    </div>
                    <span className="line-clamp-3 block max-h-[72px] px-1.5 text-center md:h-[72px]">
                      {productAlert.product.title}
                    </span>
                  </div>
                  <div className="space-y-4 self-center sm:w-3/5">
                    <div className="text-center">
                      <span className="block text-lg font-bold text-violet-500">
                        PREÇO ATUAL
                      </span>
                      <span className="text-xl font-bold">
                        {priceFormatter.format(
                          productAlert.product.price / 100,
                        )}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-lg font-bold text-violet-500">
                        PREÇO DO ALERTA
                      </span>
                      <span className="text-xl font-bold">
                        {priceFormatter.format(productAlert.price / 100)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-b-xl bg-violet-500 px-2.5 py-1.5 font-medium text-white">
                  <Link
                    href={`/produto/${productAlert.product.id}#price-history`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <FaEdit />
                    Editar Alerta
                  </Link>
                  <a
                    onClick={() =>
                      handleProductAlertDelete(productAlert.product.id)
                    }
                    className="flex cursor-pointer items-center gap-2 hover:underline"
                  >
                    Excluir
                    <FaTrash />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <strong>Parece que você não tem nenhum alerta...</strong>
        )}
      </div>
    </>
  )
}
