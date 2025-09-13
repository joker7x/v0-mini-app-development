"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Plus, X, Search, Shield, AlertCircle, CheckCircle } from "lucide-react"

export function InteractionsPage() {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const mockInteractions = [
    {
      drugs: ["وارفارين", "أسبرين"],
      severity: "high",
      description: "زيادة خطر النزيف",
      recommendation: "تجنب الاستخدام المتزامن أو راقب المريض بعناية",
    },
    {
      drugs: ["ديجوكسين", "فوروسيميد"],
      severity: "medium",
      description: "قد يزيد مستوى الديجوكسين في الدم",
      recommendation: "راقب مستويات الديجوكسين والبوتاسيوم",
    },
  ]

  const addDrug = (drugName: string) => {
    if (!selectedDrugs.includes(drugName)) {
      setSelectedDrugs([...selectedDrugs, drugName])
    }
    setSearchQuery("")
  }

  const removeDrug = (drugName: string) => {
    setSelectedDrugs(selectedDrugs.filter((drug) => drug !== drugName))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <AlertCircle className="w-4 h-4" />
      case "low":
        return <Shield className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="px-4 pb-6 space-y-6">
      {/* Header */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            فحص التفاعلات الدوائية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">أضف الأدوية التي تتناولها لفحص التفاعلات المحتملة بينها</p>

          {/* Drug Search */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن دواء لإضافته..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Selected Drugs */}
          {selectedDrugs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">الأدوية المحددة:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDrugs.map((drug) => (
                  <Badge key={drug} variant="secondary" className="flex items-center gap-1">
                    {drug}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeDrug(drug)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {["باراسيتامول", "أسبرين", "إيبوبروفين", "أوميبرازول"].map((drug) => (
              <Button
                key={drug}
                variant="outline"
                size="sm"
                onClick={() => addDrug(drug)}
                disabled={selectedDrugs.includes(drug)}
                className="justify-start text-sm"
              >
                <Plus className="w-3 h-3 mr-1" />
                {drug}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactions Results */}
      {selectedDrugs.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج فحص التفاعلات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockInteractions.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p className="font-medium text-green-700">لا توجد تفاعلات معروفة</p>
                <p className="text-sm text-muted-foreground">الأدوية المحددة آمنة للاستخدام معاً</p>
              </div>
            ) : (
              mockInteractions.map((interaction, index) => (
                <Card key={index} className={`border-l-4 ${getSeverityColor(interaction.severity)}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(interaction.severity)}`}>
                        {getSeverityIcon(interaction.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{interaction.drugs.join(" + ")}</h4>
                          <Badge variant={interaction.severity === "high" ? "destructive" : "secondary"}>
                            {interaction.severity === "high"
                              ? "خطر عالي"
                              : interaction.severity === "medium"
                                ? "خطر متوسط"
                                : "خطر منخفض"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{interaction.description}</p>
                        <p className="text-sm font-medium">التوصية: {interaction.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">معلومة مهمة</h4>
              <p className="text-sm text-muted-foreground">
                هذه المعلومات للإرشاد فقط ولا تغني عن استشارة الطبيب أو الصيدلي. استشر مقدم الرعاية الصحية قبل تناول أي
                أدوية جديدة.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
