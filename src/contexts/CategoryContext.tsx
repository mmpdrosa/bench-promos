import { createContext, ReactNode, useContext } from 'react'
import { useQuery } from 'react-query'

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
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories')
      const categories: Category[] = response.data

      return categories
    },
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 60 * 1, // 1 hour
    refetchOnMount: false,
  })

  return (
    <CategoryContext.Provider value={{ categories: categories ?? [] }}>
      {children}
    </CategoryContext.Provider>
  )
}
