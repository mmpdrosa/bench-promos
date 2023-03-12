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
          <Link href="/" title="Mouses" className="hover:underline">
            Mouses
          </Link>
          <Link href="/" title="Categorias" className="hover:underline">
            Categorias
          </Link>
          <Link href="/" title="Cupons" className="hover:underline">
            Cupons
          </Link>
          <Link href="/" title="Promoções" className="hover:underline">
            Promoções
          </Link>
          <Link href="/" title="Recomendados" className="hover:underline">
            Recomendados
          </Link>
          <Link href="/" title="Notebooks" className="hover:underline">
            Notebooks
          </Link>
        </div>

        <div className="border-y py-4 text-xl font-semibold border-white text-center">
          Encontre os produtos mais procurados em promoção aqui no Bench Promos
        </div>

        <div className="flex gap-2">
          <a
            href=""
            title="Youtube"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaYoutube className="text-2xl sm:text-4xl" />
          </a>
          <a
            href=""
            title="Instagram"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaInstagram className="text-2xl sm:text-4xl" />
          </a>
          <a
            href=""
            title="Telegram"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaTelegram className="text-2xl sm:text-4xl" />
          </a>
          <a
            href=""
            title="Discord"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaDiscord className="text-2xl sm:text-4xl" />
          </a>
          <a
            href=""
            title="Twitch"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaTwitch className="text-2xl sm:text-4xl" />
          </a>
          <a
            href=""
            title="Tiktok"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaTiktok className="text-2xl sm:text-4xl" />
          </a>
        </div>
      </div>
    </footer>
  )
}
