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
    <footer className="mt-auto text-white bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="w-max flex flex-col gap-1 pt-8 mb-4 max-xl:px-6 text-sm">
          <span className="text-sm font-bold text-violet-500">Destaques</span>
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

        <div className="border-y p-6 text-sm font-semibold border-white/50 text-center">
          Encontre os produtos mais procurados em promoção aqui no Bench Promos
        </div>

        <div className="flex max-sm:justify-between gap-2 py-6 max-xl:px-6">
          <a
            href="https://www.youtube.com/@lucasishii"
            target="_blank"
            title="Youtube"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
            rel="noreferrer"
          >
            <FaYoutube className="text-2xl" />
          </a>
          <a
            href="https://www.instagram.com/lucas.ishii/"
            title="Instagram"
            target="_blank"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
            rel="noreferrer"
          >
            <FaInstagram className="text-2xl" />
          </a>
          <a
            href="https://t.me/BenchPromos"
            title="Telegram"
            target="_blank"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
            rel="noreferrer"
          >
            <FaTelegram className="text-2xl" />
          </a>
          <a
            href="https://discord.gg/cCD5PEjyjg"
            title="Discord"
            target="_blank"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
            rel="noreferrer"
          >
            <FaDiscord className="text-2xl" />
          </a>
          <a
            href="https://www.twitch.tv/lucasishii"
            title="Twitch"
            target="_blank"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
            rel="noreferrer"
          >
            <FaTwitch className="text-2xl" />
          </a>
          <a
            href="https://www.tiktok.com/@lucas_ishii"
            title="Tiktok"
            target="_blank"
            className="p-2 rounded-full transition-colors hover:bg-zinc-600"
            rel="noreferrer"
          >
            <FaTiktok className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  )
}
