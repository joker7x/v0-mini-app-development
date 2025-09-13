"use client"

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onRefresh: () => void
  onHome: () => void
  loading: boolean
}

export function SearchHeader({ searchQuery, onSearchChange, onRefresh, onHome, loading }: SearchHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        background: "color-mix(in oklab, hsl(var(--background)) 86%, transparent)",
        backdropFilter: "blur(12px)",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="px-4 py-3 flex items-center gap-2">
        <button onClick={onHome} title="الرئيسية" className="text-xl p-2 hover:bg-muted rounded-lg transition-colors">
          🏠
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="ابحث عن دواء..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl px-10 py-2 text-sm outline-none border bg-background text-foreground border-border"
            style={{ fontSize: "16px" }} // Prevent zoom on iOS
          />
          <span className="absolute right-3 top-2.5 text-muted-foreground">🔍</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-2 rounded-lg text-sm border bg-background border-border text-primary hover:bg-muted transition-colors disabled:opacity-50"
        >
          <span className={`ml-1 ${loading ? "animate-spin" : ""}`}>⟳</span>
          تحديث
        </button>
      </div>
    </header>
  )
}
