import { NextRequest, NextResponse } from 'next/server'
import { sendInviteEmail } from '@/lib/sendgrid-service'
import { storeInvitationCode } from '@/app/api/verify-invitation/route'

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

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 })
    }

    // Generate new code
    const authCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-invitation?code=${authCode}&email=${encodeURIComponent(email)}`

    // For demo purposes, we'll use default values
    // In a real app, you'd look up the user's invitation details from the database
    const memberName = 'Member' // This should come from the database
    const organizationName = 'ChurchFlow' // This should come from the database
    const memberRole = 'member' // This should come from the database

    // Store invitation code
    storeInvitationCode(authCode, email, memberName, memberRole, organizationName)

    // Send email
    const emailSent = await sendInviteEmail({
      to: email,
      name: memberName,
      organizationName: organizationName,
      inviterName: 'Organization Admin',
      authCode,
      verificationLink
    })

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'New verification code sent to your email',
        authCode // For development/testing purposes
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email. Please try again later.'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Resend invitation error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
