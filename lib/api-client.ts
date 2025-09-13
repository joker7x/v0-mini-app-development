import type { Drug } from "@/types/drug"

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export class APIClient {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(errorData.error || `HTTP ${response.status}`, response.status, errorData.code)
    }

    return response.json()
  }

  async fetchDrugs(page: number): Promise<Drug[]> {
    return this.request<Drug[]>("/drugs", {
      method: "POST",
      body: JSON.stringify({ page }),
    })
  }

  async checkHealth(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request("/health")
  }
}

export const apiClient = new APIClient()
