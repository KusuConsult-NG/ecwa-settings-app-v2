import { NextRequest, NextResponse } from 'next/server'
import { sendInviteEmail } from '@/lib/sendgrid-service'
import { createMagicInvite, getAllMagicInvites } from '@/lib/magic-link-store'

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

    // Find existing invitation for this email
    const existingInvites = await getAllMagicInvites()
    const existingInvite = existingInvites.find(inv => 
      inv.email.toLowerCase() === email.toLowerCase() && 
      !inv.consumed && 
      Date.now() < inv.expiresAt
    )

    if (!existingInvite) {
      return NextResponse.json({
        success: false,
        message: 'No active invitation found for this email'
      }, { status: 404 })
    }

    // Create new magic invite with updated details
    const newInvite = await createMagicInvite(
      email,
      existingInvite.name,
      existingInvite.role,
      existingInvite.organizationId,
      existingInvite.organizationName,
      existingInvite.inviterName
    )

    // Create magic link
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-invite?token=${newInvite.magicToken}`
    
    // Create verification link (fallback) - redirect to Accept page
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/accept?email=${encodeURIComponent(email)}&code=${newInvite.authCode}`

    // Send email
    const emailSent = await sendInviteEmail({
      to: email,
      name: existingInvite.name,
      organizationName: existingInvite.organizationName,
      inviterName: existingInvite.inviterName,
      authCode: newInvite.authCode,
      magicLink,
      verificationLink
    })

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'New verification code sent to your email',
        authCode: newInvite.authCode // For development/testing purposes
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
