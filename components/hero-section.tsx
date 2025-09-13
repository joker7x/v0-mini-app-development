interface HeroSectionProps {
  lastSync: string | null
}

export function HeroSection({ lastSync }: HeroSectionProps) {
  return (
    <section
      className="mx-4 mt-3 p-4 rounded-2xl text-white shadow-lg"
      style={{
        background: "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--accent)))",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90">DWAPrices</div>
          <div className="text-2xl font-bold">أحدث أسعار الأدوية</div>
          <div className="text-xs mt-1 opacity-90">آخر تحديث — {lastSync || "الآن"}</div>
        </div>
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl">💊</div>
      </div>
    </section>
  )
}
