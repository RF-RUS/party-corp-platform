import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    
    const existing = db.user.findUnique({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    
    const user = db.user.create({ email, password, name })
    
    return NextResponse.json({ 
      user: { id: user.id, email: user.email, name: user.name } 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}