import {
  faBars,
  faCaretRight,
  faDollar,
  faPercent,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import Link from 'next/link'

import { useCategory } from '@/contexts/CategoryContext'

export function Menu() {
  const { categories } = useCategory()

  return (
    <NavigationMenu.Root className="flex justify-center relative z-10 max-sm:hidden ">
      <NavigationMenu.List className="flex justify-center">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex items-center justify-between gap-3 py-2 px-3 select-none text-sm font-medium rdx-state-open:bg-white">
            <FontAwesomeIcon icon={faBars} size="lg" />
            Categorias
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="p-4 bg-white shadow-xl">
            <NavigationMenu.Sub>
              <NavigationMenu.List className="flex flex-col gap-4">
                {categories?.map((category) => (
                  <NavigationMenu.Item key={category.id}>
                    <Link href={`/${category.id}`} passHref>
                      <NavigationMenu.Trigger
                        className="group w-full flex justify-between items-center gap-2 text-xs rdx-state-open:text-violet-500"
                        title={category.name}
                      >
                        {category.name}
                        <FontAwesomeIcon
                          icon={faCaretRight}
                          className="text-white group-rdx-state-open:text-black"
                        />
                      </NavigationMenu.Trigger>
                    </Link>
                    <NavigationMenu.Content className="h-rdx-navigation-menu-viewport min-w-[296px] px-4 py-2">
                      <ul className="h-full flex flex-col flex-wrap gap-x-6">
                        {category.subcategories?.map((subcategory) => (
                          <li key={subcategory.id} className="w-max">
                            <Link
                              href={`/${category.id}/${subcategory.id}`}
                              className="text-xs cursor-pointer hover:text-violet-500"
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
          <NavigationMenu.Link className="flex items-center gap-3 py-2 px-3 select-none text-sm font-medium hover:underline hover:cursor-pointer">
            <FontAwesomeIcon icon={faDollar} size="lg" />
            Promoções
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="flex items-center gap-3 py-2 px-3 select-none text-sm font-medium hover:underline hover:cursor-pointer">
            <FontAwesomeIcon icon={faPercent} size="lg" />
            Cupons
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
