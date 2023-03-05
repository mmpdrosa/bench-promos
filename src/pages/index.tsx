import Image from 'next/image'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import bannerPromotionsMobile from '@/assets/banner-1-mobile.png'
import bannerPromotions from '@/assets/banner-1.png'
import bannerTelegramMobile from '@/assets/banner-2-mobile.png'
import bannerTelegram from '@/assets/banner-2.png'
import { ProductList } from '@/components/ProductList'
import { api } from '@/lib/axios'
import { Product } from '@/models'

const settings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000, // 3 seconds
}

interface HomeProps {
  products: Product[]
}

export default function Home({ products }: HomeProps) {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 mx-auto">
      <Slider
        {...settings}
        className="h-[480px] max-sm:h-[512px] rounded-2xl overflow-hidden"
      >
        <div className="relative h-[480px] max-sm:h-[512px] rounded-2xl overflow-hidden">
          <Image
            className="object-fill"
            src={windowWidth > 640 ? bannerPromotions : bannerPromotionsMobile}
            alt=""
            fill
          />
        </div>

        <div className="relative h-[480px] max-sm:h-[512px] rounded-2xl overflow-hidden">
          <Image
            className="object-fill"
            src={windowWidth > 640 ? bannerTelegram : bannerTelegramMobile}
            alt=""
            fill
          />
        </div>
      </Slider>

      <ProductList products={products} />
    </div>
  )
}

export async function getStaticProps() {
  const response = await api.get('/products/with-min-price/for-all')

  const products: Product[] = response.data

  return {
    props: {
      products,
    },
    revalidate: 60, // 1 minute
  }
}
