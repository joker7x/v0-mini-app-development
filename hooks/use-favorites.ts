"use client"

import { useState, useEffect, useCallback } from "react"

const FAVORITES_KEY = "dwa_favs"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  const loadFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        const favArray = JSON.parse(stored)
        if (Array.isArray(favArray)) {
          setFavorites(new Set(favArray))
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      setFavorites(new Set())
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveFavorites = useCallback((newFavorites: Set<string>) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]))
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const toggleFavorite = useCallback(
    (drugId: string) => {
      setFavorites((prev) => {
        const newFavorites = new Set(prev)
        if (newFavorites.has(drugId)) {
          newFavorites.delete(drugId)
        } else {
          newFavorites.add(drugId)
        }

        saveFavorites(newFavorites)
        return newFavorites
      })
    },
    [saveFavorites],
  )

  const isFavorite = useCallback(
    (drugId: string) => {
      return favorites.has(drugId)
    },
    [favorites],
  )

  const clearAllFavorites = useCallback(() => {
    setFavorites(new Set())
    saveFavorites(new Set())
  }, [saveFavorites])

  const getFavoritesCount = useCallback(() => {
    return favorites.size
  }, [favorites])

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    getFavoritesCount,
  }
}
