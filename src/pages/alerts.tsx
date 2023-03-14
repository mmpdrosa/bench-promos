import Image from 'next/image'
import { useQuery } from 'react-query'

import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/axios'
import { ProductAlert } from '@/models'
import { priceFormatter } from '@/utils/formatter'
import { queryClient } from '@/lib/react-query'
import Link from 'next/link'

export default function Alerts() {
  const { user } = useAuth()

  const { data: productAlerts } = useQuery('product-alerts', async () => {
    if (!user) return []

    const token = await user.getIdToken()

    const response = await api.get('/users/product-notifications/for-all', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const productAlerts: ProductAlert[] = response.data

    return productAlerts
  })

  async function handleProductAlertDelete(product_id: string) {
    const token = await user!.getIdToken()

    await api.delete(`users/unnotify-product/${product_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    queryClient.invalidateQueries('product-alerts')
  }

  return (
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 mx-auto">
      <div className="w-max">
        <h2 className="text-2xl font-extrabold text-violet-600">
          ALERTAS DE PREÇOS
        </h2>
        <div className="w-3/4 h-2 rounded-full bg-violet-600"></div>
      </div>

      {productAlerts?.length ? (
        <div className="flex flex-wrap gap-4">
          {productAlerts?.map((productAlert) => (
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
                  <span className="h-20 block px-1.5 text-center line-clamp-3">
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
