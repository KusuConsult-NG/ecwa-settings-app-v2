import { NextRequest, NextResponse } from 'next/server'
import { sendInviteEmail } from '@/lib/sendgrid-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    if (!email || !name) {
      return NextResponse.json({
        success: false,
        message: 'Email and name are required'
      }, { status: 400 })
    }

    // Test email sending
    const testEmail = await sendInviteEmail({
      to: email,
      name: name,
      organizationName: 'Test Organization',
      inviterName: 'Test Admin',
      authCode: '123456',
      magicLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-invite?token=test_token_123456`,
      verificationLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/accept?email=${encodeURIComponent(email)}&code=123456`
    })

    if (testEmail) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully! Check your inbox.'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email. Check console logs for details.'
      })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error sending test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
