import { NextRequest, NextResponse } from 'next/server'
import { createAgency, getAllAgencies, updateAgency, deleteAgency } from '@/lib/database-simple'
import { sendInviteEmail } from '@/lib/sendgrid-service'
import { createMagicInvite } from '@/lib/magic-link-store'
import { generateMagicLink, generateVerificationLink } from '@/lib/url-utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      // Get single agency
      const agencies = getAllAgencies()
      const agency = agencies.find(ag => ag.id === id)
      
      if (!agency) {
        return NextResponse.json({ success: false, message: 'Agency not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, data: agency })
    } else {
      // Get all agencies
      const agencies = getAllAgencies()
      return NextResponse.json({ success: true, data: agencies })
    }
  } catch (error: any) {
    console.error('Error fetching agencies:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch agencies', error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, description, leader, contact, location, established, status, email } = await request.json()
    
    if (!name || !type || !leader || !contact) {
      return NextResponse.json({ success: false, message: 'Name, type, leader, and contact are required' }, { status: 400 })
    }

    const newAgency = createAgency({
      name: name.trim(),
      type: type.trim(),
      description: description?.trim() || '',
      leader: leader.trim(),
      contact: contact.trim(),
      location: location?.trim() || '',
      established: established || new Date().toISOString().split('T')[0],
      status: status || 'active'
    })

    // Send magic link invitation if email is provided
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        // Create magic invite
        const invite = createMagicInvite(
          email,
          leader,
          'Agency Leader',
          newAgency.id,
          name,
          'System Administrator'
        )
        
        // Create magic link with proper URL
        const magicLink = generateMagicLink(invite.magicToken)
        
        // Create verification link (fallback)
        const verificationLink = generateVerificationLink(email, invite.authCode)
        
        await sendInviteEmail({
          to: email,
          name: leader,
          organizationName: name,
          inviterName: 'System Administrator',
          authCode: invite.authCode,
          magicLink,
          verificationLink
        })
        
        console.log(`Agency leader invitation sent to ${email} with code: ${invite.authCode} and magic link: ${magicLink}`)
      } catch (error) {
        console.error(`Failed to send agency leader invitation to ${email}:`, error)
        // Don't fail the creation if email sending fails
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: newAgency, 
      message: email ? 'Agency created successfully and invitation sent!' : 'Agency created successfully!'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating agency:', error)
    return NextResponse.json({ success: false, message: 'Failed to create agency', error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, type, description, leader, contact, location, established, status } = await request.json()
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Agency ID is required for update' }, { status: 400 })
    }
    if (!name || !type || !leader || !contact) {
      return NextResponse.json({ success: false, message: 'Name, type, leader, and contact are required for update' }, { status: 400 })
    }

    const updatedAgency = updateAgency(id, {
      name: name.trim(),
      type: type.trim(),
      description: description?.trim() || '',
      leader: leader.trim(),
      contact: contact.trim(),
      location: location?.trim() || '',
      established: established || new Date().toISOString().split('T')[0],
      status: status || 'active'
    })
    
    if (!updatedAgency) {
      return NextResponse.json({ success: false, message: 'Agency not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedAgency, message: 'Agency updated successfully!' })
  } catch (error: any) {
    console.error('Error updating agency:', error)
    return NextResponse.json({ success: false, message: 'Failed to update agency', error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'Agency ID is required for deletion' }, { status: 400 })
    }

    const deleted = deleteAgency(id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Agency not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Agency deleted successfully!' })
  } catch (error: any) {
    console.error('Error deleting agency:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete agency', error: error.message }, { status: 500 })
  }
}
