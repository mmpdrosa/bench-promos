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
      className="p-2 h-12 text-lg outline-none border border-black/20 rounded-lg focus:ring-violet-500 focus:border-violet-500 dark:bg-zinc-900 dark:border-zinc-800"
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
