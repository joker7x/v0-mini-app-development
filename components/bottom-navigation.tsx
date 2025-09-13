"use client"

import { Button } from "@/components/ui/button"

interface BottomNavigationProps {
  activeTab: "home" | "search" | "interactions" | "more"
  onTabChange: (tab: "home" | "search" | "interactions" | "more") => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home" as const, label: "الرئيسية", icon: "🏠" },
    { id: "search" as const, label: "بحث", icon: "🔍" },
    { id: "interactions" as const, label: "التفاعلات", icon: "⚡" },
    { id: "more" as const, label: "المزيد", icon: "👤" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md z-40 shadow-lg">
      <div className="flex justify-around items-center py-2 px-2">
        {tabs.map(({ id, label, icon }) => (
          <Button
            key={id}
            variant="ghost"
            className={`flex flex-col items-center gap-1 p-3 h-auto min-w-0 flex-1 transition-colors ${
              activeTab === id
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            onClick={() => onTabChange(id)}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  )
}
