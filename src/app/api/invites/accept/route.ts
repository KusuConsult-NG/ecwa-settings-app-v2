import { NextRequest, NextResponse } from 'next/server'
import { consumeInvite, getInviteById } from '@/lib/inviteStore'
import { verify } from '@/lib/jwt'
import { createUser, findUserByEmail } from '@/lib/database-simple'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const payload = verify(token) as { inviteId: string, email: string, orgId: string, role: string } | null
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const invite = getInviteById(payload.inviteId)
    if (!invite || invite.consumed) {
      return NextResponse.json({ error: 'Invite not found or already used' }, { status: 400 })
    }

    if (Date.now() > invite.expiresAt) {
      return NextResponse.json({ error: 'Invite expired' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = findUserByEmail(payload.email)
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Create placeholder user (no name/password yet)
    const user = createUser({
      name: '', // Will be set during profile setup
      email: payload.email,
      password: '', // Will be set during profile setup
      role: 'user', // Default to user role, can be updated later
      organization: invite.orgName,
      phone: '',
      address: ''
    })

    // Mark user as needing profile setup
    // In a real app, you'd update the user record with needsProfileSetup: true

    // Consume the invite
    consumeInvite(invite.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        orgId: payload.orgId,
        role: payload.role,
        needsProfileSetup: true
      },
      token // Keep using this short-lived token during onboarding
    })

  } catch (error) {
    console.error('Accept invite error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
