import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('Logout API called')
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear session cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })
    
    console.log('Session cookie cleared')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

