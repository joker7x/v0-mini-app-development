"use client"

import { useEffect, useState } from "react"

export function useThemeDetection() {
  const [isDark, setIsDark] = useState(false)
  const [isTelegram, setIsTelegram] = useState(false)

  useEffect(() => {
    const checkTelegram = () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        setIsTelegram(true)

        try {
          window.Telegram.WebApp.ready()
          const colorScheme = window.Telegram.WebApp.colorScheme
          setIsDark(colorScheme === "dark")

          // Listen for theme changes in Telegram
          window.Telegram.WebApp.onEvent("themeChanged", () => {
            setIsDark(window.Telegram.WebApp.colorScheme === "dark")
          })
        } catch (error) {
          console.error("Telegram WebApp initialization error:", error)
        }
      } else {
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme) {
          setIsDark(savedTheme === "dark")
        } else {
          // Default to light mode
          setIsDark(false)
        }
      }
    }

    checkTelegram()
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  return { isDark, isTelegram, toggleTheme }
}
