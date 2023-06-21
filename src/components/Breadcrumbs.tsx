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
      <ol className="inline-flex items-center space-x-1 text-xs font-bold md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2 transition-colors hover:text-violet-500"
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
                className="ml-1 cursor-pointer transition-colors hover:text-violet-500 md:ml-2"
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
