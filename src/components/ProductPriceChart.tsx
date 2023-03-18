import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useMemo, useState } from 'react'
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

dayjs.extend(utc)

type TimeRange = '30d' | '3m' | '6m' | '1y'

interface DataItem {
  date: string
  value: number
}

const data: DataItem[] = []
for (let num = 30; num >= 0; num--) {
  data.push({
    date: dayjs().subtract(num, 'day').format('YYYY-MM-DD'),
    value: 1 + Math.random(),
  })
}

export function ProductPriceChart({ productId }: { productId: string }) {
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
    { refetchOnWindowFocus: false },
  )

  const chartData = useMemo(() => {
    if (!productPriceHistory) return []

    const formattedData: { date: string; price: number; available: boolean }[] =
      []

    let currentDate = dayjs(productPriceHistory[0].date).toISOString()
    let currentIndex = 0

    while (dayjs(currentDate).isBefore(dayjs().startOf('day'))) {
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
          price: formattedData[formattedData.length - 1].price,
          available: formattedData[formattedData.length - 1].available,
        })
      }
      currentDate = dayjs(currentDate).add(1, 'day').toISOString()
    }

    return formattedData
  }, [productPriceHistory])

  return (
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
          tickFormatter={(date: string) => dayjs(date).utc().format('D MMM')}
        />

        <YAxis
          dataKey="price"
          axisLine={false}
          tickLine={false}
          tickMargin={16}
          tickCount={5}
          tickFormatter={(price: number) => `${price / 100}`}
        />

        <Tooltip content={<CustomTooltip />} />

        <CartesianGrid opacity={0.1} vertical={false} />
      </AreaChart>
    </ResponsiveContainer>
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
      <div>
        <h4>{priceFormatter.format(payload[0].value / 100)}</h4>
        <p>{dayjs(label).utc().format('D MMM YYYY')}</p>
      </div>
    )
  }
  return null
}
