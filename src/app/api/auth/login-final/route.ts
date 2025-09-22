import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple in-memory user store (should match signup-final)
let users: any[] = [
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@churchflow.com',
    password: 'admin123',
    role: 'Admin',
    organization: 'ChurchFlow',
    phone: '+1234567890',
    address: '123 Admin Street',
    created_at: new Date().toISOString(),
    is_email_verified: true
  }
]

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 FINAL LOGIN: Starting login process')
    
    // Parse request body
    const body = await request.json()
    console.log('📝 FINAL LOGIN: Request data received')
    
    // Basic validation
    const { email, password } = body
    
    if (!email || !password) {
      console.log('❌ FINAL LOGIN: Missing credentials')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required'
        },
        { status: 400 }
      )
    }
    
    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    
    if (!user) {
      console.log('❌ FINAL LOGIN: Invalid credentials')
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Update last login
    user.last_login = new Date().toISOString()
    console.log('✅ FINAL LOGIN: User authenticated successfully:', user.email)
    
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
        last_login: user.last_login
      }
    })
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    console.log('🎉 FINAL LOGIN: Login completed successfully')
    return response
    
  } catch (error) {
    console.error('💥 FINAL LOGIN ERROR:', error)
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



