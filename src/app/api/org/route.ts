import { NextRequest, NextResponse } from 'next/server'
import { getOrganizations, createOrganization } from '@/lib/database-simple'
import { sendInviteEmail } from '@/lib/sendgrid-service'
import { createMagicInvite } from '@/lib/magic-link-store'
import { sign } from '@/lib/jwt'
import { generateMagicLink, generateVerificationLink } from '@/lib/url-utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Validate type parameter if provided
    if (type && !['GCC', 'DCC', 'LCC', 'LC', 'Prayer House'].includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid organization type'
      }, { status: 400 })
    }

    const organizations = getOrganizations(type || undefined)

    return NextResponse.json({
      success: true,
      data: organizations,
      count: organizations.length
    })
  } catch (error) {
    console.error('Organization API error:', error)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, parentId, parentName, email, phone, address, leaders, members } = body

    // Enhanced validation
    if (!name || !type) {
      return NextResponse.json({
        success: false,
        message: 'Name and type are required'
      }, { status: 400 })
    }

    // Validate organization type
    const validTypes = ['GCC', 'DCC', 'LCC', 'LC', 'Prayer House']
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        message: `Invalid organization type. Must be one of: ${validTypes.join(', ')}`
      }, { status: 400 })
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 })
    }

    // Validate leaders if provided
    if (leaders && Array.isArray(leaders)) {
      for (const leader of leaders) {
        if (!leader.firstName || !leader.surname || !leader.email) {
          return NextResponse.json({
            success: false,
            message: 'All leaders must have first name, surname, and email'
          }, { status: 400 })
        }
      }
    }

    // Validate members if provided
    if (members && Array.isArray(members)) {
      for (const member of members) {
        if (!member.name || !member.email || !member.role) {
          return NextResponse.json({
            success: false,
            message: 'All members must have name, email, and role'
          }, { status: 400 })
        }
      }
    }

    const newOrg = createOrganization({
      name: name.trim(),
      type: type as 'GCC' | 'DCC' | 'LCC' | 'LC' | 'Prayer House',
      parentId: parentId || undefined,
      parentName: parentName || undefined,
      status: 'active'
    })

    // Send invitations to leaders
    let leaderInvitationsSent = 0
    if (leaders && Array.isArray(leaders)) {
      for (const leader of leaders) {
        try {
          // Create magic invite for leaders
          const invite = createMagicInvite(
            leader.email,
            `${leader.firstName} ${leader.surname}`,
            'leader',
            newOrg.id,
            name,
            'Organization Admin'
          )
          
          // Create magic link with proper URL
          const magicLink = generateMagicLink(invite.magicToken)
          
          // Create verification link (fallback) - redirect to Accept page
          const verificationLink = generateVerificationLink(leader.email, invite.authCode)
          
          await sendInviteEmail({
            to: leader.email,
            name: `${leader.firstName} ${leader.surname}`,
            organizationName: name,
            inviterName: 'Organization Admin',
            authCode: invite.authCode,
            magicLink,
            verificationLink
          })
          
          leaderInvitationsSent++
          console.log(`Leader invitation sent to ${leader.email} with code: ${invite.authCode} and magic link: ${magicLink}`)
        } catch (error) {
          console.error(`Failed to send leader invitation to ${leader.email}:`, error)
        }
      }
    }

    // Send invitations to members
    let memberInvitationsSent = 0
    if (members && Array.isArray(members)) {
      for (const member of members) {
        try {
          // Create magic invite
          const invite = createMagicInvite(
            member.email,
            member.name,
            member.role,
            newOrg.id,
            name,
            'Organization Admin'
          )
          
          // Create magic link with proper URL
          const magicLink = generateMagicLink(invite.magicToken)
          
          // Create verification link (fallback) - redirect to Accept page
          const verificationLink = generateVerificationLink(member.email, invite.authCode)
          
          await sendInviteEmail({
            to: member.email,
            name: member.name,
            organizationName: name,
            inviterName: 'Organization Admin',
            authCode: invite.authCode,
            magicLink,
            verificationLink
          })
          
          memberInvitationsSent++
          console.log(`Member invitation sent to ${member.email} with code: ${invite.authCode} and magic link: ${magicLink}`)
        } catch (error) {
          console.error(`Failed to send member invitation to ${member.email}:`, error)
        }
      }
    }

    // In a real app, you would save leaders to the database here
    console.log('Organization created:', newOrg)
    console.log('Leaders:', leaders)
    console.log('Members invited:', members)
    console.log('Contact info:', { email, phone, address })

    const totalInvitations = leaderInvitationsSent + memberInvitationsSent
    return NextResponse.json({
      success: true,
      org: newOrg,
      message: `${type} created successfully! ${leaderInvitationsSent} leader invitation(s) and ${memberInvitationsSent} member invitation(s) sent.`,
      leadersCount: leaders?.length || 0,
      membersCount: members?.length || 0,
      leaderInvitationsSent,
      memberInvitationsSent,
      totalInvitations
    })
  } catch (error) {
    console.error('Organization creation error:', error)
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
