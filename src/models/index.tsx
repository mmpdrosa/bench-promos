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
  code: string
  discount: string
  minimum_spend?: string
  description?: string
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
}

export type Category = {
  id: string
  name: string
  subcategories?: {
    id: string
    name: string
  }[]
}
