import { NextRequest, NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'

// Mock data storage (replace with database)
let salaryRecords: any[] = []

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verify(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'approved', 'paid', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      }, { status: 400 })
    }

    const { id } = await params
    const recordIndex = salaryRecords.findIndex(record => record.id === id)
    if (recordIndex === -1) {
      return NextResponse.json({ error: 'Salary record not found' }, { status: 404 })
    }

    // Update the status
    salaryRecords[recordIndex] = {
      ...salaryRecords[recordIndex],
      status,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      message: 'Salary record status updated successfully',
      salary: salaryRecords[recordIndex]
    })
  } catch (error) {
    console.error('Error updating salary record status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
