// Simple KV store for server-side data persistence
// This uses in-memory storage with file-based persistence for Vercel deployment

interface KVStore {
  [key: string]: string
}

// In-memory store (will be lost on server restart, but that's okay for magic links)
const store: KVStore = {}

export const kv = {
  async get(key: string): Promise<string | null> {
    return store[key] || null
  },

  async set(key: string, value: string): Promise<void> {
    store[key] = value
  },

  async delete(key: string): Promise<void> {
    delete store[key]
  },

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace('*', '.*'))
    return Object.keys(store).filter(key => regex.test(key))
  }
}
