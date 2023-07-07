import Link from 'next/link'
import { FaDesktop, FaHeadphones, FaLaptop } from 'react-icons/fa'

const MobileNavBar = () => {
  const notebooksCategoryId = '52e0e282-ba6f-4b33-8399-a40bd5969f85'
  const desktopCategoryId = '8265670b-d7e4-46d3-9593-48c3358268e3'
  const peripheralsCategoryId = '4a4a6c37-d7ed-4130-a748-4ab290f09fe8'
  return (
    <div className="mx-auto flex w-full gap-2 py-4 text-xs font-semibold sm:hidden">
      <Link
        href={`/${notebooksCategoryId}`}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-800"
      >
        <FaLaptop className="text-sm" />
        Notebook
      </Link>
      <Link
        href={`/${desktopCategoryId}`}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-800"
      >
        <FaDesktop className="text-sm" />
        Desktop
      </Link>
      <Link
        href={`/${peripheralsCategoryId}`}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-800"
      >
        <FaHeadphones className="text-sm" />
        Periféricos
      </Link>
    </div>
  )
}

export default MobileNavBar
