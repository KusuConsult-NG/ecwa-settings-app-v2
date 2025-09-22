import { NextRequest, NextResponse } from 'next/server'
import { createExecutive, getAllExecutives, updateExecutive, deleteExecutive } from '@/lib/database-simple'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      // Get single executive
      const executives = getAllExecutives()
      const executive = executives.find(exec => exec.id === id)
      
      if (!executive) {
        return NextResponse.json({ success: false, message: 'Executive not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, data: executive })
    } else {
      // Get all executives
      const executives = getAllExecutives()
      return NextResponse.json({ success: true, data: executives })
    }
  } catch (error: any) {
    console.error('Error fetching executives:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch executives', error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title1, title2, name, position, department, email, phone, address, startDate, salary, status } = await request.json()
    
    if (!name || !position || !email || !phone) {
      return NextResponse.json({ success: false, message: 'Name, position, email, and phone are required' }, { status: 400 })
    }

    const newExecutive = createExecutive({
      title1: title1 || '',
      title2: title2 || '',
      name,
      position,
      department: department || '',
      email,
      phone,
      address: address || '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      salary: salary ? parseFloat(salary) : 0,
      status: status || 'active'
    })
    
    return NextResponse.json({ success: true, data: newExecutive }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating executive:', error)
    return NextResponse.json({ success: false, message: 'Failed to create executive', error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title1, title2, name, position, department, email, phone, address, startDate, salary, status } = await request.json()
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Executive ID is required' }, { status: 400 })
    }

    const updatedExecutive = updateExecutive(id, {
      title1: title1 || '',
      title2: title2 || '',
      name,
      position,
      department: department || '',
      email,
      phone,
      address: address || '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      salary: salary ? parseFloat(salary) : 0,
      status: status || 'active'
    })
    
    if (!updatedExecutive) {
      return NextResponse.json({ success: false, message: 'Executive not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedExecutive })
  } catch (error: any) {
    console.error('Error updating executive:', error)
    return NextResponse.json({ success: false, message: 'Failed to update executive', error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'Executive ID is required' }, { status: 400 })
    }

    const deleted = deleteExecutive(id)
    
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Executive not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Executive deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting executive:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete executive', error: error.message }, { status: 500 })
  }
}
