import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api } from '@/lib/axios'
import { Category } from '@/models'

type CategoryContextType = {
  categories: Category[]
}

type CategoryProviderProps = {
  children: ReactNode
}

const CategoryContext = createContext({} as CategoryContextType)

export const useCategory = () => useContext(CategoryContext)

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api.get('/categories').then((response) => {
      setCategories(response.data)
    })
  }, [])

  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  )
}
