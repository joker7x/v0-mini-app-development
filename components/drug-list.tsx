"use client"

import { useMemo, useEffect, useRef } from "react"
import { DrugCard } from "./drug-card"
import { searchDrugs, generateDrugKey } from "@/lib/search-utils"

interface Drug {
  id?: string
  product_id?: string
  name: string
  arabic?: string
  price: number
  oldprice?: number
}

interface DrugListProps {
  drugs: Drug[]
  searchQuery: string
  activeTab: "home" | "favorites" | "profile"
  favorites: Set<string>
  onToggleFavorite: (key: string) => void
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
}

export function DrugList({
  drugs,
  searchQuery,
  activeTab,
  favorites,
  onToggleFavorite,
  onLoadMore,
  hasMore,
  loading,
}: DrugListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const filteredDrugs = useMemo(() => {
    let filtered = drugs

    if (searchQuery.trim()) {
      filtered = searchDrugs(filtered, searchQuery)
    }

    if (activeTab === "favorites") {
      filtered = filtered.filter((drug) => favorites.has(generateDrugKey(drug)))
    }

    return filtered
  }, [drugs, searchQuery, activeTab, favorites])

  useEffect(() => {
    if (!sentinelRef.current || activeTab !== "home") return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore()
        }
      },
      { rootMargin: "800px" },
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore, activeTab])

  useEffect(() => {
    if (activeTab !== "home") return

    const handleScroll = () => {
      if (loading || !hasMore) return

      if (window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 900) {
        onLoadMore()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading, hasMore, onLoadMore, activeTab])

  if (activeTab === "profile") {
    return (
      <div className="mx-4 my-4 px-3 py-2 rounded-xl border text-sm bg-background border-border">
        قسم "حسابي" قيد التطوير
      </div>
    )
  }

  if (filteredDrugs.length === 0 && !loading) {
    return (
      <div className="text-center my-8">
        <div className="text-6xl mb-4">💊</div>
        <div className="text-lg font-semibold mb-2">
          {activeTab === "favorites" ? "لا توجد أدوية مفضلة" : "لم يتم العثور على نتائج"}
        </div>
        <div className="text-muted-foreground text-sm">
          {activeTab === "favorites"
            ? "أضف بعض الأدوية إلى المفضلة لتظهر هنا"
            : searchQuery
              ? "جرب البحث بكلمات مختلفة"
              : "جاري تحميل البيانات..."}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredDrugs.map((drug) => (
        <DrugCard
          key={generateDrugKey(drug)}
          drug={drug}
          isFavorite={favorites.has(generateDrugKey(drug))}
          onToggleFavorite={() => onToggleFavorite(generateDrugKey(drug))}
        />
      ))}

      {activeTab === "home" && <div ref={sentinelRef} className="h-8" />}
    </div>
  )
}
