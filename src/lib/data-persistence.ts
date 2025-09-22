// Data persistence utility for client-side storage
export class DataPersistence {
  private static prefix = 'ecwa_app_'

  static save(key: string, data: any): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.prefix + key, JSON.stringify(data))
      } catch (error) {
        console.error('Failed to save data to localStorage:', error)
      }
    }
  }

  static load<T = any>(key: string, defaultValue: T): T {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(this.prefix + key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.error('Failed to load data from localStorage:', error)
        return defaultValue
      }
    }
    return defaultValue
  }

  static remove(key: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.prefix + key)
      } catch (error) {
        console.error('Failed to remove data from localStorage:', error)
      }
    }
  }

  static clear(): void {
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
        keys.forEach(key => localStorage.removeItem(key))
      } catch (error) {
        console.error('Failed to clear data from localStorage:', error)
      }
    }
  }
}
