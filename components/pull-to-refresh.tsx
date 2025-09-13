"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
}

export function PullToRefresh({ onRefresh, children, threshold = 80 }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)

  const startY = useRef(0)
  const currentY = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling || window.scrollY > 0) return

      currentY.current = e.touches[0].clientY
      const distance = Math.max(0, currentY.current - startY.current)

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance * 0.5, threshold * 1.5))
      }
    },
    [isPulling, threshold],
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh])

  const refreshProgress = Math.min(pullDistance / threshold, 1)
  const shouldTrigger = pullDistance >= threshold

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overscroll-none"
    >
      {/* Pull to refresh indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 ease-out z-10"
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          opacity: isPulling ? 1 : 0,
        }}
      >
        <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg">
          <span
            className={`text-lg transition-all duration-200 ${
              isRefreshing
                ? "animate-spin text-primary"
                : shouldTrigger
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
            }`}
            style={{
              transform: `rotate(${refreshProgress * 180}deg)`,
            }}
          >
            🔄
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}
