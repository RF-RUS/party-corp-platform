'use client'

import { useState, useEffect } from 'react'

interface Recommendation {
  id: string
  type: string
  title: string
  description: string
  priority: string
  implemented: boolean
}

export function RecommendationsPanel({ storeId }: { storeId: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recommendations?storeId=' + storeId)
      .then(res => res.json())
      .then(data => {
        setRecommendations(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [storeId])

  const priorityColors = {
    high: '#ef4444',
    medium: '#eab308',
    low: '#22c55e'
  }

  if (loading) {
    return <div style={{ padding: '16px', color: '#6b7280' }}>Loading recommendations...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>AI Recommendations</h3>
      {recommendations.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No recommendations yet. Connect a store to get started.</p>
      ) : (
        recommendations.map(rec => (
          <div
            key={rec.id}
            style={{ 
              borderLeft: `4px solid ${priorityColors[rec.priority as keyof typeof priorityColors] || priorityColors.medium}`, 
              backgroundColor: 'white', 
              borderRadius: '0 8px 8px 0', 
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontWeight: 500 }}>{rec.title}</h4>
                <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>{rec.description}</p>
                <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', padding: '4px 8px', backgroundColor: '#f3f4f6', borderRadius: '4px', textTransform: 'capitalize' }}>
                  {rec.type}
                </span>
              </div>
              <button
                onClick={() => {
                  setRecommendations(prev =>
                    prev.map(r => r.id === rec.id ? { ...r, implemented: true } : r)
                  )
                }}
                disabled={rec.implemented}
                style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: rec.implemented ? '#d1fae5' : '#2563eb',
                  color: rec.implemented ? '#065f46' : 'white'
                }}
              >
                {rec.implemented ? 'Done' : 'Implement'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}