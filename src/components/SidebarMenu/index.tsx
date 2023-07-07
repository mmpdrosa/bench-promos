import Link from 'next/link'
import { useRef, useState } from 'react'
import { FaBars } from 'react-icons/fa'

import { useCategory } from '@/contexts/CategoryContext'

export function SidebarMenu() {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const sidebarRef = useRef<HTMLHtmlElement>(null)

  const { categories } = useCategory()

  function handleToggleSidebar() {
    setToggleSidebar((prev) => !prev)
  }

  return (
    <>
      <button
        className="dark:text-zinc-200 sm:hidden"
        onClick={handleToggleSidebar}
      >
        <FaBars />
      </button>

      <div
        onClick={handleToggleSidebar}
        className={`fixed left-0 top-0 z-[3] h-full w-full bg-black bg-opacity-50 ${
          !toggleSidebar && 'hidden'
        }`}
      />

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-[4] h-screen w-64 overflow-y-auto overscroll-none bg-zinc-50 duration-300 ease-in-out dark:bg-zinc-900 dark:text-zinc-200 ${
          toggleSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="h-full">
          <li>
            <Link
              href="/"
              className="block px-3 py-3.5 font-bold leading-none"
              onClick={handleToggleSidebar}
            >
              Promoções
            </Link>
          </li>
          <li>
            <Link
              href="/cupons"
              className="block px-3 py-3.5 font-bold leading-none"
              onClick={handleToggleSidebar}
            >
              Cupons
            </Link>
          </li>
          <li>
            <Link
              href="/recomendados"
              className="block px-3 py-3.5 font-bold leading-none"
              onClick={handleToggleSidebar}
            >
              Recomendados
            </Link>
          </li>

          <li>
            <a
              href="https://t.me/BenchPromos"
              target="_blank"
              className="block px-3 py-3.5 font-bold leading-none"
            >
              Telegram
            </a>
          </li>

          <li>
            <a
              href="https://discord.gg/cCD5PEjyjg"
              target="_blank"
              className="block px-3 py-3.5 font-bold leading-none"
            >
              Discord
            </a>
          </li>

          {categories?.map(({ id, name, subcategories }) => (
            <li key={id}>
              {subcategories?.length ? (
                <Dropdown
                  id={id}
                  name={name}
                  items={subcategories}
                  onClick={handleToggleSidebar}
                />
              ) : (
                <Link
                  href={`/${id}`}
                  className="block px-3 py-3.5 leading-none"
                  title={name}
                  onClick={handleToggleSidebar}
                >
                  {name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}

interface DropdownProps {
  id: string
  name: string
  items?: {
    id: string
    name: string
  }[]
  onClick: () => void
}

function Dropdown({ id, name, items, onClick }: DropdownProps) {
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <button
        title={name}
        className="inline-flex w-full justify-between px-3 py-3.5 leading-none"
        onClick={() => setToggle((prev) => !prev)}
      >
        {name}
      </button>
      <ul
        className={`bg-white py-2.5 pl-9 dark:bg-zinc-800 ${
          toggle ? 'block' : 'hidden'
        }`}
      >
        {items?.map((item) => (
          <li key={item.id}>
            <Link
              href={`/${id}/${item.id}`}
              title={item.name}
              className="block px-3 py-3.5 leading-none hover:underline"
              onClick={onClick}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
