import { NextRequest, NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'

// Mock data storage (replace with database)
let salaryRecords: any[] = []

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const {
      employeeId,
      employeeName,
      position,
      department,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      payPeriod,
      agency
    } = body

    // Validate required fields
    if (!employeeId || !employeeName || !position || !department || !basicSalary || !payPeriod) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    const { id } = await params
    const recordIndex = salaryRecords.findIndex(record => record.id === id)
    if (recordIndex === -1) {
      return NextResponse.json({ error: 'Salary record not found' }, { status: 404 })
    }

    // Update the record
    salaryRecords[recordIndex] = {
      ...salaryRecords[recordIndex],
      employeeId,
      employeeName,
      position,
      department,
      basicSalary: Number(basicSalary),
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      netSalary: Number(netSalary),
      payPeriod,
      agency: agency || undefined,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      message: 'Salary record updated successfully',
      salary: salaryRecords[recordIndex]
    })
  } catch (error) {
    console.error('Error updating salary record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verify(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id } = await params
    const recordIndex = salaryRecords.findIndex(record => record.id === id)
    if (recordIndex === -1) {
      return NextResponse.json({ error: 'Salary record not found' }, { status: 404 })
    }

    salaryRecords.splice(recordIndex, 1)

    return NextResponse.json({ 
      message: 'Salary record deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting salary record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
