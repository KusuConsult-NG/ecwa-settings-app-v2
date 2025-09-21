import { NextRequest, NextResponse } from 'next/server'
import { findUserById } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

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
    const user = findUserById(authToken)
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

