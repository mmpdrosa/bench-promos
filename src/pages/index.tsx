import { GetServerSideProps, InferGetServerSidePropsType, Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { useQuery } from 'react-query'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import bannerSalesMobile from '@/assets/banner-1-mobile.png'
import bannerSales from '@/assets/banner-1.png'
import bannerTelegramMobile from '@/assets/banner-2-mobile.png'
import bannerTelegram from '@/assets/banner-2.png'
import { CompactProductSaleCard } from '@/components/CompactProductSaleCard'
import { useMediaQuery } from '@/hooks/use-media-query'
import { api } from '@/lib/axios'
import { Sale } from '@/models'

export const metadata: Metadata = {
  title: 'Home',
  description: '',
}

const settings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000, // 5 seconds
}

export default function Home({
  sales: initialSales,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isSm = useMediaQuery('(min-width: 640px)')

  const { data: sales } = useQuery({
    queryKey: ['sales', 'home'],
    queryFn: async () => {
      const response = await api.get('/sales?skip=0&take=4')
      const sales: Sale[] = response.data

      return sales
    },
    initialData: initialSales,
    refetchOnWindowFocus: false,
  })

  return (
    <>
      <Head>
        <title>Bench Promos</title>
      </Head>
      <div className="max-w-screen-xl flex flex-col gap-16 py-8 max-xl:px-4 mx-auto">
        <Slider {...settings}>
          <Link href="/promocoes">
            <div className="relative h-[480px] max-sm:h-[512px] rounded-2xl overflow-hidden">
              <Image
                className="object-fill"
                src={isSm ? bannerSales : bannerSalesMobile}
                alt=""
                fill
                priority
              />
            </div>
          </Link>

          <a href="https://t.me/BenchPromos" target="_blank" rel="noreferrer">
            <div className="relative h-[480px] max-sm:h-[512px] rounded-2xl overflow-hidden">
              <Image
                className="object-fill"
                src={isSm ? bannerTelegram : bannerTelegramMobile}
                alt=""
                fill
                priority
              />
            </div>
          </a>
        </Slider>

        <div className="space-y-8">
          <div className="flex justify-between">
            <div className="w-max">
              <h2 className="text-xl uppercase font-extrabold text-violet-600">
                PROMOÇÕES
              </h2>
              <div className="w-3/4 h-2 rounded-full bg-violet-600" />
            </div>
            <div className="flex items-center gap-2 text-violet-600">
              <Link href="/promocoes" className="font-medium hover:underline">
                Ver mais
              </Link>
              <FaArrowRight />
            </div>
          </div>

          <div className="grid grid-cols-fill justify-center gap-8">
            {sales?.map((sale) => (
              <CompactProductSaleCard
                key={sale.id}
                id={sale.id}
                title={sale.title}
                html_url={sale.html_url}
                image_url={sale.image_url}
                price={sale.price}
                coupon={sale.coupon}
                specs={sale.specs}
                created_at={sale.created_at}
                reactions={sale.reactions}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  sales: Sale[]
}> = async () => {
  const response = await api.get('/sales?skip=0&take=4')
  const sales: Sale[] = response.data

  return {
    props: {
      sales,
    },
  }
}
