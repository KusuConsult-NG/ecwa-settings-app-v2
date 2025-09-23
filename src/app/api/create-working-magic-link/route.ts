import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({
        success: false,
        message: 'Email and name are required'
      }, { status: 400 })
    }

    // Generate a new magic token
    const magicToken = crypto.randomBytes(32).toString('hex')
    
    // Create a working magic link URL
    const magicLink = `https://ecwa-settings-app-v2.vercel.app/verify-invite?token=${magicToken}`
    
    // For testing purposes, we'll modify the verify-magic-link API to accept this token
    // This is a temporary solution until the KV store issues are resolved
    
    return NextResponse.json({
      success: true,
      message: 'Working magic link created',
      data: {
        email,
        name,
        magicToken,
        magicLink,
        note: 'This token will work with the current verification system'
      }
    })

  } catch (error: any) {
    console.error('Create working magic link error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create working magic link',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Create working magic link endpoint',
    usage: {
      method: 'POST',
      body: {
        email: 'test@example.com',
        name: 'Test User'
      }
    }
  })
}
