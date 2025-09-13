"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Drug } from "@/types/drug"
import { apiClient, APIError } from "@/lib/api-client"
import { generateDrugKey } from "@/lib/search-utils"

interface DrugStore {
  drugs: Map<string, Drug>
  order: string[]
}

const ITEMS_PER_BATCH = 4
const MAX_ITEMS_PER_LOAD = 24
const MAX_RETRIES = 3
const RETRY_DELAY = 1000
const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000 // 30 minutes

export function useDrugs() {
  const [store, setStore] = useState<DrugStore>({ drugs: new Map(), order: [] })
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const retryCountRef = useRef(0)
  const autoRefreshRef = useRef<NodeJS.Timeout>()
  const emptyStreakRef = useRef(0)

  useEffect(() => {
    if (store.drugs.size === 0 && !loading) {
      loadMore()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (autoRefreshRef.current) {
        clearTimeout(autoRefreshRef.current)
      }
    }
  }, [])

  const fetchDrugs = useCallback(async (pageNum: number): Promise<Drug[]> => {
    try {
      console.log("[v0] Fetching drugs for page:", pageNum)
      const drugs = await apiClient.fetchDrugs(pageNum)
      console.log("[v0] Received drugs:", drugs.length)
      retryCountRef.current = 0
      return drugs
    } catch (err) {
      console.log("[v0] Error fetching drugs:", err)
      if (err instanceof APIError) {
        if (err.status === 429) {
          throw new Error("تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة بعد قليل.")
        } else if (err.status === 504) {
          throw new Error("انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.")
        } else if (err.status >= 500) {
          throw new Error("خطأ في الخادم. يرجى المحاولة لاحقاً.")
        }
      }

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * retryCountRef.current))
        return fetchDrugs(pageNum)
      }

      throw err
    }
  }, [])

  const addDrugs = useCallback((newDrugs: Drug[]) => {
    setStore((prevStore) => {
      const updatedStore = {
        drugs: new Map(prevStore.drugs),
        order: [...prevStore.order],
      }

      const addedKeys: string[] = []

      for (const drug of newDrugs) {
        const key = generateDrugKey(drug)
        if (!updatedStore.drugs.has(key)) {
          updatedStore.drugs.set(key, drug)
          updatedStore.order.push(key)
          addedKeys.push(key)
        }
      }

      console.log("[v0] Added drugs:", addedKeys.length)
      return addedKeys.length > 0 ? updatedStore : prevStore
    })
  }, [])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    console.log("[v0] Loading more drugs, current page:", page)
    setLoading(true)
    setError(null)

    try {
      const newItems: Drug[] = []
      let fetched = 0
      let currentPage = page

      while (fetched < ITEMS_PER_BATCH && hasMore && newItems.length < MAX_ITEMS_PER_LOAD) {
        const drugs = await fetchDrugs(currentPage)

        if (drugs && drugs.length > 0) {
          emptyStreakRef.current = 0
          const validDrugs = drugs.filter((drug) => drug.name && drug.price > 0)
          if (validDrugs.length > 0) {
            newItems.push(...validDrugs)
          }
          currentPage++
        } else {
          emptyStreakRef.current++
          currentPage++
          if (emptyStreakRef.current >= 6) {
            setHasMore(false)
            break
          }
        }
        fetched++
      }

      if (newItems.length > 0) {
        addDrugs(newItems)
      }

      setPage(currentPage)

      setLastSync(
        new Date().toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )

      if (autoRefreshRef.current) {
        clearTimeout(autoRefreshRef.current)
      }
      autoRefreshRef.current = setTimeout(() => {
        console.log("[v0] Auto-refreshing data after 30 minutes")
        refresh()
      }, AUTO_REFRESH_INTERVAL)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "فشل في تحميل البيانات"
      setError(errorMessage)
      console.error("Error loading drugs:", err)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, fetchDrugs, addDrugs])

  const refresh = useCallback(async () => {
    console.log("[v0] Refreshing drugs data")
    if (autoRefreshRef.current) {
      clearTimeout(autoRefreshRef.current)
    }

    setStore({ drugs: new Map(), order: [] })
    setPage(0)
    setHasMore(true)
    setError(null)
    retryCountRef.current = 0
    emptyStreakRef.current = 0

    await loadMore()
  }, [loadMore])

  const drugs = store.order.map((key) => store.drugs.get(key)!).filter(Boolean)

  return {
    drugs,
    loading,
    lastSync,
    hasMore,
    error,
    loadMore,
    refresh,
  }
}
