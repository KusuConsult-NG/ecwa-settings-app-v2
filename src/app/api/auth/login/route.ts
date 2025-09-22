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
    
    // Step 1: Lowercase email for consistency
    const normalizedEmail = email.toLowerCase().trim()
    console.log('Login attempt for normalized email:', normalizedEmail)
    
    // Step 2: Find user with normalized email
    const user = findUserByEmail(normalizedEmail)
    
    if (!user) {
      console.log('User not found for email:', normalizedEmail)
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Step 3: Verify hash with bcryptjs
    const isPasswordValid = verifyPassword(password, user.password)
    console.log('Password verification result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', normalizedEmail)
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
    console.log('Login successful for user:', user.email)
    
    // Step 4: Set session JWT cookie
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
    
    // Set HTTP-only JWT session cookie
    response.cookies.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    console.log('Session cookie set for user:', user.id)
    
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
