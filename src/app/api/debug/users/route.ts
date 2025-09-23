import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const users = getAllUsers()
    
    // Don't return passwords in the response
    const safeUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      status: user.status,
      createdAt: user.createdAt,
      isEmailVerified: user.isEmailVerified
    }))
    
    return NextResponse.json({
      success: true,
      count: users.length,
      users: safeUsers
    })
  } catch (error) {
    console.error('Debug users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

