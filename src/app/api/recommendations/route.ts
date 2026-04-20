import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const MOCK_RECOMMENDATIONS = [
  { type: 'pricing', title: 'Optimize pricing strategy', description: 'Consider dynamic pricing to increase average order value by 10-15%', priority: 'high' },
  { type: 'inventory', title: 'Stock trending items', description: 'Your top-selling items are running low. Restock to avoid lost sales.', priority: 'high' },
  { type: 'marketing', title: 'Launch email campaign', description: 'Send personalized emails to customers who haven\'t purchased in 30+ days', priority: 'medium' },
  { type: 'seo', title: 'Improve product descriptions', description: 'Add detailed descriptions to improve SEO rankings', priority: 'medium' },
  { type: 'upsell', title: 'Bundle products', description: 'Create product bundles to increase cart size', priority: 'low' }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get('storeId')
  
  if (!storeId) {
    return NextResponse.json({ error: 'storeId required' }, { status: 400 })
  }
  
  const stored = db.recommendation.findMany({ storeId })
  
  if (stored.length === 0) {
    const created = db.recommendation.createMany(storeId, MOCK_RECOMMENDATIONS)
    return NextResponse.json(created)
  }
  
  return NextResponse.json(stored)
}

export async function POST(request: Request) {
  try {
    const { storeId, type, title, description, priority } = await request.json()
    
    const rec = db.recommendation.create({
      storeId,
      type,
      title,
      description,
      priority: priority || 'medium'
    })
    
    return NextResponse.json(rec)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create recommendation' }, { status: 500 })
  }
}