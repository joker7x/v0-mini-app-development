import { type NextRequest, NextResponse } from "next/server"
import type { Drug } from "@/types/drug"

const API_ORIGIN = "https://dwaprices.com/api_dr88g/serverz.php"
const PROXY_URL = process.env.DWA_PROXY_URL || ""
const API_TIMEOUT = 15000 // Fixed timeout from original
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : "unknown"
  return `rate_limit:${ip}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

async function fetchDrugsFromAPI(page: number): Promise<Drug[]> {
  const apiUrl = PROXY_URL || API_ORIGIN
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const body = new URLSearchParams({
      lastpricesForFlutter: String(page),
    })

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "User-Agent": "DWAPrices-App/1.0",
      },
      body,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const text = await response.text()

    try {
      const data = JSON.parse(text)
      return Array.isArray(data) ? data : []
    } catch (parseError) {
      console.error("Failed to parse API response as JSON:", text.slice(0, 500))
      throw new Error("Invalid JSON response from API")
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout")
    }

    throw error
  }
}

function normalizeDrug(drug: any, index: number, page: number): Drug {
  return {
    id: drug.id || drug.product_id || `${page}-${index}-${drug.name || "unknown"}`,
    product_id: drug.product_id,
    name: drug.name || "",
    arabic: drug.arabic || "",
    price: Number(drug.price) || 0,
    oldprice: drug.oldprice ? Number(drug.oldprice) : undefined,
    category: drug.category,
    manufacturer: drug.manufacturer,
    description: drug.description,
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json().catch(() => ({}))
    const page = Number.parseInt(body.page) || 0

    if (page < 0 || page > 1000) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 })
    }

    const rawDrugs = await fetchDrugsFromAPI(page)

    const drugs = rawDrugs
      .map((drug, index) => normalizeDrug(drug, index, page))
      .filter((drug) => drug.name && drug.price > 0) // Filter out invalid entries

    return NextResponse.json(drugs, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Content-Type": "application/json; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("API Error:", error)

    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 504 })
      }

      if (error.message.includes("Invalid JSON")) {
        return NextResponse.json({ error: "External API returned invalid data." }, { status: 502 })
      }
    }

    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST instead." }, { status: 405 })
}
