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
        <div className="flex max-h-[calc(100vh-172px)] flex-1 flex-col py-6 sm:pl-8 sm:pr-2">
          {targetRetailer ? (
            <>
              <label>Anunciante selecionado</label>
              <div className="relative mb-8 flex flex-col rounded-lg bg-violet-500/80 px-2 py-4 text-white">
                <button
                  className="absolute right-2 top-2 rounded-lg bg-red-500 p-1 hover:bg-red-400"
                  onClick={() => setTargetRetailer(undefined)}
                >
                  <BsX />
                </button>

                <h1 className="font-semibold text-white">
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
                className="group relative flex cursor-pointer flex-col rounded-lg px-2 py-4 hover:bg-violet-500/80 hover:text-white"
              >
                <h1 className="font-semibold text-violet-600 group-hover:text-white">
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
