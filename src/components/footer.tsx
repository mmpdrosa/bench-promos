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
          <Link
            href="/51d96dd7-5a1e-4fc6-83fd-c0de1745af3f"
            title="Notebooks"
            className="hover:underline"
          >
            Notebooks
          </Link>
          <Link
            href="/e42e0fd9-93c4-49cf-b6ea-5f8f0e9f7543"
            title="Mouses"
            className="hover:underline"
          >
            Mouses
          </Link>
          <Link href="/promocoes" title="Promoções" className="hover:underline">
            Promoções
          </Link>
          <Link href="/cupons" title="Cupons" className="hover:underline">
            Cupons
          </Link>
          <Link
            href="/recomendados"
            title="Recomendados"
            className="hover:underline"
          >
            Recomendados
          </Link>
        </div>

        <div className="border-y py-4 text-xl font-semibold border-white text-center">
          Encontre os produtos mais procurados em promoção aqui no Bench Promos
        </div>

        <div className="flex gap-2">
          <a
            href="https://www.youtube.com/@lucasishii"
            target="_blank"
            title="Youtube"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
            rel="noreferrer"
          >
            <FaYoutube className="text-2xl sm:text-4xl" />
          </a>
          <a
            href="https://www.instagram.com/lucas.ishii/"
            title="Instagram"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaInstagram className="text-2xl sm:text-4xl" />
          </a>
          <a
            href="https://t.me/BenchPromos"
            title="Telegram"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaTelegram className="text-2xl sm:text-4xl" />
          </a>
          <a
            href="https://discord.gg/cCD5PEjyjg"
            title="Discord"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaDiscord className="text-2xl sm:text-4xl" />
          </a>
          <a
            href="https://www.twitch.tv/lucasishii"
            title="Twitch"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
          >
            <FaTwitch className="text-2xl sm:text-4xl" />
          </a>
          <a
            href="https://www.tiktok.com/@lucas_ishii"
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
