import { NextRequest, NextResponse } from 'next/server'
import { createUser, initializeDefaultUsers, sendEmailVerification } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Initialize default users if needed
    await initializeDefaultUsers()

    const { name, email, password, role, organization } = await request.json()

    if (!name || !email || !password || !role || !organization) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const user = await createUser({
      name,
      email,
      password,
      role,
      organization
    })

    // Send email verification
    const emailSent = await sendEmailVerification(user)
    
    if (!emailSent) {
      console.warn('Failed to send verification email, but user was created')
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      message: emailSent 
        ? 'Account created successfully. Please check your email for verification code.'
        : 'Account created successfully. Please contact support for email verification.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        createdAt: user.createdAt,
        isEmailVerified: user.isEmailVerified || false
      },
      emailSent
    })

    // Only set cookie if email verification is not required or if user is pre-verified
    if (user.isEmailVerified) {
      response.cookies.set('auth-token', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    return response
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
