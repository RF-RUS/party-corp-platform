import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const user = db.user.findUnique({ email })
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    return NextResponse.json({ 
      user: { id: user.id, email: user.email, name: user.name } 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}