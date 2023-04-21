import { deleteCookie, setCookie } from 'cookies-next'
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { api } from '@/lib/axios'
import { auth } from '@/lib/firebase'
import { queryClient } from '@/lib/react-query'

type SignInData = {
  email: string
  password: string
}

type SignUpData = {
  username: string
  email: string
  password: string
}

type AuthContextType = {
  user: User | null
  isAdmin: boolean
  logIn: (data: SignInData) => Promise<string>
  logInWithGoogle: () => Promise<void>
  signUp: (data: SignUpData) => Promise<string>
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
      if (user) {
        if (!user.emailVerified) return

        const { token, expirationTime, claims } = await user.getIdTokenResult()

        const isAdmin = claims?.role === 'admin'

        setIsAdmin(isAdmin)

        setCookie('bench-promos.token', token, {
          expires: new Date(expirationTime),
        })
      } else {
        deleteCookie('bench-promos.token')
      }

      setUser(user)
    })

    return subscriber
  }, [])

  async function logIn({ email, password }: SignInData) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      if (!user.emailVerified) {
        await signOut(auth)
        return 'auth/email-not-verified'
      }

      return 'auth/success'
    } catch (err: any) {
      return err.code
    }
  }

  async function logInWithGoogle() {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch {}
  }

  async function signUp(signUpData: SignUpData) {
    try {
      const response = await api.post('/users', signUpData)

      const token: string = response.data

      const { user } = await signInWithCustomToken(auth, token)

      await sendEmailVerification(user)

      await signOut(auth)

      return 'auth/success'
    } catch (err: any) {
      if (err.response.data.code === 'auth/email-already-exists')
        return 'auth/email-already-exists'

      return 'auth/internal-error'
    }
  }

  async function logOut() {
    await signOut(auth)

    queryClient.removeQueries('alerts')
  }

  const value = useMemo(
    () => ({ user, isAdmin, logIn, logOut, logInWithGoogle, signUp }),
    [user, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
