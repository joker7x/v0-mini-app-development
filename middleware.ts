import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Content Security Policy (basic)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:;",
  )

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
