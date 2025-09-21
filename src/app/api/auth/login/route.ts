import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, initializeDefaultUsers } from '@/lib/auth'
import { loginSchema, validateData, sanitizeInput } from '@/lib/validation'
import { withRateLimit, authRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  return withRateLimit(authRateLimit, 'login', request, async () => {
  try {
    // Initialize default users if needed
    await initializeDefaultUsers()

    // Parse and sanitize request body
    const body = await request.json()
    const sanitizedBody = sanitizeInput(body)
    
    // Validate request body
    const validation = validateData(loginSchema, sanitizedBody)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data!

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please verify your email address before logging in. Check your email for a verification code.',
          requiresVerification: true 
        },
        { status: 403 }
      )
    }

    // Create response with user data
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

    // Set HTTP-only cookie for server-side authentication
    response.cookies.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
  })
}
