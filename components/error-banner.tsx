"use client"

import { Button } from "@/components/ui/button"

interface ErrorBannerProps {
  message: string
  onClose: () => void
}

export function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  return (
    <div className="fixed top-2 left-2 right-2 z-50 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 flex items-center justify-between">
      <span className="text-sm text-red-800 dark:text-red-200">{message}</span>
      <Button variant="ghost" size="sm" className="h-auto p-1 text-red-800 dark:text-red-200" onClick={onClose}>
        <span className="text-sm">✕</span>
      </Button>
    </div>
  )
}
