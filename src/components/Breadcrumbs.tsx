import Link from 'next/link'
import { HiHome } from 'react-icons/hi'
import { RxChevronLeft, RxChevronRight } from 'react-icons/rx'

interface BreadcrumbProps {
  locations?: {
    label: string
    path: string
  }[]
}

export function Breadcrumbs({ locations }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 text-xs font-bold">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer transition-colors hover:text-violet-500"
            title="Home"
          >
            {locations ? <HiHome /> : <RxChevronLeft />} Home
          </Link>
        </li>
        {locations?.map(({ label, path }) => (
          <li key={path}>
            <div className="flex items-center">
              <RxChevronRight />
              <Link
                href={path}
                className="ml-1 md:ml-2 cursor-pointer transition-colors hover:text-violet-500"
                title={label}
              >
                {label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
