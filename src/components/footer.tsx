import Link from 'next/link'
import {
  FaDiscord,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaYoutube,
} from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="px-8 p-8 max-sm:px-4 text-white bg-zinc-800">
      <div className="max-w-screen-xl grid gap-6 mx-auto">
        <div className="w-max flex flex-col text-lg">
          <span className="text-xl font-bold text-violet-500">Destaques</span>
          <Link href="/" className="hover:underline">
            Mouses
          </Link>
          <Link href="/" className="hover:underline">
            Categorias
          </Link>
          <Link href="/" className="hover:underline">
            Cupons
          </Link>
          <Link href="/" className="hover:underline">
            Promoções
          </Link>
          <Link href="/" className="hover:underline">
            Recomendados
          </Link>
          <Link href="/" className="hover:underline">
            Notebooks
          </Link>
        </div>

        <div className="border-y py-4 text-xl font-semibold border-white text-center">
          Encontre os produtos mais procurados em promoção aqui no Bench Promos
        </div>

        <div className="flex gap-4">
          <a href="">
            <FaYoutube className="text-5xl hover:text-6xl" />
          </a>
          <a href="">
            <FaInstagram className="text-5xl hover:text-6xl" />
          </a>
          <a href="">
            <FaTelegram className="text-5xl hover:text-6xl" />
          </a>
          <a href="">
            <FaDiscord className="text-5xl hover:text-6xl" />
          </a>
          <a href="">
            <FaTwitch className="text-5xl hover:text-6xl" />
          </a>
          <a href="">
            <FaTiktok className="text-5xl hover:text-6xl" />
          </a>
        </div>
      </div>
    </footer>
  )
}
