import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple in-memory user store (should match signup-final and login-final)
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

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 FINAL ME: Checking user authentication')
    
    // Get auth token from cookie
    const authToken = request.cookies.get('auth-token')?.value
    console.log('📝 FINAL ME: Auth token:', authToken ? 'Present' : 'Missing')
    
    if (!authToken) {
      console.log('❌ FINAL ME: No auth token found')
      return NextResponse.json({ 
        success: false,
        user: null 
      })
    }
    
    // Find user by ID
    const user = users.find(u => u.id === authToken)
    console.log('📝 FINAL ME: User found:', user ? user.email : 'None')
    
    if (!user) {
      console.log('❌ FINAL ME: User not found for token')
      return NextResponse.json({ 
        success: false,
        user: null 
      })
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user
    console.log('✅ FINAL ME: Returning user data for:', user.email)
    
    return NextResponse.json({ 
      success: true,
      user: userWithoutPassword 
    })
    
  } catch (error) {
    console.error('💥 FINAL ME ERROR:', error)
    return NextResponse.json({ 
      success: false,
      user: null 
    })
  }
}
