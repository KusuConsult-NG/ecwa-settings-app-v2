import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, token, email, name } = await request.json()

    if (action === 'create') {
      // Create a test magic invite manually
      const invite = {
        id: 'test-invite-id',
        email: email || 'test@example.com',
        name: name || 'Test User',
        role: 'Test Role',
        organizationId: 'test-org',
        organizationName: 'Test Organization',
        inviterName: 'System Administrator',
        authCode: '123456',
        magicToken: token || 'b59a7d8486cc51efed6c7b16964241cd2b22220b25e9dec7210c8f9507abd36c',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        consumed: false,
        createdAt: Date.now()
      }

      // Store in KV
      await kv.set(`magic_invite:${invite.id}`, JSON.stringify(invite))
      await kv.set(`magic_token:${invite.magicToken}`, invite.id)

      return NextResponse.json({
        success: true,
        message: 'Test magic invite created',
        data: {
          invite,
          magicLink: `https://ecwa-settings-app-v2.vercel.app/verify-invite?token=${invite.magicToken}`
        }
      })
    }

    if (action === 'check') {
      // Check if token exists
      const inviteId = await kv.get(`magic_token:${token}`)
      const inviteData = inviteId ? await kv.get(`magic_invite:${inviteId}`) : null
      
      return NextResponse.json({
        success: true,
        data: {
          token,
          inviteId,
          inviteData: inviteData ? JSON.parse(inviteData) : null,
          exists: !!inviteData
        }
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action. Use "create" or "check"'
    }, { status: 400 })

  } catch (error: any) {
    console.error('Debug magic link error:', error)
    return NextResponse.json({
      success: false,
      message: 'Debug operation failed',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug magic link endpoint',
    usage: {
      create: {
        method: 'POST',
        body: { action: 'create', token: 'optional', email: 'optional', name: 'optional' }
      },
      check: {
        method: 'POST', 
        body: { action: 'check', token: 'required' }
      }
    }
  })
}
