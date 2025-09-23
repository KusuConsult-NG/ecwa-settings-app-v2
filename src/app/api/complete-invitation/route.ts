import { NextRequest, NextResponse } from 'next/server'
import { getMagicInviteByCode, getMagicInviteByToken, consumeMagicInvite, getAllMagicInvites, MagicInvite } from '@/lib/magic-link-store'
import { createUser, findUserByEmail, hashPassword } from '@/lib/database-simple'
import { sign } from '@/lib/jwt'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    // Normalize email for consistency
    const normalizedEmail = email.toLowerCase().trim()
    console.log('Complete invitation for normalized email:', normalizedEmail)
    
    // Find the invite by normalized email
    const allInvites = await getAllMagicInvites()
    const invite = allInvites.find((inv: MagicInvite) => 
      inv.email.toLowerCase() === normalizedEmail && 
      !inv.consumed && 
      Date.now() < inv.expiresAt
    )

    if (!invite) {
      return NextResponse.json({
        success: false,
        message: 'No valid invitation found for this email'
      }, { status: 400 })
    }

    // Check if user already exists (using normalized email)
    const existingUser = findUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists. Please login.'
      }, { status: 409 })
    }

    // Create new user account with normalized email and hashed password
    const newUser = createUser({
      name,
      email: normalizedEmail, // Store lowercase email
      password: hashPassword(password), // Hash password with bcryptjs
      role: 'user',
      organization: invite.organizationName,
      phone: phone || '',
      address: address || ''
    })

    // Consume the invite
    await consumeMagicInvite(invite.id)

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
