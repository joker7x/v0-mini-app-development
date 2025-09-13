"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { DrugCard } from "./drug-card"

interface ProfilePageProps {
  favorites: any[]
  onToggleFavorite: (drugId: string) => void
  isDark: boolean
  onThemeToggle: () => void
}

export function ProfilePage({ favorites, onToggleFavorite, isDark, onThemeToggle }: ProfilePageProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const safeFavorites = Array.isArray(favorites) ? favorites : []

  const settingsItems = [
    {
      icon: isDark ? "☀️" : "🌙",
      label: "الوضع المظلم",
      description: "تبديل بين الوضع الفاتح والمظلم",
      action: <Switch checked={isDark} onCheckedChange={onThemeToggle} />,
    },
    {
      icon: "🔔",
      label: "الإشعارات",
      description: "تلقي إشعارات حول الأسعار الجديدة",
      action: <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />,
    },
    {
      icon: "🌐",
      label: "اللغة",
      description: "العربية",
      action: <span className="text-muted-foreground">›</span>,
    },
    {
      icon: "🛡️",
      label: "الخصوصية والأمان",
      description: "إدارة بياناتك الشخصية",
      action: <span className="text-muted-foreground">›</span>,
    },
    {
      icon: "❓",
      label: "المساعدة والدعم",
      description: "الحصول على المساعدة",
      action: <span className="text-muted-foreground">›</span>,
    },
  ]

  return (
    <div className="px-4 pb-6 space-y-6">
      {/* Profile Header */}
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">مستخدم ضيف</h2>
              <p className="text-muted-foreground">انضم إلينا للحصول على مميزات إضافية</p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-transparent" variant="outline">
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>

      {/* Favorites Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-red-500">❤️</span>
            المفضلة ({safeFavorites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {safeFavorites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-4xl block mb-3 opacity-50">❤️</span>
              <p>لا توجد أدوية مفضلة بعد</p>
              <p className="text-sm">اضغط على النجمة لإضافة الأدوية للمفضلة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {safeFavorites.slice(0, 3).map((drug, index) => {
                try {
                  const drugId = drug?.id || drug?.product_id || drug?.name || `drug-${index}`
                  return (
                    <DrugCard
                      key={drugId}
                      drug={drug}
                      isFavorite={true}
                      onToggleFavorite={() => onToggleFavorite(drugId)}
                    />
                  )
                } catch (error) {
                  console.log("[v0] Error rendering drug card:", error)
                  return null
                }
              })}
              {safeFavorites.length > 3 && (
                <Button variant="ghost" className="w-full">
                  عرض جميع المفضلة ({safeFavorites.length})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚙️</span>
            الإعدادات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {settingsItems.map((item, index) => (
            <div key={index}>
              <div className="flex items-center gap-3 py-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {item.action}
              </div>
              {index < settingsItems.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
      >
        <span className="ml-2">🚪</span>
        تسجيل الخروج
      </Button>
    </div>
  )
}
