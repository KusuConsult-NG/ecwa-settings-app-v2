import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, initializeDefaultUsers } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Initialize default users if needed
    await initializeDefaultUsers()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
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
}
