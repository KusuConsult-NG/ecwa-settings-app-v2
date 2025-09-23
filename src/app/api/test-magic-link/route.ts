import { NextRequest, NextResponse } from 'next/server'
import { createMagicInvite } from '@/lib/magic-link-store'
import { generateMagicLink } from '@/lib/url-utils'

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

    // Create a test magic invite
    const invite = await createMagicInvite(
      email,
      name,
      'Test User',
      'test-org-id',
      'Test Organization',
      'System Administrator'
    )

    // Generate magic link
    const magicLink = generateMagicLink(invite.magicToken)

    return NextResponse.json({
      success: true,
      message: 'Test magic link created successfully',
      data: {
        invite: {
          id: invite.id,
          email: invite.email,
          name: invite.name,
          magicToken: invite.magicToken,
          authCode: invite.authCode,
          expiresAt: invite.expiresAt
        },
        magicLink,
        verificationLink: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ecwa-settings-app-v2.vercel.app'}/accept?email=${encodeURIComponent(email)}&code=${invite.authCode}`
      }
    })

  } catch (error) {
    console.error('Test magic link creation error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create test magic link'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test magic link endpoint - use POST to create a test magic link',
    usage: {
      method: 'POST',
      body: {
        email: 'test@example.com',
        name: 'Test User'
      }
    }
  })
}
