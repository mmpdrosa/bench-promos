import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import Link from 'next/link'

import bannerSalesMobile from '@/assets/banner-1-mobile.png'
import bannerSales from '@/assets/banner-1.png'
import bannerTelegramMobile from '@/assets/banner-2-mobile.png'
import bannerTelegram from '@/assets/banner-2.png'
import notebooksImg from '@/assets/notebooks.png'
import promosImg from '@/assets/promos.png'
import recomendadosImg from '@/assets/recomendados.png'
import cuponsImg from '@/assets/cupons.png'
import { useMediaQuery } from '@/hooks/use-media-query'

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

export default function Home() {
  const isSm = useMediaQuery('(min-width: 640px)')

  return (
    <div className="max-w-screen-xl flex flex-col gap-16 py-8 mx-auto">
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

      <div className="flex flex-wrap justify-between max-sm:justify-center gap-6">
        <Link href="/51d96dd7-5a1e-4fc6-83fd-c0de1745af3f" className="relative">
          <div className="relative w-64 aspect-square rounded-2xl overflow-hidden">
            <Image
              className="object-cover contrast-50"
              src={notebooksImg}
              alt=""
              fill
              priority
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-center">
            <span className="text-white text-3xl font-bold">Notebooks</span>
          </div>
        </Link>

        <Link href="/promocoes" className="relative">
          <div className="relative w-64 aspect-square rounded-2xl overflow-hidden">
            <Image
              className="object-cover contrast-50"
              src={promosImg}
              alt=""
              fill
              priority
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-center">
            <span className="text-white text-3xl font-bold">Promoções</span>
          </div>
        </Link>

        <Link href="/recomendados" className="relative">
          <div className="relative w-64 aspect-square rounded-2xl overflow-hidden">
            <Image
              className="object-cover contrast-50"
              src={recomendadosImg}
              alt=""
              fill
              priority
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-center">
            <span className="text-white text-3xl font-bold">Recomendados</span>
          </div>
        </Link>

        <Link href="/cupons" className="relative">
          <div className="relative w-64 aspect-square rounded-2xl overflow-hidden">
            <Image
              className="object-cover contrast-50"
              src={cuponsImg}
              alt=""
              fill
              priority
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-center">
            <span className="text-white text-3xl font-bold">Cupons</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
