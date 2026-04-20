'use client'

import { useState } from 'react'

interface Store {
  id: string
  name: string
  platform: string
  status: string
  storeUrl?: string
}

export function StoreCard({ store, onConnect }: { store: Store; onConnect?: () => void }) {
  const statusStyles = {
    connected: { backgroundColor: '#d1fae5', color: '#065f46' },
    disconnected: { backgroundColor: '#f3f4f6', color: '#4b5563' },
    error: { backgroundColor: '#fee2e2', color: '#991b1b' }
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontWeight: 600, fontSize: '18px' }}>{store.name}</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>{store.platform}</p>
        </div>
        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', ...statusStyles[store.status as keyof typeof statusStyles] || statusStyles.disconnected }}>
          {store.status}
        </span>
      </div>
      {store.storeUrl && (
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>{store.storeUrl}</p>
      )}
      {store.status === 'disconnected' && onConnect && (
        <button
          onClick={onConnect}
          style={{ marginTop: '12px', backgroundColor: '#2563eb', color: 'white' }}
        >
          Connect
        </button>
      )}
    </div>
  )
}

export function ConnectStoreForm({ userId, onConnected }: { userId: string; onConnected: (store: Store) => void }) {
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('shopify')
  const [storeUrl, setStoreUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/stores?userId=' + userId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, platform, storeUrl })
      })
      if (res.ok) {
        const store = await res.json()
        onConnected(store)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>Connect Your Store</h3>
      <div style={{ marginBottom: '12px' }}>
        <label>Store Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="My Store"
          required
        />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label>Platform</label>
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value)}
        >
          <option value="shopify">Shopify</option>
          <option value="woocommerce">WooCommerce</option>
        </select>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label>Store URL</label>
        <input
          type="url"
          value={storeUrl}
          onChange={e => setStoreUrl(e.target.value)}
          placeholder="https://mystore.myshopify.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', opacity: loading ? 0.5 : 1 }}
      >
        {loading ? 'Connecting...' : 'Connect Store'}
      </button>
    </form>
  )
}