import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import {
  FaBars,
  FaDiscord,
  FaLaptop,
  FaTelegram,
  FaDesktop,
  FaHeadphones,
} from 'react-icons/fa'

import { useCategory } from '@/contexts/CategoryContext'
import ThemeToggleButton from '../ThemeToggle'
export function Menu() {
  const { categories } = useCategory()

  const notebooksCategory = categories.find(
    (category) => category.name === 'Notebooks',
  )

  const setupCategory = categories.find(
    (category) => category.name === 'Periféricos',
  )

  const desktopCategory = categories.find(
    (category) => category.name === 'Desktop',
  )

  return (
    <div className="mx-auto flex max-w-screen-xl items-center justify-between pb-2 max-lg:justify-center">
      <div className="w-40 max-lg:hidden"></div>
      <NavigationMenu.Root className="relative z-[2] flex justify-center max-sm:hidden">
        <NavigationMenu.List className="flex justify-center">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger
              title="Produtos"
              className="group flex select-none items-center justify-between gap-3 px-3 py-2 text-lg font-semibold text-white rdx-state-open:bg-white rdx-state-open:text-black dark:text-zinc-200 
              dark:rdx-state-open:bg-zinc-800 dark:rdx-state-open:text-white "
            >
              <FaBars className="text-amber-300 group-rdx-state-open:text-black dark:group-rdx-state-open:text-amber-300/75" />
              Categorias
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className=" bg-white p-4 shadow-xl dark:bg-zinc-800 dark:text-zinc-300">
              <NavigationMenu.Sub>
                <NavigationMenu.List className="flex flex-col gap-4">
                  {categories?.map((category) => (
                    <NavigationMenu.Item key={category.id}>
                      <Link href={`/${category.id}`} passHref>
                        <NavigationMenu.Trigger
                          className="group flex w-full items-center justify-between gap-2 text-sm transition-colors hover:text-violet-500"
                          title={category.name}
                        >
                          {category.name}
                          <AiOutlineCaretRight className="text-sm text-white group-hover:text-black dark:text-zinc-400 dark:group-hover:text-violet-500" />
                        </NavigationMenu.Trigger>
                      </Link>
                      <NavigationMenu.Content className="min-w-[296px] px-4 py-2 h-rdx-navigation-menu-viewport">
                        <ul className="flex h-full flex-col flex-wrap gap-x-6">
                          {category.subcategories?.map((subcategory) => (
                            <li key={subcategory.id} className="w-max">
                              <Link
                                href={`/${category.id}/${subcategory.id}`}
                                className="cursor-pointer text-sm transition-colors hover:text-violet-500"
                                title={subcategory.name}
                              >
                                {subcategory.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  ))}
                  <NavigationMenu.Item>
                    <Link
                      href="/"
                      title="Promoções"
                      className="text-sm font-bold hover:text-violet-500"
                    >
                      Promoções
                    </Link>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item>
                    <Link
                      href="/cupons"
                      title="Cupons"
                      className="text-sm font-bold hover:text-violet-500"
                    >
                      Cupons
                    </Link>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item>
                    <Link
                      href="/recomendados"
                      title="Recomendados"
                      className="text-sm font-bold hover:text-violet-500"
                    >
                      Recomendados
                    </Link>
                  </NavigationMenu.Item>
                </NavigationMenu.List>

                <div className="absolute left-full top-0 h-full min-w-max rounded-r border border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-800">
                  <NavigationMenu.Viewport className="max-h-full" />
                </div>
              </NavigationMenu.Sub>
            </NavigationMenu.Content>

            <div className="absolute left-0 top-full">
              <NavigationMenu.Viewport />
            </div>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link
              href={`/${notebooksCategory?.id}`}
              title="Notebooks"
              className="flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-lg font-semibold text-white hover:underline dark:text-zinc-200"
            >
              <FaLaptop className="text-lg text-amber-300" />
              Notebooks
            </Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link
              href={`/${desktopCategory?.id}`}
              title="Desktop"
              className="flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-lg font-semibold text-white hover:underline dark:text-zinc-200"
            >
              <FaDesktop className="text-lg  text-amber-300" />
              Desktop
            </Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link
              href={`/${setupCategory?.id}`}
              title="Periféricos"
              className="flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-lg font-semibold text-white hover:underline dark:text-zinc-200"
            >
              <FaHeadphones className="text-lg text-amber-300" />
              Periféricos
            </Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 max-lg:hidden">
          <div className="scale-75 max-sm:hidden xl:hidden">
            <ThemeToggleButton />
          </div>
          <h1 className="text-lg font-semibold text-white dark:text-zinc-200">
            Grupos
          </h1>
          <a
            href="https://t.me/BenchPromos"
            title="Telegram"
            target="_blank"
            className="group rounded-full p-2 hover:bg-bluetelegram"
            rel="noreferrer"
          >
            <FaTelegram className="text-3xl text-amber-300 group-hover:text-white" />
          </a>
          <a
            href="https://discord.gg/cCD5PEjyjg"
            title="Discord"
            target="_blank"
            className="group rounded-full p-2 hover:bg-bluediscord"
            rel="noreferrer"
          >
            <FaDiscord className="text-3xl text-amber-300 group-hover:text-white" />
          </a>
        </div>
      </div>
    </div>
  )
}
