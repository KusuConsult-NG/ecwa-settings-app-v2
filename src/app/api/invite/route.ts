import { NextRequest, NextResponse } from 'next/server'
import { sendInviteEmail, generateAuthCode } from '@/lib/sendgrid-service'

export const dynamic = 'force-dynamic'

// Store auth codes temporarily (in production, use a database)
const authCodes = new Map<string, { code: string; sentAt: Date; email: string; name: string }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, organizationName, inviterName } = body

    if (!email || !name || !organizationName || !inviterName) {
      return NextResponse.json({
        success: false,
        message: 'Email, name, organization name, and inviter name are required'
      }, { status: 400 })
    }

    // Generate auth code
    const authCode = generateAuthCode()
    const sentAt = new Date()

    // Store the code temporarily
    authCodes.set(email, { code: authCode, sentAt, email, name })

    // Send invite email
    const emailSent = await sendInviteEmail({
      to: email,
      name,
      authCode,
      organizationName,
      inviterName
    })

    if (!emailSent) {
      return NextResponse.json({
        success: false,
        message: 'Failed to send invite email'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Invite sent successfully',
      data: {
        email,
        authCode, // Only for development - remove in production
        sentAt
      }
    })

  } catch (error) {
    console.error('Invite API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const code = searchParams.get('code')

    if (!email || !code) {
      return NextResponse.json({
        success: false,
        message: 'Email and code are required'
      }, { status: 400 })
    }

    // Verify the auth code
    const storedData = authCodes.get(email)
    if (!storedData) {
      return NextResponse.json({
        success: false,
        message: 'No invitation found for this email'
      }, { status: 404 })
    }

    // Check if code matches and is not expired
    const now = new Date()
    const hoursDiff = (now.getTime() - storedData.sentAt.getTime()) / (1000 * 60 * 60)
    
    if (storedData.code !== code) {
      return NextResponse.json({
        success: false,
        message: 'Invalid authentication code'
      }, { status: 400 })
    }

    if (hoursDiff >= 24) {
      // Remove expired code
      authCodes.delete(email)
      return NextResponse.json({
        success: false,
        message: 'Authentication code has expired. Please request a new invitation.'
      }, { status: 400 })
    }

    // Code is valid - remove it to prevent reuse
    authCodes.delete(email)

    return NextResponse.json({
      success: true,
      message: 'Authentication code verified successfully',
      data: {
        email: storedData.email,
        name: storedData.name
      }
    })

  } catch (error) {
    console.error('Verify code API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
