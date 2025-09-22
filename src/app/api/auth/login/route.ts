import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, verifyPassword } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Enhanced validation
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required'
        },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format'
        },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters'
        },
        { status: 400 }
      )
    }
    
    // Find user
    const user = findUserByEmail(email.toLowerCase().trim())
    
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account is not active. Please contact administrator.' },
        { status: 403 }
      )
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString()
    
    // Return success response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        lastLogin: user.lastLogin
      }
    })
    
    // Set HTTP-only cookie with enhanced security
    response.cookies.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
