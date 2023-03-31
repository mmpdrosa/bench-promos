import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Montserrat } from '@next/font/google'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { IconContext } from 'react-icons'
import { QueryClientProvider } from 'react-query'

import { Layout } from '@/components/layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { CategoryProvider } from '@/contexts/CategoryContext'
import { queryClient } from '@/lib/react-query'
import '@/styles/globals.css'

dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.locale('pt-br')
dayjs.tz.setDefault('America/Sao_Paulo')

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const theme = createTheme({
  typography: { allVariants: { fontFamily: montserrat.style.fontFamily } },
})

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registrado com sucesso')
          })
          .catch((error) => {
            console.error('Falha ao registrar Service Worker:', error)
          })
      })
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IconContext.Provider value={{}}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <CategoryProvider>
                <div
                  className={`min-h-full flex flex-col text-black bg-zinc-100 ${montserrat.className}`}
                >
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </div>
              </CategoryProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </IconContext.Provider>
    </ThemeProvider>
  )
}
