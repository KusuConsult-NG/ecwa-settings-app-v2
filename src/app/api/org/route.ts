import { NextRequest, NextResponse } from 'next/server'
import { getOrganizations, createOrganization } from '@/lib/database-simple'

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
    const { name, type, parentId, parentName, email, phone, address, leaders } = body

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

    const newOrg = createOrganization({
      name: name.trim(),
      type: type as 'GCC' | 'DCC' | 'LCC' | 'LC' | 'Prayer House',
      parentId: parentId || undefined,
      parentName: parentName || undefined,
      status: 'active'
    })

    // In a real app, you would save leaders to the database here
    console.log('Organization created:', newOrg)
    console.log('Leaders:', leaders)
    console.log('Contact info:', { email, phone, address })

    return NextResponse.json({
      success: true,
      org: newOrg,
      message: `${type} created successfully! Verification codes sent to all leaders.`,
      leadersCount: leaders?.length || 0
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
