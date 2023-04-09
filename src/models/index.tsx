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
  comments?: string
  retailer: Retailer
}

export type Product = {
  id: string
  title: string
  price: number
  html_url: string
  image_url: string
  available: boolean
  recommended?: boolean
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
    price: number
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

export type Sale = {
  id: string
  title: string
  image_url: string
  html_url: string
  price: number
  specs?: string
  created_at: Date
  comments?: string
  category: Category
  coupon?: string
  reactions?: { [key: string]: number }
}
