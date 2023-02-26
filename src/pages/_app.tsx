import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Montserrat } from '@next/font/google'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import type { AppProps } from 'next/app'

import { Layout } from '@/components/layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { CategoryProvider } from '@/contexts/CategoryContext'

import '@/styles/globals.css'

config.autoAddCss = false

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TooltipProvider>
      <AuthProvider>
        <CategoryProvider>
          <div
            className={`min-h-full text-black bg-zinc-100 ${montserrat.className}`}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </CategoryProvider>
      </AuthProvider>
    </TooltipProvider>
  )
}
