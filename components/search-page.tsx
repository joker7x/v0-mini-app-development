"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, ScanLine, History, X } from "lucide-react"
import { DrugCard } from "./drug-card"
import { generateDrugKey } from "@/lib/search-utils"

interface SearchPageProps {
  drugs: any[]
  favorites: Set<string>
  onToggleFavorite: (drugKey: string) => void
  onSearch: (query: string) => void
}

export function SearchPage({ drugs, favorites, onToggleFavorite, onSearch }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchHistory, setSearchHistory] = useState(["باراسيتامول", "أسبرين", "فيتامين د", "أوميجا 3"])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query)
      onSearch(query)
      // Add to history if not already there
      if (!searchHistory.includes(query)) {
        setSearchHistory((prev) => [query, ...prev.slice(0, 9)])
      }
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  const filteredDrugs = drugs.filter(
    (drug) =>
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.activeIngredient?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="px-4 pb-6">
      {/* Search Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md z-10 py-4 -mx-4 px-4 border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن دواء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
              className="pr-10"
            />
          </div>
          <Button size="icon" variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline">
            <ScanLine className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search History */}
      {!searchQuery && searchHistory.length > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center gap-2">
                <History className="w-4 h-4" />
                عمليات البحث الأخيرة
              </h3>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSearch(term)}
                  className="text-sm"
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              نتائج البحث عن "{searchQuery}" ({filteredDrugs.length})
            </h3>
          </div>

          {filteredDrugs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">لم يتم العثور على نتائج</p>
                <p className="text-sm text-muted-foreground mt-1">جرب البحث بكلمات مختلفة</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDrugs.map((drug) => {
                const key = generateDrugKey(drug)
                return (
                  <DrugCard
                    key={key}
                    drug={drug}
                    isFavorite={favorites.has(key)}
                    onToggleFavorite={() => onToggleFavorite(key)}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Popular Searches */}
      {!searchQuery && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <h3 className="font-medium mb-3">عمليات البحث الشائعة</h3>
            <div className="grid grid-cols-2 gap-2">
              {["مسكنات الألم", "فيتامينات", "مضادات حيوية", "أدوية الضغط", "أدوية السكري", "مكملات غذائية"].map(
                (category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(category)}
                    className="justify-start text-sm"
                  >
                    {category}
                  </Button>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
