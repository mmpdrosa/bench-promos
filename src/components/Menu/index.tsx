import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { FaBars, FaDiscord, FaDollarSign, FaTelegram } from 'react-icons/fa'
import { HiCheckBadge } from 'react-icons/hi2'

import { useCategory } from '@/contexts/CategoryContext'
import { TbDiscount2 } from 'react-icons/tb'

export function Menu() {
  const { categories } = useCategory()

  return (
    <div className="flex justify-between max-lg:justify-center items-center max-w-screen-xl mx-auto pb-2">
      <div className="w-40 max-lg:hidden"></div>
      <NavigationMenu.Root className="flex justify-center relative z-[2] max-sm:hidden">
        <NavigationMenu.List className="flex justify-center">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger
              title="Produtos"
              className="group flex items-center justify-between gap-3 py-2 px-3 select-none text-xl font-semibold text-white rdx-state-open:text-black rdx-state-open:bg-white "
            >
              <FaBars className="text-amber-300 group-rdx-state-open:text-black" />
              Produtos
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="p-4 shadow-xl bg-white">
              <NavigationMenu.Sub>
                <NavigationMenu.List className="flex flex-col gap-4">
                  {categories?.map((category) => (
                    <NavigationMenu.Item key={category.id}>
                      <Link href={`/${category.id}`} passHref>
                        <NavigationMenu.Trigger
                          className="group w-full flex justify-between items-center gap-2 text-sm transition-colors rdx-state-open:text-violet-500"
                          title={category.name}
                        >
                          {category.name}
                          <AiOutlineCaretRight className="text-sm text-white group-rdx-state-open:text-black" />
                        </NavigationMenu.Trigger>
                      </Link>
                      <NavigationMenu.Content className="h-rdx-navigation-menu-viewport min-w-[296px] px-4 py-2">
                        <ul className="h-full flex flex-col flex-wrap gap-x-6">
                          {category.subcategories?.map((subcategory) => (
                            <li key={subcategory.id} className="w-max">
                              <Link
                                href={`/${category.id}/${subcategory.id}`}
                                className="text-sm cursor-pointer transition-colors hover:text-violet-500"
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
                </NavigationMenu.List>

                <div className="min-w-max h-full absolute top-0 left-full border-l rounded-r border-zinc-200 bg-white border">
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
              href="/"
              title="Promoções"
              className="flex items-center gap-2 py-2 px-3 select-none text-xl font-semibold text-white hover:underline cursor-pointer"
            >
              <FaDollarSign className="text-amber-300" />
              Promoções
            </Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link
              href="/cupons"
              title="Cupons"
              className="flex items-center gap-2 py-2 px-3 select-none text-xl font-semibold text-white hover:underline cursor-pointer"
            >
              <TbDiscount2 className="text-2xl text-amber-300" />
              Cupons
            </Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link
              href="/recomendados"
              title="Recomendados"
              className="max-md:hidden flex items-center gap-2 py-2 px-3 select-none text-xl font-semibold text-white hover:underline cursor-pointer"
            >
              <HiCheckBadge className="text-2xl text-amber-300" />
              Recomendados
            </Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <div className="flex flex-col">
        <div className="flex gap-1 items-center max-lg:hidden">
          <h1 className="text-white text-lg font-semibold">Grupos</h1>
          <a
            href="https://t.me/BenchPromos"
            title="Telegram"
            target="_blank"
            className="p-2 rounded-full hover:bg-bluetelegram group"
            rel="noreferrer"
          >
            <FaTelegram className="text-3xl text-amber-300 group-hover:text-white" />
          </a>
          <a
            href="https://discord.gg/cCD5PEjyjg"
            title="Discord"
            target="_blank"
            className="p-2 rounded-full hover:bg-bluediscord group"
            rel="noreferrer"
          >
            <FaDiscord className="text-3xl text-amber-300 group-hover:text-white" />
          </a>
        </div>
      </div>
    </div>
  )
}
