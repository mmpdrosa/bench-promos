import RetailerForm from '@/components/Admin/RetailerForm'
import { AdminLayout } from '@/components/layouts/admin'
import { api } from '@/lib/axios'
import { getCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { BsX } from 'react-icons/bs'

interface Retailer {
  id: string
  name: string
  html_url: string
}

export default function RetailersAdmin({
  retailers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [targetRetailer, setTargetRetailer] = useState<Retailer | undefined>(
    undefined,
  )
  return (
    <AdminLayout>
      <Head>
        <title>Anunciantes | Bench Promos Admin</title>
      </Head>
      <div className="flex flex-1 max-sm:flex-col">
        <RetailerForm targetRetailer={targetRetailer} />
        <div className="flex flex-1 flex-col max-h-[calc(100vh-172px)] py-6 sm:pl-8 sm:pr-2">
          {targetRetailer ? (
            <>
              <label>Anunciante selecionado</label>
              <div className="flex flex-col py-4 px-2 rounded-lg bg-violet-500/80 text-white mb-8 relative">
                <button
                  className="absolute p-1 top-2 right-2 bg-red-500 rounded-lg hover:bg-red-400"
                  onClick={() => setTargetRetailer(undefined)}
                >
                  <BsX />
                </button>

                <h1 className="text-white font-semibold">
                  {targetRetailer?.name}
                </h1>
              </div>
            </>
          ) : null}
          <span className="pb-4">Selecione um anunciante</span>
          <div className="overflow-y-scroll sm:overscroll-none">
            {retailers.map((retailer) => (
              <div
                key={retailer.id}
                onClick={() => {
                  setTargetRetailer(retailer)
                }}
                className="relative group flex flex-col py-4 px-2 cursor-pointer rounded-lg hover:bg-violet-500/80 hover:text-white"
              >
                <h1 className="text-violet-600 group-hover:text-white font-semibold">
                  {retailer.name}
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
  retailers: Retailer[]
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

  const resRetailers = await api.get('/retailers')

  const retailers: Retailer[] = resRetailers.data

  return {
    props: {
      retailers,
    },
  }
}
