export interface Drug {
  id: string
  product_id?: string
  name: string
  arabic?: string
  price: number
  oldprice?: number
  category?: string
  manufacturer?: string
  description?: string
}

export interface DrugStore {
  drugs: Drug[]
  favorites: Set<string>
  lastSync: string | null
  loading: boolean
  error: string | null
}
