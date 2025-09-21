import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Mock organization data
    const organizations = [
      {
        id: '1',
        name: 'ECWA Jos DCC',
        type: 'DCC',
        parentId: null,
        parentName: null,
        leader: 'Rev. Dr. John Doe',
        address: 'Jos, Plateau State',
        phone: '+234 123 456 7890',
        email: 'jos@ecwa.org',
        memberCount: 5000,
        churchCount: 25,
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'ECWA Bukuru LCC',
        type: 'LCC',
        parentId: '1',
        parentName: 'ECWA Jos DCC',
        leader: 'Pastor Jane Smith',
        address: 'Bukuru, Jos South',
        phone: '+234 123 456 7891',
        email: 'bukuru@ecwa.org',
        memberCount: 1200,
        churchCount: 8,
        status: 'active',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-05'
      },
      {
        id: '3',
        name: 'ECWA Rayfield LC',
        type: 'LC',
        parentId: '2',
        parentName: 'ECWA Bukuru LCC',
        leader: 'Pastor Mike Johnson',
        address: 'Rayfield, Jos',
        phone: '+234 123 456 7892',
        email: 'rayfield@ecwa.org',
        memberCount: 300,
        churchCount: 1,
        status: 'active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10'
      }
    ]

    // Filter by type if specified
    const filteredOrgs = type ? organizations.filter(org => org.type === type) : organizations

    return NextResponse.json({
      success: true,
      data: filteredOrgs
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
    const { name, type, parentId, parentName, leader, address, phone, email } = body

    // Mock organization creation
    const newOrg = {
      id: Date.now().toString(),
      name,
      type,
      parentId,
      parentName,
      leader,
      address,
      phone,
      email,
      memberCount: 0,
      churchCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

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
