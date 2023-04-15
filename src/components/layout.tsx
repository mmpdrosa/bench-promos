import { ReactNode, useEffect } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/axios'
import { Footer } from './footer'
import { Header } from './header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth()

  useEffect(() => {
    async function registerUserSubscription() {
      if (user && Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready

        let subscription = await registration.pushManager.getSubscription()

        const token = await user.getIdToken()

        if (!subscription) {
          const response = await api.get('/subscriptions/public-key')

          const publickey = response.data

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publickey,
          })

          try {
            const keys = subscription.toJSON().keys

            await api.post(
              '/subscriptions',
              {
                endpoint: subscription.endpoint,
                keys,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )
          } catch {}
        }
      }
    }
    registerUserSubscription()
  }, [user])

  return (
    <>
      <Header />
      <div className="w-full h-1.5 bg-gradient-to-r from-violet-500 via-amber-200 to-violet-500"></div>

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  )
}
