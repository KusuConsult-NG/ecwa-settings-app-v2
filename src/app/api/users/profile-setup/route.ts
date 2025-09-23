import { NextRequest, NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'
import { findUserByEmail, updateUser } from '@/lib/database-simple'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, 64)
  return `s2:${salt.toString('hex')}:${hash.toString('hex')}`
}

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json()
    
    if (!token || !name || !password) {
      return NextResponse.json({ error: 'Token, name, and password are required' }, { status: 400 })
    }

    const payload = verify(token) as { inviteId: string, email: string, orgId: string, role: string } | null
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Find user by email
    const user = findUserByEmail(payload.email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user with name and password
    const passwordHash = hashPassword(password)
    const updatedUser = updateUser(user.id, {
      name,
      password: passwordHash,
      // In a real app, you'd also set needsProfileSetup: false
    })

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    // Create session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        organization: updatedUser.organization
      }
    })

    // Set authentication cookie
    response.cookies.set('auth-token', updatedUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Profile setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
