import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 })
    }

    // Check if user exists
    const user = findUserByEmail(email.trim())
    
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent'
      })
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with expiration
    // 3. Send an email with the reset link
    
    // For demo purposes, we'll just return success
    console.log(`Password reset requested for: ${email}`)
    console.log(`Reset link would be sent to: ${email}`)
    console.log(`Reset token would be: reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
