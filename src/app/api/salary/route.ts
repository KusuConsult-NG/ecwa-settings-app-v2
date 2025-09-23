import { NextRequest, NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'

interface SalaryRecord {
  id: string
  employeeId: string
  employeeName: string
  position: string
  department: string
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  payPeriod: string
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  createdAt: string
  updatedAt: string
  agency?: string
}

// Mock data storage (replace with database)
let salaryRecords: SalaryRecord[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    position: 'Pastor',
    department: 'Evangelism',
    basicSalary: 150000,
    allowances: 25000,
    deductions: 15000,
    netSalary: 160000,
    payPeriod: '2024-01',
    status: 'paid',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    agency: 'ECWA Jos Central'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    position: 'Secretary',
    department: 'Finance',
    basicSalary: 80000,
    allowances: 10000,
    deductions: 8000,
    netSalary: 82000,
    payPeriod: '2024-01',
    status: 'pending',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verify(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json({ salaries: salaryRecords })
  } catch (error) {
    console.error('Error fetching salary records:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    // Check if employee already has salary record for this period
    const existingRecord = salaryRecords.find(
      record => record.employeeId === employeeId && record.payPeriod === payPeriod
    )
    
    if (existingRecord) {
      return NextResponse.json({ 
        error: 'Salary record already exists for this employee and pay period' 
      }, { status: 400 })
    }

    const newRecord: SalaryRecord = {
      id: Date.now().toString(),
      employeeId,
      employeeName,
      position,
      department,
      basicSalary: Number(basicSalary),
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      netSalary: Number(netSalary),
      payPeriod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      agency: agency || undefined
    }

    salaryRecords.push(newRecord)

    return NextResponse.json({ 
      message: 'Salary record created successfully',
      salary: newRecord
    })
  } catch (error) {
    console.error('Error creating salary record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
