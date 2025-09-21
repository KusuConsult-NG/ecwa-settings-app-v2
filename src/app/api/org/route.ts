import { NextRequest, NextResponse } from 'next/server'
import { getOrganizations, createOrganization } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const organizations = getOrganizations(type || undefined)

    return NextResponse.json({
      success: true,
      data: organizations
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
    const { name, type, parentId, parentName } = body

    if (!name || !type) {
      return NextResponse.json({
        success: false,
        message: 'Name and type are required'
      }, { status: 400 })
    }

    const newOrg = createOrganization({
      name,
      type: type as 'GCC' | 'DCC' | 'LCC' | 'LC' | 'Prayer House',
      parentId: parentId || undefined,
      parentName: parentName || undefined,
      status: 'active'
    })

    return NextResponse.json({
      success: true,
      data: newOrg,
      message: 'Organization created successfully'
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
