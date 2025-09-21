import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, sendEmailVerification } from '@/lib/auth'
import { resendVerificationSchema, validateData, sanitizeInput } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Parse and sanitize request body
    const body = await request.json()
    const sanitizedBody = sanitizeInput(body)
    
    // Validate request body
    const validation = validateData(resendVerificationSchema, sanitizedBody)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    const { email } = validation.data!

    const user = await findUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      )
    }

    const emailSent = await sendEmailVerification(user)

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Verification email sent successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
