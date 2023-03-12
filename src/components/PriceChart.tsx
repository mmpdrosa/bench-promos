import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import dayjs from 'dayjs'

// type TimeRange = '30d' | '3m' | '6m' | '1y'

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

export function PriceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
            <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <Area dataKey="value" stroke="#2451B7" fill="url(#color)" />

        <XAxis dataKey="date" axisLine={false} tickLine={false} />

        <YAxis
          dataKey="value"
          axisLine={false}
          tickLine={false}
          tickCount={8}
          tickFormatter={(number: number) => `$${number.toFixed(2)}`}
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
        <h4>{dayjs(label || '').format('dddd, MMM D, YYYY')}</h4>
        <p>${payload[0].value.toFixed(2)} CAD</p>
      </div>
    )
  }
  return null
}
