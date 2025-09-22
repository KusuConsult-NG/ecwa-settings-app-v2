import { NextRequest, NextResponse } from 'next/server'
import { getMagicInviteByCode } from '@/lib/magic-link-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json()

    if (!code || !email) {
      return NextResponse.json({
        success: false,
        message: 'Code and email are required'
      }, { status: 400 })
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid code format. Code must be 6 digits.'
      }, { status: 400 })
    }

    // Check if code exists and is valid
    const invite = getMagicInviteByCode(code, email)
    if (!invite) {
      return NextResponse.json({
        success: false,
        message: 'Invalid verification code or email'
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
        message: 'Verification code has expired. Please request a new invitation.'
      }, { status: 400 })
    }

    // Return success with invite data
    return NextResponse.json({
      success: true,
      message: 'Verification code verified successfully!',
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
    console.error('Code verification error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
