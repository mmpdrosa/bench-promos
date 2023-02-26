import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function SidebarMenu() {
  return (
    <>
      <button className="sm:hidden">
        <FontAwesomeIcon icon={faBars} />
      </button>
    </>
  )
}
