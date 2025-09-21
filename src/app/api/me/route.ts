import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple in-memory user store (should match signup and login)
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
    createdAt: new Date().toISOString(),
    isEmailVerified: true
  }
]

export async function GET(request: NextRequest) {
  try {
    console.log('Me API called')
    
    // Get auth token from cookie
    const authToken = request.cookies.get('auth-token')?.value
    console.log('Auth token:', authToken)
    
    if (!authToken) {
      return NextResponse.json({ user: null })
    }
    
    // Find user by ID
    const user = users.find(u => u.id === authToken)
    console.log('Found user:', user ? user.email : 'None')
    
    if (!user) {
      return NextResponse.json({ user: null })
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ user: null })
  }
}

