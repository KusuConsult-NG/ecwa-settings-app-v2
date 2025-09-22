import { NextRequest, NextResponse } from 'next/server'
import { getMagicInviteByCode, getMagicInviteByToken, consumeMagicInvite } from '@/lib/magic-link-store'
import { createUser, findUserByEmail, hashPassword } from '@/lib/database-simple'
import { sign } from '@/lib/jwt'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, address, password, verificationMethod } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email, name, and password are required'
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 6 characters long'
      }, { status: 400 })
    }

    // Find the invite by email (simplified approach)
    // In production, you'd store the invite ID in session or pass it as parameter
    const allInvites = require('@/lib/magic-link-store').getAllMagicInvites()
    const invite = allInvites.find(inv => 
      inv.email.toLowerCase() === email.toLowerCase() && 
      !inv.consumed && 
      Date.now() < inv.expiresAt
    )

    if (!invite) {
      return NextResponse.json({
        success: false,
        message: 'No valid invitation found for this email'
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists. Please login.'
      }, { status: 409 })
    }

    // Create new user account
    const newUser = createUser({
      name,
      email,
      password: hashPassword(password),
      role: 'user',
      organization: invite.organizationName,
      phone: phone || '',
      address: address || ''
    })

    // Consume the invite
    consumeMagicInvite(invite.id)

    // Generate JWT token for session
    const token = sign({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      organization: newUser.organization
    }, '7d') // 7 days

    // Return success response
    const response = NextResponse.json({
      success: true,
      message: 'Profile completed successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
        createdAt: newUser.createdAt,
        isEmailVerified: newUser.isEmailVerified
      }
    })

    // Set authentication cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Complete invitation error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
