import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple in-memory user store for immediate functionality
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
    console.log('🚀 FINAL SIGNUP: Starting signup process')
    
    // Parse request body
    const body = await request.json()
    console.log('📝 FINAL SIGNUP: Request data received')
    
    // Basic validation
    const { name, email, password, confirmPassword, phone, address } = body
    
    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      console.log('❌ FINAL SIGNUP: Missing required fields')
      return NextResponse.json(
        { 
          success: false, 
          message: 'All fields are required'
        },
        { status: 400 }
      )
    }
    
    if (password !== confirmPassword) {
      console.log('❌ FINAL SIGNUP: Passwords do not match')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Passwords do not match'
        },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      console.log('❌ FINAL SIGNUP: Password too short')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters'
        },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      console.log('❌ FINAL SIGNUP: User already exists')
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      password, // Store as plain text for demo
      role: "Member",
      organization: "ChurchFlow",
      phone,
      address,
      created_at: new Date().toISOString(),
      is_email_verified: true
    }
    
    users.push(newUser)
    console.log('✅ FINAL SIGNUP: User created successfully:', newUser.id)
    
    // Return success response
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
        created_at: newUser.created_at,
        is_email_verified: newUser.is_email_verified
      }
    })
    
    // Set authentication cookie
    response.cookies.set('auth-token', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    console.log('🎉 FINAL SIGNUP: Signup completed successfully')
    return response
    
  } catch (error) {
    console.error('💥 FINAL SIGNUP ERROR:', error)
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
