/**
 * Normalize Arabic text for better search matching - matches original HTML logic
 */
export function normalizeArabicText(text: string): string {
  if (!text) return ""

  const arabicDigits: Record<string, string> = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  }

  return String(text)
    .toLowerCase()
    .replace(/[٠-٩]/g, (digit) => arabicDigits[digit] || digit)
    .trim()
}

/**
 * Enhanced search function for drugs - matches original HTML search behavior
 */
export function searchDrugs<T extends { name?: string; arabic?: string }>(items: T[], query: string): T[] {
  if (!query.trim()) return items

  const normalizedQuery = normalizeArabicText(query)

  return items.filter((item) => {
    const normalizedName = normalizeArabicText(item.name || "")
    const normalizedArabic = normalizeArabicText(item.arabic || "")

    return normalizedName.includes(normalizedQuery) || normalizedArabic.includes(normalizedQuery)
  })
}

/**
 * Generate a unique key for a drug item - matches original keyOf function
 */
export function generateDrugKey(drug: { id?: string; product_id?: string; name?: string; arabic?: string }): string {
  if (drug.product_id || drug.id) {
    return `id:${drug.product_id || drug.id}`
  }

  const normalizedName = normalizeArabicText(drug.name || "")
  const normalizedArabic = normalizeArabicText(drug.arabic || "")

  return `n:${normalizedName}|a:${normalizedArabic}`
}
