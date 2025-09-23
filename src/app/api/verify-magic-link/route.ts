import { NextRequest, NextResponse } from 'next/server'
import { getMagicInviteByToken } from '@/lib/magic-link-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Magic link token is required'
      }, { status: 400 })
    }

    // Check if magic link exists and is valid
    const invite = await getMagicInviteByToken(token)
    if (!invite) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired magic link'
      }, { status: 400 })
    }

    // Check if already consumed
    if (invite.consumed) {
      return NextResponse.json({
        success: false,
        message: 'This invitation has already been used'
      }, { status: 400 })
    }

    // Check if expired
    if (Date.now() > invite.expiresAt) {
      return NextResponse.json({
        success: false,
        message: 'Magic link has expired. Please request a new invitation.'
      }, { status: 400 })
    }

    // Return success with invite data
    return NextResponse.json({
      success: true,
      message: 'Magic link verified successfully!',
      invite: {
        id: invite.id,
        email: invite.email,
        name: invite.name,
        role: invite.role,
        organizationId: invite.organizationId,
        organizationName: invite.organizationName,
        inviterName: invite.inviterName
      }
    })

  } catch (error) {
    console.error('Magic link verification error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}

