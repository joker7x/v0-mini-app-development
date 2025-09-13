"use client"

import { useState, useEffect } from "react"

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  backgroundColor: string
  textColor: string
}

const banners: Banner[] = [
  {
    id: "1",
    title: "PharmaSearch",
    subtitle: "جميع الصيادلة يبحثون في تطبيق واحد",
    image: "/pharmacy-app-mockup-on-phone-screen.jpg",
    backgroundColor: "bg-gradient-to-r from-blue-500 to-cyan-400",
    textColor: "text-white",
  },
  {
    id: "2",
    title: "دلوقتي تقدر تعرف",
    subtitle: "تأثير كل دواء في حالات الحمل والرضاعة",
    image: "/pregnant-woman-with-medicine-consultation.jpg",
    backgroundColor: "bg-gradient-to-r from-purple-500 to-pink-400",
    textColor: "text-white",
  },
]

export function PromotionalBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  return (
    <div className="relative mx-4 mt-4 mb-6 rounded-2xl overflow-hidden shadow-lg">
      <div className="relative h-32 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentIndex ? "translate-x-0" : index < currentIndex ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <div
              className={`${banner.backgroundColor} ${banner.textColor} h-full flex items-center justify-between px-6 relative overflow-hidden`}
            >
              <div className="flex-1 z-10">
                <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{banner.subtitle}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="w-20 h-20 object-contain" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="absolute -left-2 -bottom-2 w-12 h-12 bg-white/5 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <span>›</span>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <span>‹</span>
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
