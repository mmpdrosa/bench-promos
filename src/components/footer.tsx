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
    <footer className="text-white bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 gap-4 pt-12 mb-4 max-xl:px-6">
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-bold text-violet-500">Destaques</span>
            <Link
              href="/52e0e282-ba6f-4b33-8399-a40bd5969f85"
              title="Notebooks"
              className="hover:underline"
            >
              Notebooks
            </Link>
            <Link
              href="/bb09f4e5-20b6-473f-99de-f7de29f44394"
              title="Mouses"
              className="hover:underline"
            >
              Mouses
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
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-bold text-violet-500">
              O Bench Promos
            </span>
            <Link href="/politica-de-privacidade" className="hover:underline">
              Política de Privacidade
            </Link>
          </div>
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
