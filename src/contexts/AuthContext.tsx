import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
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
  isAdmin: boolean
  logIn: (data: SignInData) => Promise<void>
  logInWithGoogle: () => Promise<void>
  logOut: () => Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      const isAdmin = (await user?.getIdTokenResult())?.claims?.role === 'admin'

      setIsAdmin(isAdmin)
    })

    return subscriber
  }, [])

  async function logIn({ email, password }: SignInData) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logInWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  async function logOut() {
    await signOut(auth)

    queryClient.removeQueries('alerts')
  }

  const value = useMemo(
    () => ({ user, isAdmin, logIn, logOut, logInWithGoogle }),
    [user, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
