import { NextRequest, NextResponse } from 'next/server'
import { sendInviteEmail } from '@/lib/sendgrid-service'
import { generateMagicLink, generateVerificationLink } from '@/lib/url-utils'

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

    console.log('🧪 Testing SendGrid configuration...')
    console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set')
    console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || 'Not set')
    console.log('NODE_ENV:', process.env.NODE_ENV)

    // Test email sending
    const testEmail = await sendInviteEmail({
      to: email,
      name: 'Test User',
      organizationName: 'Test Organization',
      inviterName: 'Test Admin',
      authCode: '123456',
      magicLink: generateMagicLink('test_token_123456'),
      verificationLink: generateVerificationLink(email, '123456')
    })

    return NextResponse.json({
      success: true,
      message: 'SendGrid test completed. Check console logs for details.',
      emailSent: testEmail,
      config: {
        sendgridApiKey: process.env.SENDGRID_API_KEY ? 'Set' : 'Not set',
        sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'Not set',
        nodeEnv: process.env.NODE_ENV
      }
    })

  } catch (error: any) {
    console.error('SendGrid test error:', error)
    return NextResponse.json({
      success: false,
      message: 'SendGrid test failed',
      error: error.message
    }, { status: 500 })
  }
}

