import { NextRequest, NextResponse } from 'next/server'
import { getInviteByCode } from '@/lib/inviteStore'
import { sign } from '@/lib/jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
    }

    // Find invite by code
    const invite = getInviteByCode(code)
    if (!invite) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    // Check if email matches
    if (invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Email does not match the invitation' }, { status: 400 })
    }

    // Create a short-lived token for the invite acceptance process
    const token = sign({
      inviteId: invite.id,
      email: invite.email,
      orgId: invite.orgId,
      role: invite.role
    })

    return NextResponse.json({
      success: true,
      token,
      invite: {
        id: invite.id,
        email: invite.email,
        name: invite.name,
        role: invite.role,
        orgName: invite.orgName
      }
    })

  } catch (error) {
    console.error('Verify invite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

