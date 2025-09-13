"use client"

import { useEffect, useState } from "react"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <div
          className="text-3xl font-extrabold mb-2"
          style={{
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          💊 DWAPrices
        </div>
        <div className="text-sm text-muted-foreground">جاري تحميل أحدث الأسعار...</div>
      </div>
    </div>
  )
}
