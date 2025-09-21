import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailCode } from '@/lib/auth'
import { emailVerificationSchema, validateData, sanitizeInput } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Parse and sanitize request body
    const body = await request.json()
    const sanitizedBody = sanitizeInput(body)
    
    // Validate request body
    const validation = validateData(emailVerificationSchema, sanitizedBody)
    
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

    const { email, code } = validation.data!

    const result = await verifyEmailCode(email, code)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      })
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
