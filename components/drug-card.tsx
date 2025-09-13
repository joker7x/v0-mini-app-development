"use client"

interface Drug {
  id?: string
  product_id?: string
  name: string
  arabic?: string
  price: number
  oldprice?: number
}

interface DrugCardProps {
  drug: Drug
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function DrugCard({ drug, isFavorite, onToggleFavorite }: DrugCardProps) {
  const calculateDiscount = (oldPrice?: number, currentPrice?: number): number => {
    if (!oldPrice || !currentPrice || oldPrice <= 0) return 0
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
  }

  const discountPercentage = calculateDiscount(drug.oldprice, drug.price)
  const formatPrice = (price: number) => `${price} ج.م`

  return (
    <div className="w-full flex items-center gap-3 rounded-2xl p-4 bg-card border border-border shadow-sm">
      <div
        className={`text-xl cursor-pointer transition-opacity ${isFavorite ? "text-yellow-500" : "text-gray-300"}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
      >
        ⭐
      </div>

      <div className="text-right">
        <div className="font-bold text-lg text-foreground">{formatPrice(drug.price)}</div>
        {drug.oldprice && (
          <div className="text-sm text-muted-foreground line-through">{formatPrice(drug.oldprice)}</div>
        )}
      </div>

      <div className="flex-1 text-center">
        <div className="font-semibold text-foreground text-lg">{drug.name || "بدون اسم"}</div>
        {drug.arabic && <div className="text-sm mt-1 text-muted-foreground">{drug.arabic}</div>}
      </div>

      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/20">
        <span className="text-2xl">💊</span>
      </div>
    </div>
  )
}
