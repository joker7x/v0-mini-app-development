/**
 * Enhanced localStorage wrapper with error handling and versioning
 */
export class Storage {
  private prefix: string
  private version: string

  constructor(prefix = "dwa", version = "1.0") {
    this.prefix = prefix
    this.version = version
  }

  private getKey(key: string): string {
    return `${this.prefix}_${key}`
  }

  private getVersionKey(key: string): string {
    return `${this.prefix}_${key}_version`
  }

  set<T>(key: string, value: T): boolean {
    try {
      const data = {
        value,
        version: this.version,
        timestamp: Date.now(),
      }

      localStorage.setItem(this.getKey(key), JSON.stringify(data))
      localStorage.setItem(this.getVersionKey(key), this.version)
      return true
    } catch (error) {
      console.error(`Storage error setting ${key}:`, error)
      return false
    }
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const stored = localStorage.getItem(this.getKey(key))
      const version = localStorage.getItem(this.getVersionKey(key))

      if (!stored) return defaultValue

      const data = JSON.parse(stored)

      // Check version compatibility
      if (version !== this.version) {
        console.warn(`Storage version mismatch for ${key}. Expected ${this.version}, got ${version}`)
        return defaultValue
      }

      return data.value
    } catch (error) {
      console.error(`Storage error getting ${key}:`, error)
      return defaultValue
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key))
      localStorage.removeItem(this.getVersionKey(key))
      return true
    } catch (error) {
      console.error(`Storage error removing ${key}:`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error("Storage error clearing:", error)
      return false
    }
  }
}

export const storage = new Storage()
