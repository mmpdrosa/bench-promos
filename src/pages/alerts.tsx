import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { useAuth } from '@/contexts/AuthContext'
import { useCategory } from '@/contexts/CategoryContext'
import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { ProductAlert } from '@/models'
import { priceFormatter } from '@/utils/formatter'
import { CircularProgress } from '@mui/material'

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

    await api.delete(`/users/unnotify-product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    queryClient.invalidateQueries('alerts')
  }

  const handleCategoryClick = async (categoryId: string) => {
    const token = await user!.getIdToken()

    await api.post(
      `/users/toggle-category-notification/${categoryId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

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
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 mx-auto">
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            disabled={!user}
            className={`h-8 py-1 px-4 mr-2 border rounded-full text-sm font-medium transition-colors border-zinc-300 disabled:text-black/50 disabled:bg-zinc-50 ${
              categoryAlerts?.find(
                (categoryAlert) => categoryAlert.category.id === category.id,
              )
                ? 'bg-violet-500 text-white border-opacity-0 hover:bg-violet-400'
                : 'hover:bg-zinc-50'
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className="mx-1">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="w-max">
        <h2 className="text-2xl font-extrabold text-violet-600">
          ALERTAS DE PREÇOS
        </h2>
        <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
      </div>

      {productAlerts?.length ? (
        <div className="flex flex-wrap gap-4">
          {productAlerts.map((productAlert) => (
            <div key={productAlert.id} className="rounded-xl overflow-hidden">
              <div className="w-96 grid grid-cols-2 pb-2.5 bg-white">
                <div className="grid gap-2">
                  <div className="relative w-full h-48 max-sm:h-80">
                    <Image
                      className="object-contain"
                      alt=""
                      src={productAlert.product.image_url}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                  <span className="h-[72px] block px-1.5 text-center line-clamp-3">
                    {productAlert.product.title}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center p-1">
                  <span className="text-lg font-bold text-violet-500">
                    PREÇO DO ALERTA
                  </span>
                  <span className="text-xl font-bold">
                    {priceFormatter.format(productAlert.price / 100)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center px-2.5 py-1.5 text-white bg-violet-400">
                <Link
                  href={`/product/${productAlert.product.id}`}
                  className="hover:underline"
                >
                  Editar Alerta
                </Link>
                <a
                  onClick={() =>
                    handleProductAlertDelete(productAlert.product.id)
                  }
                  className="cursor-pointer hover:underline"
                >
                  Excluir
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <strong>Parece que você não tem nenhum alerta...</strong>
      )}
    </div>
  )
}
