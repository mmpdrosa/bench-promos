import { NumericFormat } from 'react-number-format'

interface Props {
  value: number | undefined
  onChange: (...event: any[]) => void
  name: string
}

export default function NumericPriceInput({ value, onChange, name }: Props) {
  return (
    <NumericFormat
      id={name}
      displayType="input"
      prefix="R$ "
      decimalScale={2}
      decimalSeparator=","
      thousandSeparator="."
      fixedDecimalScale={true}
      allowNegative={false}
      value={value! / 100}
      className="h-12 rounded-lg border border-black/20 p-2 text-lg outline-none focus:border-violet-500 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900"
      onValueChange={({ floatValue }) => {
        onChange({
          target: {
            name,
            value: floatValue ? Math.round(floatValue * 100) : 0,
          },
        })
      }}
    />
  )
}
