import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { auth } from '@/lib/firebase'
import { queryClient } from '@/lib/react-query'

type SignInData = {
  email: string
  password: string
}

type AuthContextType = {
  user: User | null
  logIn: (data: SignInData) => Promise<void>
  logOut: () => Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return subscriber
  }, [])

  async function logIn({ email, password }: SignInData) {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logOut() {
    await signOut(auth)

    queryClient.removeQueries('product-alerts')
  }

  const value = useMemo(() => ({ user, logIn, logOut }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
