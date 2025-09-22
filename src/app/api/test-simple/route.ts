import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Simple test API working',
    timestamp: new Date().toISOString()
  })
}

export async function POST() {
  return NextResponse.json({ 
    success: true, 
    message: 'Simple POST test API working',
    timestamp: new Date().toISOString()
  })
}

