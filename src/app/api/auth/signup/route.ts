import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail, hashPassword } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called')
    
    // Parse request body
    const body = await request.json()
    console.log('Request body:', body)
    
    // Basic validation
    const { name, email, password, confirmPassword, phone, address } = body
    
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name, email, password, and confirm password are required',
          errors: [
            { field: 'name', message: !name ? 'Name is required' : '' },
            { field: 'email', message: !email ? 'Email is required' : '' },
            { field: 'password', message: !password ? 'Password is required' : '' },
            { field: 'confirmPassword', message: !confirmPassword ? 'Confirm password is required' : '' }
          ].filter(e => e.message)
        },
        { status: 400 }
      )
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Passwords do not match'
        },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters'
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
    
    // Step 1: Lowercase email for consistency
    const normalizedEmail = email.toLowerCase()
    console.log('Normalized email:', normalizedEmail)
    
    // Check if user already exists (using normalized email)
    const existingUser = findUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Step 2: Hash password with bcryptjs
    const hashedPassword = hashPassword(password)
    console.log('Password hashed successfully')
    
    // Step 3: Save user with normalized email and hashed password
    const newUser = createUser({
      name,
      email: normalizedEmail, // Store lowercase email
      password: hashedPassword,
      role: "user",
      organization: "ChurchFlow",
      phone: phone || '',
      address: address || ''
    })
    
    console.log('User created:', newUser.id)
    
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
        createdAt: newUser.createdAt,
        isEmailVerified: newUser.isEmailVerified
      }
    })
    
    // Set authentication cookie
    response.cookies.set('auth-token', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Signup error:', error)
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
