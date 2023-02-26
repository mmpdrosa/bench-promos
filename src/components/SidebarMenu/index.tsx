import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar'

import { useCategory } from '@/contexts/CategoryContext'

export function SidebarMenu() {
  const { categories } = useCategory()
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const sidebarRef = useRef<HTMLHtmlElement>(null)

  function handleSidebarToggle() {
    setToggleSidebar((prev) => !prev)
  }

  function handleOutsideClick(event: MouseEvent) {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setToggleSidebar(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <>
      <button className="sm:hidden" onClick={handleSidebarToggle}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <Sidebar
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-10 ease-in-out duration-300 ${
          toggleSidebar ? 'translate-x-0' : '-translate-x-full'
        } h-screen sm:hidden bg-white`}
      >
        <Menu className="h-full overflow-y-auto">
          {categories &&
            categories.map((category) => (
              <SubMenu key={category.id} label={category.name}>
                {category.subcategories &&
                  category.subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id}>{subcategory.name}</MenuItem>
                  ))}
              </SubMenu>
            ))}

          <MenuItem>Promoções</MenuItem>
        </Menu>
      </Sidebar>
    </>
  )
}
