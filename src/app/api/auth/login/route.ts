import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, verifyPassword } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called')
    
    // Parse request body
    const body = await request.json()
    console.log('Request body:', body)
    
    // Basic validation
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
    
    // Find user
    const user = findUserByEmail(email)
    console.log('🔐 LOGIN ATTEMPT:', { email, userFound: !!user })
    
    if (!user) {
      console.log('❌ LOGIN FAILED: User not found')
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    const passwordValid = verifyPassword(password, user.password)
    console.log('🔐 PASSWORD CHECK:', { passwordValid, storedPassword: user.password.substring(0, 10) + '...' })
    
    if (!passwordValid) {
      console.log('❌ LOGIN FAILED: Invalid password')
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
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
    
    // Set HTTP-only cookie
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
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
