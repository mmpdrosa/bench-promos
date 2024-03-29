import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { api } from '@/lib/axios'
import { ProductPriceHistoryItem } from '@/models'
import { priceFormatter } from '@/utils/formatter'

type TimeRange = '30d' | '3m' | '6m' | '1y'

interface DataItem {
  date: string
  price: number
  available: boolean
}

interface ProductPriceChartProps {
  productId: string
  onInsertLowestPrice: (price: number) => void
}

export function ProductPriceChart({
  productId,
  onInsertLowestPrice,
}: ProductPriceChartProps) {
  const [period, setPeriod] = useState<TimeRange>('30d')

  const { data: productPriceHistory } = useQuery(
    ['price-history', productId, period],
    async () => {
      let periodInDays = 30
      if (period === '3m') periodInDays = 90
      else if (period === '6m') periodInDays = 180
      else if (period === '1y') periodInDays = 365

      const response = await api.get(
        `/products/${productId}/price-history?period=${periodInDays}`,
      )

      const productPriceHistory: ProductPriceHistoryItem[] = response.data

      return productPriceHistory
    },
    { refetchOnWindowFocus: false, staleTime: 1000 * 60 * 60 },
  )

  const findLowestPrice = (data: DataItem[]) => {
    if (data.length < 1) return 0

    return data.reduce((lowestPrice, item) => {
      if (item.price < lowestPrice) {
        return item.price
      } else {
        return lowestPrice
      }
    }, data[0].price)
  }

  const chartData = useMemo(() => {
    if (!productPriceHistory) return []

    const formattedData: DataItem[] = []

    let currentDate = dayjs(productPriceHistory[0].date).toISOString()
    let currentIndex = 0

    while (
      dayjs(currentDate).isBefore(dayjs().startOf('day').add(1, 'millisecond'))
    ) {
      if (
        productPriceHistory.find(({ date }) =>
          dayjs(date).isSame(currentDate, 'day'),
        )
      ) {
        formattedData.push({
          date: currentDate,
          price: productPriceHistory[currentIndex].lowest_price,
          available: productPriceHistory[currentIndex].was_available,
        })
        currentIndex++
      } else {
        formattedData.push({
          date: currentDate,
          price: productPriceHistory[currentIndex - 1].last_price,
          available: productPriceHistory[currentIndex - 1].last_availability,
        })
      }
      currentDate = dayjs(currentDate).add(1, 'day').toISOString()
    }

    return formattedData
  }, [productPriceHistory])

  useEffect(() => {
    const lowestPrice = findLowestPrice(chartData)
    onInsertLowestPrice(lowestPrice)
  }, [chartData, onInsertLowestPrice])

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <Area dataKey="price" stroke="#2451B7" fill="url(#color)" />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickMargin={16}
            tickCount={8}
            tick={{ fill: '#A1A1AA' }}
            tickFormatter={(date: string) => dayjs(date).utc().format('D MMM')}
          />

          <YAxis
            dataKey="price"
            axisLine={false}
            tickLine={false}
            tickCount={5}
            tick={{ fill: '#A1A1AA' }}
            tickFormatter={(price: number) => `${price / 100}`}
          />

          <Tooltip content={<CustomTooltip />} />

          <CartesianGrid opacity={0.1} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 overflow-x-auto whitespace-nowrap">
        <button
          className={`mr-2 h-8 rounded-full border border-zinc-300 px-4 py-1 text-sm font-medium transition-colors ${
            period === '30d'
              ? 'border-opacity-0 bg-violet-500 text-white hover:bg-violet-400'
              : 'hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700'
          }`}
          onClick={() => setPeriod('30d')}
        >
          <span className="mx-1">30 dias</span>
        </button>
        <button
          className={`mr-2 h-8 rounded-full border border-zinc-300 px-4 py-1 text-sm font-medium transition-colors ${
            period === '3m'
              ? 'border-opacity-0 bg-violet-500 text-white hover:bg-violet-400'
              : 'hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700'
          }`}
          onClick={() => setPeriod('3m')}
        >
          <span className="mx-1">3 meses</span>
        </button>
        <button
          className={`mr-2 h-8 rounded-full border border-zinc-300 px-4 py-1 text-sm font-medium transition-colors ${
            period === '6m'
              ? 'border-opacity-0 bg-violet-500 text-white hover:bg-violet-400'
              : 'hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700'
          }`}
          onClick={() => setPeriod('6m')}
        >
          <span className="mx-1">6 meses</span>
        </button>
        <button
          className={`mr-2 h-8 rounded-full border border-zinc-300 px-4 py-1 text-sm font-medium transition-colors ${
            period === '1y'
              ? 'border-opacity-0 bg-violet-500 text-white hover:bg-violet-400'
              : 'hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700'
          }`}
          onClick={() => setPeriod('1y')}
        >
          <span className="mx-1">1 ano</span>
        </button>
      </div>
    </>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h4 className="text-xl font-bold">
          {priceFormatter.format(payload[0].value / 100)}
        </h4>
        <p>{dayjs(label).utc().format('D MMM YYYY')}</p>
      </div>
    )
  }
  return null
}
