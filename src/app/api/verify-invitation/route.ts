import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail, hashPassword } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

// In-memory storage for invitation codes (in production, use Redis or database)
const invitationCodes = new Map<string, { email: string, name: string, role: string, organizationName: string, createdAt: Date }>()

export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json()

    if (!code || !email) {
      return NextResponse.json({
        success: false,
        message: 'Code and email are required'
      }, { status: 400 })
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid code format. Code must be 6 digits.'
      }, { status: 400 })
    }

    // Check if code exists and is valid
    const invitation = invitationCodes.get(code)
    if (!invitation) {
      return NextResponse.json({
        success: false,
        message: 'Invalid verification code'
      }, { status: 400 })
    }

    // Check if email matches
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({
        success: false,
        message: 'Email does not match the invitation'
      }, { status: 400 })
    }

    // Check if code is expired (24 hours)
    const now = new Date()
    const hoursDiff = (now.getTime() - invitation.createdAt.getTime()) / (1000 * 60 * 60)
    if (hoursDiff > 24) {
      invitationCodes.delete(code)
      return NextResponse.json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists'
      }, { status: 409 })
    }

    // Create new user account
    const newUser = createUser({
      name: invitation.name,
      email: invitation.email,
      password: hashPassword('temp_password_' + Math.random().toString(36).substr(2, 9)), // Temporary password
      role: 'user',
      organization: invitation.organizationName
    })

    // Remove used code
    invitationCodes.delete(code)

    // Return success response
    const response = NextResponse.json({
      success: true,
      message: 'Invitation verified successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
        isEmailVerified: true
      }
    })

    // Set authentication cookie
    response.cookies.set('auth-token', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}

// Store invitation code (called from organization creation)
export function storeInvitationCode(code: string, email: string, name: string, role: string, organizationName: string) {
  invitationCodes.set(code, {
    email,
    name,
    role,
    organizationName,
    createdAt: new Date()
  })
}

// Get invitation code storage for testing
export function getInvitationCodes() {
  return invitationCodes
}
