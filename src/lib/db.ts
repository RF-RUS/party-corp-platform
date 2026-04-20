interface User {
  id: string
  email: string
  password: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

interface Store {
  id: string
  userId: string
  name: string
  platform: string
  apiKey: string
  apiSecret: string
  storeUrl: string
  status: string
  createdAt: Date
  updatedAt: Date
}

interface Recommendation {
  id: string
  storeId: string
  type: string
  title: string
  description: string
  priority: string
  implemented: boolean
  createdAt: Date
}

const users: Map<string, User> = new Map()
const stores: Map<string, Store> = new Map()
const recommendations: Map<string, Recommendation[]> = new Map()

let userCounter = 0
let storeCounter = 0
let recCounter = 0

export const db = {
  user: {
    create: (data: { email: string; password: string; name?: string }) => {
      const id = 'user_' + (++userCounter)
      const user: User = {
        id,
        email: data.email,
        password: data.password,
        name: data.name || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      users.set(id, user)
      return user
    },
    findUnique: (where: { email: string }) => {
      for (const user of users.values()) {
        if (user.email === where.email) return user
      }
      return null
    },
    findFirst: (where: { id: string }) => {
      return users.get(where.id) || null
    }
  },
  
  store: {
    create: (data: Partial<Store>) => {
      const id = 'store_' + (++storeCounter)
      const store: Store = {
        id,
        userId: data.userId || '',
        name: data.name || '',
        platform: data.platform || 'shopify',
        apiKey: data.apiKey || '',
        apiSecret: data.apiSecret || '',
        storeUrl: data.storeUrl || '',
        status: data.status || 'disconnected',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      stores.set(id, store)
      return store
    },
    findMany: (where: { userId?: string }) => {
      const result: Store[] = []
      for (const store of stores.values()) {
        if (!where.userId || store.userId === where.userId) {
          result.push(store)
        }
      }
      return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  },
  
  recommendation: {
    findMany: (where: { storeId: string }) => {
      return recommendations.get(where.storeId) || []
    },
    create: (data: Partial<Recommendation>) => {
      const id = 'rec_' + (++recCounter)
      const rec: Recommendation = {
        id,
        storeId: data.storeId || '',
        type: data.type || '',
        title: data.title || '',
        description: data.description || '',
        priority: data.priority || 'medium',
        implemented: false,
        createdAt: new Date()
      }
      const existing = recommendations.get(rec.storeId) || []
      existing.push(rec)
      recommendations.set(rec.storeId, existing)
      return rec
    },
    createMany: (storeId: string, items: { type: string; title: string; description: string; priority: string }[]) => {
      const created = items.map(item => ({
        id: 'rec_' + (++recCounter),
        storeId,
        ...item,
        implemented: false,
        createdAt: new Date()
      }))
      recommendations.set(storeId, created)
      return created
    }
  }
}