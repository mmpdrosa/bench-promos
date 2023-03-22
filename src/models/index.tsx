export type ProductCategory = {
  id: string
  name: string
}

export type Retailer = {
  id: string
  name: string
  html_url: string
}

export type Coupon = {
  id: string
  available: boolean
  code: string
  discount: string
  minimum_spend?: string
  description?: string
  store?: string
  retailer: Retailer
}

export type Product = {
  id: string
  title: string
  price: number
  store?: string
  html_url: string
  image_url: string
  available: boolean
  category?: ProductCategory
  subcategory?: ProductCategory
  retailer: Retailer
  coupon?: Coupon
  specs?: Record<string, string>
  review_url?: string
}

export type Category = {
  id: string
  name: string
  subcategories?: {
    id: string
    name: string
  }[]
}

export type ProductAlert = {
  id: string
  price: number
  product: {
    id: string
    title: string
    image_url: string
  }
}

export type ProductPriceHistoryItem = {
  id: string
  was_available: boolean
  last_availability: boolean
  lowest_price: number
  last_price: number
  date: string
}
