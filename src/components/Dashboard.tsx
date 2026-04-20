'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { StoreCard, ConnectStoreForm } from '@/components/StoreCard'
import { RecommendationsPanel } from '@/components/RecommendationsPanel'

interface Store {
  id: string
  name: string
  platform: string
  status: string
  storeUrl?: string
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [showConnectForm, setShowConnectForm] = useState(false)

  useEffect(() => {
    if (user) {
      fetch('/api/stores?userId=' + user.id)
        .then(res => res.json())
        .then(data => {
          setStores(data)
          if (data.length > 0 && !selectedStore) {
            setSelectedStore(data[0])
          }
        })
    }
  }, [user])

  const handleStoreConnected = (store: Store) => {
    setStores(prev => [store, ...prev])
    setSelectedStore(store)
    setShowConnectForm(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Party Corp</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#4b5563' }}>{user?.name || user?.email}</span>
            <button onClick={logout} style={{ fontSize: '14px', color: '#6b7280', background: 'none' }}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Your Stores</h2>
                <button
                  onClick={() => setShowConnectForm(!showConnectForm)}
                  style={{ backgroundColor: '#2563eb', color: 'white' }}
                >
                  {showConnectForm ? 'Cancel' : '+ Connect Store'}
                </button>
              </div>
              
              {showConnectForm && user && (
                <div style={{ marginBottom: '24px' }}>
                  <ConnectStoreForm userId={user.id} onConnected={handleStoreConnected} />
                </div>
              )}

              {stores.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No stores connected yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stores.map(store => (
                    <div
                      key={store.id}
                      onClick={() => setSelectedStore(store)}
                      style={{ cursor: 'pointer' }}
                    >
                      <StoreCard store={store} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedStore && (
              <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Analytics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700 }}>$12,450</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Revenue (30d)</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700 }}>142</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Orders (30d)</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f3e8ff', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700 }}>$87.68</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Avg Order Value</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#ffedd5', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700 }}>3.2%</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Conversion Rate</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            {selectedStore ? (
              <RecommendationsPanel storeId={selectedStore.id} />
            ) : (
              <p style={{ color: '#6b7280' }}>Select a store to view recommendations.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}