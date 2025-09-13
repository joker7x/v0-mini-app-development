"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { ErrorBanner } from "@/components/error-banner"
import { SearchHeader } from "@/components/search-header"
import { PromotionalBanner } from "@/components/promotional-banner"
import { DrugList } from "@/components/drug-list"
import { ProfilePage } from "@/components/profile-page"
import { SearchPage } from "@/components/search-page"
import { InteractionsPage } from "@/components/interactions-page"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useDrugs } from "@/hooks/use-drugs"
import { useThemeDetection } from "@/hooks/use-theme-detection"
import { useFavorites } from "@/hooks/use-favorites"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState<"home" | "search" | "interactions" | "more">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { isDark, toggleTheme } = useThemeDetection()
  const { drugs, loading, lastSync, loadMore, refresh, hasMore, error: drugsError } = useDrugs()
  const { favorites, toggleFavorite } = useFavorites()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showSplash && drugs.length === 0) {
      loadMore()
    }
  }, [showSplash, drugs.length, loadMore])

  useEffect(() => {
    if (drugsError) {
      setError(drugsError)
    }
  }, [drugsError])

  const handleRefresh = async () => {
    try {
      setError(null)
      await refresh()
    } catch (err) {
      setError("فشل في تحديث البيانات. يرجى المحاولة مرة أخرى.")
    }
  }

  const handleTabChange = (tab: "home" | "search" | "interactions" | "more") => {
    setActiveTab(tab)
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setActiveTab("search")
  }

  if (showSplash) {
    return <SplashScreen />
  }

  const safeFavorites = drugs.filter((drug) => {
    try {
      const drugId = drug?.id || drug?.product_id || drug?.name
      return drugId && favorites.includes(drugId)
    } catch (error) {
      console.log("[v0] Error filtering favorites:", error)
      return false
    }
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      {activeTab === "home" && (
        <>
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefresh}
            onHome={() => handleTabChange("home")}
            loading={loading}
          />

          <PromotionalBanner />
        </>
      )}

      <main className="pb-20">
        {activeTab === "home" && (
          <div className="px-4 mt-4">
            <DrugList
              drugs={drugs}
              searchQuery=""
              activeTab="home"
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onLoadMore={loadMore}
              hasMore={hasMore}
              loading={loading}
            />
          </div>
        )}

        {activeTab === "search" && (
          <SearchPage drugs={drugs} favorites={favorites} onToggleFavorite={toggleFavorite} onSearch={handleSearch} />
        )}

        {activeTab === "interactions" && <InteractionsPage />}

        {activeTab === "more" && (
          <ProfilePage
            favorites={safeFavorites}
            onToggleFavorite={toggleFavorite}
            isDark={isDark}
            onThemeToggle={toggleTheme}
          />
        )}
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {loading && <LoadingSpinner />}
    </div>
  )
}
