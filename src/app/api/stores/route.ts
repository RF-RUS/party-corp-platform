import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }
  
  const stores = db.store.findMany({ userId })
  
  return NextResponse.json(stores)
}

export async function POST(request: Request) {
  try {
    const { userId, name, platform, apiKey, apiSecret, storeUrl } = await request.json()
    
    const store = db.store.create({
      userId,
      name,
      platform,
      apiKey: apiKey || '',
      apiSecret: apiSecret || '',
      storeUrl: storeUrl || '',
      status: 'connected'
    })
    
    return NextResponse.json(store)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 })
  }
}