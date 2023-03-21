import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import bannerPromotionsMobile from '@/assets/banner-1-mobile.png'
import bannerPromotions from '@/assets/banner-1.png'
import bannerTelegramMobile from '@/assets/banner-2-mobile.png'
import bannerTelegram from '@/assets/banner-2.png'
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
    <div className="max-w-screen-xl flex flex-col gap-8 py-8 mx-auto">
      <Slider {...settings}>
        <div className="relative h-[480px] max-sm:h-[512px] rounded-2xl overflow-hidden">
          <Image
            className="object-fill"
            src={isSm ? bannerPromotions : bannerPromotionsMobile}
            alt=""
            fill
          />
        </div>

        <div className="relative h-[480px] max-sm:h-[512px] rounded-2xl overflow-hidden">
          <Image
            className="object-fill"
            src={isSm ? bannerTelegram : bannerTelegramMobile}
            alt=""
            fill
          />
        </div>
      </Slider>
    </div>
  )
}
