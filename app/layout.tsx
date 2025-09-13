import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DWAPrices - أحدث أسعار الأدوية",
  description: "تطبيق لمتابعة أحدث أسعار الأدوية في مصر",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
